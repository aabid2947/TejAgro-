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
  getDocs 
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
  const [refreshing, setRefreshing] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const [selectedAttachments, setSelectedAttachments] = useState<AttachmentData[]>([]);
  const [uploadingAttachments, setUploadingAttachments] = useState(false);
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [currentPdfUrl, setCurrentPdfUrl] = useState('');
  const [currentPdfName, setCurrentPdfName] = useState('');
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState('');

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
    const messagesQuery = query(messagesCollection, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(
      messagesQuery,
      (querySnapshot) => {
        console.log('Firestore snapshot received, document count:', querySnapshot.size);
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

        console.log('Total messages loaded:', loadedMessages.length);
        setMessages(loadedMessages);
        setLoading(false);
        setRefreshing(false);
      },
      (error: any) => {
        console.error('Error fetching messages from path:', messagesPath, error);
        setLoading(false);
        setRefreshing(false);
        
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

  // Effect to mark ALL admin messages as read when user opens chat
  useEffect(() => {
    if (!clientId || messages.length === 0) return;

    // Mark ALL admin messages as read (set message_seen to 1)
    const markAllAdminMessagesAsRead = async () => {
      const messagesPath = `chats/${clientId}/messages`;
      const batch = writeBatch(firestore());
      let hasUpdates = false;

      // Find ALL admin messages (regardless of current message_seen status)
      const adminMessages = messages.filter(
        message => message.sender === 'admin'
      );

      console.log('Marking', adminMessages.length, 'admin messages as read');

      adminMessages.forEach((message) => {
        const messageRef = doc(firestore(), messagesPath, message.id);
        batch.update(messageRef, { message_seen: 1 });
        hasUpdates = true;
      });

      if (hasUpdates) {
        try {
          await batch.commit();
          console.log('Successfully marked all admin messages as read');
        } catch (error) {
          console.error('Error marking admin messages as read:', error);
        }
      }
    };

    // Mark all admin messages as read whenever the chat screen opens
    if (messages.some(message => message.sender === 'admin')) {
      markAllAdminMessagesAsRead();
    }
  }, [clientId, messages]);

  // Additional effect to mark admin messages as read immediately when screen is focused
  useEffect(() => {
    if (!clientId) return;

    const markAdminMessagesRead = async () => {
      try {
        const messagesPath = `chats/${clientId}/messages`;
        const messagesCollection = collection(firestore(), messagesPath);
        const adminQuery = query(messagesCollection, where('sender', '==', 'admin'));
        const snapshot = await getDocs(adminQuery);
        
        if (!snapshot.empty) {
          const batch = writeBatch(firestore());
          let hasUpdates = false;

          snapshot.forEach((docSnapshot: any) => {
            batch.update(docSnapshot.ref, { message_seen: 1 });
            hasUpdates = true;
          });

          if (hasUpdates) {
            await batch.commit();
            console.log('Immediately marked all admin messages as read on screen open');
          }
        }
      } catch (error) {
        console.error('Error in immediate mark as read:', error);
      }
    };

    // Mark admin messages as read immediately when chat screen opens
    markAdminMessagesRead();
  }, [clientId]); // Only depends on clientId, runs once when clientId is available

  // Effect to scroll to the end of the list when new messages are added
  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  // Pull to refresh handler
  const onRefresh = () => {
    if (!clientId) return;
    
    setRefreshing(true);
    // The database listener will automatically update the messages
    // We just need to show the refreshing state
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

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
        t('CUSTOMER_SUPPORT') || 'Customer Support',
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
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.messagesContainer}
          // Pull to refresh functionality
          refreshing={refreshing}
          onRefresh={onRefresh}
          // Ensure taps on list items or the content don't prevent the TextInput from
          // receiving focus and opening the keyboard.
          keyboardShouldPersistTaps="handled"
          // For iOS: allow interactive swipe to dismiss the keyboard
          keyboardDismissMode="interactive"
          ListEmptyComponent={renderEmptyList}
          // We use inverted={false} to match your original styling
          // and rely on useEffect + scrollToEnd to see new messages
          inverted={false}
        />

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