import { useState, useEffect } from "react";
import { getTimelinePosts } from "../firebase/firebaseServices";

export default function usePosts(user) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    let isComponentMounted = true;
    async function getPosts() {
      if (user?.following?.length > 0) {
        const followedUserPosts = await getTimelinePosts(user.following);

        // re-arrange array to be newest photos first by dateCreated
        followedUserPosts.sort((a, b) => b.dateCreated - a.dateCreated);
        if (isComponentMounted) {
          setPosts(followedUserPosts);
        }
      }
    }

    getPosts();

    return () => {
      isComponentMounted = false;
    };
  }, [user?.username, user?.following]);

  return posts;
}
