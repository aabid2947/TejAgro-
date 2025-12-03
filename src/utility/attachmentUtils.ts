import { launchImageLibrary, launchCamera, ImagePickerResponse, MediaType, PhotoQuality } from 'react-native-image-picker';
import { 
  pick,
  DocumentPickerResponse,
  errorCodes,
  isErrorWithCode,
  types,
} from '@react-native-documents/picker';
import { Alert, Platform } from 'react-native';
import RNFS from 'react-native-fs';

export interface AttachmentData {
  type: 'image' | 'document';
  base64: string;
  fileName: string;
  fileType: string;
  uri: string;
}

/**
 * Convert file to base64
 */
const convertToBase64 = async (uri: string): Promise<string> => {
  try {
    const base64Data = await RNFS.readFile(uri, 'base64');
    return base64Data;
  } catch (error) {
    console.error('Error converting file to base64:', error);
    throw error;
  }
};

/**
 * Show image picker options
 */
export const pickImage = (): Promise<AttachmentData[]> => {
  return new Promise((resolve, reject) => {
    Alert.alert(
      'Select Image',
      'Choose an option',
      [
        { text: 'Camera', onPress: () => openCamera(resolve, reject) },
        { text: 'Gallery', onPress: () => openGallery(resolve, reject) },
        { text: 'Cancel', style: 'cancel', onPress: () => resolve([]) },
      ],
      { cancelable: true }
    );
  });
};

/**
 * Open camera for image capture
 */
const openCamera = async (resolve: (value: AttachmentData[]) => void, reject: (reason?: any) => void) => {
  try {
    const options = {
      mediaType: 'photo' as MediaType,
      quality: 0.8 as PhotoQuality,
      includeBase64: false,
      maxWidth: 1024,
      maxHeight: 1024,
    };

    launchCamera(options, async (response: ImagePickerResponse) => {
      if (response.didCancel || response.errorMessage) {
        resolve([]);
        return;
      }

      if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        if (asset.uri) {
          try {
            const base64Data = await convertToBase64(asset.uri);
            const mimeType = asset.type || 'image/jpeg';
            const base64WithPrefix = `data:${mimeType};base64,${base64Data}`;
            
            resolve([{
              type: 'image',
              base64: base64WithPrefix,
              fileName: asset.fileName || `image_${Date.now()}.jpg`,
              fileType: mimeType,
              uri: asset.uri,
            }]);
          } catch (error) {
            reject(error);
          }
        }
      } else {
        resolve([]);
      }
    });
  } catch (error) {
    reject(error);
  }
};

/**
 * Open gallery for image selection
 */
const openGallery = async (resolve: (value: AttachmentData[]) => void, reject: (reason?: any) => void) => {
  try {
    const options = {
      mediaType: 'photo' as MediaType,
      quality: 0.8 as PhotoQuality,
      includeBase64: false,
      maxWidth: 1024,
      maxHeight: 1024,
      selectionLimit: 5, // Allow multiple selection
    };

    launchImageLibrary(options, async (response: ImagePickerResponse) => {
      if (response.didCancel || response.errorMessage) {
        resolve([]);
        return;
      }

      if (response.assets && response.assets.length > 0) {
        try {
          const attachments: AttachmentData[] = [];
          
          for (const asset of response.assets) {
            if (asset.uri) {
              const base64Data = await convertToBase64(asset.uri);
              const mimeType = asset.type || 'image/jpeg';
              const base64WithPrefix = `data:${mimeType};base64,${base64Data}`;
              
              attachments.push({
                type: 'image',
                base64: base64WithPrefix,
                fileName: asset.fileName || `image_${Date.now()}.jpg`,
                fileType: mimeType,
                uri: asset.uri,
              });
            }
          }
          
          resolve(attachments);
        } catch (error) {
          reject(error);
        }
      } else {
        resolve([]);
      }
    });
  } catch (error) {
    reject(error);
  }
};

/**
 * Pick document
 */
export const pickDocument = async (): Promise<AttachmentData[]> => {
  try {
    const results = await pick({
      type: [
        types.pdf,
        types.doc,
        types.docx,
        types.plainText,
        types.xlsx,
        types.ppt,
        types.pptx,
        // Add more types as needed
      ],
      allowMultiSelection: true,
      mode: 'import', // Use import mode for better file access
    });

    const attachments: AttachmentData[] = [];

    for (const result of results) {
      try {
        // Check file size (limit to 10MB)
        if (result.size && result.size > 10 * 1024 * 1024) {
          Alert.alert('Error', `File ${result.name} is too large. Maximum size is 10MB.`);
          continue;
        }

        const base64Data = await convertToBase64(result.uri);
        const mimeType = result.type || 'application/octet-stream';
        const base64WithPrefix = `data:${mimeType};base64,${base64Data}`;

        attachments.push({
          type: 'document',
          base64: base64WithPrefix,
          fileName: result.name || `document_${Date.now()}`,
          fileType: mimeType,
          uri: result.uri,
        });
      } catch (error) {
        console.error(`Error processing document ${result.name}:`, error);
        Alert.alert('Error', `Failed to process document ${result.name}`);
      }
    }

    return attachments;
  } catch (error) {
    if (isErrorWithCode(error)) {
      switch (error.code) {
        case errorCodes.OPERATION_CANCELED:
          console.log('Document picker cancelled');
          return [];
        case errorCodes.UNABLE_TO_OPEN_FILE_TYPE:
          console.warn('Unable to open file type');
          Alert.alert('Error', 'Unable to open this file type');
          return [];
        case errorCodes.IN_PROGRESS:
          console.warn('Document picker already in progress');
          return [];
        default:
          console.error('Document picker error:', error);
          throw error;
      }
    } else {
      console.error('Error picking document:', error);
      throw error;
    }
  }
};

/**
 * Show attachment options
 */
export const showAttachmentOptions = (): Promise<AttachmentData[]> => {
  return new Promise((resolve, reject) => {
    Alert.alert(
      'Select Attachment',
      'Choose what you want to attach',
      [
        { 
          text: 'Photo', 
          onPress: async () => {
            try {
              const images = await pickImage();
              resolve(images);
            } catch (error) {
              reject(error);
            }
          }
        },
        { 
          text: 'Document', 
          onPress: async () => {
            try {
              const documents = await pickDocument();
              resolve(documents);
            } catch (error) {
              reject(error);
            }
          }
        },
        { text: 'Cancel', style: 'cancel', onPress: () => resolve([]) },
      ],
      { cancelable: true }
    );
  });
};

/**
 * Get file extension from filename
 */
export const getFileExtension = (filename: string): string => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2).toLowerCase();
};

/**
 * Check if file is an image
 */
export const isImageFile = (filename: string): boolean => {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
  const extension = getFileExtension(filename);
  return imageExtensions.includes(extension);
};

/**
 * Get display name for file type
 */
export const getFileTypeDisplayName = (filename: string): string => {
  const extension = getFileExtension(filename);
  const typeMap: { [key: string]: string } = {
    pdf: 'PDF Document',
    doc: 'Word Document',
    docx: 'Word Document',
    xls: 'Excel Spreadsheet',
    xlsx: 'Excel Spreadsheet',
    ppt: 'PowerPoint Presentation',
    pptx: 'PowerPoint Presentation',
    txt: 'Text Document',
    jpg: 'Image',
    jpeg: 'Image',
    png: 'Image',
    gif: 'Image',
    bmp: 'Image',
    webp: 'Image',
  };
  
  return typeMap[extension] || 'Document';
};