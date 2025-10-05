/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../reduxToolkit/store';
import AuthApi from '../../api/AuthApi';
import { jwtDecode } from 'jwt-decode';
// import { StackNavigationProp } from '@react-navigation/stack';
import { styles } from './PostDetailsStyle';
import { headerView } from '../../shared/components/CommonUtilities';
import { MENUBAR_SCREEN } from '../../routes/Routes';
import CommentItem from '../../components/commonComponent/CommentItem';
import { MDBLUE, WHITE, GRAY, BLACK } from '../../shared/common-styles/colors';
import TextPoppinsRegular from '../../shared/fontFamily/TextPoppinsRegular';
import TextPoppinsSemiBold from '../../shared/fontFamily/TextPoppinsSemiBold';
import LikeIcon from '../../svg/LikeIcon';
import CommentIcon from '../../svg/CommentIcon';
import SendIcon from '../../svg/SendIcon';

interface Comment {
  id: string;
  client_id: string;
  comment_text: string;
  created_on: string;
  client_name: string;
}

interface Post {
  post_id: string;
  client_id: string;
  client_name: string;
  client_mob: string;
  post_desc: string;
  post_file?: string;
  post_category: string;
  created_on: string;
  like_count: string;
  likes: Array<{
    client_id: string;
    client_name: string;
    client_mob: string;
  }>;
  comment_count: string;
  comments: Comment[];
}

// type NavigationProp = StackNavigationProp<any>;

const PostDetailsScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const { post } = route.params as { post: Post };

  const profileDetail: any = useSelector((state: RootState) => state.counter.isProfileInfo);
  const totalItems = useSelector((state: RootState) => state.counter.totalItems);
  const isUserData = useSelector((state: any) => state.counter.isUserinfo);

  const [currentPost, setCurrentPost] = useState<Post>(post);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  // Decode token to get current user's client_id
  const decodeToken = (token: string) => {
    try {
      const decoded = jwtDecode(token);
      return decoded;
    } catch (error) {
      console.log('Error decoding JWT token:', error);
      return null;
    }
  };

  const token = isUserData?.jwt;
  const decodedToken: any = decodeToken(token);
  const currentClientId = decodedToken?.data?.client_id;

  // Sidebar/menu press handler
  const onPressSide = () => {
    navigation.navigate('MENUBAR_SCREEN' as never);
  };

  useEffect(() => {
    loadComments();
  }, []);

  const loadComments = async () => {
    try {
      setLoading(true);
      
      // Get all posts and find the specific post
      const response = await AuthApi.getPosts();
      
      if (response?.data?.status && response?.data?.posts && response?.data?.posts.length > 0) {
        const postData = response.data.posts.find((p: Post) => p.post_id === currentPost.post_id);
        if (postData) {
          setCurrentPost(postData);
          setComments(postData.comments || []);
        }
      }
      setLoading(false);

    } catch (error) {
      console.error('Error loading comments:', error);
      setLoading(false);
      Alert.alert('Error', 'Failed to load comments');
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

  const handleLike = async () => {
    try {
      const payload = {
        post_id: currentPost.post_id,
        client_id: currentClientId
      };

      const response = await AuthApi.likePost(payload);
      
      if (response?.data?.status) {
        // Update the local state to reflect the like/unlike
        const isCurrentlyLiked = currentPost.likes.some(like => like.client_id === currentClientId);
        
        if (isCurrentlyLiked) {
          // Unlike: remove current user from likes array
          setCurrentPost(prev => ({
            ...prev,
            likes: prev.likes.filter(like => like.client_id !== currentClientId),
            like_count: String(parseInt(prev.like_count) - 1)
          }));
        } else {
          // Like: add current user to likes array
          const newLike = {
            client_id: currentClientId,
            client_name: profileDetail?.client_name || '',
            client_mob: profileDetail?.client_mob || ''
          };
          setCurrentPost(prev => ({
            ...prev,
            likes: [...prev.likes, newLike],
            like_count: String(parseInt(prev.like_count) + 1)
          }));
        }
      }
    } catch (error) {
      console.error('Error liking post:', error);
      Alert.alert('Error', 'Failed to like/unlike post');
    }
  };

  const handleCommentLike = (commentId: string) => {
    // Note: You may need to implement a separate API for comment likes
    // For now, this is a placeholder
    console.log('Comment like not implemented yet for comment:', commentId);
  };

  const handleSubmitComment = async () => {
    if (!commentText.trim()) return;

    try {
      setSubmittingComment(true);
      
      const payload = {
        post_id: currentPost.post_id,
        client_id: currentClientId,
        comment_text: commentText.trim()
      };

      const response = await AuthApi.addComment(payload);
      console.log(response.data, "addCommentResponseaddCommentResponse");
      
      if (response?.data?.status) {
        // Create new comment object
        const newComment: Comment = {
          id: Date.now().toString(),
          client_id: currentClientId,
          comment_text: commentText.trim(),
          created_on: new Date().toISOString(),
          client_name: profileDetail?.client_name || 'You'
        };

        setComments(prev => [newComment, ...prev]);
        setCurrentPost(prev => ({ 
          ...prev, 
          comment_count: String(parseInt(prev.comment_count) + 1) 
        }));
        setCommentText('');
      }
      setSubmittingComment(false);

    } catch (error) {
      console.error('Error submitting comment:', error);
      setSubmittingComment(false);
      Alert.alert('Error', 'Failed to submit comment');
    }
  };

  const renderHeader = () => (
    <View style={styles.postContainer}>
      <View style={styles.authorHeader}>
        <View style={styles.authorInfo}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>{getInitials(currentPost.client_name)}</Text>
            </View>
          </View>
          <View style={styles.authorDetails}>
            <TextPoppinsSemiBold style={styles.authorName}>
              {currentPost.client_name}
            </TextPoppinsSemiBold>
            <TextPoppinsRegular style={styles.location}>
              {currentPost.client_mob}
            </TextPoppinsRegular>
            <TextPoppinsRegular style={styles.timeAgo}>
              {new Date(currentPost.created_on).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              })}
            </TextPoppinsRegular>
          </View>
        </View>
      </View>

      <View style={styles.contentContainer}>
        <TextPoppinsRegular style={styles.content}>
          {currentPost.post_desc}
        </TextPoppinsRegular>
        
        {currentPost.post_file && (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: currentPost.post_file }}
              style={styles.postImage}
              resizeMode="cover"
            />
          </View>
        )}
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.likeButton]}
          onPress={handleLike}
          activeOpacity={0.7}
        >
          <LikeIcon
            width={18}
            height={18}
            color={currentPost.likes.some(like => like.client_id === currentClientId) ? '#FF6B6B' : GRAY}
            filled={currentPost.likes.some(like => like.client_id === currentClientId)}
          />
          <Text style={[
            styles.actionText, 
            currentPost.likes.some(like => like.client_id === currentClientId) && styles.likedText
          ]}>
            {currentPost.like_count}
          </Text>
        </TouchableOpacity>

        <View style={styles.actionButton}>
          <CommentIcon width={18} height={18} color={GRAY} />
          <Text style={styles.actionText}>{currentPost.comment_count}</Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <TextPoppinsSemiBold style={styles.sectionTitle}>
          {t('COMMENTS')} ({comments.length})
        </TextPoppinsSemiBold>
      </View>
    </View>
  );

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={MDBLUE} />
        <Text style={styles.loadingText}>{t('LOADING_COMMENTS')}</Text>
      </View>
    );
  };

  const renderEmptyComments = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>{t('NO_COMMENTS')}</Text>
    </View>
  );

  // Transform API comment data to match CommentItem component expectations
  const transformCommentForUI = (comment: Comment) => {
    return {
      id: comment.id,
      author: {
        name: comment.client_name
      },
      content: comment.comment_text,
      timeAgo: new Date(comment.created_on).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }),
      likes: 0, // API doesn't provide comment likes yet
      isLiked: false, // API doesn't provide comment likes yet
      replies: []
    };
  };

  // Custom comment item render since we need to transform data
  const renderCommentItem = ({ item }: { item: Comment }) => (
    <View style={styles.commentContainer}>
      <View style={styles.commentHeader}>
        <View style={styles.commentAvatarContainer}>
          <View style={styles.commentAvatar}>
            <Text style={styles.commentAvatarText}>{getInitials(item.client_name)}</Text>
          </View>
        </View>
        <View style={styles.commentContent}>
          <TextPoppinsSemiBold style={styles.commentAuthor}>
            {item.client_name}
          </TextPoppinsSemiBold>
          <TextPoppinsRegular style={styles.commentText}>
            {item.comment_text}
          </TextPoppinsRegular>
          <TextPoppinsRegular style={styles.commentTime}>
            {new Date(item.created_on).toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            })}
          </TextPoppinsRegular>
        </View>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {headerView(t('POST_DETAILS'), "Krishi Charcha", onPressSide, totalItems, navigation)}
      
      <FlatList
        data={comments}
        keyExtractor={(item) => item.id}
        renderItem={renderCommentItem}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={loading ? null : renderEmptyComments}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />

      <View style={styles.commentInputContainer}>
        <TextInput
          style={styles.commentInput}
          placeholder={t('WRITE_COMMENT')}
          value={commentText}
          onChangeText={setCommentText}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            { opacity: commentText.trim() ? 1 : 0.5 }
          ]}
          onPress={handleSubmitComment}
          disabled={!commentText.trim() || submittingComment}
          activeOpacity={0.7}
        >
          {submittingComment ? (
            <ActivityIndicator size="small" color={WHITE} />
          ) : (
            <SendIcon width={20} height={20} color={WHITE} />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default PostDetailsScreen;