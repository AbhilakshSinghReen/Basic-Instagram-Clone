import { auth, db } from "./firebase";

import Firebase from "firebase/app";

export async function doesUsernameAlreadyExist(username) {
  const result = await db
    .collection("users")
    .where("username", "==", username)
    .get();

  return result.docs.length > 0;
}

export async function getUserById(userId) {
  const result = await db
    .collection("users")
    .where("userId", "==", userId)
    .get();

  // right here if the docs array comes back with more than 1 user, it indicates that you have a problem

  let userData = result.docs[0].data();
  userData["docId"] = result.docs[0].id;
  return userData;
}

export async function getUserByUsername(username) {
  //console.log(username);

  const result = await db
    .collection("users")
    .where("username", "==", username)
    .get();

  // right here if the docs array comes back with more than 1 user, it indicates that you have a problem

  //console.log("docs");
  //console.log(result.docs.length);
  let userData = result.docs[0].data();
  userData["docId"] = result.docs[0].id;
  return userData;
  //return "";
}

export async function getPostsOfUser(username) {
  const result = await db
    .collection("posts")
    .where("username", "==", username)
    .get();

  let userPosts = [];
  result.docs.map((doc) => {
    userPosts.push({
      id: doc.id,
      data: doc.data(),
    });
  });

  return userPosts;
}

export async function getTimelinePosts(following) {
  const result = await db
    .collection("posts")
    .where("username", "in", following)
    .get();

  const timelinePosts = result.docs.map((post) => ({
    id: post.id,
    data: post.data(),
  }));

  return timelinePosts;
}

export async function getSuggestedProfiles(username, following) {
  let query = db.collection("users");

  if (following.length > 0) {
    query = query.where("username", "not-in", [...following, username]);
  } else {
    query = query.where("username", "!=", username);
  }
  const result = await query.limit(10).get();

  const profiles = result.docs.map((doc) => ({
    id: doc.id,
    data: doc.data(),
  }));

  return profiles;
}

export async function updateFollowingOfCurrentUser(
  currentUserDocId,
  targetUserUsername,
  isFollowing
) {
  /*
  JUST TO AVOID ANY DOUBTS
  Current user is following target user
  if (isFollowing is true)
    target user should be in the "following" array of the current user
    current user should be in the "followers" array of the target user
  */
  return db
    .collection("users")
    .doc(currentUserDocId)
    .update({
      following: isFollowing
        ? Firebase.firestore.FieldValue.arrayUnion(targetUserUsername)
        : Firebase.firestore.FieldValue.arrayRemove(targetUserUsername),
    });
}

export async function updateFollowersOfTargetUser(
  targetUserDocId,
  currentUserUsername,
  isFollowing
) {
  return db
    .collection("users")
    .doc(targetUserDocId)
    .update({
      followers: isFollowing
        ? Firebase.firestore.FieldValue.arrayUnion(currentUserUsername)
        : Firebase.firestore.FieldValue.arrayRemove(currentUserUsername),
    });
}

export async function handleToggleFollow(
  currentUserDocId,
  currentUserUsername,
  targetUserDocId,
  targetUserUsername,
  isFollowing
) {
  await updateFollowingOfCurrentUser(
    currentUserDocId,
    targetUserUsername,
    isFollowing
  );

  await updateFollowersOfTargetUser(
    targetUserDocId,
    currentUserUsername,
    isFollowing
  );
}

export async function updateUserDp(userDocId, newDpURL) {
  return db.collection("users").doc(userDocId).update({
    dpURL: newDpURL,
  });
}

export async function getUserDpUrlFromUsername(username) {
  const result = await db
    .collection("users")
    .where("username", "==", username)
    .get();

  return result.docs[0].data().dpURL;
}



export async function userLikePost(postDocId, username, hasLiked) {
  return db
    .collection("posts")
    .doc(postDocId)
    .update({
      likes: hasLiked
        ? Firebase.firestore.FieldValue.arrayUnion(username)
        : Firebase.firestore.FieldValue.arrayRemove(username),
    });
}
