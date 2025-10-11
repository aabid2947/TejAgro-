import { StyleSheet } from 'react-native';
import { MDBLUE, WHITE, GRAY, BLACK, GREEN, GREY, MD_GRAY_Dark } from '../../shared/common-styles/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  listContainer: {
    paddingBottom: 20,
  },
  headerContainer: {
    marginBottom: 20,
  },
  congratsContainer: {
    backgroundColor: WHITE,
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 4,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    alignItems: 'center',
  },
  congratsEmoji: {
    fontSize: 40,
    marginBottom: 10,
  },
  congratsTitle: {
    fontSize: 18,
    color: MDBLUE,
    textAlign: 'center',
    marginBottom: 8,
  },
  congratsSubtitle: {
    fontSize: 14,
    color: GREY,
    textAlign: 'center',
  },
  // PDF View Button styles
  pdfViewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: MDBLUE,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  pdfIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  pdfButtonText: {
    color: WHITE,
    fontSize: 14,
  },
  winnerCard: {
    backgroundColor: WHITE,
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    marginHorizontal: 4,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    borderLeftWidth: 4,
    borderLeftColor: MDBLUE,
  },
  topWinnerCard: {
    borderLeftColor: '#FFD700',
    backgroundColor: '#FFF9E6',
    elevation: 6,
    shadowOpacity: 0.2,
  },
  winnerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  winnerRank: {
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  medalEmoji: {
    fontSize: 32,
  },
  rankCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: MDBLUE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: {
    color: WHITE,
    fontSize: 12,
  },
  winnerInfo: {
    flex: 1,
  },
  winnerName: {
    paddingTop:8,
    fontSize: 16,
    color: BLACK,
    marginBottom: 4,
  },
  topWinnerName: {
    color: '#B8860B',
    fontSize: 17,
  },
  winnerLocation: {
    fontSize: 12,
    color: GREY,
  },
  prizeContainer: {
    alignItems: 'flex-end',
  },
  prizeText: {
    fontSize: 14,
    color: GREEN,
    marginBottom: 4,
  },
  topPrizeText: {
    color: '#B8860B',
    fontSize: 15,
  },
  dateText: {
    fontSize: 11,
    color: MD_GRAY_Dark,
  },
  topWinnerBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFD700',
  },
  // Prize group styles
  prizeGroupContainer: {
    marginBottom: 30,
  },
  prizeHeaderContainer: {
    backgroundColor: WHITE,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: MDBLUE,
  },
  prizeImageContainer: {
    marginBottom: 12,
    alignItems: 'center',
  },
  prizeImage: {
    width: 180,
    height: 180,
    borderRadius: 8,
  },
  prizeTitle: {
    fontSize: 18,
    color: MDBLUE,
    textAlign: 'center',
  },
  winnersContainer: {
    paddingHorizontal: 4,
  },
  firstWinnerCard: {
    borderTopWidth: 2,
    borderTopColor: MDBLUE,
  },
  // Search styles
  searchContainer: {
    marginTop: 16,
    marginHorizontal: 4,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WHITE,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchIcon: {
    fontSize: 18,
    marginLeft: 16,
    color: '#999',
  },
  searchInput: {
    flex: 1,
    padding: 16,
    paddingLeft: 8,
    paddingRight: 50,
    fontSize: 16,
    color: BLACK,
  },
  clearButton: {
    position: 'absolute',
    right: 16,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: GREY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButtonText: {
    color: WHITE,
    fontSize: 12,
    fontWeight: 'bold',
  },
  searchResultsInfo: {
    marginTop: 12,
    marginHorizontal: 4,
    padding: 12,
    backgroundColor: '#F0F8FF',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: MDBLUE,
  },
  searchResultsText: {
    color: MDBLUE,
    fontSize: 14,
    textAlign: 'center',
  },
  // No results styles
  noResultsContainer: {
    backgroundColor: WHITE,
    borderRadius: 12,
    padding: 40,
    marginHorizontal: 4,
    marginTop: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    alignItems: 'center',
  },
  noResultsEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  noResultsTitle: {
    fontSize: 18,
    color: BLACK,
    textAlign: 'center',
    marginBottom: 8,
  },
  noResultsSubtitle: {
    fontSize: 14,
    color: GREY,
    textAlign: 'center',
  },
  // Highlight style
  highlightedText: {
    backgroundColor: '#FFE082',
    fontWeight: 'bold',
  },
});