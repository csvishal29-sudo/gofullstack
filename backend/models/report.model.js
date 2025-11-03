import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
    issueType: {
        type: String,
        required: true,
        enum: ['Garbage', 'Water Leakage', 'Street Light', 'Road Damage', 'Other']
    },
    comment: {
        type: String,
        required: true
    },

    city: {
        type: String
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Completed'],
        default: 'Pending'
    },
    reportDate: {
        type: Date,
        default: Date.now
    },
    photo: {
    type: String, 
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

const Report = mongoose.model('Report', reportSchema);

export default Report;