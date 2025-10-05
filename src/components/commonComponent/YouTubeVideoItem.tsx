import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions, Image, TouchableOpacity, Linking } from 'react-native';
import { BLACK, GRAY, WHITE, MDBLUE } from '../../shared/common-styles/colors';
import TextPoppinsSemiBold from '../../shared/fontFamily/TextPoppinsSemiBold';
import TextPoppinsMediumBold from '../../shared/fontFamily/TextPoppinsMediumBold';

const { width } = Dimensions.get('window');

interface YouTubeVideoItemProps {
    data: {
        id: string;
        title: string;
        videoId: string;
        description: string;
        duration: string;
        views: string;
        thumbnail: string;
        url?: string;
    };
    index: number;
}

export const YouTubeVideoItem: React.FC<YouTubeVideoItemProps> = ({ data, index }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const openYouTubeVideo = () => {
        let youtubeUrl = '';
        
        if (data.url) {
            // Use the original URL from API if available
            youtubeUrl = data.url;
        } else {
            // Fallback to constructing URL from videoId
            youtubeUrl = `https://www.youtube.com/watch?v=${data.videoId}`;
        }
        
        Linking.openURL(youtubeUrl);
    };

    const toggleDescription = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <View style={styles.container}>
            {/* Video Thumbnail */}
            <TouchableOpacity style={styles.videoContainer} onPress={openYouTubeVideo}>
                <Image 
                    source={{ uri: data.thumbnail }} 
                    style={styles.thumbnail}
                    resizeMode="cover"
                />
                <View style={styles.playButton}>
                    <View style={styles.playIcon}>
                        <Text style={styles.playText}>▶</Text>
                    </View>
                </View>
                <View style={styles.durationBadge}>
                    <Text style={styles.durationText}>{data.duration}</Text>
                </View>
            </TouchableOpacity>

            {/* Video Info */}
            <View style={styles.infoContainer}>
                <TextPoppinsSemiBold style={styles.title} numberOfLines={2}>
                    {data.title}
                </TextPoppinsSemiBold>
                
                <View style={styles.metaContainer}>
                    <Text style={styles.metaText}>{data.views} views</Text>
                    <Text style={styles.metaText}>•</Text>
                    <Text style={styles.metaText}>Tap to watch on YouTube</Text>
                </View>

                <Pressable onPress={toggleDescription}>
                    <TextPoppinsMediumBold 
                        style={styles.description} 
                        numberOfLines={isExpanded ? undefined : 2}
                    >
                        {data.description}
                    </TextPoppinsMediumBold>
                    {data.description.length > 100 && (
                        <Text style={styles.readMore}>
                            {isExpanded ? 'Show less' : 'Read more'}
                        </Text>
                    )}
                </Pressable>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: WHITE,
        marginHorizontal: 10,
        marginVertical: 8,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        overflow: 'hidden',
    },
    videoContainer: {
        width: '100%',
        height: 200,
        backgroundColor: BLACK,
        position: 'relative',
    },
    thumbnail: {
        width: '100%',
        height: '100%',
    },
    playButton: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -30 }, { translateY: -30 }],
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    playIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
    },
    playText: {
        color: WHITE,
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 2,
    },
    durationBadge: {
        position: 'absolute',
        bottom: 8,
        right: 8,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    durationText: {
        color: WHITE,
        fontSize: 12,
        fontWeight: '500',
    },
    infoContainer: {
        padding: 16,
    },
    title: {
        fontSize: 16,
        color: BLACK,
        lineHeight: 22,
        marginBottom: 8,
    },
    metaContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    metaText: {
        fontSize: 13,
        color: GRAY,
        marginRight: 8,
    },
    description: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
        marginBottom: 4,
    },
    readMore: {
        fontSize: 13,
        color: MDBLUE,
        fontWeight: '500',
    },
});