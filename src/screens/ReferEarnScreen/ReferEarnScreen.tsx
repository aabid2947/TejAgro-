import React, { useEffect, useState } from 'react';
import { View, SafeAreaView, Share, TouchableOpacity, Text, Alert, ScrollView, Clipboard, ToastAndroid, Image, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../reduxToolkit/store';
import TopHeaderFixed from '../../components/headerview/TopHeaderFixed';
import AuthApi from '../../api/AuthApi';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ShareIcon from '../../svg/ShareIcon';
import TextPoppinsMediumBold from '../../shared/fontFamily/TextPoppinsMediumBold';
import TextPoppinsSemiBold from '../../shared/fontFamily/TextPoppinsSemiBold';
import { PressableButton } from '../../shared/components/CommonUtilities';
import { StyleSheet } from 'react-native';

const App_Link = 'https://play.google.com/store/apps/details?id=com.tejagroapp'
interface ReferralData {
    farmer_name?: string;
    referral_amt?: string;
    referral_code?: string;
    referral_count?: string;
    referral_from?: string;
    referral_to?: string;
    referral_type?: string;
    referral_url?: string;
    status: boolean;
}

interface FAQItem {
    question: string;
    answer: string;
    expanded: boolean;
}

const ReferEarnScreen: React.FC = () => {

    const { t } = useTranslation();
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    const referralCode = useSelector((state: RootState) => state.counter.referralCode);
    const [referralData, setReferralData] = useState<ReferralData | null>(null);
    const [loading, setLoading] = useState(true);
    const [faqItems, setFaqItems] = useState<FAQItem[]>([
        {
            question: t("FAQ_HOW_GET_REWARD"),
            answer: t("FAQ_HOW_GET_REWARD_ANSWER"),
            expanded: false
        },
        {
            question: t("FAQ_WHEN_GET_REWARD"),
            answer: t("FAQ_WHEN_GET_REWARD_ANSWER"),
            expanded: false
        }
    ]);

    useEffect(() => {
        fetchReferralData();
    }, []);

    const fetchReferralData = async () => {
        try {
            setLoading(true);
            const response = await AuthApi.getReferralInfo();
            console.log('Referral API Response:', response.data);

            // Handle the new array response format
            let parsedData: ReferralData = { status: false };

            if (Array.isArray(response.data) && response.data.length > 0) {
                // Take the first item from the array
                parsedData = response.data[0];
            } else if (typeof response.data === 'object' && !Array.isArray(response.data)) {
                parsedData = response.data;
            } else if (typeof response.data === 'string') {
                // Handle string response if still needed
                try {
                    const jsonData = JSON.parse(response.data);
                    if (Array.isArray(jsonData) && jsonData.length > 0) {
                        parsedData = jsonData[0];
                    } else {
                        parsedData = jsonData;
                    }
                } catch (parseError) {
                    console.error('Error parsing JSON string:', parseError);
                }
            }

            console.log('Parsed Referral Data:', parsedData);

            if (parsedData?.status) {
                setReferralData(parsedData);
            } else {
                console.log('No referral data available or status is false');
                // Still set the data even if status is false to show whatever information is available
                setReferralData(parsedData);
            }
        } catch (error) {
            console.error('Error fetching referral data:', error);
        } finally {
            setLoading(false);
        }
    };

    const shareReferralCode = async (codeToShare: string) => {
        try {
            // const shareMessage = `🌱 ${t('SHARE_REFERRAL_TITLE')}: ${codeToShare}\n\n📱 ${t('SHARE_FARMING_EXPERIENCE')}\n\n💰 ${t('GET_REWARDS_MESSAGE')}\n\n🔗 ${t('DOWNLOAD')}: ${App_Link}`;
            const shareMessage = `आता करा स्मार्ट शेती..!
Tej Agro अ‍ॅपमध्ये जॉईन करताना कोड वापरा: ${codeToShare}

Tej Agro अ‍ॅपमध्ये मिळेल सर्व पिकांचे शास्त्रशुद्ध नियोजन, कृषी तज्ञांचे मार्गदर्शन आणि विडिओ, दर्जेदार कृषी उत्पादने – सर्व एकाच अ‍ॅपमध्ये !
अधिक माहितीसाठी संपर्क क्रमांक - 91 305 305 91

🔗App  डाउनलोड: https://play.google.com/store/apps/details?id=com.tejagroapp`
            const result = await Share.share({
                message: shareMessage,
                title: t('SHARE_REFERRAL_TITLE'),
            });

            if (result.action === Share.sharedAction) {
                ToastAndroid.show(t('REFERRAL_SHARED_SUCCESS'), ToastAndroid.SHORT);
            }
        } catch (error) {
            console.error('Error sharing referral code:', error);
            Alert.alert(t('ERROR'), t('FAILED_SHARE_REFERRAL'));
        }
    };

    const shareViaWhatsApp = async (codeToShare: string) => {
        try {
            const shareMessage = `🌱 ${t('JOIN_TEJAGRO_MESSAGE')}: ${codeToShare}\n\n📱 ${t('DOWNLOAD_START_JOURNEY')}\n\n💰 ${t('GET_REWARDS_MESSAGE')}`;
            const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(shareMessage)}`;

            const canOpen = await Linking.canOpenURL(whatsappUrl);
            if (canOpen) {
                await Linking.openURL(whatsappUrl);
            } else {
                ToastAndroid.show(t('WHATSAPP_NOT_INSTALLED'), ToastAndroid.SHORT);
            }
        } catch (error) {
            console.error('Error sharing via WhatsApp:', error);
            Alert.alert(t('ERROR'), t('FAILED_SHARE_WHATSAPP'));
        }
    };

    const toggleFAQ = (index: number) => {
        setFaqItems(prev => prev.map((item, i) =>
            i === index ? { ...item, expanded: !item.expanded } : item
        ));
    };

    const copyReferralCode = (codeToCopy: string) => {
        if (codeToCopy && codeToCopy !== 'Not Available') {
            Clipboard.setString(codeToCopy);
            ToastAndroid.show(t('REFERRAL_COPIED'), ToastAndroid.SHORT);
        } else {
            ToastAndroid.show(t('NO_REFERRAL_CODE'), ToastAndroid.SHORT);
        }
    };

    const renderReferralCard = () => {
        const displayReferralCode = referralData?.referral_code || referralCode || 'Not Available';

        return (
            <View style={styles.mainContainer}>
                {/* Total Amount Display */}
                <View style={styles.totalAmountContainer}>
                    <Text style={styles.totalAmountLabel}>{t('TOTAL_EARNINGS')}</Text>

                    {/* Split container for count and amount */}
                    <View style={styles.splitContainer}>
                        {/* Left side - Referral Count */}

                        <View style={styles.rightSection}>
                            <Text style={styles.totalAmountText}>₹ {referralData?.referral_amt || '0'}</Text>
                            <Text style={styles.totalAmountSubtext}>{t('EARNED_SO_FAR')}</Text>
                        </View>
                        {/* Divider */}
                        <View style={styles.verticalDivider} />

                        <View style={styles.leftSection}>
                            <Text style={styles.countText}>{referralData?.referral_count || '0'}</Text>
                            <Text style={styles.countLabel}>{t('REFERRALS')}</Text>
                        </View>
                        {/* Right side - Total Amount */}
                    </View>
                </View>

                {/* Earn Text */}
                {/* <Text style={styles.earnText}>
                    {t('EARN_PER_REFERRAL')}
                </Text> */}

                {/* Your Referral Code Section */}
                <View style={styles.referralSection}>
                    <Text style={styles.sectionTitle}>{t('YOUR_REFERRAL_CODE')}</Text>
                    <View style={styles.referralCodeContainer}>
                        <Text style={styles.referralCodeText}>{displayReferralCode}</Text>
                        <TouchableOpacity onPress={() => copyReferralCode(displayReferralCode)} style={styles.copyButton}>
                            <Text style={styles.copyButtonText}>{t('COPY')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Earnings Summary - Always show */}
                {/* <View style={styles.earningSummaryContainer}>
                    
                    <View style={styles.orderCountBadge}>
                        <Text style={styles.orderCountLabel}>{t('REFERRAL_TYPE')}</Text>
                        <Text style={styles.orderCountValue}>{referralData?.referral_type || 'Standard'}</Text>
                    </View>
                  
                    <View style={styles.earningsGrid}>
                        <View style={styles.earningCard}>
                            <Text style={styles.earningCardLabel}>{t('YOUR_EARNINGS')}</Text>
                            <Text style={styles.earningCardAmount}>₹{referralData?.referral_amt || '0'}</Text>
                            <Text style={styles.earningCardSubtext}>{t('TOTAL_AMOUNT')}</Text>
                        </View>
                        
                        <View style={styles.earningCard}>
                            <Text style={styles.earningCardLabel}>{t('FARMER_NAME')}</Text>
                            <Text style={[styles.earningCardAmount, { fontSize: 16 }]}>{referralData?.farmer_name || 'N/A'}</Text>
                            <Text style={styles.earningCardSubtext}>{t('REFERRED_BY')}</Text>
                        </View>
                    </View>
                </View> */}
            </View>
        );
    };

    const renderFAQSection = () => (
        <View style={styles.faqContainer}>
            <Text style={styles.faqTitle}>{t('QUESTIONS_ANSWERS')}</Text>

            {faqItems.map((item, index) => (
                <TouchableOpacity
                    key={index}
                    style={styles.faqItem}
                    onPress={() => toggleFAQ(index)}
                >
                    <View style={styles.faqQuestion}>
                        <Text style={styles.faqQuestionText}>{item.question}</Text>
                        <Text style={styles.faqArrow}>{item.expanded ? '▲' : '▼'}</Text>
                    </View>
                    {item.expanded && (
                        <Text style={styles.faqAnswer}>{item.answer}</Text>
                    )}
                </TouchableOpacity>
            ))}
        </View>
    );

    const renderBottomButtons = () => {
        const displayReferralCode = referralData?.referral_code || referralCode || 'Not Available';

        return (
            <View style={styles.bottomButtonsContainer}>
                {/* <TouchableOpacity 
                    style={[styles.bottomButton, styles.whatsappButton]} 
                    onPress={() => shareViaWhatsApp(displayReferralCode)}
                >
                    <Text style={styles.bottomButtonText}>{t('REFER_VIA_WHATSAPP')}</Text>
                </TouchableOpacity> */}

                <TouchableOpacity
                    style={[styles.bottomButton, styles.linkButton]}
                    onPress={() => shareReferralCode(displayReferralCode)}
                >
                    <Text style={styles.bottomButtonText}>{t('REFER_VIA_LINK')}</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <SafeAreaView style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
            <TopHeaderFixed
                leftIconSize={20}
                gobackText={t("REFER_AND_EARN")}
                topHeight={100}
                onGoBack={() => navigation.goBack()}
            />

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {renderReferralCard()}
                {renderFAQSection()}
            </ScrollView>

            {renderBottomButtons()}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    mainContainer: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    totalAmountContainer: {
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
        borderRadius: 16,
        padding: 24,
        marginBottom: 20,
        borderWidth: 2,
        borderColor: '#4CAF50',
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        width: '100%',
        maxWidth: 300,
    },
    totalAmountLabel: {
        fontSize: 16,
        color: '#666666',
        fontWeight: '600',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    totalAmountText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#4CAF50',
        marginBottom: 4,
        textAlign: 'center',
    },
    splitContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        paddingTop: 8,
    },
    leftSection: {
        flex: 1,
        alignItems: 'center',
    },
    rightSection: {
        flex: 1,
        alignItems: 'center',
    },
    verticalDivider: {
        width: 1,
        height: 60,
        backgroundColor: '#4CAF50',
        marginHorizontal: 15,
    },
    countText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FF6B35',
        marginBottom: 4,
        textAlign: 'center',
    },
    countLabel: {
        fontSize: 14,
        color: '#888888',
        fontWeight: '500',
        textAlign: 'center',
    },
    totalAmountSubtext: {
        fontSize: 14,
        color: '#888888',
        fontWeight: '500',
        textAlign: 'center',
    },
    moneyImageContainer: {
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    moneyNotesContainer: {
        position: 'relative',
        width: 100,
        height: 60,
    },
    moneyNote: {
        position: 'absolute',
        width: 80,
        height: 50,
        backgroundColor: '#E8F5E8',
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    moneyNoteOverlap: {
        left: 15,
        top: 5,
        backgroundColor: '#F3E5F5',
        borderColor: '#9C27B0',
    },
    moneyNoteOverlap2: {
        left: 30,
        top: 10,
        backgroundColor: '#FFF3E0',
        borderColor: '#FF9800',
    },
    currencySymbol: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2E7D32',
    },
    earnText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333333',
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 32,
    },
    referralSection: {
        width: '100%',
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        color: '#666666',
        marginBottom: 8,
        fontWeight: '500',
    },
    referralCodeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F8F9FA',
        padding: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    referralCodeText: {
        fontSize: 18,
        color: '#333333',
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    copyButton: {
        backgroundColor: '#FF6B35',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 6,
    },
    copyButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    rewardAmount: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#4CAF50',
        marginBottom: 4,
    },
    rewardSubtext: {
        fontSize: 16,
        color: '#666666',
        marginBottom: 20,
    },
    referralCountText: {
        fontSize: 18,
        color: '#FF6B35',
        fontWeight: '600',
        marginBottom: 12,
        marginTop: 8,
    },
    descriptionText: {
        fontSize: 14,
        color: '#666666',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 30,
    },
    faqContainer: {
        width: '100%',
        marginTop: 20,
    },
    faqTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 16,
    },
    faqItem: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        marginBottom: 8,
        overflow: 'hidden',
    },
    faqQuestion: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    faqQuestionText: {
        fontSize: 16,
        color: '#333333',
        fontWeight: '500',
        flex: 1,
    },
    faqArrow: {
        fontSize: 12,
        color: '#666666',
        marginLeft: 10,
    },
    faqAnswer: {
        padding: 16,
        paddingTop: 0,
        fontSize: 14,
        color: '#666666',
        lineHeight: 20,
    },
    bottomButtonsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
    },
    bottomButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 4,
    },
    whatsappButton: {
        backgroundColor: '#25D366',
    },
    linkButton: {
        backgroundColor: '#FF6B35',
    },
    bottomButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    earningSummaryContainer: {
        width: '100%',
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        padding: 16,
        marginTop: 20,
        borderWidth: 1,
        borderColor: '#e3e7ed',
    },
    orderCountBadge: {
        backgroundColor: '#fff3e0',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#FF9800',
    },
    orderCountLabel: {
        fontSize: 14,
        color: '#E65100',
        fontWeight: '600',
    },
    orderCountValue: {
        fontSize: 22,
        color: '#FF6B35',
        fontWeight: 'bold',
    },
    earningsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    earningCard: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#4CAF50',
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    earningCardLabel: {
        fontSize: 12,
        color: '#666666',
        marginBottom: 8,
        textAlign: 'center',
    },
    earningCardAmount: {
        fontSize: 24,
        color: '#4CAF50',
        fontWeight: 'bold',
        marginBottom: 4,
    },
    earningCardSubtext: {
        fontSize: 11,
        color: '#999999',
        textAlign: 'center',
    },
});

export default ReferEarnScreen;