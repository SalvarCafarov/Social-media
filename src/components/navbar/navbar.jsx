import Link from "next/link";
import Search from "../search/search";
import styles from "./navbar.module.scss";
import { useEffect, useState } from "react";
import SearchBar from "../searchBar/searchBar";
import { useRouter } from "next/router";
import { Button, Modal } from "antd";
import { CloseCircleOutlined, LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Upload, message } from "antd";
import { Input } from "antd";
import { post } from "@/lib/firebase";
import { usePathname } from "next/navigation";
import { AiOutlineHome, AiOutlineSearch } from "react-icons/ai";
import { CgProfile, CgLogOut } from "react-icons/cg";
import Image from "next/image";
import { IoMdAddCircleOutline } from "react-icons/io";

///

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

///
export default function Navbar() {
  const [inputNick, setInputNick] = useState("");
  const router = useRouter();
  let path = usePathname();

  function getInputValue(nickName) {
    setInputNick(nickName);
  }
  function logOut() {
    window.localStorage.removeItem("USER");
    router.push("/login");
  }

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
    console.log(date);
    let likes = [];
    await post({ content, date, author, imageUrl, likes });
    setImageUrl("");
    if (path === "/myprofile") {
      router.reload();
    }
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
  useEffect(() => {}, [imageUrl]);
//search
const [showSearch,setShowSearch] = useState(false)
function showSearchModal(){
  if(showSearch){
    setShowSearch(false)
  }
  else{
    setShowSearch(true)
  }
}
  return (
    <>
      <div className={`${styles.navbar} navbar`}>
        <div className={styles.top}>
          {" "}
          <Image
            className={styles.logo}
            src="/logo_transparent.png"
            layout="responsive"
            width={14}
            height={14}
            alt="Picture of the author"
          />
        </div>
        <div onClick={showSearchModal} className={styles.navItem}>
            <div className={styles.navItemInner}>
              <span className={styles.itemIcon}>
                <AiOutlineSearch />
              </span>
              <span className={styles.itemName}>Search</span>
            </div>
          </div>
        <div className={styles.mid}>
          <div onClick={showModal} className={styles.navItem}>
            <div className={styles.navItemInner}>
              <span className={styles.itemIcon}>
                <IoMdAddCircleOutline />
              </span>
              <span className={styles.itemName}>Add Post</span>
            </div>
          </div>
          <div
            className={styles.navItem}
            onClick={() => {
              router.push("/home");
            }}
          >
            <div className={styles.navItemInner}>
              <span className={styles.itemIcon}>
                <AiOutlineHome />
              </span>
              <span className={styles.itemName}>Home</span>
            </div>
          </div>
          <div
            className={styles.navItem}
            onClick={() => {
              router.push("/myprofile");
            }}
          >
            <div className={styles.navItemInner}>
              <span className={styles.itemIcon}>
                <CgProfile />
              </span>
              <span className={styles.itemName}>Profile</span>
            </div>
          </div>

          {/* <Search inputNick={inputNick} getInputValue={getInputValue} />
          <SearchBar setInputNick={setInputNick} inputNick={inputNick} /> */}
        </div>
        <div className={styles.right}>
          <button
            className={`${styles.logOut} ${styles.navItem}`}
            onClick={(e) => {
              logOut();
            }}
          >
            <div className={styles.navItemInner}>
              <span className={styles.itemIcon}>
                <CgLogOut />
              </span>
              <span className={styles.itemName}>LogOut</span>
            </div>
          </button>
        </div>
      </div>
      <div className={styles.navbarShadow}></div>
      <hr />
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
      {showSearch ? <div className={styles.searchModal}>
        <div className={styles.searchModalMain}>
        <div className={styles.modalTopSearch}>
          <p>Search Users</p>
          <span className={styles.closeBtn} onClick={showSearchModal}><CloseCircleOutlined /></span>
        </div>
          <Search inputNick={inputNick} getInputValue={getInputValue} />
          <SearchBar setInputNick={setInputNick} inputNick={inputNick} />
      </div>
        </div>:''}
    </>
  );
}
