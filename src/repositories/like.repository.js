import { Like } from "../models/like.model.js";
import mongoose from "mongoose";

const findLike = async (filter) => {
  return await Like.findOne(filter);
};

const createLike = async (likeData) => {
  return await Like.create(likeData);
};

const deleteLike = async (filter) => {
  return await Like.deleteOne(filter);
};

const countLikes = async (filter) => {
  return await Like.countDocuments(filter);
};

const getLikedVideos = async (userId, { page = 1, limit = 10 } = {}) => {
  const pipeline = [
    {
      $match: {
        likedBy: new mongoose.Types.ObjectId(userId),
        video: { $ne: null },
      },
    },
    {
      $sort: { createdAt: -1 },
    },
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "video",
        pipeline: [
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
        ],
      },
    },
    {
      $addFields: {
        video: { $first: "$video" },
      },
    },
    // Exclude likes whose video was deleted
    {
      $match: {
        video: { $ne: null },
      },
    },
    // Exclude unpublished videos unless owned by the requester
    {
      $match: {
        $or: [
          { "video.isPublished": true },
          { "video.owner._id": new mongoose.Types.ObjectId(userId) },
        ],
      },
    },
    {
      $project: {
        _id: 1,
        likedAt: "$createdAt",
        video: 1,
      },
    },
  ];

  return await Like.aggregatePaginate(Like.aggregate(pipeline), {
    page: Number(page) || 1,
    limit: Number(limit) || 10,
  });
};

export { 
    findLike,
    createLike,
    deleteLike,
    countLikes,
    getLikedVideos
};
