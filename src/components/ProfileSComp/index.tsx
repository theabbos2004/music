import { ProfileInfo } from "../../components";
import { FormProps } from 'antd';
import { Form } from 'antd';
import { IFORMEDITPROFILE } from "../../types";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useMainContext } from "../../contexts/MainContext";
import { CheckCircleOutlined,ExclamationCircleOutlined } from '@ant-design/icons';
import { useGetUser, useUpdateAccount } from "../../lib/react-query/queris";
import { FormProfileS } from "../shared";
export default function ProfileSComp() {
  const [form] = Form.useForm();
  const params=useParams()
  const [user,setUser]=useState<IFORMEDITPROFILE>()
  const { openNotification } = useMainContext()
  const {mutateAsync:getUserId}=useGetUser()
  const {mutateAsync:updateAccount}=useUpdateAccount()
  useEffect(()=>{
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
    getUser()
  },[])
  const onFinish:FormProps<IFORMEDITPROFILE>["onFinish"]=async(values)=>{
    try{
      const {name,bg_img_url,imageUrl,gender}=values
      const updateAccountRes=await updateAccount({name,user,bg_img_url,imageUrl,gender})
      if(updateAccountRes.error){
        throw new Error(updateAccountRes.error)
      }
      openNotification({ placement: 'topLeft', description: `muofaqqiyatli o'zgartirildi`, icon: <CheckCircleOutlined style={{ color: "var(--color-green)" }} /> })
    }
    catch(error){
      openNotification({ placement: 'topLeft', description: `${error}`, icon: <ExclamationCircleOutlined style={{ color: "var(--color-green)" }} /> })
    }
    }
    
  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        name: user?.name,
        imageUrl:user.imageUrl,
        gender:user.gender,
        bg_img_url:user?.bg_img_url,
        date:user?.date,
      });
    }
  }, [user]);
  
  return (
    <div className="w-full">
      <Form
        className="w-full"
        initialValues={{
          name: user?.name || '',
          imageUrl: user?.imageUrl || '',
          gander: user?.gender || '',
          bg_img_url: user?.bg_img_url || '',
          date: user?.date || '',
        }}
        onFinish={onFinish}
        autoComplete='on'
        form={form}
      >
         <ProfileInfo edit={true} user={user} />
         <FormProfileS/>
      </Form>
    </div>
  )
}
