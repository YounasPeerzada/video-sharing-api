import { ApiError } from "../utils/ApiError.js";
import {
  findVideoById,
} from "../repositories/video.repository.js";
import {
  createComment,
  findCommentById,
  getVideoComments as getVideoCommentsRepo,
  updateCommentById,
  deleteCommentById,
} from "../repositories/comment.repository.js";

const assertVideoAccessible = async (videoId, requesterId) => {
  const video = await findVideoById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  if (!video.isPublished) {
    const isOwner =
      requesterId && video.owner.toString() === requesterId.toString();
    if (!isOwner) {
      throw new ApiError(404, "Video not found");
    }
  }

  return video;
};

const getVideoCommentsList = async (videoId, requesterId, { page, limit } = {}) => {
  await assertVideoAccessible(videoId, requesterId);

  return await getVideoCommentsRepo(videoId, { page, limit });
};

const addComment = async ({ videoId, content, ownerId }) => {
  if (!content?.trim()) {
    throw new ApiError(400, "Comment content is required");
  }

  await assertVideoAccessible(videoId, ownerId);

  const comment = await createComment({
    content: content.trim(),
    video: videoId,
    owner: ownerId,
  });

  if (!comment) {
    throw new ApiError(500, "Failed to add comment");
  }

  return comment;
};

const updateComment = async ({ commentId, content, ownerId }) => {
  if (!content?.trim()) {
    throw new ApiError(400, "Comment content is required");
  }

  const comment = await findCommentById(commentId);

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  if (comment.owner.toString() !== ownerId.toString()) {
    throw new ApiError(403, "You are not allowed to update this comment");
  }

  const updatedComment = await updateCommentById(commentId, content.trim());

  if (!updatedComment) {
    throw new ApiError(500, "Failed to update comment");
  }

  return updatedComment;
};

const deleteComment = async (commentId, ownerId) => {
  const comment = await findCommentById(commentId);

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  if (comment.owner.toString() !== ownerId.toString()) {
    throw new ApiError(403, "You are not allowed to delete this comment");
  }

  const deletedComment = await deleteCommentById(commentId);

  if (!deletedComment) {
    throw new ApiError(500, "Failed to delete comment");
  }

  return deletedComment;
};

export {
  getVideoCommentsList,
  addComment,
  updateComment,
  deleteComment,
};
