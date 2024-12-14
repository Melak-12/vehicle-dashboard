import dotenv from 'dotenv';
import app from './app';
import { connectDB } from './db';

dotenv.config();

const PORT = process.env.PORT || 7000;

// Check for Cloudinary environment variables
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error('Cloudinary environment variables are not set');
  process.exit(1);
}

// Connect to the database
connectDB();

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

