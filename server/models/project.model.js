import mongoose from "mongoose";
const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: false,
    required: "A name is required.",
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  admins: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  // intents: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "User",
  //   },
  // ],
  updated: Date,
  created: {
    type: Date,
    default: Date.now,
  },
});

ProjectSchema.virtual("intents", {
  ref: "Intent",
  localField: "_id",
  foreignField: "project",
});
// ProjectSchema.virtual("members", {
//   ref: "User",
//   // localField: "_id",
//   // foreignField: "intent",
// });
// IntentSchema.virtual("admins", {
//   ref: "Prompt",
//   localField: "_id",
//   foreignField: "intent",
// });

ProjectSchema.set("toObject", { virtuals: true });
ProjectSchema.set("toJSON", { virtuals: true });

export default mongoose.model("Project", ProjectSchema);
