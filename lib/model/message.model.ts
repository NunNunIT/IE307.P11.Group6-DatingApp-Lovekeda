import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  body: {
    type: String,
    required: false
  },
  image: {
    type: String,
    required: false
  },
  audio: {
    type: String,
    required: false
  },
  seenIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

const Message = mongoose.models?.Message || mongoose.model("Message", messageSchema);
export default Message;