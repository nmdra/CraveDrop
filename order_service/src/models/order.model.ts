import mongoose, { Schema, Document } from 'mongoose';

interface IOrder extends Document {
  userId: string;
  items: { productId: string; quantity: number }[];
  createdAt: Date;
}

const orderSchema: Schema = new Schema({
  userId: { type: String, required: true },
  items: [{ productId: String, quantity: Number }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IOrder>('Order', orderSchema);
