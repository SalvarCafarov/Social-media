import { getPosts, getProfileInfo, getUser, getUsers } from "@/lib/firebase";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "./myprofile.module.scss";
import Navbar from "@/components/navbar/navbar";
import { Box, CircularProgress } from "@mui/material";
import MyPosts from "@/components/myPosts/myPosts";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Input, Modal, Upload } from "antd";
import { post } from "@/lib/firebase";
import FollowersModal from "@/components/followersModal/followersModal";
import FollowingModal from "@/components/followingModal/followingModal";
import EditModal from "@/components/editModal/editModal";
import Background from "@/components/bacground/background";

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
};
const beforeUpload = (file) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
};

export default function MyProfile() {
  const [followers,setFollowers] = useState([])
  const [followersCount,setFollowersCount] = useState(0)
  const [followings,setFollowings] = useState([])
  const [followingCount,setFollowingCount] = useState(0)
  const router = useRouter();
  try {
    // window.localStorage.setItem("USER",'-NUvDgvVZKn7_MX9OqZE')
    var USER = window.localStorage.getItem("USER") || "";
    var [checkUser, setCheckUser] = useState(false);
    var [prof, setProf] = useState(false);
  } catch (error) {
    console.log("sa");
  }
  let profile;
  const getData = async () => {
    async function getAllUsers() {
      let allUsers = await getUsers();
      if (allUsers) {
        var result = Object.keys(allUsers).includes(USER);
      }
      if (!result) {
        localStorage.removeItem("USER");
        router.push("/login");
      }
    }
    if (USER) {
      getAllUsers();
      profile = await getUser(USER);
      if (profile) {
        setCheckUser(true);
        setProf(profile);
        if(profile?.followers){
          setFollowers(profile?.followers)
          setFollowersCount(profile?.followers?.length)
        }
        if(profile?.followings){
          setFollowings(profile?.followings)
          setFollowingCount(profile?.followings?.length)
        }
      }
    } else {
      setCheckUser(false);
      setProf(false);
      router.push("/login");
    }
  };
  const [postIDs, setPostIDs] = useState();
  useEffect(() => {
    getData();
    async function getPSTS() {
      let x = await getPosts(USER);
      if (x?.length) {
        setPostIDs(Object.values(x));
        console.log(x)
      }
      else{
        setCheckPost(true)
      }
    }
    getPSTS();
  }, []);
  ///
  const [checkPost,setCheckPost]=useState(false)

  function sendChecked(){
    if(!checkPost){
      setCheckPost(true)
    }
  }



///
  //MaterialUi
  const [open, setOpen] = useState(false);
  const showModal = () => {
    setOpen(true);
  };
  const handleOk = async (e) => {
    console.log(e);
    setOpen(false);
    let author = localStorage.getItem("USER");
    console.log(author);
    let date = new Date().getTime();
    console.log(imageUrl);
    await post({ content, date, author, imageUrl });
    setImageUrl("");
    router.reload()
  };
  const handleCancel = (e) => {
    console.log(e);
    setOpen(false);
    setImageUrl("");
  };

  //Ant Design
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const handleChange = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );

  //

  const { TextArea } = Input;
  const [content, setContent] = useState("");
  const onChange = (e) => {
    setContent(e.target.value);
  };
  //

  return (
    <>
    <Background/>
      {checkUser ? (
        <>
        <div className={styles.mainContainer}>
        <Navbar />
          <div className={styles.container}>
            <div className={styles.info}>
              <div className={styles.left}>
                <img
                  src={
                    prof.image
                      ? prof.image
                      : "data:image/jpeg;base64,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"
                  }
                  alt=""
                />
              </div>
              <div className={styles.right}>
                <div className={styles.top}>
                  <div className={styles.nickName}>
                    {prof ? prof.nickName : "user"}
                  </div>
                  <EditModal localKey = {USER} prof = {prof}/>
                </div>

                <div className={styles.bottom}>
                  <div className={styles.posts}>
                    {prof ? (
                      prof.posts ? (
                        prof.posts.length
                      ) : (
                        "0"
                      )
                    ) : (
                      <CircularProgress />
                    )}{" "}
                    Posts
                  </div>
                  <div className={styles.followers}>
                  {prof ? <FollowersModal localUser = {prof} localKey={USER} followers={followers} followerCount={followersCount}/> : (
                                                <CircularProgress />
                                            )}
                  </div>
                  <div className={styles.followings}>
                    {prof ? <FollowingModal localUser = {prof} localKey={USER} followers={followings} followerCount={followingCount}/>: (
                                                <CircularProgress />
                                            )}
                  </div>
                </div>
                <div className={styles.bottomBio}>
                  <p>
                    {prof ? prof.bio ? prof.bio : "Bio Yoxdur" : <CircularProgress />}
                  </p>
                </div>
              </div>
            </div>
            <div className={styles.posts}>
              {postIDs ? (
                <MyPosts sendChecked={sendChecked} postIDs={postIDs} />
              ) : checkPost?(
                <>
                  <div className={styles.withoutposts}>
                  <Button type="primary" onClick={showModal}>
                    Share First Post
                  </Button>
                  </div>
                  <Modal
                    title="Share Post"
                    open={open}
                    onOk={imageUrl ? handleOk : ""}
                    onCancel={handleCancel}
                    okButtonProps={{
                      disabled: imageUrl ? false : true,
                    }}
                    cancelButtonProps={{
                      disabled: false,
                    }}
                  >
                    <Upload
                      name="avatar"
                      listType="picture-card"
                      className="avatar-uploader"
                      showUploadList={false}
                      beforeUpload={beforeUpload}
                      onChange={handleChange}
                    >
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt="avatar"
                          style={{
                            width: "100%",
                          }}
                        />
                      ) : (
                        uploadButton
                      )}
                    </Upload>
                    <TextArea showCount maxLength={100} onChange={onChange} />
                  </Modal>
                </>
              ):<Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "50vh",
              }}
            >
              <CircularProgress />
            </Box>}
            </div>
          </div>
        </div>
         
        </>
      ) : (
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
      )}
    </>
  );
}
