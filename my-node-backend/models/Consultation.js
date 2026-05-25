import mongoose from 'mongoose';

const consultationSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  country: { type: String },
  investmentGoal: { type: String, required: true },
  budgetRange: { type: String, required: true },
  interestedAreas: [{ type: String }],
  propertyType: { type: String },
  preferredDate: { type: String },
  preferredTime: { type: String },
  consultationType: { type: String, required: true },
  additionalMessage: { type: String },
  status: { 
    type: String, 
    enum: ['New Lead', 'Contacted', 'Consultation Scheduled', 'Deal Closed'],
    default: 'New Lead'
  },
  createdAt: { type: Date, default: Date.now }
});

const Consultation = mongoose.model('Consultation', consultationSchema);

export default Consultation;
