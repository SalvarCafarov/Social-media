import { useEffect, useState } from "react";
import MyPost from "../myPost/myPost";
import styles from "./myPosts.module.scss";
export default function MyPosts({sendChecked,postIDs}) {
  useEffect(()=>{
    sendChecked()
  })
  return (
    <>
      <div className={styles.posts}>
        {postIDs?.map((e) => (
          <MyPost key={e[0]} postID={e[0]} />
        ))}
      </div>
    </>
  );
}
