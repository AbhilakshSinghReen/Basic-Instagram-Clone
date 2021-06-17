import React, { useState, useEffect } from "react";

import usePosts from "../../hooks/usePosts";

import Post from "./subComponents/Post";

import { useSelector } from "react-redux";

export default function Timeline() {
  const { authUser, userFromDb } = useSelector((state) => {
    return state.user;
  });

  const posts = usePosts(userFromDb);

  return (
    <div>
      {posts.map((post) => (
        <Post
          key={post.id}
          postId={post.id}
          postData={post.data}
          userFromDb={userFromDb}
        />
      ))}
    </div>
  );
}
