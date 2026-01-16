import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['freelancer', 'client'], required: true },
    profileImage: String,
    bio: String,
    skills: [String],
    hourlyRate: Number,
    rating: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 },
    stripeAccountId: String,
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
