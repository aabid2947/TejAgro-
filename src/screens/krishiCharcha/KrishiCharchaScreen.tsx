/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../reduxToolkit/store';
import AuthApi from '../../api/AuthApi';
import { jwtDecode } from 'jwt-decode';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
// import { StackNavigationProp } from '@react-navigation/stack';
import { styles } from './KrishiCharchaStyle';
import PostItem from '../../components/commonComponent/PostItem';
import { headerView } from '../../shared/components/CommonUtilities';
import { MENUBAR_SCREEN } from '../../routes/Routes';
import { MDBLUE, WHITE } from '../../shared/common-styles/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Post {
  post_id: string;
  client_id: string;
  client_name: string;
  client_mob: string;
  post_desc: string;
  post_file?: string; // Keep for backward compatibility
  post_files?: string[]; // New field for multiple images
  post_category: string;
  created_on: string;
  like_count: string;
  likes: Array<{
    client_id: string;
    client_name: string;
    client_mob: string;
  }>;
  comment_count: string;
  comments: Array<{
    id: string;
    client_id: string;
    comment_text: string;
    created_on: string;
    client_name: string;
  }>;
}

// type NavigationProp = StackNavigationProp<any>;

const KrishiCharchaScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  
  const profileDetail: any = useSelector((state: RootState) => state.counter.isProfileInfo);
  const totalItems = useSelector((state: RootState) => state.counter.totalItems);
  const isUserData = useSelector((state: any) => state.counter.isUserinfo);
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);

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
    navigation.navigate(MENUBAR_SCREEN as never);
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async (pageNum = 1, refresh = false) => {
    try {
      if (refresh) {
        setRefreshing(true);
        setPage(1);
        setPosts([]);
      } else {
        setLoading(true);
      }

      // Call the real API
      // const payload = {
      //   client_id: currentClientId,
      //   page: pageNum
      // };

      const response = await AuthApi.getPosts({
        client_id: currentClientId
      });
      
      
      if (response?.data?.status && response?.data?.posts) {
        const apiPosts = response.data.posts;
        
        if (refresh) {
          setPosts(apiPosts);
          setRefreshing(false);
        } else {
          setPosts(prev => pageNum === 1 ? apiPosts : [...prev, ...apiPosts]);
          setLoading(false);
        }
        setHasMoreData(apiPosts.length === 10); // Assuming 10 items per page
      } else {
        if (refresh) {
          setPosts([]);
          setRefreshing(false);
        } else {
          setLoading(false);
        }
        setHasMoreData(false);
      }

    } catch (error) {
      console.error('Error loading posts:', error);
      setLoading(false);
      setRefreshing(false);
      Alert.alert(t('ERROR'), t('FAILED_TO_LOAD_POSTS'));
    }
  };

  const onRefresh = () => {
    loadPosts(1, true);
  };

  const loadMorePosts = () => {
    if (!loading && hasMoreData) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadPosts(nextPage);
    }
  };

  const handlePostPress = (post: Post) => {
    (navigation as any).navigate('PostDetails', { post });
  };

  const handleCreatePost = () => {
    navigation.navigate('CreatePost' as never);
  };

  const handleLike = async (postId: string) => {
    try {
      const payload = {
        post_id: postId,
        client_id: currentClientId
      };
      console.log(payload, "likePayloadlikePayload");

      const response = await AuthApi.likePost(payload);
      console.log(response.data, "likeResponselikeResponse");
      
      if (response?.data?.status) {
        // Update the local state to reflect the like/unlike
        setPosts(prev =>
          prev.map(post => {
            if (post.post_id === postId) {
              const isCurrentlyLiked = post.likes.some(like => like.client_id === currentClientId);
              
              if (isCurrentlyLiked) {
                // Unlike: remove current user from likes array
                return {
                  ...post,
                  likes: post.likes.filter(like => like.client_id !== currentClientId),
                  like_count: String(parseInt(post.like_count) - 1)
                };
              } else {
                // Like: add current user to likes array
                const newLike = {
                  client_id: currentClientId,
                  client_name: profileDetail?.client_name || '',
                  client_mob: profileDetail?.client_mob || ''
                };
                return {
                  ...post,
                  likes: [...post.likes, newLike],
                  like_count: String(parseInt(post.like_count) + 1)
                };
              }
            }
            return post;
          })
        );
      }
    } catch (error) {
      console.error('Error liking post:', error);
      Alert.alert(t('ERROR'), t('FAILED_TO_LIKE_UNLIKE_POST'));
    }
  };

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={MDBLUE} />
        <Text style={styles.loadingText}>{t('LOADING_POSTS')}</Text>
      </View>
    );
  };

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>{t('NO_POSTS')}</Text>
    </View>
  );

  // Transform API post data to match PostItem component expectations
  const transformPostForUI = (post: Post) => {
    const isLiked = post.likes.some(like => like.client_id === currentClientId);
    
    // Get the first image for display - support both old and new formats
    let imageUrl = undefined;
    if (post.post_files && post.post_files.length > 0) {
      imageUrl = post.post_files[0]; // Show first image in list view
    } else if (post.post_file) {
      imageUrl = post.post_file;
    }
    
    return {
      id: post.post_id,
      author: {
        name: post.client_name,
        location: '', // API doesn't provide location
        timeAgo: new Date(post.created_on).toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })
      },
      content: post.post_desc,
      image: imageUrl,
      images: post.post_files || (post.post_file ? [post.post_file] : []), // Include all images
      likes: parseInt(post.like_count),
      comments: parseInt(post.comment_count),
      isLiked: isLiked,
      tags: []
    };
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {headerView(t('KRISHI_CHARCHA'), t('FARMING_COMMUNITY'), onPressSide, totalItems, navigation, undefined)}
      
      <View style={styles.content}>
        <FlatList
          data={posts}
          keyExtractor={(item) => item.post_id}
          renderItem={({ item }) => (
            <PostItem
              post={transformPostForUI(item)}
              onPress={() => handlePostPress(item)}
              onLike={() => handleLike(item.post_id)}
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[MDBLUE]}
            />
          }
          onEndReached={loadMorePosts}
          onEndReachedThreshold={0.1}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmptyComponent}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={posts.length === 0 ? styles.emptyListContainer : undefined}
        />
      </View>
    </SafeAreaView>
  );
};

export default KrishiCharchaScreen;