import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  toggleVideoLike as toggleVideoLikeService,
  toggleCommentLike as toggleCommentLikeService,
  getLikedVideosList as getLikedVideosService,
} from "../services/like.service.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const result = await toggleVideoLikeService(videoId, req.user._id);

  const message = result.liked
    ? "Video liked successfully"
    : "Video unliked successfully";

  return res.status(200).json(new ApiResponse(200, result, message));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  const result = await toggleCommentLikeService(commentId, req.user._id);

  const message = result.liked
    ? "Comment liked successfully"
    : "Comment unliked successfully";

  return res.status(200).json(new ApiResponse(200, result, message));
});

const getLikedVideos = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;

  const likedVideos = await getLikedVideosService(req.user._id, {
    page,
    limit,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, likedVideos, "Liked videos fetched successfully")
    );
});

export {
  toggleVideoLike,
  toggleCommentLike,
  getLikedVideos,
};
