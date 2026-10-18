import { Comment } from "../models/comment.model.js";
import mongoose from "mongoose";

const createComment = async (commentData) => {
  return await Comment.create(commentData);
};

const findCommentById = async (commentId) => {
  if (!mongoose.isValidObjectId(commentId)) return null;
  return await Comment.findById(commentId);
};

const getVideoComments = async (videoId, { page = 1, limit = 10 } = {}) => {
  const pipeline = [
    {
      $match: {
        video: new mongoose.Types.ObjectId(videoId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {
              username: 1,
              fullName: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        owner: { $first: "$owner" },
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
  ];

  return await Comment.aggregatePaginate(Comment.aggregate(pipeline), {
    page: Number(page) || 1,
    limit: Number(limit) || 10,
  });
};

const updateCommentById = async (commentId, content) => {
  if (!mongoose.isValidObjectId(commentId)) return null;
  return await Comment.findByIdAndUpdate(
    commentId,
    { $set: { content } },
    { new: true }
  );
};

const deleteCommentById = async (commentId) => {
  if (!mongoose.isValidObjectId(commentId)) return null;
  return await Comment.findByIdAndDelete(commentId);
};

export {
  createComment,
  findCommentById,
  getVideoComments,
  updateCommentById,
  deleteCommentById,
};
