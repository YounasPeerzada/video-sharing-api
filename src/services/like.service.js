import { ApiError } from "../utils/ApiError.js";
import {
  findVideoById,
} from "../repositories/video.repository.js";
import {
  findCommentById,
} from "../repositories/comment.repository.js";
import {
  findLike,
  createLike,
  deleteLike,
  countLikes,
  getLikedVideos as getLikedVideosRepo,
} from "../repositories/like.repository.js";

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

const toggleVideoLike = async (videoId, userId) => {
  await assertVideoAccessible(videoId, userId);

  const existingLike = await findLike({ video: videoId, likedBy: userId });

  if (existingLike) {
    await deleteLike({ video: videoId, likedBy: userId });
    const likeCount = await countLikes({ video: videoId });

    return {
      targetType: "video",
      targetId: videoId,
      liked: false,
      likeCount,
    };
  }

  try {
    await createLike({ video: videoId, likedBy: userId });
  } catch (error) {
    // Handle E11000 duplicate key error from concurrent toggle
    if (error.code === 11000) {
      // Another request created the like concurrently — remove it instead
      await deleteLike({ video: videoId, likedBy: userId });
      const likeCount = await countLikes({ video: videoId });

      return {
        targetType: "video",
        targetId: videoId,
        liked: false,
        likeCount,
      };
    }
    throw new ApiError(500, "Failed to toggle video like");
  }

  const likeCount = await countLikes({ video: videoId });

  return {
    targetType: "video",
    targetId: videoId,
    liked: true,
    likeCount,
  };
};

const toggleCommentLike = async (commentId, userId) => {
  const comment = await findCommentById(commentId);

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  // The parent video must be accessible under the same visibility policy
  await assertVideoAccessible(comment.video, userId);

  const existingLike = await findLike({ comment: commentId, likedBy: userId });

  if (existingLike) {
    await deleteLike({ comment: commentId, likedBy: userId });
    const likeCount = await countLikes({ comment: commentId });

    return {
      targetType: "comment",
      targetId: commentId,
      liked: false,
      likeCount,
    };
  }

  try {
    await createLike({ comment: commentId, likedBy: userId });
  } catch (error) {
    // Handle E11000 duplicate key error from concurrent toggle
    if (error.code === 11000) {
      await deleteLike({ comment: commentId, likedBy: userId });
      const likeCount = await countLikes({ comment: commentId });

      return {
        targetType: "comment",
        targetId: commentId,
        liked: false,
        likeCount,
      };
    }
    throw new ApiError(500, "Failed to toggle comment like");
  }

  const likeCount = await countLikes({ comment: commentId });

  return {
    targetType: "comment",
    targetId: commentId,
    liked: true,
    likeCount,
  };
};

const getLikedVideosList = async (userId, { page, limit } = {}) => {
  return await getLikedVideosRepo(userId, { page, limit });
};

export {
  toggleVideoLike,
  toggleCommentLike,
  getLikedVideosList,
};
