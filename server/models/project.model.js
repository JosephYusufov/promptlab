import mongoose from "mongoose";
import User from "./user.model.js";

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

ProjectSchema.virtual("contexts", {
  ref: "Context",
  localField: "_id",
  foreignField: "project",
});

ProjectSchema.methods.isPro = async function () {
  console.log(this.owner);
  let owner = await User.findById(this.owner);
  console.log(owner.is_pro);
  return owner.is_pro;
};

ProjectSchema.methods.getOwnerUsername = async function () {
  console.log(this.owner);
  let owner = await User.findById(this.owner);
  console.log(owner.is_pro);
  return owner.username;
};

ProjectSchema.set("toObject", { virtuals: true });
ProjectSchema.set("toJSON", { virtuals: true });

export default mongoose.model("Project", ProjectSchema);
