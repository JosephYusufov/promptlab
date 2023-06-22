import mongoose from "mongoose";
const ContextSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: false,
    required: "A name is required.",
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: "A project is required.",
  },
  data: {
    type: String,
    trim: false,
    required: "Data is required.",
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
});

ContextSchema.pre("validate", async function (next) {
  //   console.log("middleware");
  // console.log("this");
  console.log(this);
  //   let intentId = this.intent;
  // console.log("intentId ");
  // console.log(intentId);
  try {
    this.version = this.version + 1;
    // let intent = await Intent.findById(intentId);
    // this.generation = intent.version + 1;
    // intent.version += 1;
    // await intent.save();
    // console.log(this);
    next();
  } catch (err) {
    console.log(dbErrorHandler.getErrorMessage(err));
  }
  // next();
});

export default mongoose.model("Context", ContextSchema);
