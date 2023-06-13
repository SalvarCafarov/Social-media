import { getComments } from "@/lib/firebase";
import st from "./comments.module.scss";
import { useEffect } from "react";
import { useState } from "react";
import Comment from "../comment/comment";
import { Box, CircularProgress } from "@mui/material";

export default function Comments({ postId ,refresh}) {
  const [comments, setComments] = useState("");
  useEffect(() => {
    async function handleGetComment() {
      let coms = await getComments(postId);
      let arr = Object.entries(coms);
      setComments(arr.reverse());
    }
    handleGetComment();
    console.log(comments);
  }, [refresh]);
  return (
    <>
      <div className={st.comments}>
        {comments
          ? comments.map((commentId) => (
              <Comment  commentId={commentId} key={commentId} />
            ))
          : <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "190px",
          }}
        >
          <CircularProgress />
        </Box>}
      </div>
      
    </>
  );
}
