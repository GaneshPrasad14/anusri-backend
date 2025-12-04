
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  images: {
    type: [String], // Array of image URLs/paths
    required: true,
    validate: {
      validator: function(v) {
        return v && v.length > 0; // Ensure at least one image
      },
      message: 'At least one image is required'
    }
  },
  // Keep image field for backward compatibility (will be deprecated)
  image: {
    type: String,
    required: false,
  },
  category: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    default: 0,
  },
}, {
timestamps: true,
});

// Add indexes for better performance
productSchema.index({ category: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ name: 'text', description: 'text' }); // Text search index

export default mongoose.model('Product', productSchema);
