import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

// Define the Driver Schema
const driverSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  licenseNumber: { type: String, unique: true, sparse: true },
  email: { 
    type: String, 
    unique: true, 
    required: true,
    match: [/\S+@\S+\.\S+/, 'Please enter a valid email address'] 
  },
  password: { type: String, required: true },
  address: { type: String },
  currentLocation: {
    type: { type: String, default: 'Point' }, // For GeoJSON
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0]
    }
  },
  vehicleNumber: { type: String, unique: true, sparse: true },
  vehicleType: { type: String },
  isAvailable: { type: Boolean, default: true },
  contactNumber: { type: String },
}, { timestamps: true });

// Add a 2dsphere index on currentLocation for geo queries (proximity-based search)
driverSchema.index({ currentLocation: '2dsphere' });

// Password hashing middleware
driverSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
driverSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Create the model from the schema
const Driver = mongoose.model('Driver', driverSchema);

export default Driver;
