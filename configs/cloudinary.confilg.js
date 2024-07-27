const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUD_API_KEY, 
    api_secret: process.env.CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'instagram',
      allowerdFormates: ["png","jpg","jpeg"],
      transformation: [
        {width: 1000, crop: "scale"},
        {quality: 40},
        {fetch_format: "auto"}
        ]
    },
});
const deleteImage = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        console.log('Delete Result:', result);
        return result;
    } catch (error) {
        console.error('Error deleting image:', error.message);
        throw error;
    }
};

module.exports={cloudinary,storage,deleteImage}