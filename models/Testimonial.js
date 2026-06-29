// FILE: backend/src/models/Testimonial.js
// PURPOSE: Testimonial schema for user reviews

import mongoose from 'mongoose';

/**
 * Child Explanation:
 * This is a template for storing testimonials in the database.
 * Each testimonial has: name, role, avatar URL, rating, and quote.
 * 
 *  Technical Explanation:
 * Mongoose schema for testimonials with validation.
 * Fields: name (required), role, avatarUrl, rating (1-5), quote (required).
 * isActive controls visibility, order controls sorting.
 */

const testimonialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters'],
  },
  role: {
    type: String,
    trim: true,
    maxlength: [100, 'Role cannot exceed 100 characters'],
  },
  avatarUrl: {
    type: String,
    default: '',
  },
  rating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5'],
    default: 5,
  },
  quote: {
    type: String,
    required: [true, 'Quote is required'],
    trim: true,
    maxlength: [500, 'Quote cannot exceed 500 characters'],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  order: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Add index for efficient queries
testimonialSchema.index({ isActive: 1, order: 1 });

const Testimonial = mongoose.model('Testimonial', testimonialSchema);

export default Testimonial;