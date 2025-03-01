import { NewPost } from "@/db/schema";

export const createPost = (post: NewPost) => {
  return fetch("/api/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(post),
  }).then((res) => res.json());
};

export const getPosts = () => {
  return fetch("/api/posts").then((res) => res.json());
};
