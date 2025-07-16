import mongoose from 'mongoose';


// Define schema (or import if already defined elsewhere)
const GallerySchema = new mongoose.Schema({
  userId: { type: String, required: false }, // Optional: add user id if needed
  recipeName: String,
  ingredients: [String],
  instructions: [String],
  time: Number,
  servings: Number,
  conditions: String,
  cuisine: String,
  prepTime: String,
  imageUrl: String,
  tips: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Gallery || mongoose.model('Gallery', GallerySchema);