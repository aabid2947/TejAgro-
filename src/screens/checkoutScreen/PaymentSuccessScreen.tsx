import React, { useEffect, useRef } from 'react';
import { 
    SafeAreaView, 
    StyleSheet, 
    Text, 
    View, 
    Image, 
    Pressable,
    BackHandler,
    Animated,
    Dimensions,
    StatusBar
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useDispatch } from 'react-redux';
import { RootStackParamList } from '../../routes/AppRouter';
import { HOME_SCREEN, ORDER_SCREEN } from '../../routes/Routes';
import { clearSelectedPromoCode, setTotalItems, setOrderPlaced } from '../../reduxToolkit/counterSlice';
import TextPoppinsSemiBold from '../../shared/fontFamily/TextPoppinsSemiBold';
import CustomFontText from '../../shared/fontFamily/CustomFontText';
import { GREEN, WHITE, BLACK, MDBLUE, GRAY_BORDER, ORANGE } from '../../shared/common-styles/colors';
import { useTranslation } from 'react-i18next';

const { width, height } = Dimensions.get('window');

interface PaymentSuccessScreenProps {
    route?: {
        params?: {
            paymentResponse?: any;
            orderId?: string;
            amount?: string;
            paymentMethod?: string;
        }
    }
}

const PaymentSuccessScreen: React.FC<PaymentSuccessScreenProps> = ({ route }) => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const dispatch = useDispatch();
    const { t } = useTranslation();

    // Animation refs
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const confettiAnim = useRef(new Animated.Value(0)).current;
    const shimmerAnim = useRef(new Animated.Value(0)).current;

    const { paymentResponse, orderId, amount, paymentMethod } = route?.params || {};

    useEffect(() => {
        // Set status bar
        StatusBar.setBarStyle('dark-content');
        StatusBar.setBackgroundColor(WHITE);

        // Prevent back button press
        const backAction = () => {
            navigation.reset({
                index: 0,
                routes: [{ name: HOME_SCREEN }],
            });
            return true;
        };

        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

        // Clear cart and related data
        dispatch(clearSelectedPromoCode());
        dispatch(setTotalItems(0));
        dispatch(setOrderPlaced(true));

        // Start animations
        startAnimations();

        return () => backHandler.remove();
    }, [dispatch, navigation]);

    const startAnimations = () => {
        // Main fade in
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();

        // Success icon scale animation
        Animated.sequence([
            Animated.timing(scaleAnim, {
                toValue: 1.2,
                duration: 400,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start();

        // Content slide up
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 600,
            delay: 200,
            useNativeDriver: true,
        }).start();

        // Pulse animation for success icon
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();

        // Confetti animation
        Animated.timing(confettiAnim, {
            toValue: 1,
            duration: 2000,
            delay: 300,
            useNativeDriver: true,
        }).start();

        // Shimmer animation
        Animated.loop(
            Animated.timing(shimmerAnim, {
                toValue: 1,
                duration: 2000,
                useNativeDriver: true,
            })
        ).start();
    };

    const handleGoHome = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: HOME_SCREEN }],
        });
    };

    const handleViewOrders = () => {
        navigation.navigate(ORDER_SCREEN);
    };

    const formatAmount = (amt: string | number) => {
        console.log(amt, "amtamt");
        console.log(parseFloat(amt.toString()).toFixed(2))
        return `₹${parseFloat(amt.toString()).toFixed(2)}`;
    };

    const getTransactionId = () => {
        if (paymentResponse && paymentResponse.txnid) {
            return paymentResponse.txnid;
        }
        if (paymentResponse && paymentResponse.easepayid) {
            return paymentResponse.easepayid;
        }
        return orderId || 'N/A';
    };

    const renderConfetti = () => {
        const confettiElements = [];
        for (let i = 0; i < 20; i++) {
            const translateY = confettiAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-50, height],
            });
            
            const translateX = confettiAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [Math.random() * width, Math.random() * width],
            });

            confettiElements.push(
                <Animated.View
                    key={i}
                    style={[
                        styles.confettiPiece,
                        {
                            backgroundColor: i % 3 === 0 ? GREEN : i % 3 === 1 ? MDBLUE : ORANGE,
                            transform: [
                                { translateX },
                                { translateY },
                                { rotate: `${Math.random() * 360}deg` }
                            ],
                        },
                    ]}
                />
            );
        }
        return confettiElements;
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={WHITE} />
            
            {/* Background Gradient Overlay */}
            <View style={styles.gradientOverlay} />
            
            {/* Confetti */}
            <View style={styles.confettiContainer}>
                {renderConfetti()}
            </View>

            <Animated.View style={[styles.contentContainer, { opacity: fadeAnim }]}>
                {/* Success Icon with Glow Effect */}
                <Animated.View 
                    style={[
                        styles.iconContainer,
                        {
                            transform: [
                                { scale: scaleAnim },
                                { scale: pulseAnim }
                            ]
                        }
                    ]}
                >
                    <View style={styles.glowEffect}>
                        <View style={styles.successIcon}>
                            <Text style={styles.checkMark}>✓</Text>
                        </View>
                    </View>
                </Animated.View>

                {/* Success Message with Slide Animation */}
                <Animated.View 
                    style={{ 
                        transform: [{ translateY: slideAnim }],
                        alignItems: 'center'
                    }}
                >
                    <TextPoppinsSemiBold style={styles.successTitle}>
                        Payment Successful! 🎉
                    </TextPoppinsSemiBold>
                    
                    <CustomFontText style={styles.successSubtitle}>
                        Your order has been placed successfully
                    </CustomFontText>
                </Animated.View>

                {/* Transaction Details with Enhanced Card */}
                <Animated.View 
                    style={[
                        styles.detailsContainer,
                        { 
                            transform: [{ translateY: slideAnim }],
                            opacity: fadeAnim
                        }
                    ]}
                >
                    {/* Shimmer Effect */}
                    <Animated.View 
                        style={[
                            styles.shimmerEffect,
                            {
                                transform: [{
                                    translateX: shimmerAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [-width, width],
                                    })
                                }]
                            }
                        ]}
                    />
                    
                    <View style={styles.cardHeader}>
                        <TextPoppinsSemiBold style={styles.cardTitle}>
                            Transaction Details
                        </TextPoppinsSemiBold>
                    </View>

                    <View style={styles.detailRow}>
                        <CustomFontText style={styles.detailLabel}>
                            🔢 Transaction ID:
                        </CustomFontText>
                        <TextPoppinsSemiBold style={styles.detailValue}>
                            {getTransactionId()}
                        </TextPoppinsSemiBold>
                    </View>

                    {amount && (
                        <View style={styles.detailRow}>
                            <CustomFontText style={styles.detailLabel}>
                                💰 Amount Paid:
                            </CustomFontText>
                            <Text style={[styles.detailValue, styles.amountValue]}>
                                {formatAmount(amount)}
                                
                                 {/* {amount} */}
                            </Text>
                        </View>
                    )}

                    {paymentMethod && (
                        <View style={styles.detailRow}>
                            <CustomFontText style={styles.detailLabel}>
                                💳 Payment Method:
                            </CustomFontText>
                            <TextPoppinsSemiBold style={styles.detailValue}>
                                {paymentMethod}
                            </TextPoppinsSemiBold>
                        </View>
                    )}

                    {paymentResponse?.status && (
                        <View style={[styles.detailRow, styles.statusRow]}>
                            <CustomFontText style={styles.detailLabel}>
                                ✨ Status:
                            </CustomFontText>
                            <View style={styles.statusBadge}>
                                <TextPoppinsSemiBold style={styles.statusText}>
                                    {paymentResponse.status.toUpperCase()}
                                </TextPoppinsSemiBold>
                            </View>
                        </View>
                    )}
                </Animated.View>

                {/* Enhanced Action Buttons */}
                <Animated.View 
                    style={[
                        styles.buttonContainer,
                        { 
                            transform: [{ translateY: slideAnim }],
                            opacity: fadeAnim
                        }
                    ]}
                >
                    <Pressable 
                        style={({ pressed }) => [
                            styles.button, 
                            styles.primaryButton,
                            pressed && styles.buttonPressed
                        ]} 
                        onPress={handleGoHome}
                        android_ripple={{ color: 'rgba(255,255,255,0.2)' }}
                    >
                        <View style={styles.buttonContent}>
                            <Text style={styles.buttonIcon}>🛒</Text>
                            <TextPoppinsSemiBold style={styles.primaryButtonText}>
                                Continue Shopping
                            </TextPoppinsSemiBold>
                        </View>
                    </Pressable>

                    <Pressable 
                        style={({ pressed }) => [
                            styles.button, 
                            styles.secondaryButton,
                            pressed && styles.buttonPressed
                        ]} 
                        onPress={handleViewOrders}
                        android_ripple={{ color: `${MDBLUE}20` }}
                    >
                        <View style={styles.buttonContent}>
                            <Text style={styles.buttonIcon}>📦</Text>
                            <TextPoppinsSemiBold style={styles.secondaryButtonText}>
                                View Orders
                            </TextPoppinsSemiBold>
                        </View>
                    </Pressable>
                </Animated.View>
            </Animated.View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: WHITE,
    },
    gradientOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(45, 156, 219, 0.02)',
    },
    confettiContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1,
    },
    confettiPiece: {
        position: 'absolute',
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
        zIndex: 2,
    },
    iconContainer: {
        marginBottom: 40,
        position: 'relative',
    },
    glowEffect: {
        shadowColor: GREEN,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 20,
        elevation: 15,
    },
    successIcon: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: GREEN,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: WHITE,
    },
    checkMark: {
        fontSize: 50,
        color: WHITE,
        fontWeight: 'bold',
    },
    successTitle: {
        fontSize: 28,
        lineHeight: 36,
        color: BLACK,
        textAlign: 'center',
        marginBottom: 12,
        letterSpacing: 0.5,
    },
    successSubtitle: {
        fontSize: 16,
        lineHeight: 24,
        color: GRAY_BORDER,
        textAlign: 'center',
        marginBottom: 50,
        letterSpacing: 0.2,
    },
    detailsContainer: {
        width: '100%',
        backgroundColor: WHITE,
        borderRadius: 20,
        padding: 24,
        marginBottom: 40,
        borderWidth: 1,
        borderColor: '#E3F2FD',
        elevation: 8,
        shadowColor: MDBLUE,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        overflow: 'hidden',
        position: 'relative',
    },
    shimmerEffect: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        width: 50,
        transform: [{ skewX: '-20deg' }],
    },
    cardHeader: {
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        paddingBottom: 16,
        marginBottom: 20,
        alignItems: 'center',
    },
    cardTitle: {
        fontSize: 18,
        color: MDBLUE,
        letterSpacing: 0.3,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 18,
        paddingVertical: 4,
    },
    detailLabel: {
        fontSize: 14,
        lineHeight: 20,
        color: GRAY_BORDER,
        flex: 1,
        fontWeight: '500',
    },
    detailValue: {
        fontSize: 14,
        lineHeight: 20,
        color: BLACK,
        flex: 1,
        textAlign: 'right',
        fontWeight: '600',
    },
    amountValue: {
        color: GREEN,
        fontSize: 16,
        fontWeight: 'bold',
    },
    statusRow: {
        backgroundColor: `${GREEN}10`,
        borderRadius: 12,
        padding: 12,
        marginTop: 8,
    },
    statusBadge: {
        backgroundColor: GREEN,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
    },
    statusText: {
        color: WHITE,
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    buttonContainer: {
        width: '100%',
        gap: 16,
    },
    button: {
        width: '100%',
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        overflow: 'hidden',
    },
    buttonPressed: {
        transform: [{ scale: 0.98 }],
        elevation: 4,
    },
    primaryButton: {
        backgroundColor: MDBLUE,
        borderWidth: 2,
        borderColor: MDBLUE,
    },
    secondaryButton: {
        backgroundColor: WHITE,
        borderWidth: 2,
        borderColor: MDBLUE,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    buttonIcon: {
        fontSize: 18,
    },
    primaryButtonText: {
        fontSize: 16,
        lineHeight: 22,
        color: WHITE,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    secondaryButtonText: {
        fontSize: 16,
        lineHeight: 22,
        color: ORANGE,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
});

export default PaymentSuccessScreen;