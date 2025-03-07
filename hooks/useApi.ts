import { GetPostsResponse } from "@/app/api/posts+api";
import { GetProfileResponse } from "@/app/api/profiles/[userId]+api";
import { GetUserStatsResponse } from "@/app/api/profiles/[userId]/stats+api";
import { useAuth } from "@clerk/clerk-expo";
import { GetToken } from "@clerk/types";
import { GetNotificationsResponse } from "@/app/api/notifications+api";
import { Profile } from "@/db/schema";

async function authenticatedFetch<T>(
  getToken: GetToken,
  url: string,
  options: RequestInit = {}
) {
  const token = await getToken();

  if (!token) {
    throw new Error(
      "Tried to run an authenticated fetch without token yet being set"
    );
  }
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch");
  }

  if (response.status === 204) {
    return undefined as T;
  } else {
    return response.json() as Promise<T>;
  }
}

export function useApi() {
  const { getToken } = useAuth();

  return {
    files: {
      createPresignedUrl: () =>
        authenticatedFetch<{
          url: string;
          fields: Record<string, string>;
        }>(getToken, "/api/presigned-url", {
          method: "POST",
        }),
    },
    posts: {
      get: () => authenticatedFetch<GetPostsResponse>(getToken, "/api/posts"),
      create: (post: { content: string; imageKey?: string }) =>
        authenticatedFetch(getToken, "/api/posts", {
          method: "POST",
          body: JSON.stringify(post),
        }),
      toggleLike: (postId: number) =>
        authenticatedFetch<{ liked: boolean }>(
          getToken,
          `/api/posts/${postId}/like`,
          {
            method: "POST",
          }
        ),
      delete: (postId: number) =>
        authenticatedFetch(getToken, `/api/posts/${postId}`, {
          method: "DELETE",
        }),
    },
    profiles: {
      get: (userId: string) =>
        authenticatedFetch<GetProfileResponse>(
          getToken,
          `/api/profiles/${userId}`
        ),
      getPosts: (userId: string) =>
        authenticatedFetch<GetPostsResponse>(
          getToken,
          `/api/profiles/${userId}/posts`
        ),
      getFollowStatus: (userId: string) =>
        authenticatedFetch<{ following: boolean }>(
          getToken,
          `/api/profiles/${userId}/follow`
        ),
      toggleFollow: (userId: string) =>
        authenticatedFetch<{ following: boolean }>(
          getToken,
          `/api/profiles/${userId}/follow`,
          {
            method: "POST",
          }
        ),
      getStats: (userId: string) =>
        authenticatedFetch<GetUserStatsResponse>(
          getToken,
          `/api/profiles/${userId}/stats`
        ),
    },
    notifications: {
      get: () =>
        authenticatedFetch<GetNotificationsResponse>(
          getToken,
          "/api/notifications"
        ),
    },
    userProfile: {
      get: () => authenticatedFetch<Profile>(getToken, "/api/userProfile"),
      update: (profile: { displayName: string }) =>
        authenticatedFetch<Profile>(getToken, "/api/userProfile", {
          method: "PUT",
          body: JSON.stringify(profile),
        }),
    },
  };
}
