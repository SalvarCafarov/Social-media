import { getUsers, signUp } from "@/lib/firebase";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from './Signup.module.css'
import ImgCrop from 'antd-img-crop';
import { toast } from "react-toastify";
import {
  Button,
  Checkbox,
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
} from 'antd';
import Link from "next/link";

//antd 
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

export default function SignUp() {
      const router =useRouter()



  //ANTD
  const [form] = Form.useForm();
  const onFinish = (values) => {
    let newData ={
      image:fileList?.[0]?.thumbUrl,
      ...values
    }
    if(checkNick === 'Boshluq'){
      toast('Nicknamede Boshluq ola bilmez duzelt',{ type: 'error' })
    }
    else if(checkNick){
      const [nickName,name,surName ,email, password, bio,image,gender] = [newData.nickname.toLowerCase(),newData.name,newData.surname,newData.email.toLowerCase(),newData.password,newData.bio,newData.image,newData.gender]
      signUp({nickName,name,surName,email,password,bio,image,gender})
      router.push('/login')
    }
    else{
      toast('bu nick var',{ type: 'error' })
    }
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
  const [fileList, setFileList] = useState([]);
  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
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
  try {
    // window.localStorage.setItem("USER",'-NUvDgvVZKn7_MX9OqZE')
    var USER = window.localStorage.getItem("USER") || "";
  } catch (error) {
    console.log("sa");
  }
  useEffect(()=>{
    async function getAllUsers(){
      let allUsers = await getUsers()
      if(allUsers){
        var result = Object.keys(allUsers).includes(USER)
      }
      if(result){
        router.push('/home')
      }
      else{
        localStorage.removeItem('USER')
        console.log('getmedin')
      }
    }
    
    if (USER){
     getAllUsers()
    }
  },[])
  const [checkNick,setCheckNick] = useState(false)
  async function checkNickname(nick) {
    let users = await getUsers()
    let netice = []
    if(nick===''){
      netice.push(false)
    }
    else if(nick.includes(' ')){
      toast('NickNamede boshluq isdifade ede bilmersen',{ type: 'warning' })
      
      netice.push('Boshluq')
    }
    else{
      if(users){
        Object.entries(users).forEach(user=>{
            if(user[1].nickName !== nick){
              netice.push(true)
            }
            else {
              netice.push(false)
            }
        })
      }
      else{
        netice.push(true)
      }
    }
    console.log(netice)
    if(netice.includes(false)){
      setCheckNick(false)
    }
    else if(netice.includes('Boshluq')){
      setCheckNick('Boshluq')
    }
    else{
      setCheckNick(true)
    }
  }
  
  return (
    <div className={styles.sigupContain}>
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
              required: true,
              message: 'Please input your Name!',
              whitespace: true,
            },
          ]}
        >
          <Input/>
        </Form.Item>
        <Form.Item
          name="surname"
          label="Surname"
          rules={[
            {
              required: true,
              message: 'Please input your Surname!',
              whitespace: true,
            },
          ]}
        >
          <Input />
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
              required: true,
              message: 'Please input your E-mail!',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="confirm"
          label="Confirm Password"
          dependencies={['password']}
          hasFeedback
          rules={[
            {
              required: true,
              message: 'Please confirm your password!',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('The two passwords that you entered do not match!'));
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="nickname"
          label="Nickname"
          tooltip="What do you want others to call you?"
          rules={[
            {
              required: true,
              message: 'Please input your nickname!',
              whitespace: false,
            },
          ]}
        >
          <Input onChange={(e)=>{
            checkNickname(e.target.value.toLowerCase())
          }} />
        </Form.Item>
        <Form.Item
          name="phone"
          label="Phone Number"
          rules={[
            {
              required: true,
              message: 'Please input your phone number!',
            },
          ]}
        >
          <Input
            addonBefore={prefixSelector}
            style={{
              width: '100%',
            }}
          />
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
          <Input.TextArea showCount maxLength={30} />
        </Form.Item>

        <Form.Item
          name="gender"
          label="Gender"
          rules={[
            {
              required: true,
              message: 'Please select gender!',
            },
          ]}
        >
          <Select placeholder="select your gender">
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

        <Form.Item
          name="agreement"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value ? Promise.resolve() : Promise.reject(new Error('Should accept agreement')),
            },
          ]}
          {...tailFormItemLayout}
        >
          <Checkbox>
            I have read the <a href="">agreement</a>
          </Checkbox>
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            Register
          </Button>
        </Form.Item>
        <div className={styles.loginContain}>
          <h1>Hesabin var?</h1>
          <Link className={styles.link} href={'/login'}>Login</Link>
        </div>
      </Form>
    </div>

  );
}
