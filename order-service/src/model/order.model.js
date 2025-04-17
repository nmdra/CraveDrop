import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  quantity: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    items: [itemSchema],
    paymentClientSecret: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;
