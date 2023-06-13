import { useState } from 'react'
import styles from './editModal.module.scss'
import { CloseCircleOutlined } from '@ant-design/icons'
import ImgCrop from 'antd-img-crop';
import {
    Button,
    Checkbox,
    Form,
    Input,
    InputNumber,
    Select,
    Upload,
} from 'antd';
import { useRouter } from 'next/router';
import { ref, set } from 'firebase/database';
import { db } from '@/lib/firebase';
const { Option } = Select;
const formItemLayout = {
    labelCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 8,
        },
    },
    wrapperCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 16,
        },
    },
};
const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 16,
            offset: 8,
        },
    },
};
export default function EditModal({ prof, localKey }) {
    const router = useRouter()


    //ANTD
    const [form] = Form.useForm();
    const onFinish = async (values) => {
        let newData = {
            image: fileList?.[0]?.thumbUrl,
            ...values
        }

        const [name, surName, email, password, bio, image, gender] = [newData.name, newData.surname, newData.email?.toLowerCase(), newData.password, newData.bio, newData.image, newData.gender]
        await set(ref(db, "/users/" + localKey), {

            bio: bio || prof.bio,
            email: email || prof.email,
            followers: prof.followers || [],
            followings: prof.followings || [],
            gender: gender || prof.gender,
            image: image || prof.image,
            name: name || prof.name,
            password: password || prof.password,
            posts: prof.posts || [],
            surName: surName || prof.surName,
            nickName:prof.nickName
        });
        router.reload()
    };
    const prefixSelector = (
        <Form.Item name="prefix" noStyle>
            <Select
                style={{
                    width: 120,
                }}
            >
                <Option value="994">+994</Option>
            </Select>
        </Form.Item>
    );
    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };
    const [fileList, setFileList] = useState([
        {
            uid: '-1',
            name: 'image.png',
            status: 'done',
            url: prof.image,
        },
    ]);
    const onChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
        prof.image = ''
    };
    const onPreview = async (file) => {
        let src = file.url;
        if (!src) {
            src = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj);
                reader.onload = () => resolve(reader.result);
            });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow?.document.write(image.outerHTML);
    };

    //edit
    const [editModal, setEditModal] = useState(false)
    function showEditModal() {
        setEditModal(!editModal)
        console.log(prof)
    }
    return (
        <>
            <button onClick={showEditModal} className={styles.edit}>Edit Profile</button>
            {editModal ? <div className={styles.modalContainer}>

                <div className={styles.main}>
                    <div className={styles.modalTop}>
                        <p>Edit Profile</p>
                        <span className={styles.closeBtn} onClick={showEditModal}><CloseCircleOutlined /></span>
                    </div>
                    <Form
                        {...formItemLayout}
                        form={form}
                        name="register"
                        onFinish={onFinish}
                        initialValues={{
                            prefix: '994',
                        }}
                        style={{
                            maxWidth: 800,
                        }}
                        scrollToFirstError
                    >
                        <Form.Item
                            name="name"
                            label="Name"
                            rules={[
                                {
                                    required: false,
                                    message: 'Please input your Name!',
                                    whitespace: true,
                                },
                            ]}
                        >
                            <Input defaultValue={prof.name} />
                        </Form.Item>
                        <Form.Item
                            name="surname"
                            label="Surname"
                            rules={[
                                {
                                    required: false,
                                    message: 'Please input your Surname!',
                                    whitespace: true,
                                },
                            ]}
                        >
                            <Input defaultValue={prof.surName} />
                        </Form.Item>
                        <Form.Item
                            name="email"
                            label="E-mail"
                            rules={[
                                {
                                    type: 'email',
                                    message: 'The input is not valid E-mail!',
                                },
                                {
                                    required: false,
                                    message: 'Please input your E-mail!',
                                },
                            ]}
                        >
                            <Input defaultValue={prof.email} />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            label="Password"
                            rules={[
                                {
                                    required: false,
                                    message: 'Please input your password!',
                                },
                            ]}
                            hasFeedback
                        >
                            <Input.Password defaultValue={prof.password} />
                        </Form.Item>


                        <Form.Item
                            name="bio"
                            label="Bio"
                            rules={[
                                {
                                    required: false,
                                    message: 'Please input Bio',
                                },
                            ]}
                        >
                            <Input.TextArea defaultValue={prof.bio} showCount maxLength={30} />
                        </Form.Item>

                        <Form.Item
                            name="gender"
                            label="Gender"
                            rules={[
                                {
                                    required: false,
                                    message: 'Please select gender!',
                                },
                            ]}
                        >
                            <Select defaultValue={prof.gender} placeholder="select your gender">
                                <Option value="male">Male</Option>
                                <Option value="female">Female</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="Upload" valuePropName="fileList" getValueFromEvent={normFile}>
                            <ImgCrop rotationSlider>
                                <Upload
                                    listType="picture-card"
                                    fileList={fileList}
                                    onChange={onChange}
                                    onPreview={onPreview}
                                >
                                    {fileList.length < 1 && '+ Upload'}
                                </Upload>
                            </ImgCrop>
                        </Form.Item>


                        <Form.Item {...tailFormItemLayout}>
                            <Button type="primary" htmlType="submit">
                                Edit
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div> : ''}
        </>
    )
}