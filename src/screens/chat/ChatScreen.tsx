/* eslint-disable prettier/prettier */
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  SafeAreaView,
  Image,
  Linking,
  Modal,
  Dimensions,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../../reduxToolkit/store';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { WebView } from 'react-native-webview';
import { styles } from './ChatScreenStyle'; // Make sure you have this style file
import { headerView } from '../../shared/components/CommonUtilities'; // Make sure you have this component
import { CHAT_SCREEN, MENUBAR_SCREEN } from '../../routes/Routes'; // Make sure you have this route
import { MDBLUE, WHITE, GRAY, BLACK } from '../../shared/common-styles/colors'; // Make sure you have these colors
import TextPoppinsRegular from '../../shared/fontFamily/TextPoppinsRegular'; // Make sure you have this font
import TextPoppinsSemiBold from '../../shared/fontFamily/TextPoppinsSemiBold'; // Make sure you have this font
import SendIcon from '../../svg/SendIcon'; // Make sure you have this icon
import AttachmentIcon from '../../svg/AttachmentIcon'; // New attachment icon
import CrossIcon from '../../svg/CrossIcon'; // Add cross icon for PDF viewer
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AuthApi from '../../api/AuthApi'; // For postImageInChat API
import { showAttachmentOptions, AttachmentData, getFileExtension, isImageFile, getFileTypeDisplayName } from '../../utility/attachmentUtils'; // New utility functions

const ENDPOINT = "https://tejagrosales.tejgroup.in/"
const { width, height } = Dimensions.get('window');
// Firebase and auth
import firestore, {
  FirebaseFirestoreTypes,
  collection,
  orderBy,
  onSnapshot,
  doc,
  writeBatch,
  serverTimestamp,
  addDoc,
  setDoc,
  query,
  where,
  getDocs,
  limit,
  startAfter
} from '@react-native-firebase/firestore';
import { jwtDecode } from 'jwt-decode';

interface Message {
  id: string; // Firestore document ID
  text: string;
  sender: 'user' | 'admin';
  timestamp: FirebaseFirestoreTypes.Timestamp | null;
  client_mob?: string;
  client_name?: string;
  client_id?: string;
  message_seen?: number; // 0 means unread, 1 means read
  attachments?: MessageAttachment[]; // New field for attachments
}

interface MessageAttachment {
  type: 'image' | 'document';
  url: string;
  fileName: string;
  fileType: string;
}

const ChatScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const flatListRef = useRef<FlatList | null>(null);
  const insets = useSafeAreaInsets();

  // Get user info and total items from Redux
  const profileDetail: any = useSelector((state: RootState) => state.counter.isProfileInfo);
  const profileInfo: any = useSelector((state: RootState) => state.counter.isProfileInfo);
  const totalItems = useSelector((state: RootState) => state.counter.totalItems);
  const isUserData: any = useSelector((state: RootState) => state.counter.isUserinfo);

  // State
  const [clientId, setClientId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const [selectedAttachments, setSelectedAttachments] = useState<AttachmentData[]>([]);
  const [uploadingAttachments, setUploadingAttachments] = useState(false);
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [currentPdfUrl, setCurrentPdfUrl] = useState('');
  const [currentPdfName, setCurrentPdfName] = useState('');
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState('');

  // Pagination state
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastVisible, setLastVisible] = useState<any>(null);

  // Sidebar/menu press handler
  const onPressSide = () => {
    navigation.navigate(MENUBAR_SCREEN as never);
  };

  // Effect to get client_id from the user's JWT
  useEffect(() => {
    const token = isUserData?.jwt;
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        if (decodedToken?.data?.client_id) {
          setClientId(decodedToken.data.client_id);
        } else {
          console.error("client_id not found in token");
          setLoading(false);
        }
      } catch (e) {
        console.error("Failed to decode token:", e);
        setLoading(false);
      }
    } else {
      console.error("No JWT token found");
      setLoading(false);
    }
  }, [isUserData]);

  // Effect to listen for real-time messages from Firestore
  useEffect(() => {
    if (!clientId) {
      // If there's no clientId, don't attempt to fetch
      return;
    }

    setLoading(true);
    // Use the same path structure: chats/{chatId}/messages
    const messagesPath = `chats/${clientId}/messages`;

    console.log('Setting up Firestore listener for path:', messagesPath);

    const messagesCollection = collection(firestore(), messagesPath);
    // Strategy 1: Realtime Listener (Latest Messages) - Limit 20
    const messagesQuery = query(messagesCollection, orderBy('timestamp', 'desc'), limit(20));

    const unsubscribe = onSnapshot(
      messagesQuery,
      (querySnapshot) => {
        console.log('Firestore snapshot received, document count:', querySnapshot.size);

        // Strategy 2: Store DocumentSnapshot for cursor-based pagination
        // Only set lastVisible if it's the first load (we don't have a cursor yet)
        if (querySnapshot.docs.length > 0) {
          setLastVisible((prev: any) => {
            if (!prev) {
              return querySnapshot.docs[querySnapshot.docs.length - 1];
            }
            return prev;
          });
        }

        const loadedMessages: Message[] = [];
        querySnapshot.forEach((docSnapshot: any) => {
          const data = docSnapshot.data();
          // console.log('Processing message doc:', doc.id, data);

          // Handle attachments - convert document_path array to attachments format
          let attachments: MessageAttachment[] = [];

          // Check if admin message has document_path array
          if (data.document_path && Array.isArray(data.document_path)) {
            attachments = data.document_path.map((path: string, index: number) => {
              // Determine file type from path
              const fileName = path.split('/').pop() || `file_${index}`;
              const extension = fileName.split('.').pop()?.toLowerCase() || '';

              // Determine if it's an image or document based on extension
              const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'];
              const documentExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'];

              let type: 'image' | 'document' = 'document';
              let fileType = 'application/octet-stream';

              if (imageExtensions.includes(extension)) {
                type = 'image';
                fileType = `image/${extension === 'jpg' ? 'jpeg' : extension}`;
              } else if (documentExtensions.includes(extension)) {
                type = 'document';
                if (extension === 'pdf') fileType = 'application/pdf';
                else if (extension.includes('doc')) fileType = 'application/msword';
                else if (extension.includes('xls')) fileType = 'application/vnd.ms-excel';
                else if (extension.includes('ppt')) fileType = 'application/vnd.ms-powerpoint';
                else fileType = 'application/octet-stream';
              }

              return {
                type,
                url: path, // Store relative path from document_path
                fileName,
                fileType,
              };
            });
          }
          // Check if message has attachments array (from user messages)
          else if (data.attachments && Array.isArray(data.attachments)) {
            attachments = data.attachments;
          }

          loadedMessages.push({
            id: docSnapshot.id,
            text: data.text || '', // Admin messages might have empty text with only attachments
            sender: data.sender,
            timestamp: data.timestamp,
            client_mob: data.client_mob,
            client_name: data.client_name,
            client_id: data.client_id,
            message_seen: data.message_seen || 0, // Default to 0 (unread) if not present
            attachments: attachments,
          });
        });

        // Merge logic:
        // We have new messages from snapshot (latest 10).
        // We might have older messages in state.
        // We need to update existing ones and add new ones.
        setMessages(prevMessages => {
          const msgMap = new Map(prevMessages.map(m => [m.id, m]));
          loadedMessages.forEach(m => msgMap.set(m.id, m));

          // Sort by timestamp DESC (Newest first) for inverted list
          const merged = Array.from(msgMap.values()).sort((a, b) => {
            const getMillis = (timestamp: any) => {
              if (!timestamp) return Date.now();
              if (timestamp.toMillis) return timestamp.toMillis();
              if (timestamp.seconds) return timestamp.seconds * 1000;
              if (timestamp instanceof Date) return timestamp.getTime();
              if (typeof timestamp === 'number') return timestamp;
              if (typeof timestamp === 'string') return new Date(timestamp).getTime();
              return Date.now();
            };
            // Descending order: b - a
            return getMillis(b.timestamp) - getMillis(a.timestamp);
          });

          // Update lastVisible based on the oldest message in the merged list
          // This ensures pagination continues from the correct point
          // We can't easily get the DocumentSnapshot from the merged array of plain objects
          // So we rely on the initial snapshot setting lastVisible, and update it in loadMore

          return merged;
        });

        setLoading(false);
      },
      (error: any) => {
        console.error('Error fetching messages from path:', messagesPath, error);
        setLoading(false);

        if (error.code === 'firestore/permission-denied') {
          Alert.alert('Permission Error', 'Unable to load messages due to security rules.');
        } else {
          Alert.alert('Error', 'Failed to load messages.');
        }
      },
    );

    // Return the unsubscribe function to clean up the listener on unmount
    return () => unsubscribe();
  }, [clientId]); // Re-run this effect if clientId changes

  // Function to load more messages
  const loadMoreMessages = async () => {
    if (loadingMore || !hasMore || !clientId || messages.length < 10) return;

    console.log('Loading more messages...');
    setLoadingMore(true);

    try {
      // We need the last visible document to paginate
      // Since we are storing plain objects in state, we might not have the doc snapshot
      // But we can use startAfter with the timestamp of the last message
      const lastMsg = messages[messages.length - 1];
      if (!lastMsg) {
        setLoadingMore(false);
        return;
      }

      const messagesPath = `chats/${clientId}/messages`;
      const messagesCollection = collection(firestore(), messagesPath);

      // Query for next 10 messages after the last one we have
      const nextQuery = query(
        messagesCollection,
        orderBy('timestamp', 'desc'),
        startAfter(lastMsg.timestamp),
        limit(10)
      );

      const snapshot = await getDocs(nextQuery);

      if (!snapshot.empty) {
        const newMessages: Message[] = [];
        snapshot.forEach((docSnapshot: any) => {
          const data = docSnapshot.data();
          // ... (same parsing logic as above, ideally refactored into a function)
          // Handle attachments - convert document_path array to attachments format
          let attachments: MessageAttachment[] = [];

          if (data.document_path && Array.isArray(data.document_path)) {
            attachments = data.document_path.map((path: string, index: number) => {
              const fileName = path.split('/').pop() || `file_${index}`;
              const extension = fileName.split('.').pop()?.toLowerCase() || '';
              const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'];
              const documentExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'];
              let type: 'image' | 'document' = 'document';
              let fileType = 'application/octet-stream';
              if (imageExtensions.includes(extension)) {
                type = 'image';
                fileType = `image/${extension === 'jpg' ? 'jpeg' : extension}`;
              } else if (documentExtensions.includes(extension)) {
                type = 'document';
                if (extension === 'pdf') fileType = 'application/pdf';
                else if (extension.includes('doc')) fileType = 'application/msword';
                else if (extension.includes('xls')) fileType = 'application/vnd.ms-excel';
                else if (extension.includes('ppt')) fileType = 'application/vnd.ms-powerpoint';
                else fileType = 'application/octet-stream';
              }
              return { type, url: path, fileName, fileType };
            });
          } else if (data.attachments && Array.isArray(data.attachments)) {
            attachments = data.attachments;
          }

          newMessages.push({
            id: docSnapshot.id,
            text: data.text || '',
            sender: data.sender,
            timestamp: data.timestamp,
            client_mob: data.client_mob,
            client_name: data.client_name,
            client_id: data.client_id,
            message_seen: data.message_seen || 0,
            attachments: attachments,
          });
        });

        setMessages(prev => [...prev, ...newMessages]);

        if (snapshot.docs.length < 10) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more messages:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  // Strategy 3: Read-Receipt Optimization
  // Update 'lastReadAt' timestamp in the parent 'chats/{chatId}' document
  // One write per screen/chat open
  useEffect(() => {
    if (!clientId) return;

    const updateReadStatus = async () => {
      try {
        const chatRef = doc(firestore(), `chats/${clientId}`);
        // We use merge: true to avoid overwriting other fields
        await setDoc(chatRef, {
          last_read_user: serverTimestamp(),
          user_unread_count: 0
        }, { merge: true });
        console.log('Updated last_read_user timestamp and reset user_unread_count');
      } catch (error) {
        console.error('Failed to update read status', error);
      }
    };

    updateReadStatus();
  }, [clientId]);

  // Handle attachment selection
  const handleAttachmentPress = async () => {
    try {
      const attachments = await showAttachmentOptions();
      if (attachments.length > 0) {
        setSelectedAttachments(prev => [...prev, ...attachments]);
      }
    } catch (error) {
      console.error('Error selecting attachments:', error);
      Alert.alert('Error', 'Failed to select attachments');
    }
  };

  // Remove attachment from selection
  const removeAttachment = (index: number) => {
    setSelectedAttachments(prev => prev.filter((_, i) => i !== index));
  };

  // Upload attachments to server
  const uploadAttachments = async (attachments: AttachmentData[]): Promise<MessageAttachment[]> => {
    if (attachments.length === 0) return [];

    try {
      const base64Array = attachments.map(attachment => attachment.base64);

      const requestBody = {
        client_id: clientId,
        sender: 'User',
        chat_image: base64Array,
      };

      console.log('Uploading attachments:', {
        client_id: clientId,
        sender: 'User',
        imageCount: base64Array.length,
        attachmentTypes: attachments.map(a => ({ type: a.type, fileName: a.fileName, fileType: a.fileType })),
      });

      const response = await AuthApi.postImageInChat(requestBody);
      console.log("image api response", response.data)

      if (response.data && response.data.status && response.data.file_urls) {
        const messageAttachments: MessageAttachment[] = [];

        response.data.file_urls.forEach((relativeUrl: string, index: number) => {
          const attachment = attachments[index];

          // Determine the correct type based on original file
          let attachmentType = attachment.type;

          // Additional safety check: if the original was a document, keep it as document
          // regardless of what the server might have converted it to
          if (attachment.type === 'document' ||
            attachment.fileType?.includes('pdf') ||
            attachment.fileType?.includes('doc') ||
            attachment.fileType?.includes('xls') ||
            attachment.fileType?.includes('ppt') ||
            attachment.fileName?.toLowerCase().includes('.pdf') ||
            attachment.fileName?.toLowerCase().includes('.doc') ||
            attachment.fileName?.toLowerCase().includes('.xls') ||
            attachment.fileName?.toLowerCase().includes('.ppt')) {
            attachmentType = 'document';
          }

          console.log(`Processing attachment ${index}:`, {
            originalType: attachment.type,
            determinedType: attachmentType,
            fileName: attachment.fileName,
            fileType: attachment.fileType,
            relativeUrl: relativeUrl, // Store only relative path
          });

          messageAttachments.push({
            type: attachmentType,
            url: relativeUrl, // Store only relative path from API
            fileName: attachment.fileName,
            fileType: attachment.fileType,
          });
        });


        return messageAttachments;
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error uploading attachments:', error);
      throw new Error('Failed to upload attachments');
    }
  };

  const handleSendMessage = async () => {
    const hasText = messageText.trim().length > 0;
    const hasAttachments = selectedAttachments.length > 0;

    if (!hasText && !hasAttachments) return;

    if (!clientId) {
      Alert.alert('Error', 'Cannot send message: User ID is not available.');
      return;
    }

    console.log('Attempting to send message with:', {
      clientId,
      client_mob: profileInfo?.client_mob,
      client_name: profileInfo?.client_name,
      messageLength: messageText.trim().length,
      attachmentCount: selectedAttachments.length,
    });

    setSending(true);
    setUploadingAttachments(hasAttachments); // Only set to true if there are attachments

    try {
      let messageAttachments: MessageAttachment[] = [];

      // Upload attachments if any
      if (hasAttachments) {
        messageAttachments = await uploadAttachments(selectedAttachments);
      }

      // Use the chat structure that matches your Firestore rules: chats/{chatId}/messages
      const chatPath = `chats/${clientId}`;
      const messagesPath = `${chatPath}/messages`;

      const newMessage: any = {
        text: messageText.trim() || '', // Allow empty text if there are attachments
        sender: 'user', // Set sender as 'user'
        timestamp: serverTimestamp(), // Use server timestamp
        client_id: clientId,
        created_at: new Date().toISOString(), // Additional timestamp for sorting
        message_seen: 0, // User messages start as unread (0)
      };

      // Only add optional fields if they exist
      if (profileInfo?.client_mob) {
        newMessage.client_mob = profileInfo.client_mob;
      }
      if (profileInfo?.client_name) {
        newMessage.client_name = profileInfo.client_name;
      }

      // Only add attachments field if there are attachments
      if (messageAttachments.length > 0) {
        newMessage.attachments = messageAttachments;
      }

      console.log('Sending message to Firestore:', newMessage);

      // First, ensure the chat document exists
      const chatDocRef = doc(firestore(), chatPath);
      const chatDocData: any = {
        client_id: clientId,
        last_updated: serverTimestamp(),
        admin_unread_count: firestore.FieldValue.increment(1),
      };

      // Only add optional fields if they exist
      if (profileInfo?.client_name) {
        chatDocData.client_name = profileInfo.client_name;
      }
      if (profileInfo?.client_mob) {
        chatDocData.client_mob = profileInfo.client_mob;
      }

      await setDoc(chatDocRef, chatDocData, { merge: true });

      // Then add the message to the messages subcollection
      const messagesCollection = collection(firestore(), messagesPath);
      await addDoc(messagesCollection, newMessage);

      // Strategy 4: Server-Side Lifecycle (Cloud Functions)
      // Client must never check message length to send a welcome message
      // Removed client-side welcome message logic

      setMessageText(''); // Clear input on success
      setSelectedAttachments([]); // Clear attachments on success
      // The snapshot listener will automatically update the UI
    } catch (error: any) {
      console.error('Error sending message:', error);
      console.error('Error details:', {
        code: error?.code,
        message: error?.message,
        clientId,
        chatPath: `chats/${clientId}`,
        messagesPath: `chats/${clientId}/messages`,
      });

      // More specific error handling
      if (error?.code === 'firestore/permission-denied') {
        Alert.alert(
          'Permission Error',
          'Unable to send message due to security rules. Please contact support.\n\nTechnical details: Write permission denied for messages.'
        );
      } else if (error?.code === 'firestore/unauthenticated') {
        Alert.alert('Authentication Error', 'Please log in again to send messages.');
      } else if (error?.code === 'firestore/not-found') {
        Alert.alert('Error', 'Chat not found. Please try again.');
      } else {
        Alert.alert('Error', `Failed to send message: ${error?.message || 'Unknown error'}`);
      }
    } finally {
      setSending(false);
      setUploadingAttachments(false);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    // Check if the sender is 'user' or 'admin'
    const isUserMessage = item.sender === 'user';

    // Format the timestamp. It could be null (if pending), a Timestamp object, or an ISO string
    const formatTimestamp = (timestamp: any) => {
      if (!timestamp) return 'Sending...';

      try {
        let date: Date;

        // Check if it's a Firebase Timestamp object
        if (timestamp && typeof timestamp.toDate === 'function') {
          date = timestamp.toDate();
        }
        // Check if it's an ISO string (like "2025-11-10T10:06:38.488Z")
        else if (typeof timestamp === 'string') {
          date = new Date(timestamp);
        }
        // Check if it's already a Date object
        else if (timestamp instanceof Date) {
          date = timestamp;
        }
        // If it's a number (milliseconds since epoch)
        else if (typeof timestamp === 'number') {
          date = new Date(timestamp);
        }
        else {
          console.log('Unknown timestamp format:', timestamp);
          return 'Invalid time';
        }

        // Validate the date
        if (isNaN(date.getTime())) {
          console.log('Invalid date created from timestamp:', timestamp);
          return 'Invalid time';
        }

        return date.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });
      } catch (error) {
        console.error('Error formatting timestamp:', error, 'Original timestamp:', timestamp);
        return 'Invalid time';
      }
    };

    const timeString = formatTimestamp(item.timestamp);

    // Render attachment based on type
    const renderAttachment = (attachment: MessageAttachment, index: number) => {
      // Create full URL by appending base URL to relative path
      const fullUrl = attachment.url.startsWith('http')
        ? attachment.url
        : `${ENDPOINT}/${attachment.url}`;

      console.log(`Rendering attachment ${index}:`, {
        type: attachment.type,
        fileName: attachment.fileName,
        fileType: attachment.fileType,
        storedUrl: attachment.url, // Relative path from Firebase
        fullUrl: fullUrl, // Full URL for display
        sender: item.sender,
      });

      // Enhanced type detection based on file extension and MIME type
      const isImageType = attachment.type === 'image' ||
        attachment.fileType?.includes('image/') ||
        isImageFile(attachment.fileName);

      const isDocumentType = attachment.type === 'document' ||
        attachment.fileType?.includes('pdf') ||
        attachment.fileType?.includes('doc') ||
        attachment.fileType?.includes('xls') ||
        attachment.fileType?.includes('ppt') ||
        attachment.fileName?.toLowerCase().match(/\.(pdf|doc|docx|xls|xlsx|ppt|pptx|txt)$/);

      if (isImageType && !isDocumentType) {
        return (
          <TouchableOpacity
            key={index}
            onPress={() => {
              // Open image in full screen viewer within the app
              setCurrentImageUrl(fullUrl);
              setShowImageViewer(true);
            }}
            style={{ marginBottom: 5 }}
          >
            <Image
              source={{ uri: fullUrl }}
              style={[
                styles.messageImage,
                {
                  maxWidth: 200,
                  maxHeight: 200,
                  minHeight: 100,
                  borderRadius: 8,
                }
              ]}
              resizeMode="cover"
              onError={(error) => {
                console.log('Image load error:', error, 'URL:', fullUrl);
              }}
              onLoad={() => {
                console.log('Image loaded successfully:', fullUrl);
              }}
            />
            {/* Image filename overlay for admin messages */}
            {!isUserMessage && attachment.fileName && (
              <View style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: 'rgba(0,0,0,0.7)',
                padding: 4,
                borderBottomLeftRadius: 8,
                borderBottomRightRadius: 8,
              }}>
                <TextPoppinsRegular style={{ color: WHITE, fontSize: 10 }} numberOfLines={1}>
                  {attachment.fileName}
                </TextPoppinsRegular>
              </View>
            )}
          </TouchableOpacity>
        );
      } else {
        // Document attachment (PDFs, DOCs, etc.)
        const extension = getFileExtension(attachment.fileName).toUpperCase();
        const displayName = getFileTypeDisplayName(attachment.fileName);
        const isPdf = extension === 'PDF';

        return (
          <TouchableOpacity
            key={index}
            style={[
              styles.messageDocument,
              {
                flexDirection: 'row',
                alignItems: 'center',
                padding: 8,
                backgroundColor: isUserMessage ? '#dcf8c6' : WHITE,
                borderRadius: 8,
                marginBottom: 5,
                maxWidth: 200, // More like WhatsApp width
                borderWidth: 1,
                borderColor: isUserMessage ? '#d1f2cc' : '#e0e0e0',
              }
            ]}
            onPress={() => {
              console.log('Opening document:', fullUrl);
              if (isPdf) {
                // Open PDF in app viewer
                setCurrentPdfUrl(fullUrl);
                setCurrentPdfName(attachment.fileName);
                setShowPdfViewer(true);
              } else {
                // Open other documents in external viewer
                Linking.openURL(fullUrl).catch(err => {
                  console.error('Failed to open document:', err);
                  Alert.alert('Error', 'Could not open document. Please try again.');
                });
              }
            }}
          >
            <View style={[
              styles.documentIcon,
              {
                backgroundColor: isPdf ? '#dc2626' : (isUserMessage ? '#25d366' : '#757575'),
                width: 32,
                height: 32,
                borderRadius: 4,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 8,
              }
            ]}>
              <TextPoppinsRegular style={[
                styles.documentIconText,
                {
                  color: WHITE,
                  fontSize: 9,
                  fontWeight: 'bold',
                }
              ]}>
                {extension.substring(0, 3)}
              </TextPoppinsRegular>
            </View>
            <View style={[styles.documentInfo, { flex: 1 }]}>
              <TextPoppinsRegular style={[
                styles.documentName,
                {
                  color: isUserMessage ? '#075e54' : '#424242',
                  fontSize: 12,
                  fontWeight: '500',
                }
              ]} numberOfLines={1}>
                {attachment.fileName.length > 20 ?
                  `${attachment.fileName.substring(0, 20)}...` :
                  attachment.fileName}
              </TextPoppinsRegular>
              <TextPoppinsRegular style={[
                styles.documentType,
                {
                  color: isUserMessage ? '#128c7e' : '#757575',
                  fontSize: 10,
                  marginTop: 1,
                }
              ]}>
                {displayName}
              </TextPoppinsRegular>
            </View>
            {/* Download/Open indicator */}
            <View style={{
              marginLeft: 4,
            }}>
              <TextPoppinsRegular style={{
                color: isUserMessage ? '#128c7e' : '#757575',
                fontSize: 16,
                fontWeight: 'bold'
              }}>
                {isPdf ? '📄' : '📎'}
              </TextPoppinsRegular>
            </View>
          </TouchableOpacity>
        );
      }
    };

    return (
      <View
        style={[
          styles.messageContainer,
          isUserMessage ? styles.userMessage : styles.supportMessage,
        ]}>
        <View
          style={[
            styles.messageBubble,
            isUserMessage ? styles.userBubble : styles.supportBubble,
          ]}>
          {item.attachments && item.attachments.length > 0 && (
            <View style={{ marginBottom: item.text ? 8 : 0 }}>
              {item.attachments.map((attachment, index) =>
                renderAttachment(attachment, index)
              )}
            </View>
          )}

          {/* Render attachments if any */}

          {/* Render text message if any */}
          {item.text && (
            <TextPoppinsRegular
              style={[
                styles.messageText,
                isUserMessage ? styles.userText : styles.supportText,
              ]}>
              {item.text}
            </TextPoppinsRegular>
          )}

          <TextPoppinsRegular
            style={[
              styles.messageTime,
              isUserMessage ? styles.userTime : styles.supportTime,
            ]}>
            {timeString}
          </TextPoppinsRegular>
        </View>
      </View>
    );
  };

  const renderEmptyList = () => {
    if (loading) {
      return <ActivityIndicator size="large" color={MDBLUE} style={{ marginTop: 50 }} />;
    }
    if (!clientId) {
      return (
        <View style={{ padding: 20, alignItems: 'center', marginTop: 50 }}>
          <Text style={{ color: GRAY, fontSize: 16, textAlign: 'center' }}>
            Please log in to start chatting.
          </Text>
        </View>
      );
    }
    return (
      <View style={{ padding: 20, alignItems: 'center', marginTop: 50 }}>
        <Text style={{ color: GRAY, fontSize: 16, textAlign: 'center' }}>
          No messages yet.
        </Text>
        <Text style={{ color: GRAY, fontSize: 14, textAlign: 'center', marginTop: 8 }}>
          Say hello to start the conversation!
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {headerView(
        `Hi, ${profileDetail?.client_name || ''}`,
        'Online', // You can hook this to admin's presence later
        onPressSide,
        totalItems,
        navigation,
        CHAT_SCREEN
      )}

      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {!loading && messages.length === 0 && (
          <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
          }}>
            <Text style={{ color: GRAY, fontSize: 16, textAlign: 'center' }}>
              No messages yet.
            </Text>
            <Text style={{ color: GRAY, fontSize: 14, marginTop: 8 }}>
              Say hello to start the conversation!
            </Text>
          </View>
        )}
        {!loading && messages.length > 0 && ( <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.messagesContainer}
          // Pagination props
          onEndReached={loadMoreMessages}
          onEndReachedThreshold={0.1}
          ListFooterComponent={loadingMore ? <ActivityIndicator size="small" color={MDBLUE} style={{ marginVertical: 10 }} /> : null}

          // Ensure taps on list items or the content don't prevent the TextInput from
          // receiving focus and opening the keyboard.
          keyboardShouldPersistTaps="handled"
          // For iOS: allow interactive swipe to dismiss the keyboard
          keyboardDismissMode="interactive"
          // Use inverted for chat interface (latest at bottom)
          inverted={true}
        />)}
        {/* <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.messagesContainer}
          // Pagination props
          onEndReached={loadMoreMessages}
          onEndReachedThreshold={0.1}
          ListFooterComponent={loadingMore ? <ActivityIndicator size="small" color={MDBLUE} style={{ marginVertical: 10 }} /> : null}

          // Ensure taps on list items or the content don't prevent the TextInput from
          // receiving focus and opening the keyboard.
          keyboardShouldPersistTaps="handled"
          // For iOS: allow interactive swipe to dismiss the keyboard
          keyboardDismissMode="interactive"
          ListEmptyComponent={renderEmptyList}
          // Use inverted for chat interface (latest at bottom)
          inverted={true}
        /> */}

        {/* Attachment Preview */}
        {selectedAttachments.length > 0 && (
          <View style={styles.attachmentPreviewContainer}>
            {selectedAttachments.map((attachment, index) => (
              <View key={index} style={styles.attachmentPreview}>
                {attachment.type === 'image' ? (
                  <Image
                    source={{ uri: attachment.uri }}
                    style={styles.attachmentImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.attachmentDocument}>
                    <TextPoppinsRegular style={styles.documentText} numberOfLines={3}>
                      {attachment.fileName}
                    </TextPoppinsRegular>
                  </View>
                )}

                {/* Loading overlay when uploading */}
                {uploadingAttachments && (
                  <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="small" color={WHITE} />
                  </View>
                )}

                {/* Remove button */}
                {!uploadingAttachments && (
                  <TouchableOpacity
                    style={styles.removeAttachment}
                    onPress={() => removeAttachment(index)}
                  >
                    <TextPoppinsRegular style={styles.removeAttachmentText}>
                      ×
                    </TextPoppinsRegular>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        )}

        <View style={styles.inputContainer}>
          <TouchableOpacity
            style={styles.attachmentButton}
            onPress={handleAttachmentPress}
            disabled={sending || uploadingAttachments}
            activeOpacity={0.7}
          >
            <AttachmentIcon
              width={20}
              height={20}
              color={sending || uploadingAttachments ? '#ccc' : WHITE}
            />
          </TouchableOpacity>

          <TextInput
            style={styles.messageInput}
            placeholder={t('TYPE_MESSAGE') || 'Type a message...'}
            value={messageText}
            onChangeText={setMessageText}
            multiline
            maxLength={500}
            placeholderTextColor={GRAY}
            // Enable the input only when we have a clientId and loading is false.
            // Previous logic `!clientId || loading` made the input editable only when
            // the user was NOT logged in which prevented the keyboard from opening.
            editable={!!clientId && !loading && !uploadingAttachments}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              { opacity: ((messageText.trim() || selectedAttachments.length > 0) && !sending && !uploadingAttachments && clientId) ? 1 : 0.5 },
            ]}
            onPress={handleSendMessage}
            disabled={!(messageText.trim() || selectedAttachments.length > 0) || sending || uploadingAttachments || !clientId}
            activeOpacity={0.7}>
            {sending || uploadingAttachments ? (
              <ActivityIndicator size="small" color={WHITE} />
            ) : (
              <SendIcon width={20} height={20} color={WHITE} />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* PDF Viewer Modal */}
      <Modal
        visible={showPdfViewer}
        animationType="slide"
        onRequestClose={() => setShowPdfViewer(false)}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: BLACK }}>
          {/* Header */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 16,
            backgroundColor: '#075e54',
          }}>
            <View style={{ flex: 1 }}>
              <TextPoppinsSemiBold style={{
                color: WHITE,
                fontSize: 16,
              }}>
                PDF Document
              </TextPoppinsSemiBold>
              <TextPoppinsRegular style={{
                color: WHITE,
                fontSize: 12,
                opacity: 0.8,
              }} numberOfLines={1}>
                {currentPdfName}
              </TextPoppinsRegular>
            </View>
            <TouchableOpacity
              onPress={() => setShowPdfViewer(false)}
              style={{
                padding: 8,
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: 20,
                marginLeft: 12,
              }}
            >
              <CrossIcon width={20} height={20} color={WHITE} />
            </TouchableOpacity>
          </View>

          {/* PDF Viewer */}
          <View style={{ flex: 1 }}>
            {currentPdfUrl ? (
              <WebView
                source={{
                  uri: `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(currentPdfUrl)}`
                }}
                style={{ flex: 1 }}
                startInLoadingState={true}
                renderLoading={() => (
                  <View style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: WHITE,
                  }}>
                    <ActivityIndicator size="large" color={MDBLUE} />
                    <TextPoppinsRegular style={{
                      marginTop: 12,
                      color: GRAY,
                      textAlign: 'center',
                    }}>
                      Loading PDF...
                    </TextPoppinsRegular>
                  </View>
                )}
                onError={() => {
                  Alert.alert(
                    'Error',
                    'Could not load PDF. Would you like to open it externally?',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      {
                        text: 'Open External',
                        onPress: () => {
                          setShowPdfViewer(false);
                          Linking.openURL(currentPdfUrl);
                        }
                      }
                    ]
                  );
                }}
                onLoadEnd={() => {
                  console.log('PDF loaded successfully');
                }}
              />
            ) : (
              <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: WHITE,
              }}>
                <TextPoppinsRegular style={{ color: GRAY }}>
                  No PDF to display
                </TextPoppinsRegular>
              </View>
            )}
          </View>
        </SafeAreaView>
      </Modal>

      {/* Image Viewer Modal */}
      <Modal
        visible={showImageViewer}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowImageViewer(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.9)',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          {/* Close button */}
          <TouchableOpacity
            onPress={() => setShowImageViewer(false)}
            style={{
              position: 'absolute',
              top: 50,
              right: 20,
              zIndex: 1,
              backgroundColor: 'rgba(0,0,0,0.5)',
              borderRadius: 25,
              padding: 10,
            }}
          >
            <CrossIcon width={24} height={24} color={WHITE} />
          </TouchableOpacity>

          {/* Full size image */}
          {currentImageUrl ? (
            <Image
              source={{ uri: currentImageUrl }}
              style={{
                width: width - 40,
                height: height - 200,
                maxWidth: width - 40,
                maxHeight: height - 200,
              }}
              resizeMode="contain"
              onError={(error) => {
                console.log('Full image load error:', error);
                Alert.alert('Error', 'Could not load image');
                setShowImageViewer(false);
              }}
            />
          ) : (
            <View style={{
              justifyContent: 'center',
              alignItems: 'center',
              padding: 20,
            }}>
              <TextPoppinsRegular style={{ color: WHITE }}>
                No image to display
              </TextPoppinsRegular>
            </View>
          )}

          {/* Tap anywhere to close hint */}
          <TouchableOpacity
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
            onPress={() => setShowImageViewer(false)}
            activeOpacity={1}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ChatScreen;