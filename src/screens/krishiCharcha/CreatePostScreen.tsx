/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
  ActionSheetIOS,
  Platform,
  FlatList,
  ToastAndroid,
  SafeAreaView,
  PermissionsAndroid,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../reduxToolkit/store';
import { launchImageLibrary, launchCamera, ImagePickerResponse } from 'react-native-image-picker';
import { jwtDecode } from 'jwt-decode';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { styles } from './CreatePostStyle';
import { headerView } from '../../shared/components/CommonUtilities';
import { MENUBAR_SCREEN } from '../../routes/Routes';
import { MDBLUE, WHITE, GRAY, BLACK } from '../../shared/common-styles/colors';
import TextPoppinsRegular from '../../shared/fontFamily/TextPoppinsRegular';
import TextPoppinsSemiBold from '../../shared/fontFamily/TextPoppinsSemiBold';
import CameraIcon from '../../svg/CameraIcon';
import TagIcon from '../../svg/TagIcon';
import AuthApi from '../../api/AuthApi';
import { regexImage } from '../../shared/utilities/String';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TextCommonStyle } from '../../shared/fontFamily/TextCommonStyle';
// import file system

// type NavigationProp = StackNavigationProp<any>;

const CreatePostScreen: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets()

  const profileDetail: any = useSelector((state: RootState) => state.counter.isProfileInfo);
  const totalItems = useSelector((state: RootState) => state.counter.totalItems);
  const isUserData = useSelector((state: any) => state.counter.isUserinfo);

  const [currentStep, setCurrentStep] = useState(1); // 1: Image, 2: Description, 3: Tags
  const [description, setDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [cropList, setCropList] = useState<any[]>([]);
  const [selectedCrops, setSelectedCrops] = useState<any[]>([]);
  const [showAllCrops, setShowAllCrops] = useState(false);
  const [isLoadingCrops, setIsLoadingCrops] = useState(false);

  // Decode token to get current user's client_id
  const decodeToken = (token: string) => {
    try {
      const decoded = jwtDecode(token);
      return decoded;
    } catch (error) {
      console.log('Error decoding JWT token:', error);
      return null;
    }
  };

  const token = isUserData?.jwt;
  const decodedToken: any = decodeToken(token);
  const currentClientId = decodedToken?.data?.client_id;

  // Request Camera Permission for Android
  const requestCameraPermission = async (): Promise<boolean> => {
    if (Platform.OS !== 'android') {
      return true;
    }

    try {
      const androidVersion = Platform.Version;
      
      // Android 13+ (API 33+) doesn't need WRITE_EXTERNAL_STORAGE
      if (androidVersion >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: t('CAMERA_PERMISSION_TITLE'),
            message: t('CAMERA_PERMISSION_MESSAGE'),
            buttonNeutral: t('ASK_ME_LATER'),
            buttonNegative: t('CANCEL'),
            buttonPositive: t('OK'),
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        // Android 12 and below
        const grants = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        ]);

        return (
          grants[PermissionsAndroid.PERMISSIONS.CAMERA] === PermissionsAndroid.RESULTS.GRANTED &&
          grants[PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE] === PermissionsAndroid.RESULTS.GRANTED
        );
      }
    } catch (err) {
      console.warn('Error requesting camera permission:', err);
      return false;
    }
  };

  // Request Gallery Permission for Android
  const requestGalleryPermission = async (): Promise<boolean> => {
    if (Platform.OS !== 'android') {
      return true;
    }

    try {
      const androidVersion = Platform.Version;
      
      // Android 13+ (API 33+) uses READ_MEDIA_IMAGES
      if (androidVersion >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          {
            title: t('GALLERY_PERMISSION_TITLE'),
            message: t('GALLERY_PERMISSION_MESSAGE'),
            buttonNeutral: t('ASK_ME_LATER'),
            buttonNegative: t('CANCEL'),
            buttonPositive: t('OK'),
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        // Android 12 and below uses READ_EXTERNAL_STORAGE
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: t('GALLERY_PERMISSION_TITLE'),
            message: t('GALLERY_PERMISSION_MESSAGE'),
            buttonNeutral: t('ASK_ME_LATER'),
            buttonNegative: t('CANCEL'),
            buttonPositive: t('OK'),
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
    } catch (err) {
      console.warn('Error requesting gallery permission:', err);
      return false;
    }
  };

  // Fetch crops on component mount
  useEffect(() => {
    fetchCrops();
  }, []);

  const fetchCrops = async () => {
    try {
      setIsLoadingCrops(true);
      const cropResponse = await AuthApi.getCrops();
      console.log('Crop response:', cropResponse);
      if (cropResponse && cropResponse.data && Array.isArray(cropResponse.data)) {
        setCropList(cropResponse?.data);
      } else {
        console.log('Invalid crop response format:', cropResponse);
        setCropList([]);
      }
    } catch (error) {
      console.log('Error fetching crops:', error);
      setCropList([]);
    } finally {
      setIsLoadingCrops(false);
    }
  };

  // Sidebar/menu press handler
  const onPressSide = () => {
    navigation.navigate(MENUBAR_SCREEN as never);
  };

  // Early return if no user data
  useEffect(() => {
    if (!currentClientId) {
      Alert.alert(t('ERROR'), t('PLEASE_LOGIN_TO_CREATE_POST'), [
        { text: t('OK'), onPress: () => navigation.goBack() }
      ]);
    }
  }, [currentClientId]);

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const showImagePicker = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [t('CANCEL'), t('CAMERA'), t('GALLERY')],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            openCamera();
          } else if (buttonIndex === 2) {
            openGallery();
          }
        }
      );
    } else {
      Alert.alert(
        t('SELECT_IMAGE'),
        '',
        [
          { text: t('CANCEL'), style: 'cancel' },
          { text: t('CAMERA'), onPress: openCamera },
          { text: t('GALLERY'), onPress: openGallery },
        ]
      );
    }
  };

  const openCamera = async () => {
    const hasPermission = await requestCameraPermission();
    
    if (!hasPermission) {
      Alert.alert(
        t('PERMISSION_DENIED'),
        t('CAMERA_PERMISSION_REQUIRED'),
        [
          { text: t('OK'), style: 'default' }
        ]
      );
      return;
    }

    const options = {
      mediaType: 'photo' as const,
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
      saveToPhotos: true,
    };

    launchCamera(options, handleImageResponse);
  };

  const openGallery = async () => {
    const hasPermission = await requestGalleryPermission();
    
    if (!hasPermission) {
      Alert.alert(
        t('PERMISSION_DENIED'),
        t('GALLERY_PERMISSION_REQUIRED'),
        [
          { text: t('OK'), style: 'default' }
        ]
      );
      return;
    }

    const options = {
      mediaType: 'photo' as const,
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchImageLibrary(options, handleImageResponse);
  };

  const handleImageResponse = (response: ImagePickerResponse) => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
      return;
    }

    if (response.errorCode) {
      console.log('ImagePicker Error: ', response.errorCode);
      console.log('ImagePicker Error Message: ', response.errorMessage);
      
      if (response.errorCode === 'camera_unavailable') {
        Alert.alert(t('ERROR'), t('CAMERA_NOT_AVAILABLE'));
      } else if (response.errorCode === 'permission') {
        Alert.alert(t('ERROR'), t('PERMISSION_REQUIRED_TO_ACCESS_CAMERA'));
      } else {
        Alert.alert(t('ERROR'), response.errorMessage || t('IMAGE_SELECTION_FAILED'));
      }
      return;
    }

    if (response.assets && response.assets.length > 0 && response.assets[0].uri) {
      const imageUri = response.assets[0].uri;
      setSelectedImage(imageUri);
      console.log('Image selected successfully:', imageUri);
      console.log('Image details:', {
        fileName: response.assets[0].fileName,
        fileSize: response.assets[0].fileSize,
        type: response.assets[0].type,
        width: response.assets[0].width,
        height: response.assets[0].height,
      });
      
      // Show success message
      if (Platform.OS === 'android') {
        ToastAndroid.show(t('IMAGE_SELECTED_SUCCESS'), ToastAndroid.SHORT);
      }
    } else {
      console.log('No image selected or invalid response:', response);
      Alert.alert(t('ERROR'), t('NO_IMAGE_SELECTED'));
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
  };

  const handleCropSelection = (crop: any) => {
    const isSelected = selectedCrops.some((c: any) => c.crop_id === crop.crop_id);
    if (isSelected) {
      setSelectedCrops(selectedCrops.filter((c: any) => c.crop_id !== crop.crop_id));
    } else {
      setSelectedCrops([...selectedCrops, crop]);
    }
  };

  const renderCropItem = ({ item, index }: { item: any; index: number }) => {
    const isSelected = selectedCrops.some((c: any) => c.crop_id === item.crop_id);

    return (
      <TouchableOpacity
        key={item.crop_id + index}
        style={[styles.cropItem, isSelected && styles.cropItemSelected]}
        onPress={() => handleCropSelection(item)}
        activeOpacity={0.7}
      >
        {isSelected && <View style={styles.selectedIndicator} />}
        {regexImage.test(item?.crop_image) ? (
          <Image source={{ uri: item.crop_image }} style={styles.cropImage} />
        ) : (
          <Image
            source={require('../../assets/defaultProduct.png')}
            style={styles.cropImage}
          />
        )}
        <TextPoppinsRegular style={styles.cropName}>
          {i18n.language === 'en' ? item?.crop_name : item?.crop_marathi_name}
        </TextPoppinsRegular>
      </TouchableOpacity>
    );
  };

  const validateStep = () => {
    if (currentStep === 1 && !selectedImage) {
      Alert.alert(t('ERROR'), t('PLEASE_SELECT_IMAGE'));
      return false;
    }
    if (currentStep === 2 && !description.trim()) {
      Alert.alert(t('ERROR'), t('PLEASE_ENTER_DESCRIPTION'));
      return false;
    }
    return true;
  };

  const convertImageToBase64 = async (imageUri: string): Promise<string | null> => {
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          resolve(base64String);
        };
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.log('Error converting image to base64:', error);
      return null;
    }
  };

  const handleSubmit = async () => {
    if (!description.trim()) {
      Alert.alert(t('ERROR'), t('PLEASE_ENTER_DESCRIPTION'));
      return;
    }

    if (!currentClientId) {
      Alert.alert(t('ERROR'), t('USER_INFORMATION_NOT_FOUND'));
      return;
    }

    try {
      setSubmitting(true);

      let imageBase64 = null;
      if (selectedImage) {
        imageBase64 = await convertImageToBase64(selectedImage);
      }

      // Create JSON payload
      const payload = {
        client_id: currentClientId.toString(),
        post_description: description.trim(),
        post_category: "personal",
        post_file: imageBase64
      };

    

      // save this payload in a file
      
      // Call the createPost API
      const response = await AuthApi.createPost(payload);

      console.log('Create post response:', response);

      if (response && response.data) {
        if (response.data.status === true || response.data.success === true) {
          ToastAndroid.show(t('POST_SUBMITTED_SUCCESS'), ToastAndroid.SHORT);
          navigation.goBack();
        } else {
          throw new Error(response.data.message || 'Post submission failed');
        }
      } else {
        throw new Error('Invalid response from server');
      }

    } catch (error: any) {
      console.error('Error submitting post:', error);
      const errorMessage = error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'Failed to submit post. Please try again.';

      Alert.alert(t('ERROR'), errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const canProceed = () => {
    if (currentStep === 1) return selectedImage !== null;
    if (currentStep === 2) return description.trim().length > 0;
    return true;
  };

  const getDisplayedCrops = () => {
    if (showAllCrops) return cropList;
    return cropList.slice(0, 15); // Show first 15 crops (5 rows x 3 columns)
  };

  const renderStep1 = () => (
    <View style={styles.content}>
      <View style={styles.stepContainer}>
        <View style={styles.stepIcon}>
          <CameraIcon width={40} height={40} color="#D32F2F" />
        </View>
        <Text style={{ ...TextCommonStyle.textPoppinsSemiBold, ...styles.stepTitle }}>
          {t('CROP_DAMAGE_PHOTO_INSTRUCTIONS')}
        </Text>
        <TextPoppinsRegular style={styles.stepSubtitle}>
          {t('CROP_DAMAGE_PHOTO_CLOSE')}
        </TextPoppinsRegular>

        <View style={styles.section}>
          <TouchableOpacity
            style={styles.imageSection}
            onPress={showImagePicker}
            activeOpacity={0.7}
          >
            <View style={styles.imageSectionHeader}>
              <CameraIcon width={20} height={20} color={MDBLUE} />
              <TextPoppinsRegular style={styles.imageSectionTitle}>
                {t('UPLOAD_PHOTO')}
              </TextPoppinsRegular>
            </View>
          </TouchableOpacity>

          {selectedImage && (
            <View style={styles.selectedImageContainer}>
              <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={removeImage}
                activeOpacity={0.7}
              >
                <Text style={styles.removeImageText}>×</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.content}>
      <View style={styles.stepContainer}>
        <View style={styles.stepIcon}>
          <Text style={{ fontSize: 40, color: '#D32F2F' }}>✏️</Text>
        </View>
        <TextPoppinsSemiBold style={styles.stepTitle}>
          {t('ASK_YOUR_QUESTION')}
        </TextPoppinsSemiBold>
        <TextPoppinsRegular style={styles.stepSubtitle}>
          {t('WRITE_CROP_INFO_HELP')}
        </TextPoppinsRegular>

        <View style={styles.section}>
          <TextInput
            style={styles.descriptionInput}
            placeholder={t('WRITE_CROP_PROBLEM_HERE')}
            value={description}
            onChangeText={setDescription}
            multiline
            textAlignVertical="top"
            maxLength={1000}
          />
          <Text style={styles.characterCount}>
            {description.length}/1000 {t('CHARACTER_COUNT')}
          </Text>
        </View>

        <TouchableOpacity style={styles.recordButton} activeOpacity={0.7}>
          <TextPoppinsRegular style={styles.recordButtonText}>
            {t('RECORD_YOUR_QUESTION')}
          </TextPoppinsRegular>
          <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: MDBLUE, marginTop: 5 }} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.content}>
      <View style={styles.stepContainer}>
        <View style={styles.stepIcon}>
          <Text style={{ fontSize: 40, color: '#D32F2F' }}>🌾</Text>
        </View>
        <TextPoppinsSemiBold style={styles.stepTitle}>
          {t('ADD_TAGS_TO_POST')}
        </TextPoppinsSemiBold>
        <TextPoppinsRegular style={styles.stepSubtitle}>
          {t('OPTIONAL_REFERENCE_ONLY')}
        </TextPoppinsRegular>

        <FlatList
          data={getDisplayedCrops()}
          renderItem={renderCropItem}
          keyExtractor={(item, index) => item.crop_id + index.toString()}
          numColumns={3}
          style={styles.cropGrid}
          scrollEnabled={false}
        />

        {!showAllCrops && cropList.length > 15 && (
          <TouchableOpacity
            style={styles.expandButton}
            onPress={() => setShowAllCrops(true)}
            activeOpacity={0.7}
          >
            <TextPoppinsSemiBold style={styles.expandButtonText}>
              {t('VIEW_ALL_CROPS')} ⌄
            </TextPoppinsSemiBold>
          </TouchableOpacity>
        )}

        {showAllCrops && (
          <TouchableOpacity
            style={styles.expandButton}
            onPress={() => setShowAllCrops(false)}
            activeOpacity={0.7}
          >
            <TextPoppinsSemiBold style={styles.expandButtonText}>
              {t('VIEW_LESS_CROPS')} ⌃
            </TextPoppinsSemiBold>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {headerView(t('CREATE_POST'), t('SHARE_FARMING_EXPERIENCE'), onPressSide, totalItems, navigation, undefined)}

      {/* Progress Bar */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${(currentStep / 3) * 100}%` }]} />
      </View>

      {/* Main Content with KeyboardAwareScrollView */}
      <KeyboardAwareScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
      >
        {/* Step Content */}
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
      </KeyboardAwareScrollView>

      {/* Navigation Buttons */}
      <View style={styles.navigationButtons}>
        {currentStep > 1 ? (
          <TouchableOpacity
            style={[styles.navButton, styles.navButtonSecondary]}
            onPress={handlePreviousStep}
            activeOpacity={0.7}
          >
            <Text style={{ ...styles.navButtonText, ...TextCommonStyle.textPoppinsBold }}>{t('PREVIOUS')}</Text>
          </TouchableOpacity>
        ) : (
          <View />
        )}

        {currentStep < 3 ? (
          <TouchableOpacity
            style={[
              styles.navButton,
              styles.navButtonPrimary,
              { opacity: canProceed() ? 1 : 0.5 }
            ]}
            onPress={() => {
              if (validateStep()) {
                handleNextStep();
              }
            }}
            disabled={!canProceed()}
            activeOpacity={0.7}
          >
            <Text style={{ ...styles.navButtonText, ...TextCommonStyle.textPoppinsBold }}>{t('NEXT')}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              styles.navButton,
              styles.navButtonPrimary,
              { opacity: canProceed() && !submitting ? 1 : 0.5 }
            ]}
            onPress={handleSubmit}
            disabled={!canProceed() || submitting}
            activeOpacity={0.7}
          >
            {submitting ? (
              <ActivityIndicator size="small" color={WHITE} />
            ) : (
              <TextPoppinsSemiBold style={styles.navButtonText}>{t('SUBMIT')}</TextPoppinsSemiBold>
            )}
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default CreatePostScreen;