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
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../../reduxToolkit/store';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { styles } from './ChatScreenStyle'; // Make sure you have this style file
import { headerView } from '../../shared/components/CommonUtilities'; // Make sure you have this component
import { CHAT_SCREEN, MENUBAR_SCREEN } from '../../routes/Routes'; // Make sure you have this route
import { MDBLUE, WHITE, GRAY, BLACK } from '../../shared/common-styles/colors'; // Make sure you have these colors
import TextPoppinsRegular from '../../shared/fontFamily/TextPoppinsRegular'; // Make sure you have this font
import SendIcon from '../../svg/SendIcon'; // Make sure you have this icon
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Firebase and auth
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
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
          console.log('Client ID set:', decodedToken.data.client_id);
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

    const unsubscribe = firestore()
      .collection(messagesPath)
      .orderBy('timestamp', 'asc') // Get messages in chronological order
      .onSnapshot(
        (querySnapshot) => {
          console.log('Firestore snapshot received, document count:', querySnapshot.size);
          const loadedMessages: Message[] = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            console.log('Processing message doc:', doc.id, data);
            loadedMessages.push({
              id: doc.id,
              text: data.text,
              sender: data.sender,
              timestamp: data.timestamp,
              client_mob: data.client_mob,
              client_name: data.client_name,
              client_id: data.client_id,
              message_seen: data.message_seen || 0, // Default to 0 (unread) if not present
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
      const batch = firestore().batch();
      let hasUpdates = false;

      // Find ALL admin messages (regardless of current message_seen status)
      const adminMessages = messages.filter(
        message => message.sender === 'admin'
      );

      console.log('Marking', adminMessages.length, 'admin messages as read');

      adminMessages.forEach((message) => {
        const messageRef = firestore().collection(messagesPath).doc(message.id);
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
        const snapshot = await firestore().collection(messagesPath).where('sender', '==', 'admin').get();
        
        if (!snapshot.empty) {
          const batch = firestore().batch();
          let hasUpdates = false;

          snapshot.forEach((doc) => {
            batch.update(doc.ref, { message_seen: 1 });
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

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;

    if (!clientId) {
      Alert.alert('Error', 'Cannot send message: User ID is not available.');
      return;
    }

    console.log('Attempting to send message with:', {
      clientId,
      client_mob: profileInfo?.client_mob,
      client_name: profileInfo?.client_name,
      messageLength: messageText.trim().length
    });

    setSending(true);
    
    // Use the chat structure that matches your Firestore rules: chats/{chatId}/messages
    const chatPath = `chats/${clientId}`;
    const messagesPath = `${chatPath}/messages`;

    const newMessage = {
      text: messageText.trim(),
      sender: 'user', // Set sender as 'user'
      timestamp: firestore.FieldValue.serverTimestamp(), // Use server timestamp
      client_mob: profileInfo?.client_mob || '',
      client_name: profileInfo?.client_name || '',
      client_id: clientId,
      created_at: new Date().toISOString(), // Additional timestamp for sorting
      message_seen: 0, // User messages start as unread (0)
    };

    try {
      console.log('Sending message to path:', messagesPath);
      console.log('Message data:', newMessage);
      
      // First, ensure the chat document exists
      await firestore().doc(chatPath).set({
        client_id: clientId,
        client_name: profileInfo?.client_name || '',
        client_mob: profileInfo?.client_mob || '',
        last_updated: firestore.FieldValue.serverTimestamp(),
      }, { merge: true });

      // Then add the message to the messages subcollection
      await firestore().collection(messagesPath).add(newMessage);
      
      console.log('Message sent successfully');
      setMessageText(''); // Clear input on success
      // The snapshot listener will automatically update the UI
    } catch (error: any) {
      console.error('Error sending message:', error);
      console.error('Error details:', {
        code: error?.code,
        message: error?.message,
        clientId,
        chatPath,
        messagesPath
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
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    // Check if the sender is 'user' or 'admin'
    const isUserMessage = item.sender === 'user';
    
    // Format the timestamp. It could be null (if pending) or a Timestamp object
    const timeString = item.timestamp
      ? new Date(item.timestamp.toDate()).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })
      : 'Sending...';

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
          <TextPoppinsRegular
            style={[
              styles.messageText,
              isUserMessage ? styles.userText : styles.supportText,
            ]}>
            {item.text}
          </TextPoppinsRegular>

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

        <View style={styles.inputContainer}>
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
            editable={!!clientId && !loading}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              { opacity: (messageText.trim() && !sending && clientId) ? 1 : 0.5 },
            ]}
            onPress={handleSendMessage}
            disabled={!messageText.trim() || sending || !clientId}
            activeOpacity={0.7}>
            <SendIcon width={20} height={20} color={WHITE} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;