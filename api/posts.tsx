export type Post = {
  id: string;
  content: string;
  createdAt: Date;
};

const posts: Post[] = [];

export const createPost = (post: Post) => {
  posts.push(post);
};

export const getPosts = () => {
  return posts;
};
