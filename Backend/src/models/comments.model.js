import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const commentsSchema = new Schema(
  {
    comment: {
      type: String,
      required: true,
    },
    videoToComment: {
      type: Schema.Types.ObjectId,
      ref: "Video",
    },
    ownerOfComment: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);
commentsSchema.plugin(mongooseAggregatePaginate);

export const Comments = mongoose.model("Comments", commentsSchema);
