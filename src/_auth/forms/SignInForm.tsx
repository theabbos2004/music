import React, { memo, useState } from 'react';
import { Button, Card, Checkbox, Col, Form, Input, Row } from 'antd';
import type { FormProps } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircleOutlined, ExclamationCircleOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useMainContext } from '../../contexts/MainContext';
import { usegetCurrentUser, useSignInAccount, useSignOutAccount } from '../../lib/react-query/queris';


const SignInForm: React.FC = () => {
  const { openNotification } = useMainContext()
  const { mutateAsync: signInAccount } = useSignInAccount()
  const { mutateAsync: signOutAccount } = useSignOutAccount()
  const { mutateAsync: currentUser } = usegetCurrentUser()
  const [ isLoading , setIsLoading] = useState<boolean>()
  const navigate = useNavigate()
  type FieldType = {
    email: string;
    password: string;
    remember?: boolean;
  };


  const [form] = Form.useForm();

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    setIsLoading(true)
    try{
      const { email, password, remember } = values  
      signOutAccount()
      const isSignInAccount = await signInAccount({ email, password })
      
      if (isSignInAccount.error) {
        throw new Error(isSignInAccount.error);
      }
      const isCurrentUser=await currentUser()
      if (isCurrentUser.error) {
        throw new Error(isCurrentUser.error);
      }
      openNotification({ placement: 'topLeft', description: "welcome to the system" ,icon:<CheckCircleOutlined style={{color:"var(--color-green)"}} />})
      
      !remember && signOutAccount()
      form.setFieldsValue({
        email:"",
        password:"",
        remember:false
      });
      setIsLoading(false)
      navigate("/")
    }
    catch(error){
      setIsLoading(false)
      openNotification({ placement: 'topLeft', description: `${error}`,icon:<ExclamationCircleOutlined style={{color:"var(--color-red)"}} /> })
    }
  };
  
  return (
    <Card className='bg-transparent border-white text-light-1'>
      <Col className='flex flex-col items-center justify-center text-[var(--color-green)]'>
        <div className=' text-2xl font-bold'>Sign In</div>
        <div className=' text-base text-gray-950 dark:text-gray-300'>Welcome</div>
      </Col>
      <Form
        form={form}
        initialValues={{
          remember:false
        }}
        name="nest-messages"
        onFinish={onFinish}
        layout="vertical"
        className='w-full py-4'
      >
        <Form.Item<FieldType> name='email' className="my-4" rules={[{ required: true,type: 'email'}]}>
          <Input prefix={<MailOutlined className="site-form-item-icon" />} className='gap-1' placeholder="Email"/>
        </Form.Item>
        <Form.Item<FieldType> name='password' className="my-4" rules={[{ required: true, message: 'Please input your password!'},{min:8,message: '${label} must be between ${min} and ${max}'}]}>
          <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} className='gap-1' placeholder="Password"/>
        </Form.Item>
        <Form.Item<FieldType> className="my-4"  name="remember" valuePropName="checked">
          <Checkbox className=' text-gray-500'>remember me</Checkbox>
        </Form.Item>
        <Form.Item className='w-full justify-center'>
          <Button type="primary" className='w-full p-4 round' htmlType="submit" loading={isLoading}>
              Submit
          </Button>
        </Form.Item>
      </Form>
      <Row className=' justify-center gap-2'>
        <div className='dark:text-gray-300'>I have account</div>
        <Link to={"/sign-up"} className=' text-[var(--color-green)] font-semibold'>
          Sign Up
        </Link>
      </Row>
    </Card>
  );
};

export default memo(SignInForm);