const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    userId: {
      type: String,
    },
    productName: {
      type: String,
      required: true,
      trim: true,
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      min: 1,
    },
    weight: {
      type: Number,
      min: 0,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      required: true,
      default: 'USD',
      trim: true,
      uppercase: true,
    },
    trackingLink: {
      type: String,
      default: '',
      trim: true,
    },
    purchaseDate: {
      type: Date,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    shippingAddress: {
      type: String,
    },
    status: {
      type: String,
      enum: [
        'Order Placed',
        'Processing',
        'Dispatched',
        'In Transit',
        'Delivered',
        'Cancelled',
      ],
      default: 'Order Placed',
    },
    location: {
      latitude: { type: Number },
      longitude: { type: Number },
      address: { type: String, trim: true },
      lastUpdated: { type: Date },
    },
    estimatedDelivery: {
      type: Date,
    },
    trackingData: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Order', orderSchema);
