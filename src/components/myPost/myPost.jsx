import { getPost } from "@/lib/firebase";
import { useEffect, useState } from "react";
import styles from "./myPost.module.scss";
import { Box, CircularProgress } from "@mui/material";
import { useRouter } from "next/router";
export default function MyPost({ postID }) {
  const [postst, setPostst] = useState();
  async function getEach() {
    let post = await getPost(postID);
    setPostst(post);
  }
  const route =useRouter()
  function setRoute(){
    route.push(`/post/`+postID)
  }
  useEffect(() => {
    getEach();
  }, []);
  return (
    <>
      {postst ? (
        <div onClick={setRoute} className={styles.mypost}>
          <img src={postst.imageUrl} />
        </div>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "31.5%",
            height:"150px"
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </>
  );
}
