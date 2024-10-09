import { useNavigate } from 'react-router-dom'
import { Button, Card, Col, Form, Input, Row } from 'antd';
import type { FormProps } from 'antd';
import { Link } from 'react-router-dom';
import { ExclamationCircleOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { memo, useEffect, useState } from 'react';
import { useMainContext } from '../../contexts/MainContext';
import { useCreateAccount, useSignInAccount, useSignOutAccount } from '../../lib/react-query/queris';
import { useUserContext } from '../../contexts/AuthContext/AuthContext';

const SignUpForm=() =>{
  const navigate = useNavigate()
  const { openNotification } = useMainContext()
  const { checkAuthUser } = useUserContext()
  const {mutateAsync:createAccount}=useCreateAccount()
  const {mutateAsync:signInAccount}=useSignInAccount()
  const {mutateAsync:signOutAccount}=useSignOutAccount()

  const [ isLoading , setIsLoading] = useState<boolean>()

  useEffect(()=>{
    checkAuthUser()
  },[])
  const [form] = Form.useForm();


  type FieldType = {
    name: string;
    username: string;
    password: string;
    confirmPassword:string;
    email: string;
  };

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    setIsLoading(true)
    try {
      const { email, password } = values
      signOutAccount()
      const createAccountRes=await createAccount({email,password})
      
      if(createAccountRes.error){
        throw new Error(createAccountRes.error);
      }
      const signInAccountRes=await signInAccount({email,password})
      if(signInAccountRes.error){
        signOutAccount()
        throw new Error(signInAccountRes.error);
      }
      setIsLoading(false)
      navigate("/sign-up-step-2")
    }
    catch (error) {
      setIsLoading(false)
      openNotification({ placement: 'topLeft', description: `${error}`, icon: <ExclamationCircleOutlined style={{ color: "var(--color-green)" }} /> })
    }
  };

  return (
    <Card className='p-2 bg-transparent border-white text-light-1'>
      <Col className='flex flex-col items-center justify-center text-[var(--color-green)]'>
        <div className=' text-2xl font-bold'>Sign Up</div>
        <div className=' text-base'>We're glad you signed up</div>
      </Col>
      <Form
        form={form}
        initialValues={{
          remember: false
        }}
        name="nest-messages"
        onFinish={onFinish}
        layout="vertical"
        className=' w-full py-4'
        autoComplete="off"
      >

        <Form.Item<FieldType> 
          name='email' 
          className="my-4" 
          rules={[{ required: true, type: 'email' }]}
          >
            <Input prefix={<MailOutlined className="site-form-item-icon" />} className='gap-1' placeholder="Email" />
        </Form.Item>

        <Form.Item<FieldType>
          name="password" 
          className="my-4"
          rules={[{ required: true, message: 'Please input your password!'},{min:8,message: '${label} must be between ${min} and ${max}'}]}
        >
          <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} className='gap-1' placeholder="Password" />
        </Form.Item>
        <Form.Item
          name="confirmPassword" 
          className="my-4"
          dependencies={['password']}
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
                return Promise.reject(new Error('The new password that you entered do not match!'));
              },
            }),
          ]}
        >
          <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} className='gap-1' placeholder="confirm password" />
        </Form.Item>
        <Form.Item className='w-full justify-center'>
          <Button type="primary" className='w-full p-4 rounded-xl' htmlType="submit" loading={isLoading}>
              Next
          </Button>
        </Form.Item>
      </Form>
      <Row className=' justify-center gap-2'>
        <div>I have account</div>
        <Link to={"/sign-in"} className=' text-[var(--color-green)] font-semibold'>
          Sign In
        </Link>
      </Row>
    </Card>
  )
}

export default memo(SignUpForm)