import mongoose from "mongoose";
const PromptSchema = new mongoose.Schema({
  text: {
    type: String,
    trim: false,
    required: "A prompt is required.",
  },
  updated: Date,
  created: {
    type: Date,
    default: Date.now,
  },
  model: {
    type: String,
    trim: true,
    required: "A model is required.",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  intent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Intent",
  },
});

export default mongoose.model("Prompt", PromptSchema);
