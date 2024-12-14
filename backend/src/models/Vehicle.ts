import mongoose, { Document, Schema } from 'mongoose';

export interface IVehicle extends Document {
  name: string;
  brand: string;
  model: string;
  year: number;
  licensePlate: string;
  color: string;
  images: string[];
  status: 'available' | 'sold' | 'pending';
  category: mongoose.Types.ObjectId;
  lastUpdated: Date;
}

const VehicleSchema: Schema = new Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  licensePlate: { type: String, required: true },
  color: { type: String, required: true },
  images: { type: [String], required: true },
  status: { 
    type: String, 
    required: true, 
    enum: ['available', 'sold', 'pending'],
    default: 'available'
  },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  lastUpdated: { type: Date, default: Date.now }
});

export default mongoose.model<IVehicle>('Vehicle', VehicleSchema);

