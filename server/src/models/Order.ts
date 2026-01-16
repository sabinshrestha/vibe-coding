import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
    freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: String,
    price: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed', 'cancelled'],
      default: 'pending',
    },
    deliveryDate: Date,
    paymentId: String,
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    review: {
      rating: Number,
      comment: String,
      createdAt: Date,
    },
    requirements: String,
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);
