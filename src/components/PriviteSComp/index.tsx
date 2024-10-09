import { Flex } from "antd";
import { FormEmailPriviteS, FormPasswordPriviteS } from "../shared";
import { FormProps } from 'antd';
import { Form } from 'antd';
import { IFORMEDITPROFILE } from "../../types";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useMainContext } from "../../contexts/MainContext";
import { CheckCircleOutlined,ExclamationCircleOutlined } from '@ant-design/icons';
import { useGetUser, useUpdateAccount } from "../../lib/react-query/queris";
import { client } from "../../lib/AppWrite/config";
export default function PriviteSComp() {
  const [emailForm] = Form.useForm();
  const [passwordform] = Form.useForm();
  const params=useParams()
  const [user,setUser]=useState<IFORMEDITPROFILE>()
  const { openNotification } = useMainContext()
  const {mutateAsync:getUserId}=useGetUser()
  const {mutateAsync:updateAccount}=useUpdateAccount()
  
  useEffect(()=>{
    getUser()
    const unSubscribeMusicCol=client.subscribe("account", () => {
      getUser()
    });
    return ()=>{
        unSubscribeMusicCol()
    }
},[])
  const getUser=async()=>{
    try{
      const user=await getUserId({userId:`${params?.id}`})
      if(user.error){
        throw new Error(user.error)
      }
      setUser(user.data)
    }
    catch(error){
      openNotification({ placement: 'topLeft', description: `${error}`, icon: <ExclamationCircleOutlined style={{ color: "var(--color-green)" }} /> })
    }
  }
  const onFinishEmail:FormProps<IFORMEDITPROFILE>["onFinish"]=async(values)=>{
    try{
      const {email,password}=values      
      const updateAccountRes=await updateAccount({user,email,password})
      if(updateAccountRes.error){
        throw new Error(updateAccountRes.error)
      }
      openNotification({ placement: 'topLeft', description: `email changed successfully`, icon: <CheckCircleOutlined style={{ color: "var(--color-green)" }} /> })
      emailForm.resetFields()
    }
    catch(error){
      openNotification({ placement: 'topLeft', description: `${error}`, icon: <ExclamationCircleOutlined style={{ color: "var(--color-green)" }} /> })
      emailForm.resetFields()
    }
    }
  const onFinishPassword:FormProps<IFORMEDITPROFILE>["onFinish"]=async(values)=>{
    try{
      const {newPassword,password}=values      
      const updateAccountRes=await updateAccount({user,newPassword,password})
      if(updateAccountRes.error){
          throw new Error(updateAccountRes.error)
        }
        openNotification({ placement: 'topLeft', description: `password changed successfully`, icon: <CheckCircleOutlined style={{ color: "var(--color-green)" }} /> })
        passwordform.resetFields()
      }
    catch(error){
      openNotification({ placement: 'topLeft', description: `${error}`, icon: <ExclamationCircleOutlined style={{ color: "var(--color-green)" }} /> })
    }
    }
    
  useEffect(() => {
    if (user) {
      emailForm.setFieldsValue({
        email: user?.email
      });
    }
  }, [user]);

  return (
    <Flex className=" flex-col sm:flex-row px-6 pt-12 w-full justify-around gap-4">
      <Form
        initialValues={{
          email: user?.email || '',
        }}
        onFinish={onFinishEmail}
        autoComplete='off'
        form={emailForm}
        className="w-full sm:w-2/4"
        >
        
            <FormEmailPriviteS/>
      </Form>
      <Form
        onFinish={onFinishPassword}
        autoComplete='off'
        form={passwordform}
        className="w-full sm:w-2/4"
        >
            <FormPasswordPriviteS/>
      </Form>
    </Flex>
  )
}
