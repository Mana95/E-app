import * as Yup from "yup";
import "./Login.css";
import { Form, Input, Button, Checkbox } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import config from "../config/config.json";
import axios from "axios";
import { USER_LOGIN_api } from "../constant/ApiConstant";

const Login = () => {
  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState(false);

  const { setAuth } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd]);

  const onFinish = (values) => {
    console.log("Success:", values);
    const _authData = { userName: values.username, password: values.password };
    axios
      .post(config.backendPort + USER_LOGIN_api, _authData)
      .then((response) => {
        const accessToken = response?.data?.accessToken;
        const roles = [response?.data?.roles];
        setAuth({ user:values.username, pwd, roles, accessToken });
        localStorage.setItem('userinfo', { user:values.username, pwd, roles, accessToken });
        setUser('');
        setPwd('');
        navigate('/view', { replace: true });
      })
      .catch((err) => {
        if (!err?.response) {
          setErrMsg("No Server Response");
        } else if (err.response?.status === 400) {
          setErrMsg("Missing Username or Password");
        } else if (err.response?.status === 401) {
          setErrMsg("Unauthorized");
        } else {
          setErrMsg("Login Failed");
        }
        errRef.current.focus();
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <section>
      <div className="signUp">
        <p
          ref={errRef}
          className={errMsg ? "errmsg" : "offscreen"}
          aria-live="assertive"
        >
          {errMsg}
        </p>
        <h1>Sign In</h1>
        <br />
      </div>
      <div className="row">
        <Form
          name="basic"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[
              {
                required: true,
                message: "Please input your username!",
              },
            ]}
          >
            <Input value={user} ref={userRef} />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
          >
            <Input.Password
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            name="remember"
            valuePropName="checked"
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          ></Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
            &nbsp; &nbsp;
            <Button type="primary"  onClick={() => {
         
            navigate("/register");
          }}>
              Register
            </Button>
          </Form.Item>
        </Form>
      </div>
    </section>
  );
};

export default Login;
