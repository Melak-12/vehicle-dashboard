import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import vehicleRoutes from './routes/vehicleRoutes';
import categoryRoutes from './routes/categoryRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 7000;

const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [];

// app.use(cors({
//   origin: (origin, callback) => {
//     if (!origin || allowedOrigins.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   optionsSuccessStatus: 200
// }));
``
app.use(cors());
app.use(express.json({ limit: '50mb' }));  
app.use(express.urlencoded({ limit: '50mb', extended: true }));


mongoose.connect(process.env.MONGODB_URI!,)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

app.use('/api/vehicles', vehicleRoutes);
app.use('/api/categories', categoryRoutes);

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error('Cloudinary environment variables are not set');
  process.exit(1);
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

