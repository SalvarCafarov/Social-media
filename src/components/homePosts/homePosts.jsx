import { getPosts } from "@/lib/firebase";
import { Box, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import HomePost from "../homePost/homePost";
import styles from './homePosts.module.scss'
export default function HomePosts({ localUser,userSelf }) {
  const [loading, setLoading] = useState(true);
  const [allPosts, setAllPosts] = useState([]);
  const [oldPosts, setOldPosts] = useState([]);
  const [newPosts, setNewPosts] = useState([]);
  useEffect(() => {
    async function getAllFollowingsPosts(followings) {
      // burdakilar funksiyanin daxilinde deyishen kimi kecerlidi colde state olaraq dushecek
      let allPostsf = [];
      let newPostsf = [];
      let oldPostsf = [];
      for (let i = 0; i < followings.length; i++) {
        let followingPosts = await getPosts(followings[i]);
        followingPosts?.sort(function (a, b) {
          return b[1].date - a[1].date;
        });
        followingPosts?.slice(2).forEach((item) => oldPostsf.push(item[0]));
        followingPosts?.slice(0, 2).forEach((item) => newPostsf.push(item[0]));
      }
      setOldPosts(oldPostsf);
      setNewPosts(newPostsf);
      allPostsf = newPostsf.concat(oldPostsf);
      console.log(allPostsf);
      setAllPosts(allPostsf);
      setLoading(false);
    }
    let followings = localUser?.followings;
    if (followings?.length) {
      getAllFollowingsPosts(followings.reverse());
    } else {
      setLoading(false);
    }
  }, []);
  return (
    <>
      {loading ? (
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
      ) : (
        <>
          {/* Burda yazassan */}

         <div className={styles.homePosts}>
         {allPosts.length
            ? newPosts.length > 5
              ? newPosts.map((postKey) => (
                  <HomePost key={postKey} postKey={postKey} />
                ))
              : allPosts.map((postKey) => (
                  <HomePost key={postKey} postKey={postKey}  />
                ))
            : "yoxdu"}
         </div>
        </>
      )}
    </>
  );
}
