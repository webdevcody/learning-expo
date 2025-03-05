import { GetPostsResponse } from "@/app/api/posts+api";
import { GetProfileResponse } from "@/app/api/profiles/[userId]+api";
import { GetUserStatsResponse } from "@/app/api/profiles/[userId]/stats+api";
import { useAuth } from "@clerk/clerk-expo";
import { GetToken } from "@clerk/types";

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
  return response.json() as Promise<T>;
}

export function useApi() {
  const { getToken } = useAuth();

  return {
    posts: {
      get: () => authenticatedFetch<GetPostsResponse>(getToken, "/api/posts"),
      create: (post: { content: string }) =>
        authenticatedFetch(getToken, "/api/posts", {
          method: "POST",
          body: JSON.stringify(post),
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
    userProfile: {
      get: () => authenticatedFetch(getToken, "/api/userProfile"),
    },
  };
}
