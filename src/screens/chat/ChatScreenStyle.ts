import { StyleSheet } from 'react-native';
import { MDBLUE, WHITE, GRAY, BLACK, LIGHTGREY } from '../../shared/common-styles/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    flex: 1,
  },
  messagesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  messageContainer: {
    marginVertical: 4,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  supportMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 18,
  },
  userBubble: {
    backgroundColor: MDBLUE,
    borderBottomRightRadius: 4,
  },
  supportBubble: {
    backgroundColor: WHITE,
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  userText: {
    color: WHITE,
  },
  supportText: {
    color: BLACK,
  },
  messageTime: {
    fontSize: 11,
    alignSelf: 'flex-end',
  },
  userTime: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  supportTime: {
    color: GRAY,
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: WHITE,
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: LIGHTGREY,
  },
  messageInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: LIGHTGREY,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: BLACK,
    maxHeight: 100,
    marginRight: 12,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: MDBLUE,
    justifyContent: 'center',
    alignItems: 'center',
  },
});