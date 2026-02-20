/* eslint-disable prettier/prettier */
import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  AppState,
  Dimensions,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../../reduxToolkit/store';
import { WebView } from 'react-native-webview';
import { styles } from './ChatScreenStyle';
import { headerView } from '../../shared/components/CommonUtilities';
import { CHAT_SCREEN, MENUBAR_SCREEN } from '../../routes/Routes';
import { MDBLUE, WHITE, GRAY, BLACK } from '../../shared/common-styles/colors';
import TextPoppinsRegular from '../../shared/fontFamily/TextPoppinsRegular';
import TextPoppinsSemiBold from '../../shared/fontFamily/TextPoppinsSemiBold';
import SendIcon from '../../svg/SendIcon';
import AttachmentIcon from '../../svg/AttachmentIcon';
import CrossIcon from '../../svg/CrossIcon';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AuthApi from '../../api/AuthApi';
import { showAttachmentOptions, AttachmentData, getFileExtension, isImageFile, getFileTypeDisplayName } from '../../utility/attachmentUtils';
import firestore, {
  FirebaseFirestoreTypes,
  collection,
  orderBy,
  onSnapshot,
  doc,
  serverTimestamp,
  addDoc,
  setDoc,
  query,
  where,
  getDocs,
  limit,
  startAfter,
} from '@react-native-firebase/firestore';
import { jwtDecode } from 'jwt-decode';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ENDPOINT = "https://tejagrosales.tejgroup.in/";
const { width, height } = Dimensions.get('window');

// CONSTANTS FOR ULTRA-LOW READS
const MAX_MESSAGES_IN_MEMORY = 50;
const PAGINATION_BATCH_SIZE = 20;
const READ_RECEIPT_DEBOUNCE_MS = 5000; // 5s debounce
const MESSAGE_RETRY_ATTEMPTS = 3;
const MESSAGE_RETRY_DELAY_MS = 2000;

// AsyncStorage keys
const LAST_READ_TIMESTAMP_KEY = 'chat_last_read_timestamp_';
const CACHED_MESSAGES_KEY = 'chat_cached_messages_';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'admin';
  timestamp: FirebaseFirestoreTypes.Timestamp | null;
  client_mob?: string;
  client_name?: string;
  client_id?: string;
  message_seen?: number;
  attachments?: MessageAttachment[];
  status?: 'sending' | 'sent' | 'failed';
  localId?: string;
  retryCount?: number;
}

interface MessageAttachment {
  type: 'image' | 'document';
  url: string;
  fileName: string;
  fileType: string;
}

interface PendingMessage {
  localId: string;
  message: Message;
  retryCount: number;
  attachmentData?: AttachmentData[];
}

const ChatScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const appState = useRef(AppState.currentState);
  const flatListRef = useRef<FlatList | null>(null);
  const insets = useSafeAreaInsets();
  const readReceiptTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hasNewUnreadMessagesRef = useRef(false); // Track if there are actually new messages
  const listenerActiveRef = useRef(false);

  // Redux state
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
  const [isOnline, setIsOnline] = useState(true);
  const [pendingMessages, setPendingMessages] = useState<PendingMessage[]>([]);
  const [lastReadTimestamp, setLastReadTimestamp] = useState<number>(0);

  // Pagination state
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [oldestMessageTimestamp, setOldestMessageTimestamp] = useState<any>(null);

  // Network state monitoring
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const online = state.isConnected && state.isInternetReachable !== false;
      setIsOnline(online);
      
      if (online && pendingMessages.length > 0) {
        retryPendingMessages();
      }
    });

    return () => unsubscribe();
  }, [pendingMessages]);

  const onPressSide = () => {
    navigation.navigate(MENUBAR_SCREEN as never);
  };

  // Extract client_id from JWT
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

  // AppState tracking
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // Load cached messages and last read timestamp from AsyncStorage
  useEffect(() => {
    if (!clientId) return;

    const loadCachedData = async () => {
      try {
        // Load last read timestamp
        const savedTimestamp = await AsyncStorage.getItem(LAST_READ_TIMESTAMP_KEY + clientId);
        if (savedTimestamp) {
          const timestamp = parseInt(savedTimestamp, 10);
          setLastReadTimestamp(timestamp);
          console.log('Loaded last read timestamp from cache:', new Date(timestamp));
        }

        // Load cached messages
        const cachedMessages = await AsyncStorage.getItem(CACHED_MESSAGES_KEY + clientId);
        if (cachedMessages) {
          const parsed = JSON.parse(cachedMessages);
          setMessages(parsed);
          console.log('Loaded', parsed.length, 'cached messages');
        }
      } catch (error) {
        console.error('Error loading cached data:', error);
      }
    };

    loadCachedData();
  }, [clientId]);

  // Save messages to cache whenever they change
  useEffect(() => {
    if (!clientId || messages.length === 0) return;

    const saveToCache = async () => {
      try {
        await AsyncStorage.setItem(
          CACHED_MESSAGES_KEY + clientId,
          JSON.stringify(messages.slice(0, MAX_MESSAGES_IN_MEMORY))
        );
      } catch (error) {
        console.error('Error saving messages to cache:', error);
      }
    };

    saveToCache();
  }, [messages, clientId]);

  // CRITICAL: Single listener that only fetches NEW messages
  useEffect(() => {
    if (!clientId || !isFocused || appState.current !== 'active' || listenerActiveRef.current) {
      return;
    }

    const setupListener = async () => {
      setLoading(true);
      listenerActiveRef.current = true;

      const messagesPath = `chats/${clientId}/messages`;
      const messagesCollection = collection(firestore(), messagesPath);

      // Use the cached timestamp or default to 7 days ago
      const startTime = lastReadTimestamp || (Date.now() - 7 * 24 * 60 * 60 * 1000);

      console.log('🔥 Setting up SINGLE listener from:', new Date(startTime));
      console.log('📊 This query will ONLY fetch messages newer than this timestamp');

      // CRITICAL: Only listen to NEW messages after our last read
      const messagesQuery = query(
        messagesCollection,
        where('timestamp', '>', new Date(startTime)),
        orderBy('timestamp', 'asc'), // ASC to get oldest-to-newest for real-time updates
        limit(100) // Safety limit
      );

      const unsubscribe = onSnapshot(
        messagesQuery,
        (snapshot) => {
          console.log('📬 Snapshot received:', snapshot.size, 'new messages');
          
          // Track if we got actual new messages from admin
          let hasNewAdminMessages = false;

          const newMessages: Message[] = [];
          snapshot.docChanges().forEach(change => {
            if (change.type === 'added') {
              const data = change.doc.data();
              const message = parseFirestoreMessage(change.doc.id, data);
              newMessages.push(message);

              // Check if this is a new admin message
              if (message.sender === 'admin') {
                hasNewAdminMessages = true;
              }

              // Update our in-memory last read timestamp
              const msgTime = getMillis(message.timestamp);
              if (msgTime > lastReadTimestamp) {
                setLastReadTimestamp(msgTime);
                AsyncStorage.setItem(LAST_READ_TIMESTAMP_KEY + clientId, msgTime.toString());
              }
            }
          });

          if (newMessages.length > 0) {
            setMessages(prev => {
              // Remove duplicates and merge
              const msgMap = new Map(prev.map(m => [m.id, m]));
              
              newMessages.forEach(m => {
                // Remove optimistic messages that are now confirmed
                const optimistic = Array.from(msgMap.values()).find(
                  existing => existing.localId && 
                             existing.text === m.text && 
                             existing.sender === 'user' &&
                             !existing.id.startsWith('temp_')
                );
                if (optimistic) {
                  msgMap.delete(optimistic.id);
                }
                
                msgMap.set(m.id, m);
              });

              // Sort DESC for inverted list
              const merged = Array.from(msgMap.values())
                .sort((a, b) => getMillis(b.timestamp) - getMillis(a.timestamp))
                .slice(0, MAX_MESSAGES_IN_MEMORY);

              // Update oldest for pagination
              if (merged.length > 0) {
                setOldestMessageTimestamp(merged[merged.length - 1].timestamp);
              }

              return merged;
            });

            // Mark that we have new unread messages for read receipt
            if (hasNewAdminMessages) {
              hasNewUnreadMessagesRef.current = true;
              updateReadReceiptDebounced();
            }
          }

          setLoading(false);
        },
        (error) => {
          console.error('❌ Firestore listener error:', error);
          setLoading(false);
          listenerActiveRef.current = false;
        }
      );

      return unsubscribe;
    };

    const unsubscribePromise = setupListener();

    return () => {
      unsubscribePromise.then(unsub => {
        if (unsub) {
          console.log('🔌 Cleaning up listener');
          unsub();
        }
      });
      listenerActiveRef.current = false;
    };
  }, [clientId, isFocused, lastReadTimestamp]);

  // Parse Firestore message
  const parseFirestoreMessage = (id: string, data: any): Message => {
    let attachments: MessageAttachment[] = [];

    if (data.document_path && Array.isArray(data.document_path)) {
      attachments = data.document_path.map((path: string, index: number) => {
        const fileName = path.split('/').pop() || `file_${index}`;
        const extension = fileName.split('.').pop()?.toLowerCase() || '';
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'];
        
        let type: 'image' | 'document' = 'document';
        let fileType = 'application/octet-stream';

        if (imageExtensions.includes(extension)) {
          type = 'image';
          fileType = `image/${extension === 'jpg' ? 'jpeg' : extension}`;
        } else if (extension === 'pdf') {
          fileType = 'application/pdf';
        }

        return { type, url: path, fileName, fileType };
      });
    } else if (data.attachments && Array.isArray(data.attachments)) {
      attachments = data.attachments;
    }

    return {
      id,
      text: data.text || '',
      sender: data.sender,
      timestamp: data.timestamp,
      client_mob: data.client_mob,
      client_name: data.client_name,
      client_id: data.client_id,
      message_seen: data.message_seen || 0,
      attachments,
      status: 'sent',
    };
  };

  const getMillis = (timestamp: any): number => {
    if (!timestamp) return Date.now();
    if (timestamp.toMillis) return timestamp.toMillis();
    if (timestamp.seconds) return timestamp.seconds * 1000;
    if (timestamp instanceof Date) return timestamp.getTime();
    if (typeof timestamp === 'number') return timestamp;
    if (typeof timestamp === 'string') return new Date(timestamp).getTime();
    return Date.now();
  };

  // CRITICAL: Zero-read debounced update
  // Only writes if we actually received new messages
  const updateReadReceiptDebounced = useCallback(() => {
    if (!clientId) return;

    if (readReceiptTimerRef.current) {
      clearTimeout(readReceiptTimerRef.current);
    }

    readReceiptTimerRef.current = setTimeout(async () => {
      // CRITICAL: Only write if we actually have new unread messages
      if (!hasNewUnreadMessagesRef.current) {
        console.log('⏭️  Skipping read receipt - no new messages');
        return;
      }

      try {
        const chatRef = doc(firestore(), `chats/${clientId}`);
        
        // Write WITHOUT reading first - blind write
        await setDoc(
          chatRef,
          {
            last_read_user: serverTimestamp(),
            user_unread_count: 0,
          },
          { merge: true }
        );
        
        console.log('✅ Read receipt updated (1 write, 0 reads)');
        hasNewUnreadMessagesRef.current = false; // Reset flag
      } catch (error) {
        console.error('Failed to update read receipt:', error);
      }
    }, READ_RECEIPT_DEBOUNCE_MS);
  }, [clientId]);

  useEffect(() => {
    return () => {
      if (readReceiptTimerRef.current) {
        clearTimeout(readReceiptTimerRef.current);
      }
    };
  }, []);

  // OPTIMIZED: Cursor-based pagination - ONE-TIME reads only
  const loadMoreMessages = async () => {
    if (loadingMore || !hasMore || !clientId || !oldestMessageTimestamp) return;

    console.log('📥 Loading older messages (one-time read)...');
    setLoadingMore(true);

    try {
      const messagesPath = `chats/${clientId}/messages`;
      const messagesCollection = collection(firestore(), messagesPath);

      const nextQuery = query(
        messagesCollection,
        orderBy('timestamp', 'desc'),
        startAfter(oldestMessageTimestamp),
        limit(PAGINATION_BATCH_SIZE)
      );

      const snapshot = await getDocs(nextQuery);

      if (!snapshot.empty) {
        const olderMessages: Message[] = [];
        snapshot.forEach((docSnapshot: any) => {
          const data = docSnapshot.data();
          const message = parseFirestoreMessage(docSnapshot.id, data);
          olderMessages.push(message);
        });

        setMessages(prev => {
          const combined = [...prev, ...olderMessages];
          const limited = combined.slice(0, MAX_MESSAGES_IN_MEMORY * 2);
          
          const oldest = limited[limited.length - 1];
          setOldestMessageTimestamp(oldest.timestamp);
          
          return limited;
        });

        if (snapshot.docs.length < PAGINATION_BATCH_SIZE) {
          setHasMore(false);
        }

        console.log('✅ Loaded', olderMessages.length, 'older messages');
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more messages:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  // Upload attachments
  const uploadAttachments = async (attachments: AttachmentData[]): Promise<MessageAttachment[]> => {
    if (attachments.length === 0) return [];

    try {
      const base64Array = attachments.map(attachment => attachment.base64);

      const requestBody = {
        client_id: clientId,
        sender: 'User',
        chat_image: base64Array,
      };

      const response = await AuthApi.postImageInChat(requestBody);

      if (response.data && response.data.status && response.data.file_urls) {
        const messageAttachments: MessageAttachment[] = response.data.file_urls.map(
          (relativeUrl: string, index: number) => {
            const attachment = attachments[index];
            return {
              type: attachment.type,
              url: relativeUrl,
              fileName: attachment.fileName,
              fileType: attachment.fileType,
            };
          }
        );

        return messageAttachments;
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error uploading attachments:', error);
      throw error;
    }
  };

  // Send message with retry
  const handleSendMessage = async () => {
    const hasText = messageText.trim().length > 0;
    const hasAttachments = selectedAttachments.length > 0;

    if (!hasText && !hasAttachments) return;
    if (!clientId) {
      Alert.alert('Error', 'Cannot send message: User ID is not available.');
      return;
    }

    const localId = `temp_${Date.now()}_${Math.random()}`;
    const optimisticMessage: Message = {
      id: localId,
      localId,
      text: messageText.trim(),
      sender: 'user',
      timestamp: null,
      client_id: clientId,
      client_mob: profileInfo?.client_mob,
      client_name: profileInfo?.client_name,
      status: 'sending',
      attachments: [],
    };

    setMessages(prev => [optimisticMessage, ...prev]);
    const messageToSend = messageText.trim();
    const attachmentsToSend = [...selectedAttachments];
    
    setMessageText('');
    setSelectedAttachments([]);

    setPendingMessages(prev => [
      ...prev,
      {
        localId,
        message: optimisticMessage,
        retryCount: 0,
        attachmentData: attachmentsToSend,
      },
    ]);

    await sendMessageWithRetry(localId, messageToSend, attachmentsToSend, clientId);
  };

  const sendMessageWithRetry = async (
    localId: string,
    messageText: string,
    attachments: AttachmentData[],
    clientId: string,
    retryCount: number = 0
  ) => {
    try {
      setSending(true);
      setUploadingAttachments(attachments.length > 0);

      let messageAttachments: MessageAttachment[] = [];

      if (attachments.length > 0) {
        messageAttachments = await uploadAttachments(attachments);
      }

      const chatPath = `chats/${clientId}`;
      const messagesPath = `${chatPath}/messages`;

      const newMessage: any = {
        text: messageText || '',
        sender: 'user',
        timestamp: serverTimestamp(),
        client_id: clientId,
        created_at: new Date().toISOString(),
        message_seen: 0,
      };

      if (profileInfo?.client_mob) newMessage.client_mob = profileInfo.client_mob;
      if (profileInfo?.client_name) newMessage.client_name = profileInfo.client_name;
      if (messageAttachments.length > 0) newMessage.attachments = messageAttachments;

      const chatDocRef = doc(firestore(), chatPath);
      await setDoc(
        chatDocRef,
        {
          client_id: clientId,
          last_updated: serverTimestamp(),
          admin_unread_count: firestore.FieldValue.increment(1),
          client_name: profileInfo?.client_name,
          client_mob: profileInfo?.client_mob,
        },
        { merge: true }
      );

      const messagesCollection = collection(firestore(), messagesPath);
      const docRef = await addDoc(messagesCollection, newMessage);

      setMessages(prev =>
        prev.map(m =>
          m.localId === localId
            ? { ...m, id: docRef.id, status: 'sent', timestamp: serverTimestamp() }
            : m
        )
      );

      setPendingMessages(prev => prev.filter(p => p.localId !== localId));

    } catch (error: any) {
      console.error('Error sending message:', error, 'Retry:', retryCount);

      if (retryCount < MESSAGE_RETRY_ATTEMPTS) {
        const delay = MESSAGE_RETRY_DELAY_MS * Math.pow(2, retryCount);
        
        setTimeout(() => {
          sendMessageWithRetry(localId, messageText, attachments, clientId, retryCount + 1);
        }, delay);

        setPendingMessages(prev =>
          prev.map(p =>
            p.localId === localId ? { ...p, retryCount: retryCount + 1 } : p
          )
        );
      } else {
        setMessages(prev =>
          prev.map(m => (m.localId === localId ? { ...m, status: 'failed' } : m))
        );

        Alert.alert(
          'Message Failed',
          'Could not send message. It will be retried when you come back online.',
          [
            { text: 'Cancel', onPress: () => removeFailedMessage(localId) },
            { text: 'Retry Now', onPress: () => retryFailedMessage(localId) },
          ]
        );
      }
    } finally {
      setSending(false);
      setUploadingAttachments(false);
    }
  };

  const retryPendingMessages = useCallback(() => {
    pendingMessages.forEach(pending => {
      if (pending.message.status === 'failed' || pending.retryCount > 0) {
        sendMessageWithRetry(
          pending.localId,
          pending.message.text,
          pending.attachmentData || [],
          clientId!,
          0
        );
      }
    });
  }, [pendingMessages, clientId]);

  const retryFailedMessage = (localId: string) => {
    const pending = pendingMessages.find(p => p.localId === localId);
    if (pending && clientId) {
      sendMessageWithRetry(
        pending.localId,
        pending.message.text,
        pending.attachmentData || [],
        clientId,
        0
      );
    }
  };

  const removeFailedMessage = (localId: string) => {
    setMessages(prev => prev.filter(m => m.localId !== localId));
    setPendingMessages(prev => prev.filter(p => p.localId !== localId));
  };

  const handleAttachmentPress = async () => {
    try {
      const attachments = await showAttachmentOptions();
      if (attachments.length > 0) {
        const totalSize = attachments.reduce((sum, att) => {
          const sizeEstimate = att.base64.length * 0.75;
          return sum + sizeEstimate;
        }, 0);

        if (totalSize > 10 * 1024 * 1024) {
          Alert.alert('File Too Large', 'Please select files smaller than 10MB total.');
          return;
        }

        setSelectedAttachments(prev => [...prev, ...attachments]);
      }
    } catch (error) {
      console.error('Error selecting attachments:', error);
      Alert.alert('Error', 'Failed to select attachments');
    }
  };

  const removeAttachment = (index: number) => {
    setSelectedAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const renderMessage = useCallback(({ item }: { item: Message }) => {
    const isUserMessage = item.sender === 'user';

    const formatTimestamp = (timestamp: any) => {
      if (!timestamp) return item.status === 'sending' ? 'Sending...' : 'Pending';
      try {
        let date: Date;
        if (timestamp && typeof timestamp.toDate === 'function') {
          date = timestamp.toDate();
        } else if (typeof timestamp === 'string') {
          date = new Date(timestamp);
        } else if (timestamp instanceof Date) {
          date = timestamp;
        } else if (typeof timestamp === 'number') {
          date = new Date(timestamp);
        } else {
          return 'Invalid time';
        }

        if (isNaN(date.getTime())) return 'Invalid time';

        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } catch (error) {
        return 'Invalid time';
      }
    };

    const timeString = formatTimestamp(item.timestamp);

    const renderAttachment = (attachment: MessageAttachment, index: number) => {
      const fullUrl = attachment.url.startsWith('http')
        ? attachment.url
        : `${ENDPOINT}/${attachment.url}`;

      const isImageType = attachment.type === 'image' || isImageFile(attachment.fileName);

      if (isImageType) {
        return (
          <TouchableOpacity
            key={index}
            onPress={() => {
              setCurrentImageUrl(fullUrl);
              setShowImageViewer(true);
            }}
            style={{ marginBottom: 5 }}>
            <Image
              source={{ uri: fullUrl }}
              style={{
                maxWidth: 200,
                maxHeight: 200,
                minHeight: 100,
                borderRadius: 8,
              }}
              resizeMode="cover"
            />
          </TouchableOpacity>
        );
      } else {
        const extension = getFileExtension(attachment.fileName).toUpperCase();
        const displayName = getFileTypeDisplayName(attachment.fileName);
        const isPdf = extension === 'PDF';

        return (
          <TouchableOpacity
            key={index}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 8,
              backgroundColor: isUserMessage ? '#dcf8c6' : WHITE,
              borderRadius: 8,
              marginBottom: 5,
              maxWidth: 200,
              borderWidth: 1,
              borderColor: isUserMessage ? '#d1f2cc' : '#e0e0e0',
            }}
            onPress={() => {
              if (isPdf) {
                setCurrentPdfUrl(fullUrl);
                setCurrentPdfName(attachment.fileName);
                setShowPdfViewer(true);
              } else {
                Linking.openURL(fullUrl).catch(err => {
                  console.error('Failed to open document:', err);
                  Alert.alert('Error', 'Could not open document.');
                });
              }
            }}>
            <View
              style={{
                backgroundColor: isPdf ? '#dc2626' : '#757575',
                width: 32,
                height: 32,
                borderRadius: 4,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 8,
              }}>
              <TextPoppinsRegular style={{ color: WHITE, fontSize: 9, fontWeight: 'bold' }}>
                {extension.substring(0, 3)}
              </TextPoppinsRegular>
            </View>
            <View style={{ flex: 1 }}>
              <TextPoppinsRegular
                style={{ color: isUserMessage ? '#075e54' : '#424242', fontSize: 12 }}
                numberOfLines={1}>
                {attachment.fileName.length > 20
                  ? `${attachment.fileName.substring(0, 20)}...`
                  : attachment.fileName}
              </TextPoppinsRegular>
              <TextPoppinsRegular style={{ color: '#757575', fontSize: 10 }}>
                {displayName}
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
        <View style={[styles.messageBubble, isUserMessage ? styles.userBubble : styles.supportBubble]}>
          {item.attachments && item.attachments.length > 0 && (
            <View style={{ marginBottom: item.text ? 8 : 0 }}>
              {item.attachments.map((attachment, index) => renderAttachment(attachment, index))}
            </View>
          )}

          {item.text && (
            <TextPoppinsRegular
              style={[styles.messageText, isUserMessage ? styles.userText : styles.supportText]}>
              {item.text}
            </TextPoppinsRegular>
          )}

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <TextPoppinsRegular
              style={[styles.messageTime, isUserMessage ? styles.userTime : styles.supportTime]}>
              {timeString}
            </TextPoppinsRegular>
            
            {isUserMessage && (
              <Text style={{ fontSize: 10, marginLeft: 4 }}>
                {item.status === 'sending' && '🕐'}
                {item.status === 'sent' && '✓'}
                {item.status === 'failed' && '❌'}
              </Text>
            )}
          </View>
        </View>
      </View>
    );
  }, []);

  const keyExtractor = useCallback((item: Message) => item.id, []);

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {headerView(
        `Hi, ${profileDetail?.client_name || ''}`,
        isOnline ? 'Online' : 'Offline',
        onPressSide,
        totalItems,
        navigation,
        CHAT_SCREEN
      )}

      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
        
        {!isOnline && (
          <View style={{
            backgroundColor: '#ff9800',
            padding: 8,
            alignItems: 'center',
          }}>
            <TextPoppinsRegular style={{ color: WHITE, fontSize: 12 }}>
              You're offline. Messages will be sent when connection is restored.
            </TextPoppinsRegular>
          </View>
        )}

        {loading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={MDBLUE} />
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={keyExtractor}
            renderItem={renderMessage}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.messagesContainer}
            onEndReached={loadMoreMessages}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              loadingMore ? (
                <ActivityIndicator size="small" color={MDBLUE} style={{ marginVertical: 10 }} />
              ) : null
            }
            ListEmptyComponent={
              <View style={{ padding: 20, alignItems: 'center', marginTop: 50 }}>
                <Text style={{ color: GRAY, fontSize: 16, textAlign: 'center' }}>
                  No messages yet.
                </Text>
                <Text style={{ color: GRAY, fontSize: 14, marginTop: 8 }}>
                  Say hello to start the conversation!
                </Text>
              </View>
            }
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
            inverted={true}
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            updateCellsBatchingPeriod={50}
            windowSize={10}
          />
        )}

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

                {uploadingAttachments && (
                  <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="small" color={WHITE} />
                  </View>
                )}

                {!uploadingAttachments && (
                  <TouchableOpacity
                    style={styles.removeAttachment}
                    onPress={() => removeAttachment(index)}>
                    <TextPoppinsRegular style={styles.removeAttachmentText}>×</TextPoppinsRegular>
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
            activeOpacity={0.7}>
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
            editable={!!clientId && !loading}
          />
          
          <TouchableOpacity
            style={[
              styles.sendButton,
              {
                opacity:
                  (messageText.trim() || selectedAttachments.length > 0) &&
                  !sending &&
                  !uploadingAttachments &&
                  clientId
                    ? 1
                    : 0.5,
              },
            ]}
            onPress={handleSendMessage}
            disabled={
              !(messageText.trim() || selectedAttachments.length > 0) ||
              sending ||
              uploadingAttachments ||
              !clientId
            }
            activeOpacity={0.7}>
            {sending || uploadingAttachments ? (
              <ActivityIndicator size="small" color={WHITE} />
            ) : (
              <SendIcon width={20} height={20} color={WHITE} />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <Modal
        visible={showPdfViewer}
        animationType="slide"
        onRequestClose={() => setShowPdfViewer(false)}>
        <SafeAreaView style={{ flex: 1, backgroundColor: BLACK }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 16,
              backgroundColor: '#075e54',
            }}>
            <View style={{ flex: 1 }}>
              <TextPoppinsSemiBold style={{ color: WHITE, fontSize: 16 }}>
                PDF Document
              </TextPoppinsSemiBold>
              <TextPoppinsRegular style={{ color: WHITE, fontSize: 12, opacity: 0.8 }} numberOfLines={1}>
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
              }}>
              <CrossIcon width={20} height={20} color={WHITE} />
            </TouchableOpacity>
          </View>

          <View style={{ flex: 1 }}>
            {currentPdfUrl ? (
              <WebView
                source={{
                  uri: `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(
                    currentPdfUrl
                  )}`,
                }}
                style={{ flex: 1 }}
                startInLoadingState={true}
                renderLoading={() => (
                  <View
                    style={{
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
                    <TextPoppinsRegular style={{ marginTop: 12, color: GRAY }}>
                      Loading PDF...
                    </TextPoppinsRegular>
                  </View>
                )}
                onError={() => {
                  Alert.alert('Error', 'Could not load PDF. Open externally?', [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Open External',
                      onPress: () => {
                        setShowPdfViewer(false);
                        Linking.openURL(currentPdfUrl);
                      },
                    },
                  ]);
                }}
              />
            ) : (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <TextPoppinsRegular style={{ color: GRAY }}>No PDF to display</TextPoppinsRegular>
              </View>
            )}
          </View>
        </SafeAreaView>
      </Modal>

      <Modal
        visible={showImageViewer}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowImageViewer(false)}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.9)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
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
            }}>
            <CrossIcon width={24} height={24} color={WHITE} />
          </TouchableOpacity>

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
              onError={() => {
                Alert.alert('Error', 'Could not load image');
                setShowImageViewer(false);
              }}
            />
          ) : (
            <View style={{ justifyContent: 'center', alignItems: 'center', padding: 20 }}>
              <TextPoppinsRegular style={{ color: WHITE }}>No image to display</TextPoppinsRegular>
            </View>
          )}

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