import mongoose from "mongoose";
import crypto from "crypto";
import Stripe from "stripe";

const stripe = new Stripe(
  "sk_test_51NMtbwHSOMSiIegDG6ASNuLydA3BcIX4V1S2yUUdFSEHBfvKJw1HNdmbsqdbjJRM9bQSg3VAxuphjEuk5gqf517Y00LYx8turx"
);

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: "Name is required",
  },
  username: {
    type: String,
    trim: false,
    unique: true,
    required: "Username is required",
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    // unique: "Email already exists",
    match: [/.+\@.+\..+/, "Please fill a valid email address"],
    required: "Email is required",
  },
  hashed_password: {
    type: String,
    required: "Password is required",
  },
  salt: String,
  updated: Date,
  created: {
    type: Date,
    default: Date.now,
  },
  stripe_customer_id: {
    type: String,
  },
  is_pro: {
    type: Boolean,
    default: false,
  },
  prompts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Prompt",
    },
  ],
});

UserSchema.virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

UserSchema.path("hashed_password").validate(function (v) {
  if (this._password && this._password.length < 6) {
    this.invalidate("password", "Password must be at least 6 characters.");
  }
  if (this.isNew && !this._password) {
    this.invalidate("password", "Password is required");
  }
}, null);

UserSchema.methods = {
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },
  encryptPassword: function (password) {
    if (!password) return "";
    try {
      return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },
  makeSalt: function () {
    return Math.round(new Date().valueOf() * Math.random()) + "";
  },
};

// Create stripe customer and save their customer_id
UserSchema.pre("save", async function (next) {
  if (!this.stripe_customer_id)
    try {
      const customer = await stripe.customers.create({
        email: this.email,
      });
      this.stripe_customer_id = customer.id;
      next();
    } catch (err) {
      console.log(dbErrorHandler.getErrorMessage(err));
    }
});

export default mongoose.model("User", UserSchema);
