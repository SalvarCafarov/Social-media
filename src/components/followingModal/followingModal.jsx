import { useState } from "react"
import styles from './followingModal.module.scss'
import { CloseCircleOutlined } from "@ant-design/icons"
import FollowingInfo from "./followingInfo"

export default function FollowingModal({localUser,localKey,followerCount,followers}){
    const [showModal,setShowModal] = useState(false)
    function showFollowers(){
        setShowModal(!showModal)
    }
    return(
        <>
        <span style={{cursor:'pointer'}} onClick={showFollowers}>{followerCount} Followings</span> 
        {showModal ? <div className={styles.modalContainer}>

            <div className={styles.main}>
                <div className={styles.modalTop}>
                    <p>Following</p>
                    <span className={styles.closeBtn} onClick={showFollowers}><CloseCircleOutlined /></span>
                </div>
                <div className={styles.followers}>
                    {followers?.length ? followers?.map(follower=>(
                        <FollowingInfo key={follower} setShowModal={setShowModal} localUser = {localUser} localKey={localKey} follower = {follower} />
                    )) : <h1 className={styles.nonMessage}>Follow elediyi yoxdur</h1>}
                </div>
            </div>
        </div> : ''}
        </>
    )
}