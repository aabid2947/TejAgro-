/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import ImageViewer from 'react-native-image-zoom-viewer';
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
  images?: string[];
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
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  console.log('PostItem rendered with post:',post.content, post.image);

  const getPostImages = (): string[] => {
    if (post.images && post.images.length > 0) {
      return post.images;
    }
    return post.image ? [post.image] : [];
  };

  const images = getPostImages();

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
        
        {images.length > 0 && (
          <View style={styles.imagesContainer}>
            {images.length === 1 ? (
              <TouchableOpacity 
                style={styles.singleImageContainer}
                onPress={() => {
                  setCurrentImageIndex(0);
                  setShowImageModal(true);
                }}
                activeOpacity={0.9}
              >
                <Image
                  source={{ uri: images[0] }}
                  style={styles.singleImage}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ) : (
              <View style={styles.multipleImagesGrid}>
                {images.slice(0, 4).map((imageUri, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.gridImageContainer,
                      images.length === 2 && styles.twoImagesContainer,
                      images.length === 3 && index === 0 && styles.threeImagesFirstContainer,
                      images.length === 3 && index > 0 && styles.threeImagesOtherContainer,
                    ]}
                    onPress={() => {
                      setCurrentImageIndex(index);
                      setShowImageModal(true);
                    }}
                    activeOpacity={0.9}
                  >
                    <Image
                      source={{ uri: imageUri }}
                      style={styles.gridImage}
                      resizeMode="cover"
                    />
                    {index === 3 && images.length > 4 && (
                      <View style={styles.moreImagesOverlay}>
                        <Text style={styles.moreImagesText}>+{images.length - 4}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
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

      {/* Image Zoom Modal */}
      {images.length > 0 && (
        <Modal
          visible={showImageModal}
          transparent={true}
          onRequestClose={() => setShowImageModal(false)}
        >
          <ImageViewer
            imageUrls={images.map(uri => ({ url: uri }))}
            index={currentImageIndex}
            enableSwipeDown={true}
            onSwipeDown={() => setShowImageModal(false)}
            backgroundColor="rgba(0, 0, 0, 0.95)"
            renderHeader={() => (
              <View style={styles.imageModalHeader}>
                <TouchableOpacity
                  style={styles.imageModalCloseButton}
                  onPress={() => setShowImageModal(false)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.imageModalCloseText}>×</Text>
                </TouchableOpacity>
                {images.length > 1 && (
                  <Text style={styles.imageModalCounter}>
                    {currentImageIndex + 1} / {images.length}
                  </Text>
                )}
              </View>
            )}
            renderIndicator={() => <View />}
            enableImageZoom={true}
            maxOverflow={300}
            onChange={(index) => setCurrentImageIndex(index || 0)}
          />
        </Modal>
      )}
    </TouchableOpacity>
  );
};

export default PostItem;