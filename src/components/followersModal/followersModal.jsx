import {useState } from "react"
import styles from './followersModal.module.scss'
import { CloseCircleOutlined } from "@ant-design/icons"
import FollowerInfo from "./followerInfo"
export default function FollowersModal({localUser,localKey,followerCount,followers}){
    const [showModal,setShowModal] = useState(false)
    function showFollowers(){
        setShowModal(!showModal)
    }
    return(
        <>
        <span style={{cursor:'pointer'}} onClick={showFollowers}>{followerCount} Followers</span> 
        {showModal ? <div className={styles.modalContainer}>

            <div className={styles.main}>
                <div className={styles.modalTop}>
                    <p>Followers</p>
                    <span className={styles.closeBtn} onClick={showFollowers}><CloseCircleOutlined /></span>
                </div>
                <div className={styles.followers}>
                    {followers?.length ? followers?.map(follower=>(
                        <FollowerInfo key={follower} setShowModal={setShowModal} localUser = {localUser} localKey={localKey} follower = {follower} />
                    )) : <h1 className={styles.nonMessage}>Takipcisi yoxdur</h1>}
                </div>
            </div>
        </div> : ''}
        </>
    )
}
