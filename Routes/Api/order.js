const express = require('express');
const router = express.Router();

const contactController = require('../../Controllers/ContactController');
const {
  receiveOrderNotification,
  receiveBookingNotification,
  receiveBulkQuote,
} = require('../../Controllers/notificationController');
const {
  getTrackingNumber,
  updateTrackingInfo,
} = require('../../Controllers/trackController');
const userController = require('../../Controllers/userController');
const adminController = require('../../Controllers/adminController');
const roleMiddleware = require('../../Middleware/roleMiddleware');
const authMiddleware = require('../../Middleware/authMiddleware');

// -------------------- CONTACT --------------------
// Public: users can send messages
router.post('/contact', contactController);

// -------------------- ORDER NOTIFICATIONS --------------------
// Admin-only: receive order notifications
router.post(
  '/notification',
  authMiddleware,
  roleMiddleware(['admin']),
  receiveOrderNotification
);

// -------------------- TRACKING --------------------
// Get tracking info (user/admin)
router.post('/tracking', authMiddleware, getTrackingNumber);

// Update order status (admin only)
router.put(
  '/all-orders/tracking',
  authMiddleware,
  roleMiddleware(['admin']),
  updateTrackingInfo
);

// -------------------- USER CONTROLLER --------------------
// Get user's order history
router.get(
  '/user/history',
  authMiddleware,
  roleMiddleware(['user']),
  userController.getUserHistory
);

// Get user's parcel status by orderId
router.get(
  '/user/parcel/:orderId',
  authMiddleware,
  roleMiddleware(['user']),
  userController.getParcelStatus
);

// -------------------- ADMIN CONTROLLER --------------------
// Get all orders
router.get(
  '/admin/orders',
  authMiddleware,
  roleMiddleware(['admin']),
  adminController.getAllOrders
);

// Get a specific order by orderId
router.get(
  '/admin/orders/:orderId',
  authMiddleware,
  roleMiddleware(['admin']),
  adminController.getOrderById
);

// booking
router.post('/booking', receiveBookingNotification);
router.post('/bulk-quote', receiveBulkQuote);

module.exports = router;
