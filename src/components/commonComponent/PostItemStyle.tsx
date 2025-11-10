/* eslint-disable prettier/prettier */
import { StyleSheet } from 'react-native';
import { WHITE, BLACK, GRAY, MDBLUE } from '../../shared/common-styles/colors';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: WHITE,
    marginHorizontal: 12,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingBottom: 12,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: MDBLUE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: WHITE,
    fontSize: 16,
    fontWeight: 'bold',
  },
  authorDetails: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    color: BLACK,
    marginBottom: 2,
  },
  location: {
    fontSize: 12,
    color: GRAY,
    marginBottom: 2,
  },
  timeAgo: {
    fontSize: 12,
    color: GRAY,
  },
  followButton: {
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  followText: {
    color: '#4CAF50',
    fontSize: 12,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  content: {
    fontSize: 14,
    color: BLACK,
    lineHeight: 20,
    marginBottom: 12,
  },
  imageContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 8,
  },
  postImage: {
    width: '100%',
    height: 200,
  },
  imagesContainer: {
    marginTop: 8,
  },
  singleImageContainer: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  singleImage: {
    width: '100%',
    height: 200,
  },
  multipleImagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridImageContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    width: '49%',
    height: 120,
    marginBottom: 4,
  },
  twoImagesContainer: {
    width: '49%',
    height: 120,
  },
  threeImagesFirstContainer: {
    width: '100%',
    height: 150,
    marginBottom: 4,
  },
  threeImagesOtherContainer: {
    width: '49%',
    height: 120,
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  moreImagesOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreImagesText: {
    color: WHITE,
    fontSize: 18,
    fontWeight: 'bold',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
    paddingVertical: 4,
  },
  likeButton: {
    // Special styling for like button if needed
  },
  actionText: {
    fontSize: 13,
    color: GRAY,
    marginLeft: 6,
  },
  likedText: {
    color: '#FF6B6B',
  },
  imageModalCloseButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  imageModalCloseText: {
    color: WHITE,
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  imageModalHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: 40,
    paddingHorizontal: 20,
    zIndex: 999,
  },
  imageModalCounter: {
    color: WHITE,
    fontSize: 16,
    fontWeight: '600',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 4,
  },
});