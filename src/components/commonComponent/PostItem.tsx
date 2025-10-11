/* eslint-disable prettier/prettier */
import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { styles } from './PostItemStyle';
import { MDBLUE, GRAY, WHITE } from '../../shared/common-styles/colors';
import TextPoppinsRegular from '../../shared/fontFamily/TextPoppinsRegular';
import TextPoppinsSemiBold from '../../shared/fontFamily/TextPoppinsSemiBold';
import LikeIcon from '../../svg/LikeIcon';
import CommentIcon from '../../svg/CommentIcon';

interface Post {
  id: string;
  author: {
    name: string;
    avatar?: string;
    location: string;
    timeAgo: string;
  };
  content: string;
  image?: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  tags?: string[];
}

interface PostItemProps {
  post: Post;
  onPress: () => void;
  onLike: () => void;
}

const PostItem: React.FC<PostItemProps> = ({ post, onPress, onLike }) => {
  const { t } = useTranslation();
  console.log('PostItem rendered with post:',post.content, post.image);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const handleComment = () => {
    onPress(); // Navigate to post details
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.95}>
      <View style={styles.header}>
        <View style={styles.authorInfo}>
          <View style={styles.avatarContainer}>
            {post.author.avatar ? (
              <Image source={{ uri: post.author.avatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>{getInitials(post.author.name)}</Text>
              </View>
            )}
          </View>
          <View style={styles.authorDetails}>
            <TextPoppinsSemiBold style={styles.authorName}>
              {post.author.name}
            </TextPoppinsSemiBold>
            <TextPoppinsRegular style={styles.location}>
              {post.author.location}
            </TextPoppinsRegular>
            <TextPoppinsRegular style={styles.timeAgo}>
              {post.author.timeAgo}
            </TextPoppinsRegular>
          </View>
        </View>
      </View>

      <View style={styles.contentContainer}>
        <TextPoppinsRegular style={styles.content}>
          {post.content}
        </TextPoppinsRegular>
        
        {post.image && (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: post.image }}
              style={styles.postImage}
              resizeMode="cover"
            />
          </View>
        )}
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.likeButton]}
          onPress={onLike}
          activeOpacity={0.7}
        >
          <LikeIcon
            width={18}
            height={18}
            color={post.isLiked ? '#FF6B6B' : GRAY}
            filled={post.isLiked}
          />
          <Text style={[styles.actionText, post.isLiked && styles.likedText]}>
            {post.likes}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleComment}
          activeOpacity={0.7}
        >
          <CommentIcon width={18} height={18} color={GRAY} />
          <Text style={styles.actionText}>{post.comments}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default PostItem;