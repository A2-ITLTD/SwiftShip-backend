const logger = require('../Config/logger');
const orderSchema = require('../models/orderSchema');
const sanitizeInput = require('../Utils/sanitizeInput');

// -------------------- GET TRACKING NUMBER --------------------
const getTrackingNumber = async (req, res) => {
  try {
  

    let { orderId } = req.body;

    // ------------------ CHECK LOGIN ------------------
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, error: 'Please login to track your parcel' });
    }

    // ------------------ SANITIZE INPUT ------------------
    orderId = sanitizeInput(orderId);
    if (!orderId) {
      return res
        .status(400)
        .json({ success: false, error: 'Order ID is required' });
    }

    // ------------------ BUILD QUERY ------------------
    const query = { orderId, userId: req.user.id }; 

    // ------------------ FETCH ORDER ------------------
    const order = await orderSchema.findOne(query);

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    // ------------------ PREPARE RESPONSE ------------------
    const trackingData = {
      orderId: order.orderId,
      productName: order.productName,
      purchaseDate: order.purchaseDate,
      trackingLink: order.trackingLink,
      status: order.status,
      location: order.location?.address || null,
      userEmail: order.userEmail,
      companyName: order.companyName || null,
      quantity: order.quantity || null,
      weight: order.weight || null,
      price: order.price || null,
      currency: order.currency || null,
      shippingAddress: order.shippingAddress || null,
      estimatedDelivery: order.estimatedDelivery || null,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      trackingData: order.trackingData || {},
    };

    return res.status(200).json({ success: true, data: trackingData });
  } catch (error) {
    logger?.error('Error fetching tracking info:', error);
    return res
      .status(500)
      .json({ success: false, error: 'Internal server error' });
  }
};


// -------------------- UPDATE TRACKING INFO --------------------
const updateTrackingInfo = async (req, res) => {
  try {
    let { orderId, status, address } = req.body;

    // Sanitize inputs
    orderId = sanitizeInput(orderId);
    status = sanitizeInput(status);
    address = sanitizeInput(address);

    if (!orderId) {
      return res
        .status(400)
        .json({ success: false, error: 'Order ID is required' });
    }

    const order = await orderSchema.findOne({ orderId });

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    // Update status if provided
    if (status) order.status = status;

    // Update address if provided
    if (address) {
      order.location = order.location || {};
      order.location.address = address;
      order.location.lastUpdated = new Date();
    }

    await order.save();

    return res.status(200).json({
      success: true,
      message: 'Tracking info updated successfully',
      data: order,
    });
  } catch (error) {
    logger?.error('Error updating tracking info:', error);
    return res
      .status(500)
      .json({ success: false, error: 'Internal server error' });
  }
};

module.exports = { getTrackingNumber, updateTrackingInfo };
