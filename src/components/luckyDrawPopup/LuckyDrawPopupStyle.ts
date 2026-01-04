import { StyleSheet, Dimensions } from 'react-native';
import { MDBLUE, WHITE, BLACK, GREY, GREEN } from '../../shared/common-styles/colors';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  popup: {
    backgroundColor: WHITE,
    borderRadius: 16,
    width: width, // Full width minus padding
    maxWidth: width , // Ensure it takes full available width
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6.84,
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 12,
    width: 28,
    height: 28,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  content: {
    // padding: 24,
    paddingTop: 32,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 16,
  },
  trophyIcon: {
    fontSize: 48,
  },
  title: {
    paddingTop: 8,
    fontSize: 20,
    color: MDBLUE,
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: GREY,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  previewContainer: {
    width: '100%',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  winnerPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  medalEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  previewInfo: {
    flex: 1,
  },
  previewName: {
    paddingTop: 8,
    fontSize: 16,
    color: BLACK,
    marginBottom: 2,
  },
  // Add these to your existing styles object:
  pdfContainer: {
    flex: 1,
    backgroundColor: WHITE,
  },
  pdfHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: MDBLUE,
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop:  12,
  },
  pdfTitle: {
    paddingTop: 8,
    fontSize: 18,
    color: WHITE,
  },
  pdfCloseButton: {
    padding: 8,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  previewPrize: {
    fontSize: 14,
    color: GREEN,
  },
  moreWinners: {
    fontSize: 12,
    color: GREY,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  seeAllButton: {
    backgroundColor: MDBLUE,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: WHITE,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: GREY,
  },
  seeAllText: {
    paddingTop: 4,
    color: WHITE,
    fontSize: 16,
  },
  mainHeading: {
    paddingTop: 4,
    fontSize: 18,
    color: MDBLUE,
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: 'bold',
  },
  mainDescription: {
    fontSize: 14,
    color: GREY,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  errorText: {
    fontSize: 14,
    color: 'red',
    textAlign: 'center',
    padding: 20,
  },
  subDescContainer: {
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  subDescription: {
    fontSize: 14,
    color: GREY,
    lineHeight: 20,
    textAlign: 'center',
  },
});