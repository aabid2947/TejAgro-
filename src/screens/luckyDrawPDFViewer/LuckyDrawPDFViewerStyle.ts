import { StyleSheet, Dimensions } from 'react-native';
import { MDBLUE, WHITE, GRAY, BLACK, GREEN, GREY } from '../../shared/common-styles/colors';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  content: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  pdfContainer: {
    flex: 1,
    margin: 10,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  pdf: {
    flex: 1,
    width: width - 20,
    height: height - 200,
    backgroundColor: WHITE,
  },
  pageIndicator: {
    backgroundColor: MDBLUE,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    margin: 10,
    alignSelf: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  pageText: {
    color: WHITE,
    fontSize: 14,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: WHITE,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: MDBLUE,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: WHITE,
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: BLACK,
    textAlign: 'center',
    marginBottom: 16,
  },
  errorSubtext: {
    fontSize: 14,
    color: GREY,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: MDBLUE,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: WHITE,
    fontSize: 16,
  },
  // Action container styles
  actionContainer: {
    padding: 16,
    backgroundColor: WHITE,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  externalButton: {
    backgroundColor: MDBLUE,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  externalButtonText: {
    color: WHITE,
    fontSize: 14,
  },
});