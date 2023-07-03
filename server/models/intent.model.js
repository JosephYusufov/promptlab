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
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: "A project is required.",
  },
  version: {
    type: Number,
    default: 0,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  // prompts: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "Prompt",
  //   },
  // ],
});

//Foreign key reference to prompts associated with intent ID
IntentSchema.virtual("prompts", {
  ref: "Prompt",
  localField: "_id",
  foreignField: "intent",
});

IntentSchema.set("toObject", { virtuals: true }); //retrieve foreign key objects when transforming to object
IntentSchema.set("toJSON", { virtuals: true }); //retrieve foreign key objects when transforming to JSON

export default mongoose.model("Intent", IntentSchema);
