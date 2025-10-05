/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../reduxToolkit/store';
import { styles } from './test';
import { headerView } from '../../shared/components/CommonUtilities';
import { MENUBAR_SCREEN, CHAT_CONVERSATION_SCREEN } from '../../routes/Routes';
import { MDBLUE, WHITE, GRAY } from '../../shared/common-styles/colors';
import TextPoppinsRegular from '../../shared/fontFamily/TextPoppinsRegular';
import TextPoppinsSemiBold from '../../shared/fontFamily/TextPoppinsSemiBold';
import SendIcon from '../../svg/SendIcon';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'support';
  timestamp: string;
  isRead: boolean;
}

interface Chat {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  avatar?: string;
  isOnline?: boolean;
}

const ChatScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  
  const profileDetail: any = useSelector((state: RootState) => state.counter.isProfileInfo);
  const totalItems = useSelector((state: RootState) => state.counter.totalItems);
  
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  // Sidebar/menu press handler
  const onPressSide = () => {
    navigation.navigate(MENUBAR_SCREEN as never);
  };

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    try {
      setLoading(true);
      
      // Mock chat data - Replace with actual API
      const mockChats: Chat[] = [
        {
          id: '1',
          title: 'Customer Support',
          lastMessage: 'Hello! How can we help you today?',
          timestamp: '2 mins ago',
          unreadCount: 1,
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
          isOnline: true,
        },
        {
          id: '2',
          title: 'Agri Expert - Dr. Sharma',
          lastMessage: 'Your crop analysis report is ready',
          timestamp: '1 hour ago',
          unreadCount: 0,
          avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
          isOnline: false,
        },
        {
          id: '3',
          title: 'Order Updates',
          lastMessage: 'Your fertilizer order has been shipped',
          timestamp: '3 hours ago',
          unreadCount: 2,
          isOnline: false,
        },
        {
          id: '4',
          title: 'Weather Alerts',
          lastMessage: 'Rain expected in your area tomorrow',
          timestamp: 'Yesterday',
          unreadCount: 0,
          isOnline: false,
        },
      ];

      setTimeout(() => {
        setChats(mockChats);
        setLoading(false);
      }, 1000);

    } catch (error) {
      console.error('Error loading chats:', error);
      setLoading(false);
      Alert.alert('Error', 'Failed to load chats');
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const handleChatPress = (chat: Chat) => {
    // Navigate to individual chat conversation
    navigation.navigate(CHAT_CONVERSATION_SCREEN as never, { chat } as never);
  };

  const renderChatItem = ({ item }: { item: Chat }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => handleChatPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.avatarContainer}>
        {item.avatar ? (
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>{getInitials(item.title)}</Text>
          </View>
        )}
        {item.isOnline && <View style={styles.onlineIndicator} />}
      </View>
      
      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <TextPoppinsSemiBold style={styles.chatTitle} numberOfLines={1}>
            {item.title}
          </TextPoppinsSemiBold>
          <TextPoppinsRegular style={styles.timestamp}>
            {item.timestamp}
          </TextPoppinsRegular>
        </View>
        
        <View style={styles.chatFooter}>
          <TextPoppinsRegular 
            style={[
              styles.lastMessage,
              item.unreadCount > 0 && styles.unreadMessage
            ]} 
            numberOfLines={1}
          >
            {item.lastMessage}
          </TextPoppinsRegular>
          
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>{t('NO_CHATS')}</Text>
      <Text style={styles.emptySubText}>Start a conversation with our support team</Text>
    </View>
  );

  const filteredChats = chats.filter(chat =>
    chat.title.toLowerCase().includes(searchText.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {headerView(t('MESSAGES'), "Stay Connected", onPressSide, totalItems, navigation)}
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder={t('SEARCH_CHATS') || 'Search chats...'}
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor={GRAY}
        />
      </View>
      
      <FlatList
        data={filteredChats}
        keyExtractor={(item) => item.id}
        renderItem={renderChatItem}
        ListEmptyComponent={renderEmptyComponent}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={filteredChats.length === 0 ? styles.emptyListContainer : undefined}
        refreshing={loading}
        onRefresh={loadChats}
      />
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;