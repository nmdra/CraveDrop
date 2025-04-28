import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  orderID: {
    type: String,
    required: true,
    unique: true
  },
  customerID: {
    type: String,
    required: true
  },
  customername: {
    type: String,
    required: true
  },
  customercontact: {
    type: String,
    required: true
  },
  customerlocatiocordinate: {
    type: [Number], // [longitude, latitude]
    required: true
  },
  customerlocation: {
    type: String,
    required: false
  },
  shopid: {
    type: String,
    required: true
  },
  shopname: {
    type: String,
    required: true
  },
  shopcontact: {
    type: String,
    required: true
  },
  shoplocation: {
    type: [Number], // [longitude, latitude]
    required: true
  },
  shoplocationtext: {
    type: String,
    required: false
  },
  status: {
    type: String,
    required: true,
    enum: ['PENDING', 'ACCEPTED', 'PREPARING', 'READY_FOR_PICKUP', 'PICKED_UP', 'DELIVERED', 'CANCELLED'],
    default: 'PENDING'
  }
}, { timestamps: true });

// Create geospatial indexes for location coordinates
OrderSchema.index({ customerlocatiocordinate: "2dsphere" });
OrderSchema.index({ shoplocation: "2dsphere" });

const Order = mongoose.model('Order', OrderSchema);

export default Order;