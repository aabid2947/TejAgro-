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
});