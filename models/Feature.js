// FILE: backend/src/models/Feature.js
// PURPOSE: Feature schema for homepage features

import mongoose from 'mongoose';

/**
 *  Child Explanation:
 * This stores information about each feature shown on the homepage.
 * Each feature has: icon, title, description, and color.
 * 
 *  Technical Explanation:
 * Feature schema for dynamic feature cards on the homepage.
 * icon is the SVG icon name or URL.
 */

const featureSchema = new mongoose.Schema({
  icon: {
    type: String,
    required: [true, 'Icon name is required'],
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [50, 'Title cannot exceed 50 characters'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [200, 'Description cannot exceed 200 characters'],
  },
  color: {
    type: String,
    default: 'text-primary',
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

featureSchema.index({ isActive: 1, order: 1 });

const Feature = mongoose.model('Feature', featureSchema);

export default Feature;