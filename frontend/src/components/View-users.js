
import { useEffect } from 'react';
import { useState } from 'react';
import axios from "axios";
import config from "../config/config.json";
import { GET_ALLUSER_api } from "../constant/ApiConstant";
import useAuth from './../hooks/useAuth';
import columns from '../constant/commonConstants';
import { Button, Space, Table, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Column, ColumnGroup } = Table;

const ViewUser = ()=>{
    
    const[data , setData] = useState([]);
    const {auth} = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        (async () => {
          await axios.get(config.backendPort + GET_ALLUSER_api,{ params: { role: auth.roles[0] ,userName:auth.user} })
          .then(
              result=>{
                console.log(result)
                setData(result.data);
              }
          ).catch(e=>console.log(e))
         
        })();
      }, []);

     
      const onClickNavigate = (event)=>{
          console.log(event)
          if(auth.roles[0] === 'user'){
            navigate(`/myinfo/${data[0]?._id}`)
          }else{

          }
      //  navigate(`/myinfo/${event.target.dataset.id}`)

      }
    return(
        <Table dataSource={data}>
      <Column title="UserName" dataIndex="userName" key="userName" />
      <Column title="Email" dataIndex="email" key="email" />
      <Column title="Action" dataIndex="button" key="button"
            render = {(key)=>{
             return(   <>
                <Button
                 onClick={onClickNavigate} >Click</Button>
                </>)
            }}
      />

        </Table>
        )
}

export default ViewUser;

