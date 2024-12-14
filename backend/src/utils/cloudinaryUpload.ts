import cloudinary from '../config/cloudinary';

export const uploadImageToCloudinary = async (base64Image: string) => {
  const base64Data = base64Image.replace(/^data:image\/[a-z]+;base64,/, '');

  try {
    const result = await cloudinary.uploader.upload(`data:image/jpeg;base64,${base64Data}`, {
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

