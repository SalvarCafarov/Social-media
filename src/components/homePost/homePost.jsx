import { getLike, getPost, getUser, likePost } from "@/lib/firebase";
import { useEffect, useState } from "react";
import Comments from "../comments/comments";
import { FaHeart, FaHeartBroken } from "react-icons/fa";
import AddComment from "../addComment/addComment";
import { useRouter } from "next/router";
import styles from "./homePost.module.scss";
export default function HomePost({ postKey }) {
  try {
    var USER = window.localStorage.getItem("USER");
  } catch (error) {}
  const [post, setPost] = useState("");
  useEffect(() => {
    handleGetPost();
  }, []);
  let router = useRouter();
  async function handleGetPost() {
    let postHandle = await getPost(postKey);
    setPost(postHandle);
    handleGetUser(postHandle);

  }
  //User getirilmesi
  const [author, setAuthor] = useState([]);
  async function handleGetUser(postHandle) {
    let authorInfo = await getUser(postHandle.author);
    setAuthor(authorInfo);
  } //click edende profile getmesi
  function routeMyProfile() {
    router.push(`/user/${author.nickName}`);
  } //commentin refresh olunmasi
  const [refresh, setRefresh] = useState(true);
  function refreshComment() {
    if (refresh) {
      setRefresh(false);
    } else {
      setRefresh(true);
    }
  } //like
  const [likes,setLikes] = useState([])
  const [likeCount,setLikeCount] = useState(0)
  const [checkLike, setCheckLike] = useState(false);
  let mylikes = []
  async function handleLike() {
    if (!checkLike) {
          likePost(postKey, USER);
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
        likePost(postKey, USER);
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
      let  x = await getLike(postKey);
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
  }, [postKey]);
  // const [checkLike, setCheckLike] = useState(false);
  // const [likes, setLikes] = useState([]);
  // const [keyLike,setKeyLike] = useState(false)
  // function handleLike() {
  //   console.log("sa");
  //   if (checkLike) {
  //     setCheckLike(false);
  //     setKeyLike(true)
  //   } else {
  //     setKeyLike(false)
  //     setCheckLike(true);
  //   }
  //   likePost(postKey, USER);
  // }
  // useEffect(() => {
  //   console.log("CHecklike");
  //   let x = [];
  //   async function checkFirstLike() {
  //     x = await getLike(postKey);
  //     setLikes(x);
  //     if (x) {
  //       if (x.includes(USER)) {
  //         setCheckLike(true);
  //       } else {
  //         setCheckLike(false);
  //       }
  //     }
  //   }
  //   checkFirstLike();
  // }, [keyLike]); //comment
  const [commentInput, setCommentInput] = useState("");
  function commentInputOnChange(e) {
    setCommentInput(e.target.value);
  } //time
  function changeTime(time) {
    // Verilen milisaniye değeri
    const milliseconds = time; // Date nesnesi oluşturma
    const dateObj = new Date(milliseconds); // MM/dd/yy formatına dönüştürme
    const month = (dateObj.getUTCMonth() + 1).toString().padStart(2, "0");
    const day = dateObj.getUTCDate().toString().padStart(2, "0");
    const year = dateObj.getUTCFullYear().toString().slice(-2);
    const MMddyy = `${month}/${day}/${year}`;
    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();
    let date = { year: MMddyy, hours: hours, minutes: minutes };
    return date;
  }
  return (
    <>
      <div className={styles.postPage}>
        <div className={styles.top}>
          <div className={styles.authorImg} onClick={routeMyProfile}>
            <img
              src={
                author.image
                  ? author.image
                  : "data:image/jpeg;base64,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"
              }
            />
          </div>
          <div className={styles.authorName} onClick={routeMyProfile}>
            {author ? author.nickName : "anonim"}
          </div>
          <div className={styles.postDate}> 18:35 05/29/23 </div>
        </div>
        <div className={styles.mid}>
          <img src={post.imageUrl} alt="" />
        </div>
        <div className={styles.bottom}>
              <div className={styles.likeBTN}>
                
              {!checkLike ? (
                <FaHeartBroken onClick={handleLike} className="icon" />
              ) : (
                <FaHeart onClick={handleLike} className="icon" />
              )}
                <div className={styles.counter}>{likeCount}</div>{" "}
              </div>
              <div className={styles.content}>
                {post?post.content:""}
              </div>
          <div className={styles.comments}>
          <Comments postId={postKey} refresh={refresh} />
          
          <div className={styles.addComment}>
            <input
              type="text"
              onChange={commentInputOnChange}
              value={commentInput}
              placeholder="Add Comment..."
            />
            <div
              className={styles.addBtn}
              onClick={() => {
                setCommentInput("");
              }}
            >
              <AddComment
                commentInput={commentInput ? commentInput : ""}
                author={post ? post.author : ""}
                postId={postKey ? postKey : ""}
                refreshComment={refreshComment}
              />
            </div>
          </div>
          </div>
         
        </div>
        {/* <div className={styles.right}>
          {" "}
          <div className={styles.myProfInfo}>
            <div className={styles.authorImg} onClick={routeMyProfile}>
              <img
                src={
                  author
                    ? author.image
                    : "data:image/jpeg;base64,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"
                }
              />{" "}
            </div>{" "}
            <div className={styles.authorName} onClick={routeMyProfile}>
              {" "}
              {author?.nickName}{" "}
            </div>{" "}
          </div>{" "}
          <hr /> <Comments postId={postKey} refresh={refresh} />{" "}
          <div className={styles.content}>{post.content}</div>{" "}
          <div className={styles.partLike}>
            {" "}
            <div className={styles.btns}>
              {" "}
              {!checkLike ? (
                <FaHeartBroken onClick={handleLike} className="icon" />
              ) : (
                <FaHeart onClick={handleLike} className="icon" />
              )}{" "}
            </div>{" "}
            <div className={styles.counter}>{likes ? likes.length : "0"}</div>{" "}
          </div>{" "}
          <div className={styles.date}>{} </div>{" "}
          <div className={styles.addComment}>
            {" "}
            <input
              type="text"
              onChange={commentInputOnChange}
              value={commentInput}
              placeholder="Add Comment..."
            />{" "}
            <div
              className={styles.addBtn}
              onClick={() => {
                setCommentInput("");
              }}
            >
              {" "}
              <AddComment
                commentInput={commentInput ? commentInput : ""}
                author={post ? post.author : ""}
                postId={postKey ? postKey : ""}
                refreshComment={refreshComment}
              />{" "}
            </div>{" "}
          </div>{" "}
        </div> */}
      </div>
      <hr />
    </>
  );
}
