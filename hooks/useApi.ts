import { GetPostsResponse } from "@/app/api/posts+api";
import { GetProfileResponse } from "@/app/api/profiles/[userId]+api";
import { NewPost } from "@/db/schema";
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
    },
    userProfile: {
      get: () => authenticatedFetch(getToken, "/api/userProfile"),
    },
  };
}
