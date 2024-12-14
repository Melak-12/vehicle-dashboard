import cloudinary from '../config/cloudinary';

export const uploadImageToCloudinary = async (base64Image: string) => {
  // const base64Data = base64Image.replace(/^data:image\/[a-z]+;base64,/, '');
  // console.log('base64Data:', base64Data);

  try {
    const result = await cloudinary.uploader.upload(`${base64Image}`, {
      folder: 'vehicle',
      quality: 'auto:low', 
      format: 'jpg', 
    });

    return result.secure_url; 
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return null; 
  }
};
