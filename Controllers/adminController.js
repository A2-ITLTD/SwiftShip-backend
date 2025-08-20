const orderSchema = require('../models/orderSchema');
const sanitizeInput = require('../Utils/sanitizeInput');

// Get all orders (admin)
const getAllOrders = async (req, res) => {
  try {
    const orders = await orderSchema.find().sort({ purchaseDate: -1 });
    return res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error('Error fetching all orders:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Get a specific order by orderId (admin)
const getOrderById = async (req, res) => {
  try {
    let { orderId } = req.params;
    orderId = sanitizeInput(orderId);

    if (!orderId)
      return res.status(400).json({ error: 'Order ID is required' });

    const order = await orderSchema.findOne({ orderId });
    if (!order) return res.status(404).json({ error: 'Order not found' });

    return res.status(200).json({ success: true, order });
  } catch (error) {
    console.error('Error fetching order by ID:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getAllOrders, getOrderById };
