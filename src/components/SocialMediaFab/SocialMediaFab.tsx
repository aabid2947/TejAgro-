import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated, Linking } from 'react-native';
import FacebookIcon from '../../svg/FacebookIcon';
import InstagramIcon from '../../svg/InstagramIcon';
import LinkedInIcon from '../../svg/LinkedInIcon';
import YouTubeIcon from '../../svg/YouTubeIcon';
import WhatsAppIcon from '../../svg/WhatsAppIcon';
import ShareIcon from '../../svg/ShareIcon';

interface SocialMediaFabProps {
  style?: any;
}

const SocialMediaFab: React.FC<SocialMediaFabProps> = ({ style }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  const toggleExpand = () => {
    const toValue = isExpanded ? 0 : 1;
    
    Animated.spring(animation, {
      toValue,
      useNativeDriver: true,
      friction: 5,
    }).start();
    
    setIsExpanded(!isExpanded);
  };

  const openSocialMedia = (platform: string) => {
    let url = '';
    switch (platform) {
      case 'facebook':
        url = 'https://www.facebook.com/tejagrotechindia/';
        break;
      case 'instagram':
        url = 'https://www.instagram.com/tejagrotech/';
        break;
      case 'linkedin':
        url = 'https://www.linkedin.com/company/101432630/admin/page-posts/published/';
        break;
      case 'youtube':
        url = 'https://www.youtube.com/@tejagrotech123';
        break;
      case 'whatsapp':
        const phoneNumber = '+919130530591';
        const whatsappUrl = `whatsapp://send?phone=${phoneNumber}`;
        
        Linking.canOpenURL(whatsappUrl)
          .then((supported) => {
            if (supported) {
              return Linking.openURL(whatsappUrl);
            } else {
              // Fallback to web WhatsApp
              return Linking.openURL(`https://wa.me/${phoneNumber.replace('+', '')}`);
            }
          })
          .catch((err) => console.error('Error opening WhatsApp:', err));
        return; // Exit early for WhatsApp
    }
    
    Linking.openURL(url).catch((err) => console.error('Error opening URL:', err));
  };

  // Calculate positions for semicircle arrangement (opening to the left)
  const radius = 90;
  const angleStep = Math.PI / 7; // Adjusted for 5 buttons
  
  const facebookTranslate = {
    x: animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -radius * Math.cos(angleStep * 3.2) + 15],
    }),
    y: animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -radius * Math.sin(angleStep * 4) - 15],
    }),
  };

  const instagramTranslate = {
    x: animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -radius * Math.cos(angleStep * 2) + 10],
    }),
    y: animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -radius * Math.sin(angleStep * 2.1) - 8],
    }),
  };

  const linkedinTranslate = {
    x: animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -radius * Math.cos(angleStep * 1.5) + 5],
    }),
    y: animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -radius * Math.sin(angleStep * 0.7) - 2],
    }),
  };

  const whatsappTranslate = {
    x: animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -radius * Math.cos(angleStep * 2) + 2],
    }),
    y: animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, radius * Math.sin(angleStep * 0.5) + 5],
    }),
  };

  const youtubeTranslate = {
    x: animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -radius * Math.cos(angleStep * 3) + 10],
    }),
    y: animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, radius * Math.sin(angleStep * 1.9) - 8],
    }),
  };

  const iconScale = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const mainButtonRotation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  return (
    <View style={[styles.container, style]}>
      {/* Facebook Button */}
      <Animated.View
        style={[
          styles.socialButton,
          {
            transform: [
              { translateX: facebookTranslate.x },
              { translateY: facebookTranslate.y },
              { scale: iconScale },
            ],
          },
        ]}
      >
        <TouchableOpacity
          style={[styles.button, styles.socialIconButton]}
          onPress={() => openSocialMedia('facebook')}
          activeOpacity={0.8}
        >
          <FacebookIcon width={24} height={24} color="#1877F2" />
        </TouchableOpacity>
      </Animated.View>

      {/* Instagram Button */}
      <Animated.View
        style={[
          styles.socialButton,
          {
            transform: [
              { translateX: instagramTranslate.x },
              { translateY: instagramTranslate.y },
              { scale: iconScale },
            ],
          },
        ]}
      >
        <TouchableOpacity
          style={[styles.button, styles.socialIconButton]}
          onPress={() => openSocialMedia('instagram')}
          activeOpacity={0.8}
        >
          <InstagramIcon width={24} height={24} color="#E4405F" />
        </TouchableOpacity>
      </Animated.View>

      {/* LinkedIn Button */}
      <Animated.View
        style={[
          styles.socialButton,
          {
            transform: [
              { translateX: linkedinTranslate.x },
              { translateY: linkedinTranslate.y },
              { scale: iconScale },
            ],
          },
        ]}
      >
        <TouchableOpacity
          style={[styles.button, styles.socialIconButton]}
          onPress={() => openSocialMedia('linkedin')}
          activeOpacity={0.8}
        >
          <LinkedInIcon width={24} height={24} color="#0077B5" />
        </TouchableOpacity>
      </Animated.View>

      {/* WhatsApp Button */}
      <Animated.View
        style={[
          styles.socialButton,
          {
            transform: [
              { translateX: whatsappTranslate.x },
              { translateY: whatsappTranslate.y },
              { scale: iconScale },
            ],
          },
        ]}
      >
        <TouchableOpacity
          style={[styles.button, styles.socialIconButton]}
          onPress={() => openSocialMedia('whatsapp')}
          activeOpacity={0.8}
        >
          <WhatsAppIcon width={24} height={24} color="#25D366" />
        </TouchableOpacity>
      </Animated.View>

      {/* YouTube Button */}
      <Animated.View
        style={[
          styles.socialButton,
          {
            transform: [
              { translateX: youtubeTranslate.x },
              { translateY: youtubeTranslate.y },
              { scale: iconScale },
            ],
          },
        ]}
      >
        <TouchableOpacity
          style={[styles.button, styles.socialIconButton]}
          onPress={() => openSocialMedia('youtube')}
          activeOpacity={0.8}
        >
          <YouTubeIcon width={24} height={24} color="#FF0000" />
        </TouchableOpacity>
      </Animated.View>

      {/* Main Toggle Button */}
      <Animated.View
        style={{
          transform: [{ rotate: mainButtonRotation }],
        }}
      >
        <TouchableOpacity
          style={[styles.button, styles.mainButton]}
          onPress={toggleExpand}
          activeOpacity={0.8}
        >
          <ShareIcon width={24} height={24} color="#FFFFFF" />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialButton: {
    position: 'absolute',
  },
  button: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
  },
  socialIconButton: {
    backgroundColor: '#FFFFFF',
  },
  mainButton: {
    backgroundColor: '#FF6B35',
    width: 56,
    height: 56,
    borderRadius: 28,
  },
});

export default SocialMediaFab;
