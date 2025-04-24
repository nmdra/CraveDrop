import mongoose from 'mongoose';

const DeliverySchema = new mongoose.Schema({
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
  customerlocationcordinate: {
    type: [Number], // [longitude, latitude]
    required: true
  },
  driverid: {
    type: String,
    required: true
  },
  driverName: {
    type: String,
    required: true
  },
  driverlocation: {
    type: [Number], // [longitude, latitude]
    required: true
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
  status: {
    type: String,
    required: true,
    enum: ['ASSIGNED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'FAILED', 'CANCELLED'],
    default: 'ASSIGNED'
  }
}, { timestamps: true });

// Create geospatial indexes for location tracking
DeliverySchema.index({ customerlocationcordinate: "2dsphere" });
DeliverySchema.index({ driverlocation: "2dsphere" });
DeliverySchema.index({ shoplocation: "2dsphere" });

const Delivery = mongoose.model('Delivery', DeliverySchema);

export default Delivery;