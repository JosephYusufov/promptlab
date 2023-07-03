import mongoose from "mongoose";
import Intent from "./intent.model.js";
import dbErrorHandler from "../helpers/dbErrorHandler.js";
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
  generation: {
    type: Number,
    required: "A generation is required",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  intent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Intent",
    required: "An intent is required",
  },
});

//Validate
PromptSchema.pre("validate", async function (next) {
  console.log("middleware");
  // console.log("this");
  console.log(this);
  let intentId = this.intent;
  // console.log("intentId ");
  // console.log(intentId);
  try {
    let intent = await Intent.findById(intentId); //make sure intent exists
    this.generation = intent.version + 1; //increment version because of new prompt
    intent.version += 1;
    await intent.save();
    console.log(this);
    next();
  } catch (err) {
    console.log(dbErrorHandler.getErrorMessage(err));
  }
  // next();
});

export default mongoose.model("Prompt", PromptSchema);
