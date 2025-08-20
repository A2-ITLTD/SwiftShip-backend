const orderSchema = require('../models/orderSchema');
const sanitizeInput = require('../Utils/sanitizeInput');

// Get all orders for the logged-in user
const getUserHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await orderSchema
      .find({ userId })
      .sort({ purchaseDate: -1 });

    return res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error('Error fetching user history:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Get tracking info for a user's order
const getParcelStatus = async (req, res) => {
  try {
    let { orderId } = req.params;
    orderId = sanitizeInput(orderId);

    if (!orderId)
      return res.status(400).json({ error: 'Order ID is required' });

    // Make sure only the **owner of the order** can access it
    const order = await orderSchema.findOne({
      orderId,
      userId: req.user.id,
    });

    if (!order) return res.status(404).json({ error: 'Order not found' });

    return res.status(200).json({
      success: true,
      order: {
        orderId: order.orderId,
        productName: order.productName,
        purchaseDate: order.purchaseDate,
        trackingLink: order.trackingLink,
        status: order.status,
        location: order.location || {},
      },
    });
  } catch (error) {
    console.error('Error fetching parcel status:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getUserHistory, getParcelStatus };
