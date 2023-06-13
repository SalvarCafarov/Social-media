import {
  follow,
  getAllPosts,
  getComments,
  getLike,
  getLikes,
  getPost,
  getPosts,
  getUser,
  getUsers,
  likePost,
  removeLike,
  removePostFireBase,
  setLike,
  unfollow,
} from "@/lib/firebase";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./postPage.module.scss";
import { Box, CircularProgress } from "@mui/material";
import { useRouter } from "next/router";
import Comments from "@/components/comments/comments";
import AddComment from "@/components/addComment/addComment";
import Navbar from "@/components/navbar/navbar";
import { AiOutlineHeart } from "react-icons/fa";
import { FaHeart, FaHeartBroken } from "react-icons/fa";
import Background from "@/components/bacground/background";
export default function Post() {
  let path = usePathname();
  let newKey;
  let post;
  const [postSt, setPostSt] = useState();
  const [autName, setAutName] = useState();
  const [userSelf, setUserSelf] = useState(false);
  const [key, setKey] = useState("");
  var [prof, setProf] = useState(false);
  var [checkUser, setCheckUser] = useState(false);
  let router = useRouter();
  try {
    var USER = window.localStorage.getItem("USER");
  } catch (error) {}

  let profile;
  const getData = async () => {
    async function getAllUsers() {
      let allUsers = await getUsers();
      if (allUsers) {
        var result = Object.keys(allUsers).includes(USER);
        
      }
      if (!result) {
        localStorage.removeItem("USER");
        router.push("/login");
      }
    }
    if (USER) {
      getAllUsers();
      profile = await getUser(USER);
      if (profile) {
        setCheckUser(true);
        setProf(profile);
      }
    } else {
      setCheckUser(false);
      setProf(false);
      router.push("/login");
    }
  };

  useEffect(() => {
    getData();
    checkUser();
    if (path !== null) {
      newKey = path.split("/")[2];
      getNowPost(newKey);
      setKey(newKey);

      getComments(key);
    }
    async function getNowPost(key) {
      post = await getPost(key);
      if (post) {
        setPostSt(post);
        let user = await getUser(post.author);
        setAutName(user);
      }
      else{
        router.push('/home')
      }
    }

    async function checkUser() {
      if (USER) {
        if (postSt) {
          if (USER == postSt.author) {
            setUserSelf(true);
          } else {
            setUserSelf(false);
          }
        }
      } else {
        router.push("/login");
      }
    }

    

  }, [path]);

  useEffect(() => {
    async function checkUser() {
      if (USER) {
        if (postSt) {
          if (USER == postSt.author) {
            // window.localStorage.removeItem("USER")
            setUserSelf(true);
          } else {
            setUserSelf(false);
          }
        }
      } else {
        router.push("/login");
      }
    }
    checkUser();
  }, [postSt]);

  //commentBtn
  const [commentInput, setCommentInput] = useState("");
  function commentInputOnChange(e) {
    setCommentInput(e.target.value);
  }








  //profile routing
  function routeMyProfile() {
    router.push(`/user/${autName?.nickName}`);
  }
  const [followerBtn, setFollowerBtn] = useState(false);
  async function followUser(userKey) {
    if (followerBtn) {
      follow(USER, userKey);
      setFollowerBtn(false);
    } else {
      unfollow(USER, userKey);
      setFollowerBtn(true);
    }
  }
  useEffect(() => {
    async function getFollowerInfo() {
      let followerInfo = await getUser(postSt?.author);
      if (followerInfo?.followers?.includes(USER)) {
        setFollowerBtn(false);
      } else {
        setFollowerBtn(true);
      }
    }
    getFollowerInfo();
  }, [postSt]);

  const [refresh, setRefresh] = useState(true);
  function refreshComment() {
    if (refresh) {
      setRefresh(false);
    } else {
      setRefresh(true);
    }
  }
//likes
const [likes,setLikes] = useState([])
const [likeCount,setLikeCount] = useState(0)
const [checkLike, setCheckLike] = useState(false);
let mylikes = []
async function likeBtn() {
  if (!checkLike) {
        likePost(key, USER);
        console.log('s')
         setLikeCount(prevCount => prevCount + 1)
         setCheckLike(true)
         if(likes.length){
             mylikes = likes
         }
         mylikes.push(USER)
         setLikes(mylikes)

  }
  else {
      likePost(key, USER);
      setLikeCount(prevCount => prevCount - 1)
      setCheckLike(false)
        if(likes.length){
          mylikes = likes
        }
        mylikes?.splice(mylikes?.indexOf(USER),1)
        setLikes(mylikes)
   
    }
}
useEffect(() => {
  async function checkFirstLike() {
    let  x = await getLike(key);
    console.log(x)
    setLikes(x)
    setLikeCount(x.length)
   if(x.length){
    if (x.includes(USER)) {
      console.log('varr ')
      setCheckLike(true);
    } else {
      setCheckLike(false);
    }
   }
   
  }
  checkFirstLike();
}, [key]);
async function removePost() {
  await removePostFireBase(key,postSt.author)
  router.push('/myprofile')
}
  return (
    <>
    <Background/>
      {postSt && checkUser ? (
        <div className={styles.container}>
          <Navbar />

          <div className={styles.postPage}>
            <div className={styles.left}>
              <img src={postSt.imageUrl} alt="gelirem" />
            </div>
            <div className={styles.right}>
              <div className={styles.myProfInfo}>
                <div className={styles.authorImg} onClick={routeMyProfile}>
                  <img
                    src={
                      autName
                        ? autName.image
                        : "data:image/jpeg;base64,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"
                    }
                  />{" "}
                </div>
                <div className={styles.authorName} onClick={routeMyProfile}>
                  {autName?.nickName}
                </div>
                {userSelf ? (
                  <div onClick={removePost} className={styles.trashBtn}>
                    <button>trash</button>
                  </div>
                ) : (
                  <div className={styles.followBtn}>
                    <button
                      onClick={() => {
                        followUser(postSt.author);
                      }}
                    >
                      {followerBtn ? "Follow +" : "Unfollow -"}
                    </button>
                  </div>
                )}
              </div>
              <hr />

              <Comments postId={key} refresh={refresh} />
                <div className={styles.content}>{postSt.content}</div>
              <div className={styles.partLike}>
                <div className={styles.btns}>
                  {!checkLike ? (
                    <FaHeartBroken onClick={likeBtn} className="icon" />
                  ) : (
                    <FaHeart onClick={likeBtn} className="icon" />
                  )}
                </div>
                <div className={styles.counter}>
                  {likeCount}
                </div>
              </div>
              <div className={styles.date}>{} </div>
              <div className={styles.addComment}>
                <input
                  type="text"
                  onChange={commentInputOnChange}
                  value={commentInput}
                  placeholder="Add Comment..."
                maxLength={"40"}
                />
                <div
                  className={styles.addBtn}
                  onClick={() => {
                    setCommentInput("");
                  }}
                >
                  <AddComment
                    commentInput={commentInput ? commentInput : ""}
                    author={postSt ? postSt.author : ""}
                    postId={key ? key : ""}
                    refreshComment={refreshComment}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100vh",
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </>
  );
}
