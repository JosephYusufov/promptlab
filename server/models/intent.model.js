import mongoose from "mongoose";
const IntentSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: false,
    required: "A name is required.",
  },
  model: {
    type: String,
    trim: true,
    required: "A model is required.",
  },
  prompts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Prompt",
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  updated: Date,
  created: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Intent", IntentSchema);
