import { comment } from "@/lib/firebase";
import { useEffect, useState } from "react";

export default function AddComment({
  commentInput,
  author,
  postId,
  refreshComment,
}) {
  const [localUser, setLocalUser] = useState("");
  useEffect(() => {
    try {
      let User = window.localStorage.getItem("USER");
      setLocalUser(User);
    } catch (error) {
      console.log();
    }
  }, []);
  async function addCommentTo() {
    let date = new Date().getTime();
    if (commentInput && localUser != "") {
     await comment({
        content: commentInput,
        date: date,
        postid: postId,
        author: localUser,
      });
    refreshComment();

    } else {
      console.log("olmadi");
    }

  }
  return (
    <>
      <button className="styles button" onClick={addCommentTo}>
        Add
      </button>
    </>
  );
}
