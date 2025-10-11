/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../../reduxToolkit/store';
import { headerView } from '../../shared/components/CommonUtilities';
import { MENUBAR_SCREEN, LUCKY_DRAW_PDF_VIEWER_SCREEN } from '../../routes/Routes';
import { MDBLUE, WHITE, GRAY, BLACK, GREEN } from '../../shared/common-styles/colors';
import TextPoppinsRegular from '../../shared/fontFamily/TextPoppinsRegular';
import TextPoppinsSemiBold from '../../shared/fontFamily/TextPoppinsSemiBold';
import TextPoppinsMediumBold from '../../shared/fontFamily/TextPoppinsMediumBold';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { luckyDrawWinners, LuckyDrawWinner } from '../../data/luckyDrawWinners';
import { styles } from './LuckyDrawWinnersStyle';

interface PrizeGroup {
  prizeImage: any; // Changed from string to any to handle require() results
  prizeName: string;
  winners: LuckyDrawWinner[];
}

const LuckyDrawWinnersScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  
  const totalItems = useSelector((state: RootState) => state.counter.totalItems);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Define prize order and names
  const prizeOrder = [
    { image: require("../../assets/winnerPrize/Towel.png"), path: "../assets/winnerPrize/Towel.png", name: "टॉवेल" },
    { image: require("../../assets/winnerPrize/pot.png"), path: "../assets/winnerPrize/pot.png", name: "भांडे" },
    { image: require("../../assets/winnerPrize/Cooker.png"), path: "../assets/winnerPrize/Cooker.png", name: "कुकर" },
    { image: require("../../assets/winnerPrize/LunchBox.png"), path: "../assets/winnerPrize/lunchBox.png", name: "लंच बॉक्स" },
    { image: require("../../assets/winnerPrize/Backpack.png"), path: "../assets/winnerPrize/Backpack.png", name: "बॅकपॅक" }
  ];

  // Group winners by prize type with search filtering
  const groupWinnersByPrize = (): PrizeGroup[] => {
    const groupedWinners: PrizeGroup[] = [];
    
    prizeOrder.forEach(prize => {
      let winnersForPrize = luckyDrawWinners.filter(winner => {
        // Handle case mismatch for lunchBox/LunchBox
        const winnerImage = winner.prizeImage.replace("lunchBox.png", "LunchBox.png");
        return winnerImage === prize.path;
      });
      
      // Apply search filter if search query exists
      if (searchQuery.trim()) {
        winnersForPrize = winnersForPrize.filter(winner =>
          winner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (winner.location && winner.location.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      }
      
      if (winnersForPrize.length > 0) {
        groupedWinners.push({
          prizeImage: prize.image,
          prizeName: prize.name,
          winners: winnersForPrize
        });
      }
    });
    
    return groupedWinners;
  };

  const prizeGroups = groupWinnersByPrize();

  // Sidebar/menu press handler
  const onPressSide = () => {
    navigation.navigate(MENUBAR_SCREEN as never);
  };

  // Navigate to PDF viewer
  const onPressPDFViewer = () => {
    navigation.navigate(LUCKY_DRAW_PDF_VIEWER_SCREEN as never);
  };

  const renderSearchBar = () => (
    <View style={styles.searchContainer}>
      <View style={styles.searchInputContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="विजेत्याचे नाव शोधा..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => setSearchQuery('')}
          >
            <Text style={styles.clearButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const highlightSearchText = (text: string, searchQuery: string) => {
    if (!searchQuery.trim()) return text;
    
    const regex = new RegExp(`(${searchQuery})`, 'gi');
    const parts = text.split(regex);
    
    return (
      <Text>
        {parts.map((part, index) => (
          <Text
            key={index}
            style={regex.test(part) ? styles.highlightedText : undefined}
          >
            {part}
          </Text>
        ))}
      </Text>
    );
  };

  const renderPrizeHeader = (prizeGroup: PrizeGroup) => (
    <View style={styles.prizeHeaderContainer}>
      {/* <View style={styles.prizeImageContainer}> */}
        <Image 
          source={prizeGroup.prizeImage} 
          style={styles.prizeImage}
          resizeMode="contain"
        />
      {/* </View> */}
      {/* <TextPoppinsMediumBold style={styles.prizeTitle}>
        🏆 {prizeGroup.prizeName} विजेते ({prizeGroup.winners.length})
      </TextPoppinsMediumBold> */}
    </View>
  );

  const renderWinnerItem = (winner: LuckyDrawWinner, index: number, groupIndex: number) => {
    const isFirstInGroup = index === 0;
    
    return (
      <TouchableOpacity 
        key={`${groupIndex}-${winner.id}`}
        style={[styles.winnerCard, isFirstInGroup && styles.firstWinnerCard]} 
        activeOpacity={0.8}
      >
        <View style={styles.winnerHeader}>
          <View style={styles.winnerRank}>
            <View style={styles.rankCircle}>
              <TextPoppinsSemiBold style={styles.rankText}>{index + 1}</TextPoppinsSemiBold>
            </View>
          </View>
          <View style={styles.winnerInfo}>
            <TextPoppinsMediumBold style={styles.winnerName}>
              {searchQuery.trim() ? highlightSearchText(winner.name, searchQuery) : winner.name}
            </TextPoppinsMediumBold>
            {winner.location && (
              <TextPoppinsRegular style={styles.winnerLocation}>
                📍 {searchQuery.trim() ? highlightSearchText(winner.location, searchQuery) : winner.location}
              </TextPoppinsRegular>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderPrizeGroup = ({ item, index }: { item: PrizeGroup; index: number }) => (
    <View style={styles.prizeGroupContainer}>
      {renderPrizeHeader(item)}
      <View style={styles.winnersContainer}>
        {item.winners.map((winner, winnerIndex) => 
          renderWinnerItem(winner, winnerIndex, index)
        )}
      </View>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.congratsContainer}>
        <Text style={styles.congratsEmoji}>🎉</Text>
        <TextPoppinsMediumBold style={styles.congratsTitle}>
          तेज अग्रोटेकच्या भाग्यवान विजेते!
        </TextPoppinsMediumBold>
        <TextPoppinsRegular style={styles.congratsSubtitle}>
          आमच्या लकी ड्रॉमध्ये सहभागी झाल्याबद्दल धन्यवाद
        </TextPoppinsRegular>
        
        <TouchableOpacity 
          style={styles.pdfViewButton}
          onPress={onPressPDFViewer}
          activeOpacity={0.8}
        >
          <Text style={styles.pdfIcon}>📄</Text>
          <TextPoppinsSemiBold style={styles.pdfButtonText}>
            संपूर्ण PDF पहा
          </TextPoppinsSemiBold>
        </TouchableOpacity>
      </View>
      {renderSearchBar()}
      {searchQuery.trim() && (
        <View style={styles.searchResultsInfo}>
          <TextPoppinsRegular style={styles.searchResultsText}>
            "{searchQuery}" साठी {prizeGroups.reduce((total, group) => total + group.winners.length, 0)} परिणाम सापडले
          </TextPoppinsRegular>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {headerView(
        'तेज अग्रो लकी ड्रॉ विजेते',
        'सर्व विजेत्यांना अभिनंदन!',
        onPressSide,
        totalItems,
        navigation,
        undefined
      )}
      
      <View style={styles.content}>
        {prizeGroups.length > 0 ? (
          <FlatList
            data={prizeGroups}
            renderItem={renderPrizeGroup}
            keyExtractor={(item, index) => `prize-group-${index}`}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            ListHeaderComponent={renderHeader}
          />
        ) : searchQuery.trim() ? (
          <View style={styles.listContainer}>
            {renderHeader()}
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsEmoji}>🔍</Text>
              <TextPoppinsMediumBold style={styles.noResultsTitle}>
                कोणतेही परिणाम सापडले नाहीत
              </TextPoppinsMediumBold>
              <TextPoppinsRegular style={styles.noResultsSubtitle}>
                कृपया वेगळा शोध शब्द वापरून पहा
              </TextPoppinsRegular>
            </View>
          </View>
        ) : (
          <FlatList
            data={prizeGroups}
            renderItem={renderPrizeGroup}
            keyExtractor={(item, index) => `prize-group-${index}`}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            ListHeaderComponent={renderHeader}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default LuckyDrawWinnersScreen;