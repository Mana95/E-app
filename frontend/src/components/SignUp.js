
import {
    Button,
    Form,
    Input,
  } from 'antd';
  import './Login.css'
import { formItemLayout ,tailFormItemLayout } from './../constant/signUpConstant';
import config from "../config/config.json";
import axios from "axios";
import { USER_REGISTER_api } from "../constant/ApiConstant";
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUp = ()=>{
    const errRef = useRef();
    const [form] = Form.useForm();
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const onFinish = data=>{
            console.log(data)
            data['role'] = 'user'
        axios.post(config.backendPort + USER_REGISTER_api,data)
        .then(result=>{
             //console.log(JSON.stringify(response))
             setSuccess(true);
             //clear state and controlled input
             navigate('/login', { replace: true });
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
        name="userName"
        label="UserName"
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

export default SignUp;