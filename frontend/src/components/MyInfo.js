
import {
    Button,
    Form,
    Input,
  } from 'antd';
  import './Login.css'
import { formItemLayout ,tailFormItemLayout } from './../constant/signUpConstant';
import config from "../config/config.json";
import axios from "axios";
import { UPDATE_USER_api ,GET_ALLUSER_api } from "../constant/ApiConstant";
import { useState, useRef, useEffect } from 'react';
import { useNavigate ,useParams } from 'react-router-dom';
import useAuth from './../hooks/useAuth';


const MyInfo = () =>{
    const [formVal ,setFormVal] = useState({
        userName:'',
        email:'',
        role:'',

    });
    const  { id } = useParams()
    console.log(id)
    const errRef = useRef();
    const [form] = Form.useForm();
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
    const [data , setData] = useState([]);
    const auth = useAuth()
    console.log(auth)
    useEffect(() => {
        (async () => {
          await axios.get(config.backendPort + GET_ALLUSER_api,{ params: { role: '' ,id:id } })
          .then(
              result=>{
                  console.log(result)
                setData(result.data);
              }
          ).catch(e=>console.log(e))
         
        })();
      }, []);


    const onFinish = data=>{
        console.log(data);

    axios.patch(config.backendPort + UPDATE_USER_api,data)
    .then(result=>{
         //console.log(JSON.stringify(response))
         setSuccess(true);
         //clear state and controlled input
         navigate('/view', { replace: true });
    }).catch(
        (err) =>{
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 409) {
                setErrMsg('Username Taken');
            } else {
                setErrMsg('Registration Failed')
            }
            errRef.current.focus();
        }
    )
}
    return(
        <section>
        <div className="signUp">
<p
  ref={errRef}
  className={errMsg ? "errmsg" : "offscreen"}
  aria-live="assertive"
>
  {errMsg}
</p>
<h1>Register</h1>
<br />
</div>
<div className="row">
<Form 
{...formItemLayout}
form={form}
name="register"
onFinish={onFinish}
initialValues={{
residence: ['zhejiang', 'hangzhou', 'xihu'],
prefix: '86',
}}
scrollToFirstError
>
<Form.Item
name="email"
label="E-mail"
value={formVal.email}
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
name="userName"
label="UserName"
value={formVal.userName}
tooltip="Login will login with the username"
rules={[
  {
    required: true,
    message: 'Please input your userName!',
    whitespace: true,
  },
]}
>
<Input />
</Form.Item>

<Form.Item {...tailFormItemLayout}>
<Button type="primary" htmlType="submit">
  Register
</Button>
&nbsp; &nbsp;
    <Button type="primary"  onClick={() => {
 
    navigate("/login");
  }}>Login</Button>
</Form.Item>
</Form>
</div>
</section>
    )
}

export default MyInfo;