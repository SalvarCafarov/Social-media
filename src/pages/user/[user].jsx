import { follow, getPosts, getUser, getUsers, unfollow } from "@/lib/firebase"
import { useEffect, useState } from "react"
import { usePathname } from 'next/navigation'
import { Box, CircularProgress } from "@mui/material"
import Navbar from "@/components/navbar/navbar"
import MyPosts from "@/components/myPosts/myPosts"
import styles from './userPage.module.scss'
import { useRouter } from "next/router"
import FollowersModal from "@/components/followersModal/followersModal"
import FollowingModal from "@/components/followingModal/followingModal"
import Background from "@/components/bacground/background"

export default function User() {
    let path = usePathname()
    let router = useRouter()
    const [user, setUser] = useState('')
    const [userKey, setUserKey] = useState('')
    const [localKey, setLocalKey] = useState('')
    const [localUser, setLocalUser] = useState('')
    const [loading, setLoading] = useState(true)
    const [postIDs, setPostIDs] = useState([])
    const [postsLoading, setPostsLoading] = useState(true)
    const [followerCount, setFollowerCount] = useState(0)
    const [followers,setFollowers] = useState([])
    const [following,setFollowing] = useState([])
    const [followingCount,setFollowingCount] = useState(0)
    let myFollowers = []
    const [followBTN, setFollowBTN] = useState(true)
    async function followUser() {
        if (followBTN) {
            follow(localKey, userKey)
            setFollowerCount(prevCount => prevCount + 1)
            setFollowBTN(false)
            if(followers.length){
                myFollowers = followers
            }
            myFollowers.push(localKey)
            setFollowers(myFollowers)
        }
        else {
            setFollowerCount(prevCount => prevCount - 1)
            unfollow(localKey, userKey)
            setFollowBTN(true)
            if(followers.length){
                myFollowers = followers
            }
            myFollowers?.splice(myFollowers?.indexOf(localKey),1)
            setFollowers(myFollowers)
        }
    }
    async function checkNickNameFunc(userData, nickName) {
        Object.entries(userData).forEach(item => {
            if (item[1].nickName.toLowerCase() === nickName.toLowerCase()) {
                if (item[0] !== localStorage.getItem('USER')) {
                    setUser(item[1])
                    setUserKey(item[0])
                    if (item[1]?.followers?.length) {
                        setFollowerCount(item[1].followers.length)
                        setFollowers(item[1].followers)
                    }
                    if(item[1]?.followings?.length){
                        setFollowing(item[1]?.followings)
                        setFollowingCount(item[1]?.followings?.length)
                    }
                }
                else {
                    router.push('/myprofile')
                }
            }
        })
    }
    useEffect(() => {
        async function checkLocalinfo() {
            let localInfo = await getUser(localStorage.getItem('USER'))
            if (!localInfo) {
                localStorage.removeItem('USER')
                router.push('/login')
            }
            else {
                let newNickName = path.split('/')[2]
                getUserData(newNickName)
                setLocalKey(localStorage.getItem('USER'))
                setLocalUser(localInfo)
            }
        }
        async function getUserData(nickName) {
            let userData = await getUsers()
            await checkNickNameFunc(userData, nickName)
            setTimeout(() => {
                setLoading(false)
            }, 5000);
        }
        if (path !== null) {
            checkLocalinfo()
        }

    }, [path])
    async function getPSTS() {
        let x = await getPosts(userKey);
        if (x && x.length) {
            setPostIDs(Object.values(x));
        }
        else {
            setPostIDs([])
            setPostsLoading(false)
        }
    }
    async function checkFollowing() {
        if (localUser?.followings?.includes(userKey)) {
            setFollowBTN(false)
        }
    }
    useEffect(() => {
        setPostsLoading(true)
        getPSTS();
        checkFollowing()
    }, [userKey,path])
    const [checkPost,setCheckPost]=useState(false)

    function sendChecked(){
      if(!checkPost){
        setCheckPost(true)
      }
    }
    return (
        <>
            {user ?


                (
                    <>
                    <Background/>
                        <div className={styles.cont}>

                        <Navbar />
                        <div className={styles.container}>
                            <div className={styles.info}>
                                <div className={styles.left}>
                                    <img
                                        src={user.image ? user.image : "data:image/jpeg;base64,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"}
                                        alt=""
                                    />
                                </div>
                                <div className={styles.right}>
                                    <div className={styles.top}>
                                        <div className={styles.nickName}>
                                            {user ? user.nickName : "sa"}
                                        </div>
                                        <button className={styles.edit} onClick={followUser}>{followBTN ? 'FOLLOW' : 'UNFOLLOW'}</button>
                                    </div>

                                    <div className={styles.bottom}>
                                        <div className={styles.posts}>
                                            {user ? (
                                                user.posts ? (
                                                    user.posts.length
                                                ) : (
                                                    "0"
                                                )
                                            ) : (
                                                <CircularProgress />
                                            )}{" "}
                                            Posts
                                        </div>
                                        <div className={styles.followers}>
                                            {user ?                                                     <FollowersModal localUser = {localUser} localKey={localKey} followers={followers} followerCount={followerCount}/>: (
                                                <CircularProgress />
                                            )}
                                            
                                        </div>
                                        <div className={styles.followings}>
                                            {user ? <FollowingModal localUser = {localUser} localKey={localKey} followers={following} followerCount={followingCount}/>: (
                                                <CircularProgress />
                                            )}
                                        </div>
                                    </div>
                                    <div className={styles.bottomBio}>
                                        <p>
                                            {user ? user.bio ? user.bio : "" : <CircularProgress />}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <hr />
                            <div className={styles.posts}>
                                {postIDs.length ? (
                                    <MyPosts sendChecked={sendChecked} postIDs={postIDs} />
                                ) : postsLoading ? <CircularProgress /> : 'post yoxdur'
                                }
                            </div>
                        </div>
                        </div>
                    </>
                )
                : loading ? (
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
                ) : (<><h1>Üzgünüz, bu sayfaya ulaşılamıyor.</h1> <p>Tıkladığın bağlantı bozuk olabilir veya sayfa kaldırılmış olabilir. Instagram'a geri dön.</p></>)}
        </>
    )
}