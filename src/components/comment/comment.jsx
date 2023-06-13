import { getUser } from "@/lib/firebase";
import st from "./comment.module.scss";
import { useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import { useRouter } from "next/router";
export default function Comment({ commentId }) {
  const [user, setUser] = useState();
  const [commentTime, setCommentTime] = useState({});
  let time;
  function changeTime(time) {
    // Verilen milisaniye değeri
    const milliseconds = time;

    // Date nesnesi oluşturma
    const dateObj = new Date(milliseconds);
    // MM/dd/yy formatına dönüştürme
    const month = (dateObj.getUTCMonth() + 1).toString().padStart(2, "0");
    const day = dateObj.getUTCDate().toString().padStart(2, "0");
    const year = dateObj.getUTCFullYear().toString().slice(-2);
    const MMddyy = `${month}/${day}/${year}`;
    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();
    let date = {
      year: MMddyy,
      hours: hours,
      minutes: minutes,
    };
    return date;
  }
  function nickRoute(e){
    console.log(e.target.textContent);
  }

  async function handleProfImg() {
    let x = await getUser(commentId[1][1].author);
    let tm = commentId[1][1];
    setUser(x);
    // setCommentTime(commentId[1][1].date)
    let y = changeTime(commentId[1][1].date);
    setCommentTime(y);
  }
  useEffect(() => {
    handleProfImg();
  }, []);
  let router = useRouter();
  function commentRoute(){
    router.push(`/user/${user.nickName}`)
  }
  return (
    <>
    {user?<div onClick={commentRoute} className={st.comment} key={commentId}>
        <div className={st.left}>
          <img
            src={
              user
                ? user.image?user.image:"data:image/jpeg;base64,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"
                : ""
            }
            alt=""
          />
        </div>
        <div className={st.right}>
          <div className={st.head}>
          <div onClick={nickRoute} className={st.nick}>{user ? user.nickName : ""}</div>
          <div className={st.date}>{commentTime ?  ` ${commentTime.hours}:${commentTime.minutes}     ${commentTime.year}   ` : "today"}</div>
          </div>
          <pre className={st.content}>{commentId[1][1].content}</pre>
        </div>
      </div>:""}
      
    </>
  );
}
