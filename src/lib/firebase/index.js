import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  push,
  child,
  set,
  get,
  onValue,
  remove,
} from "firebase/database";
const firebaseConfig = {
  apiKey: "AIzaSyDp83UP1gaKxBDWLz5lBRAylKWc_wIldIs",
  authDomain: "social-media-17bee.firebaseapp.com",
  databaseURL: "https://social-media-17bee-default-rtdb.firebaseio.com",
  projectId: "social-media-17bee",
  storageBucket: "social-media-17bee.appspot.com",
  messagingSenderId: "388001008570",
  appId: "1:388001008570:web:b70a4ff38c9f9436036b83"
};
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export async function signUp({
  nickName,
  name,
  surName,
  email,
  password,
  bio,
  image,
  gender,
}) {
  if (!bio) {
    bio = "";
  }
  if (!image) {
    image = "";
  }
  const newKey = push(ref(db, "/users")).key;
  await set(ref(db, "/users/" + newKey), {
    nickName,
    name,
    surName,
    email,
    password,
    bio,
    image,
    gender,
  });
}
export async function login({ userName, password }) {
  const snapshot = await get(ref(db, "/users"));
  const users = snapshot.val();
  for (let [key, user] of Object.entries(users)) {
    if (user.nickName == userName && user.password == password) {
      return key;
    }
  }
  return false;
}
export async function post({ likes, content, date, author, imageUrl }) {
  const newKey = push(ref(db, "/posts")).key;
  await set(ref(db, "/posts/" + newKey), {
    content,
    date,
    author,
    imageUrl,
    likes: likes || [],
  });
  const snapshot = await get(ref(db, "/users/" + author + "/posts"));
  if (!snapshot.exists()) {
    await set(ref(db, "/users/" + author + "/posts/"), [newKey]);
  } else {
    const posts = snapshot.val();
    posts.push(newKey);
    await set(ref(db, "/users/" + author + "/posts/"), posts);
  }
}
export async function comment({ content, date, postid, author }) {
  let postExist = (await get(ref(db, "/posts/" + postid))).val()
  if(postExist){
    const newKey = push(ref(db, "/comments")).key;
    await set(ref(db, "/comments/" + newKey), {
      content,
      date,
      postid,
      author,
    });
    const snapshot = await get(ref(db, "/posts/" + postid + "/comments"));
    if (!snapshot.exists()) {
      await set(ref(db, "/posts/" + postid + "/comments"), [newKey]);
    } else {
      const comments = snapshot.val();
      comments.push(newKey);
      await set(ref(db, "/posts/" + postid + "/comments"), comments);
    }
  }
}
export async function likePost(postId, USER) {
  const likes = await getLike(postId);
  if (likes) {
    if (likes.includes(USER)) {
      let arr = likes.filter(e => e !== USER);
      await set(ref(db, "/posts/" + postId + "/likes/"), arr);
    }
    else{
      likes.push(USER)
      await set(ref(db, "/posts/" + postId + "/likes/"), likes);
     
    }
    return true
  }
  else{
    return false
  }

  // if(likes){
  //   await set(ref(db, "/posts/" + postId + "/likes/"), likes);
  // }
}

export async function getLike(postId) {
  let postExist = (await get(ref(db, "/posts/" + postId))).val()
  if(postExist){
    const snapshot = await get(ref(db, "/posts/" + postId + "/likes"));
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      return [];
    }
  }
  else{
    return false
  }
}

export async function getLikes(postId) {
  const snapshot = await get(ref(db, "/posts/" + postId + "/likes/"));
  return snapshot.val();
}
export async function likeComment(commentId) {
  const snapshot = await get(ref(db, "/comments/" + commentId));
  if (!snapshot.exists()) {
    return;
  }
  const comment = snapshot.val();
  if (comment.likes) {
    comment.likes++;
  } else {
    comment.likes = 1;
  }
  await set(ref(db, "/comments/" + commentId + "/likes"), comment.likes);
}
export async function follow(followerId, followingId) {
  const snapshot1 = await get(ref(db, "/users/" + followerId));
  const snapshot2 = await get(ref(db, "/users/" + followingId));
  if (!snapshot1.exists() || !snapshot2.exists()) {
    return;
  }
  const followings = snapshot1.val().followings || [];
  const followers = snapshot2.val().followers || [];
  if (!followings.includes(followingId)) {
    followings.push(followingId);
  }
  if (!followers.includes(followerId)) {
    followers.push(followerId);
  }
  await set(ref(db, "/users/" + followerId + "/followings"), followings);
  await set(ref(db, "/users/" + followingId + "/followers"), followers);
}
export async function unfollow(followerId, followingId) {
  const snapshot1 = await get(ref(db, "/users/" + followerId));
  const snapshot2 = await get(ref(db, "/users/" + followingId));
  if (!snapshot1.exists() || !snapshot2.exists()) {
    return;
  }
  let followings = snapshot1.val().followings || [];
  let followers = snapshot2.val().followers || [];
  followings = followings.filter((el) => el !== followingId);
  followers = followers.filter((el) => el !== followerId);
  await set(ref(db, "/users/" + followerId + "/followings"), followings);
  await set(ref(db, "/users/" + followingId + "/followers"), followers);
}
export async function postsCount(authorId) {
  return (await getPosts(authorId)).length;
}
export async function commentsCount(postId) {
  return (await getComments(postId)).length;
}
export async function editBio({ bio, userId }) {
  await set(ref(db, "/users/" + userId + "/bio"), bio);
}
export async function getProfileInfo(userId) {
  const snapshot = await get(ref(db, "/users/" + userId));
  return snapshot.val();
}

export async function getAllPosts(limit = -1) {
  const snapshot = await get(ref(db, "/posts"));
  if (!snapshot.exists()) {
    return;
  }
  let posts = Object.entries(snapshot.val());

  if (limit > -1) {
    return posts.slice(0, limit);
  }
  return posts;
}

export async function getPosts(authorId, limit = -1) {
  const snapshot = await get(ref(db, "/posts"));
  if (!snapshot.exists()) {
    return;
  }
  let posts = Object.entries(snapshot.val());
  posts = posts.filter(([key, post]) => post.author == authorId);
  if (limit > -1) {
    return posts.slice(0, limit);
  }
  return posts;
}

export async function getPost(postID) {
  if (postID != null || postID != undefined) {
    const snapshot = await get(ref(db, "/posts/" + postID));
    let post = snapshot.val();
    if(post){
      return post;
    }
    else{
      return false
    }
  }
}
export async function getComments(postId, limit = -1) {
  const snapshot = await get(ref(db, "/comments"));
  if(snapshot.val()){
    let comments = Object.entries(snapshot.val());
    comments = comments.filter(([key, comment]) => comment.postid == postId);
    if (limit > -1) {
      return comments.slice(0, limit);
    }
    return comments;
  }
  else{
    return false
  }
}
export async function getUsers() {
  const snapshot = await get(ref(db, "/users"));
  let users = snapshot.val();
  return users;
}
export async function getUser(key) {
  const snapshot = await get(ref(db, `/users/${key}`));
  if (snapshot.val()) {
    let user = snapshot.val();
    return user;
  }
  return false;
}
export async function removePostFireBase(postID,authorId){
  let authorPosts = await getPosts(authorId)
  await remove(ref(db, "/posts/" + postID))
  let newAuthorPosts = authorPosts.filter(post=>{
    if(postID !== post[0]){
      return post[0]
    }
  })
  await set(ref(db, "/users/" + authorId + "/posts/"), [newAuthorPosts]);
}