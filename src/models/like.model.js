import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const likeSchema = mongoose.Schema(
  {
    video: {
      type: Schema.Types.ObjectId,
      ref: "Video",
      default: null,
    },
    comment: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
    likedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

likeSchema.pre("validate", function (next) {
  const hasVideo = this.video != null;
  const hasComment = this.comment != null;

  if (hasVideo === hasComment) {
    return next(
      new Error("A like must target exactly one of: video, comment")
    );
  }

  next();
});

likeSchema.index(
  { video: 1, likedBy: 1 },
  { unique: true, partialFilterExpression: { video: { $exists: true, $ne: null } } }
);

likeSchema.index(
  { comment: 1, likedBy: 1 },
  { unique: true, partialFilterExpression: { comment: { $exists: true, $ne: null } } }
);

likeSchema.index({ likedBy: 1, createdAt: -1 });

likeSchema.plugin(mongooseAggregatePaginate);

export const Like = mongoose.model("Like", likeSchema);
