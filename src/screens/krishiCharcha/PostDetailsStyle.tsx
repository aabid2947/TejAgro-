/* eslint-disable prettier/prettier */
import { StyleSheet } from 'react-native';
import { WHITE, BLACK, GRAY, MDBLUE } from '../../shared/common-styles/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: MDBLUE,
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 50, // Account for status bar
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: WHITE,
    marginHorizontal: 16,
  },
  headerRight: {
    width: 40,
    height: 40,
  },
  listContainer: {
    flexGrow: 1,
  },
  postContainer: {
    backgroundColor: WHITE,
    marginBottom: 8,
  },
  authorHeader: {
    padding: 16,
    paddingBottom: 12,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
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
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
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
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: WHITE,
  },
  sectionTitle: {
    fontSize: 16,
    color: BLACK,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    marginLeft: 10,
    fontSize: 14,
    color: GRAY,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: GRAY,
    textAlign: 'center',
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: WHITE,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 12,
    maxHeight: 100,
    fontSize: 14,
    color: BLACK,
  },
  sendButton: {
    backgroundColor: MDBLUE,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentContainer: {
    backgroundColor: WHITE,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  commentAvatarContainer: {
    marginRight: 12,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: MDBLUE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentAvatarText: {
    color: WHITE,
    fontSize: 14,
    fontWeight: 'bold',
  },
  commentContent: {
    flex: 1,
  },
  commentAuthor: {
    fontSize: 14,
    color: BLACK,
    marginBottom: 4,
  },
  commentText: {
    fontSize: 13,
    color: BLACK,
    lineHeight: 18,
    marginBottom: 6,
  },
  commentTime: {
    fontSize: 11,
    color: GRAY,
  },
});