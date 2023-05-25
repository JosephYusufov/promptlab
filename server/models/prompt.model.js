import mongoose from "mongoose";
const PromptSchema = new mongoose.Schema({
  content: {
    type: String,
    trim: false,
    required: "A prompt is required.",
  },
  updated: Date,
  created: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Prompt", PromptSchema);
