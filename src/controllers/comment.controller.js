import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  getVideoCommentsList as getVideoCommentsService,
  addComment as addCommentService,
  updateComment as updateCommentService,
  deleteComment as deleteCommentService,
} from "../services/comment.service.js";

const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { page, limit } = req.query;

  const comments = await getVideoCommentsService(videoId, req.user?._id, {
    page,
    limit,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, comments, "Comments fetched successfully"));
});

const addComment = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { content } = req.body;

  if (!content?.trim()) {
    throw new ApiError(400, "Comment content is required");
  }

  const comment = await addCommentService({
    videoId,
    content,
    ownerId: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, comment, "Comment added successfully"));
});

const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;

  if (!content?.trim()) {
    throw new ApiError(400, "Comment content is required");
  }

  const comment = await updateCommentService({
    commentId,
    content,
    ownerId: req.user._id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment updated successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  await deleteCommentService(commentId, req.user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Comment deleted successfully"));
});

export {
  getVideoComments,
  addComment,
  updateComment,
  deleteComment,
};
