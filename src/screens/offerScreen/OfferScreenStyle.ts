/* eslint-disable prettier/prettier */
import { StyleSheet } from 'react-native';
import { MDBLUE, WHITE, GRAY, GRAY_SHADE, BLACK } from '../../shared/common-styles/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  filterContainer: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  filterScrollContainer: {
    paddingHorizontal: 4,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedFilterChip: {
    backgroundColor: MDBLUE,
    borderColor: MDBLUE,
  },
  filterChipText: {
    fontSize: 14,
    color: GRAY,
    fontFamily: 'Poppins-Medium',
  },
  selectedFilterChipText: {
    color: WHITE,
  },
  userCategoryContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    marginVertical: 8,
  },
  userCategoryText: {
    fontSize: 14,
    color: GRAY,
  },
  userCategoryValue: {
    color: MDBLUE,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: GRAY,
    fontFamily: 'Poppins-Regular',
  },
  listContainer: {
    paddingVertical: 8,
    flexGrow: 1,
  },
  offerCard: {
    backgroundColor: WHITE,
    borderRadius: 12,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  offerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  offerBadge: {
    backgroundColor: MDBLUE,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  offerBadgeText: {
    color: WHITE,
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
  },
  offerContent: {
    flexDirection: 'row',
    padding: 16,
  },
  offerImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#F5F5F5',
    marginRight: 16,
  },
  offerImage: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E9E9E9',
  },
  placeholderText: {
    fontSize: 10,
    color: GRAY,
    fontFamily: 'Poppins-Regular',
  },
  offerDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  offerTitle: {
    fontSize: 16,
    color: BLACK,
    marginBottom: 4,
  },
  offerType: {
    fontSize: 14,
    color: MDBLUE,
    marginBottom: 4,
  },
  productNames: {
    fontSize: 12,
    color: GRAY,
    lineHeight: 16,
  },
  offerFooter: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  viewOfferButton: {
    backgroundColor: MDBLUE,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignItems: 'center',
  },
  viewOfferButtonText: {
    color: WHITE,
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: GRAY,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
    paddingHorizontal: 20,
  },
});