import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastMessageAt: {
    type: Date,
    default: Date.now
  },
  name: {
    type: String,
    required: false
  },
  isGroup: {
    type: Boolean,
    required: false
  },
  messagesIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  }],
  userIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, { timestamps: true });

const Conversation = mongoose.models?.Conversation || mongoose.model("Conversation", conversationSchema);

export default Conversation;

