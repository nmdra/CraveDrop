import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  priceAtPurchase: { type: Number, required: true }, 
  restaurantId: { type: String, required: true }, // Add restaurant ID to each item
});

const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    items: [itemSchema],
    totalAmount: { type: Number, required: true },
    currency: { type: String, default: 'usd' },
    paymentMethod: { type: String, enum: ['card', 'cash'], required: true },
    paymentClientSecret: { type: String },
    status: { type: String, enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
    deliveryAddress: { type: String, required: true },
    phoneNumber: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;
