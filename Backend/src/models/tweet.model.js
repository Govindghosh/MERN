import mongoose, { Schema } from "mongoose";

const tweetSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
    },
    tweetOwner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Tweet = mongoose.model("Tweet", tweetSchema);
