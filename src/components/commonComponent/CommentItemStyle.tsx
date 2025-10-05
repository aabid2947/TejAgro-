/* eslint-disable prettier/prettier */
import { StyleSheet } from 'react-native';
import { WHITE, BLACK, GRAY, MDBLUE } from '../../shared/common-styles/colors';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: WHITE,
  },
  replyContainer: {
    marginLeft: 40,
    backgroundColor: '#F8F8F8',
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: MDBLUE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: WHITE,
    fontSize: 14,
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  authorName: {
    fontSize: 14,
    color: BLACK,
    marginRight: 8,
  },
  timeAgo: {
    fontSize: 12,
    color: GRAY,
  },
  content: {
    fontSize: 13,
    color: BLACK,
    lineHeight: 18,
    marginBottom: 8,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    paddingVertical: 2,
  },
  likeText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  likedText: {
    color: '#FF6B6B',
  },
  replyButton: {
    paddingVertical: 2,
  },
  replyText: {
    fontSize: 12,
    color: MDBLUE,
  },
  viewRepliesButton: {
    marginTop: 8,
    paddingVertical: 4,
  },
  viewRepliesText: {
    fontSize: 12,
    color: MDBLUE,
  },
});