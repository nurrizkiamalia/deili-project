// utils/uploadImageToCloudinary.ts
import axios from 'axios';

export const uploadImageToCloudinary = async (image: File) => {
  const formData = new FormData();
  formData.append('file', image);
  formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
  formData.append('cloud_name', process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!);

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData
    );
    return response.data.secure_url;
  } catch (err: any) {
    console.error('Cloudinary upload error:', err);
    throw new Error('Failed to upload image to Cloudinary');
  }
};
