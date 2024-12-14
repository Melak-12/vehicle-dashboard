import express from 'express';
import cors from 'cors';
import vehicleRoutes from './routes/vehicleRoutes';
import categoryRoutes from './routes/categoryRoutes';

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));  
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use('/api/vehicles', vehicleRoutes);
app.use('/api/categories', categoryRoutes);

export default app;

