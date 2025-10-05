/* eslint-disable prettier/prettier */
import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { styles } from './CommentItemStyle';
import { MDBLUE, WHITE } from '../../shared/common-styles/colors';
import TextPoppinsRegular from '../../shared/fontFamily/TextPoppinsRegular';
import TextPoppinsSemiBold from '../../shared/fontFamily/TextPoppinsSemiBold';
import LikeIcon from '../../svg/LikeIcon';

interface Comment {
  id: string;
  author: {
    name: string;
    avatar?: string;
  };
  content: string;
  timeAgo: string;
  likes: number;
  isLiked: boolean;
  replies?: Comment[];
}

interface CommentItemProps {
  comment: Comment;
  onLike: () => void;
  isReply?: boolean;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, onLike, isReply = false }) => {
  const { t } = useTranslation();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <View style={[styles.container, isReply && styles.replyContainer]}>
      <View style={styles.avatarContainer}>
        {comment.author.avatar ? (
          <Image source={{ uri: comment.author.avatar }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>{getInitials(comment.author.name)}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <TextPoppinsSemiBold style={styles.authorName}>
            {comment.author.name}
          </TextPoppinsSemiBold>
          <TextPoppinsRegular style={styles.timeAgo}>
            {comment.timeAgo}
          </TextPoppinsRegular>
        </View>
        
        <TextPoppinsRegular style={styles.content}>
          {comment.content}
        </TextPoppinsRegular>
        
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.likeButton}
            onPress={onLike}
            activeOpacity={0.7}
          >
            <LikeIcon
              width={16}
              height={16}
              color={comment.isLiked ? '#FF6B6B' : '#666'}
              filled={comment.isLiked}
            />
            <Text style={[styles.likeText, comment.isLiked && styles.likedText]}>
              {comment.likes > 0 ? comment.likes : ''}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.replyButton} activeOpacity={0.7}>
            <TextPoppinsRegular style={styles.replyText}>
              {t('REPLY')}
            </TextPoppinsRegular>
          </TouchableOpacity>
        </View>
        
        {comment.replies && comment.replies.length > 0 && (
          <TouchableOpacity style={styles.viewRepliesButton} activeOpacity={0.7}>
            <TextPoppinsRegular style={styles.viewRepliesText}>
              {t('VIEW_REPLIES')} ({comment.replies.length})
            </TextPoppinsRegular>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default CommentItem;