import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, SafeAreaView, View, Dimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AuthApi from '../../api/AuthApi';
import { LoaderScreen } from '../../components/loaderview/LoaderScreen';
import NoRecordFound from '../../components/noRecordFound/NoRecordFound';
import SearchInput from '../../components/searchInput/SearchInput';
import { setTotalItems } from '../../reduxToolkit/counterSlice';
import { RootState } from '../../reduxToolkit/store';
import { MENUBAR_SCREEN } from '../../routes/Routes';
import { headerView } from '../../shared/components/CommonUtilities';
import { YouTubeVideoItem } from '../../components/commonComponent/YouTubeVideoItem';
import { jwtDecode } from 'jwt-decode';
import CustomCaraosel from "../../components/customCarousel/CustomCarousel";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { YouTubeVideosStyle } from './YouTubeVideosStyle';
import TextPoppinsMediumBold from '../../shared/fontFamily/TextPoppinsMediumBold';

// Interface for video data
interface VideoData {
    id: string;
    title: string;
    videoId: string;
    description: string;
    thumbnail: string;
    crop_name?: string;
    marathi_name?: string;
    marathi_subject?: string;
    url?: string;
}

// Note: Videos are now loaded only from API - no static fallback data

const YouTubeVideosScreen = ({ navigation }: any) => {
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredVideos, setFilteredVideos] = useState<VideoData[]>([]);
    const [refresh, setRefresh] = useState(false);
    const [isLoader, setLoader] = useState(false);
  
    const [videoData, setVideoData] = useState<VideoData[]>([]);
    // const userData: any = useSelector((state: RootState) => state.counter.isUserinfo);
    const profileDetail: any = useSelector((state: RootState) => state.counter.isProfileInfo);
    const totalItems: any = useSelector((state: RootState) => state.counter.totalItems);
    const isUserData = useSelector((state: any) => state.counter.isUserinfo);
    
    const insets = useSafeAreaInsets();
    const dispatch = useDispatch();



    const decodedTokens = (token: string) => {
        try {
            const decoded = jwtDecode(token);
            return decoded;
        } catch (error) {
            console.log('Error decoding JWT token:', error);
            return null;
        }
    };

    const token = isUserData?.jwt;
    const decodedToken: any = decodedTokens(token);

    const getCartDetail = async () => {
        const payload = {
            "client_id": decodedToken?.data?.client_id
        };
        try {
            const response = await AuthApi.getCartDetails(payload, token);
            if (response && response.data && Array.isArray(response.data)) {
                const numberOfItems = response.data.reduce((total: number, item: any) => total + Number(item.quantity), 0);
                dispatch(setTotalItems(numberOfItems));
            } else {
                dispatch(setTotalItems(0));
            }
        } catch (error: any) {
            console.log("Error loading cart:", error);
        }
    };

    const onRefresh = () => {
        setRefresh(true);
        setTimeout(() => {
            setRefresh(false);
            getVideoList();
            getCartDetail();
         
        }, 1000);
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        if (query) {
            const filtered = videoData.filter(video =>
                video.title.toLowerCase().includes(query.toLowerCase()) ||
                video.description.toLowerCase().includes(query.toLowerCase()) ||
                (video.crop_name && video.crop_name.toLowerCase().includes(query.toLowerCase())) ||
                (video.marathi_name && video.marathi_name.toLowerCase().includes(query.toLowerCase())) ||
                (video.marathi_subject && video.marathi_subject.toLowerCase().includes(query.toLowerCase()))
            );
            console.log('YouTube filtered results count:', filtered.length, 'matches:', filtered.map(f => f.title));
            setFilteredVideos(filtered);
        } else {
            setFilteredVideos([]);
        }
    };

    // Function to extract video ID from YouTube URL
    const extractVideoId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    // Function to transform API response to expected format
    const transformVideoData = (apiData: any[]): VideoData[] => {
        return apiData.map((item, index) => {
            const videoId = extractVideoId(item.url) || ''; // Fallback to default video ID
            
            // Get appropriate title based on language preference
            let title = 'Farming Video';
            if (item.subject && item.subject.trim()) {
                title = item.subject;
            } else if (item.marathi_subject && item.marathi_subject.trim()) {
                title = item.marathi_subject;
            }
            
            // Use description from API, or fallback to title
            let description = item.description || title || 'Educational farming content';
            
            return {
                id: item.id || index.toString(),
                title: title,
                videoId: videoId,
                description: description,
                thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
                crop_name: item.crop_name,
                marathi_name: item.marathi_name,
                marathi_subject: item.marathi_subject,
                url: item.url
            };
        });
    };

    const getVideoList = async () => {
        try {
            setLoader(true);
            const response = await AuthApi.getYouTubeVideos();
            console.log('API Response:', response.data);
            
            if (response?.data?.status && response?.data?.youtube_links) {
                const transformedData = transformVideoData(response.data.youtube_links);
                setVideoData(transformedData);
                console.log('YouTube transformedData set, length:', transformedData.length);
                console.log('Transformed Data:', transformedData);
            } else {
                // No fallback - only show API videos
                setVideoData([]);
            }
            setLoader(false);
        } catch (error: any) {
            console.log("Error loading videos:", error);
            // No fallback - only show API videos
            setVideoData([]);
            setLoader(false);
        }
    };

    useEffect(() => {
        getVideoList();
        getCartDetail();
       
    }, []);

    // If videos load after the user has typed a search query,
    // reapply the filter so results appear without retyping.
    useEffect(() => {
        if (searchQuery) {
            // re-run the same logic as handleSearch but avoid double console logs
            const q = searchQuery;
            const filtered = videoData.filter(video =>
                video.title.toLowerCase().includes(q.toLowerCase()) ||
                video.description.toLowerCase().includes(q.toLowerCase()) ||
                (video.crop_name && video.crop_name.toLowerCase().includes(q.toLowerCase())) ||
                (video.marathi_name && video.marathi_name.toLowerCase().includes(q.toLowerCase())) ||
                (video.marathi_subject && video.marathi_subject.toLowerCase().includes(q.toLowerCase()))
            );
            console.log('Reapplied search; filtered count:', filtered.length);
            setFilteredVideos(filtered);
        }
    }, [videoData]);

    const onPressSide = () => {
        navigation.navigate(MENUBAR_SCREEN);
    };

    return (
        <SafeAreaView style={{ ...YouTubeVideosStyle.main, paddingTop: insets.top, paddingBottom: insets.bottom }}>
            {headerView(`Hi, ${profileDetail?.client_name || ""}`, "Enjoy our services", onPressSide, totalItems, navigation, undefined)}
            <View style={YouTubeVideosStyle.container}>
                <SearchInput
                    placeholder={t('SEARCH_VIDEOS')}
                    value={searchQuery}
                    setSearchQuery={setSearchQuery}
                    searchQuery={searchQuery}
                    onChangeText={handleSearch}
                />
                {isLoader ? (
                    <LoaderScreen />
                ) : (
                    <FlatList
                        data={!searchQuery ? videoData : filteredVideos}
                        keyExtractor={(item: any) => item.id}
                        renderItem={({ item, index }: any) => {
                            return <YouTubeVideoItem data={item} index={index} />;
                        }}
                        ListEmptyComponent={!isLoader && <NoRecordFound style={YouTubeVideosStyle.noDataTxt} />}
                        refreshing={refresh}
                        ListHeaderComponent={() => {
                            return (
                                <View>
                             
                                    <TextPoppinsMediumBold style={YouTubeVideosStyle.headerText}>
                                        {t('FARMING_VIDEOS')}
                                    </TextPoppinsMediumBold>
                                </View>
                            );
                        }}
                        onRefresh={onRefresh}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </View>
        </SafeAreaView>
    );
};

export default YouTubeVideosScreen;