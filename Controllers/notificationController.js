const orderSchema = require('../models/orderSchema');
const sendMail = require('../Utils/mail');
const sanitizeInput = require('../Utils/sanitizeInput');
const {
  orderNotificationEmail,
  bookingNotificationEmail,
} = require('../Utils/template');

const receiveOrderNotification = async (req, res) => {
  try {
    let {
      orderId,
      productName,
      trackingLink,
      purchaseDate,
      userEmail,
      companyName,
      quantity,
      price,
      currency,
      shippingAddress,
      weight,
    } = req.body;

    // -------------------- SANITIZATION --------------------
    orderId = sanitizeInput(orderId);
    productName = sanitizeInput(productName);
    trackingLink = sanitizeInput(trackingLink);
    userEmail = sanitizeInput(userEmail);
    companyName = sanitizeInput(companyName || '');
    shippingAddress = sanitizeInput(shippingAddress || '');

    // -------------------- VALIDATION --------------------
    const errors = [];
    if (!orderId) errors.push('Order ID is required.');
    if (!productName) errors.push('Product Name is required.');
    if (!trackingLink) errors.push('Tracking Link is required.');
    if (!purchaseDate) errors.push('Purchase Date is required.');
    if (!userEmail) errors.push('User Email is required.');
    if (userEmail && !/^\S+@\S+\.\S+$/.test(userEmail))
      errors.push('Invalid email format.');
    if (!weight) errors.push('Weight is required.');

    if (errors.length > 0) return res.status(400).json({ errors });

    // Convert purchaseDate to Date object safely
    const purchaseDateObj = new Date(purchaseDate);
    if (isNaN(purchaseDateObj.getTime())) {
      return res.status(400).json({ error: 'Invalid purchase date' });
    }

    // -------------------- DUPLICATE CHECK --------------------
    const existingOrder = await orderSchema.findOne({ orderId });
    if (existingOrder) {
      return res.status(409).json({ error: 'Order already exists' });
    }

    // -------------------- SAVE ORDER --------------------
    const order = new orderSchema({
      orderId,
      productName,
      trackingLink,
      purchaseDate: purchaseDateObj,
      userEmail,
      companyName: companyName || null,
      quantity: quantity || 1,
      price: price || 0,
      currency: currency || 'USD',
      shippingAddress: shippingAddress || null,
      weight,
      status: 'Order Placed',
    });

    await order.save();

    // -------------------- SEND EMAIL TO CLIENT --------------------
    try {
      await sendMail(userEmail, 'Your Parcel Details', orderNotificationEmail, {
        orderId,
        productName,
        trackingLink,
        purchaseDate: purchaseDateObj,
        email: userEmail,
        companyName,
        quantity,
        price,
        currency,
        weight,
      });
    } catch (mailErr) {
      console.error('Error sending order email:', mailErr);
    }

    return res.status(201).json({
      success: true,
      message: 'Order saved successfully and email sent (if no errors)',
      data: order,
    });
  } catch (error) {
    console.error('Error processing order notification:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const receiveBookingNotification = async (req, res) => {
  try {
    let {
      senderName,
      senderPhone,
      senderEmail,
      senderAddressType,
      senderDistrict,
      senderArea,
      senderPostCode,
      senderAddress,
      recipientName,
      recipientPhone,
      recipientDistrict,
      recipientArea,
      recipientPostCode,
      recipientAddress,
      recipientInstruction,
      sendPickupNotification,
      productType,
      weightKg,
      contents,
      numberOfItems,
      packagingService,
      parcelValue,
      deliverySpeed,
    } = req.body;

    // -------------------- SANITIZATION --------------------
    senderName = sanitizeInput(senderName);
    senderPhone = sanitizeInput(senderPhone);
    senderEmail = sanitizeInput(senderEmail);
    senderDistrict = sanitizeInput(senderDistrict);
    senderArea = sanitizeInput(senderArea);
    senderAddress = sanitizeInput(senderAddress);

    recipientName = sanitizeInput(recipientName);
    recipientPhone = sanitizeInput(recipientPhone);
    recipientDistrict = sanitizeInput(recipientDistrict);
    recipientArea = sanitizeInput(recipientArea);
    recipientAddress = sanitizeInput(recipientAddress);
    recipientInstruction = sanitizeInput(recipientInstruction || '');

    productType = sanitizeInput(productType);
    contents = sanitizeInput(contents);
    packagingService = sanitizeInput(packagingService || 'No');

    // -------------------- VALIDATION --------------------
    const errors = [];
    if (!senderName) errors.push('Sender Name is required.');
    if (!senderPhone) errors.push('Sender Phone is required.');
    if (!senderEmail) errors.push('Sender Email is required.');
    if (senderEmail && !/^\S+@\S+\.\S+$/.test(senderEmail))
      errors.push('Invalid Sender Email format.');
    if (!senderDistrict) errors.push('Sender District is required.');
    if (!senderArea) errors.push('Sender Area is required.');
    if (!senderAddress) errors.push('Sender Address is required.');

    if (!recipientName) errors.push('Recipient Name is required.');
    if (!recipientPhone) errors.push('Recipient Phone is required.');
    if (!recipientDistrict) errors.push('Recipient District is required.');
    if (!recipientArea) errors.push('Recipient Area is required.');
    if (!recipientAddress) errors.push('Recipient Address is required.');

    if (!productType) errors.push('Product Type is required.');
    if (!weightKg) errors.push('Weight is required.');
    if (!contents) errors.push('Contents description is required.');

    if (errors.length > 0) return res.status(400).json({ errors });

    // -------------------- SEND EMAIL TO ADMIN --------------------
    try {
      await sendMail(
        'soniaweba2it@gmail.com',
        'New Booking Received',
        bookingNotificationEmail,
        {
          senderName,
          senderPhone,
          senderEmail,
          senderAddressType,
          senderDistrict,
          senderArea,
          senderPostCode,
          senderAddress,
          recipientName,
          recipientPhone,
          recipientDistrict,
          recipientArea,
          recipientPostCode,
          recipientAddress,
          recipientInstruction,
          sendPickupNotification,
          productType,
          weightKg,
          contents,
          numberOfItems,
          packagingService,
          parcelValue,
          deliverySpeed,
        }
      );
    } catch (mailErr) {
      console.error('Error sending booking email:', mailErr);
    }

    return res.status(201).json({
      success: true,
      message: 'Booking saved and admin notified via email.',
    });
  } catch (error) {
    console.error('Error processing booking:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { receiveOrderNotification, receiveBookingNotification };
