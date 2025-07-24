import mongoose, { Schema } from "mongoose";

mongoose.connect(process.env.MONGODB_URI);
mongoose.Promise = global.Promise;

const CarSchema = new mongoose.Schema({
  name: { type: String, required: true },
  bodyStyle: { type: String, required: true },
  seats: { type: Number, required: true },
  powertrain: { type: String, required: true },
  transmission: { type: String, required: true },
  unlimitedMileage: { type: Boolean, default: false },
  description: { type: String, required: true },
  features: { type: [String], required: true },
  imageUrls: { type: [String], required: true },
  pricePerDay: { type: Number, required: true },
  status: { type: String, enum: ['active', 'disabled'], default: 'active' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userEmail: { type: String, required: true },
  location: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});


 const Car =  mongoose.models.Car || mongoose.model('Car', CarSchema); 
 export default Car;