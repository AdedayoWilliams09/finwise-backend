// FILE: backend/src/routes/publicRoutes.js
// PURPOSE: Public API endpoints for homepage data

import express from 'express';
import Testimonial from '../models/Testimonial.js';
import Feature from '../models/Feature.js';

const router = express.Router();

/**
 *  Child Explanation:
 * These are public URLs that anyone can visit to get data.
 * They don't need passwords or login.
 * 
 *  Technical Explanation:
 * Public routes that serve data without authentication.
 * Used for homepage dynamic content.
 * Rate limited but no auth required.
 */

// GET /api/public/testimonials
// Returns all active testimonials sorted by order
router.get('/testimonials', async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .lean();
    
    res.status(200).json({
      success: true,
      count: testimonials.length,
      data: testimonials,
    });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch testimonials',
    });
  }
});

// GET /api/public/features
// Returns all active features sorted by order
router.get('/features', async (req, res) => {
  try {
    const features = await Feature.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .lean();
    
    res.status(200).json({
      success: true,
      count: features.length,
      data: features,
    });
  } catch (error) {
    console.error('Error fetching features:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch features',
    });
  }
});

// GET /api/public/pricing
// Returns pricing information (static for now, but could be dynamic)
router.get('/pricing', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      free: {
        name: 'Free',
        price: 0,
        currency: 'USD',
        features: [
          '50 transactions per month',
          '3 budgets',
          'Basic reports',
          '30-day data history',
        ],
      },
      premium: {
        name: 'Premium',
        price: 2500,
        currency: 'NGN',
        features: [
          'Unlimited transactions',
          'Unlimited budgets',
          'Advanced analytics',
          'Unlimited data history',
          'Receipt storage',
          'Export to CSV/PDF',
          'Email reports',
        ],
      },
    },
  });
});

export default router;