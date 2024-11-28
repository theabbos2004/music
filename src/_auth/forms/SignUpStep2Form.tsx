import { useNavigate } from 'react-router-dom'
import { Button, Card, Checkbox, Col, Form, Input, Radio, Row } from 'antd';
import type { FormProps } from 'antd';
import { Link } from 'react-router-dom';
import { CheckCircleOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { memo, useEffect, useState } from 'react';
import { useCreateUserAccount, useGetAccount, useSignOutAccount } from '../../lib/react-query/queris';
import { useMainContext } from '../../contexts/MainContext';
import { useUserContext } from '../../contexts/AuthContext/AuthContext';

function SignUpStep2Form() {
  const navigate = useNavigate()

  const { mutateAsync: createUserAccount } = useCreateUserAccount()
  const { mutateAsync: signOutAccount } = useSignOutAccount()
  const { mutateAsync: getAccount } = useGetAccount()
  
  const { openNotification } = useMainContext()
  const { checkAuthUser } = useUserContext()

  const [ isLoading , setIsLoading] = useState<boolean>()


  const [form] = Form.useForm();


  type FieldType = {
    name: string;
    gender:string;
    remember:boolean
  };

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    setIsLoading(true)
    try {
      const { name , gender , remember} = values
      const currentAccountRes = await getAccount()
      
      if (currentAccountRes.error) {
        throw new Error(currentAccountRes.error)
      }

      const newUser = await createUserAccount({
        email:currentAccountRes.data.email,
        accountId: currentAccountRes.data.$id,
        name,
        gender
      })      
      if (newUser.error) {
        throw new Error(newUser.error)
      }
      const ischeckAuthUser = await checkAuthUser()
      
      if (ischeckAuthUser.error) {
        throw new Error(ischeckAuthUser.error)
      }
      !remember && signOutAccount()
      navigate("/")
      openNotification({ placement: 'topLeft', description: "tizimga xush kelibsiz", icon: <CheckCircleOutlined style={{ color: "var(--color-green)" }} /> })
    }
    catch (error) {
      openNotification({ placement: 'topLeft', description: `${error}`, icon: <ExclamationCircleOutlined style={{ color: "var(--color-green)" }} /> })
    }
    finally{
      setIsLoading(false)
    }
  };  
  useEffect(() => {
    const handleBeforeUnload = () => {
      signOutAccount()
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
    useEffect(()=>{
      const authCurrentAccountFc=async ()=>{
        const currentAccountRes=await getAccount()
        
        currentAccountRes.error && navigate("/sign-up")
      }
      authCurrentAccountFc()
    },[])
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
          name="name"
          rules={[{ required: true, message: 'Please input your name !' }]}
        >
          <Input  prefix={<EditOutlined className="site-form-item-icon" />} className='gap-1' placeholder='Name'/>
        </Form.Item>
        <Form.Item<FieldType>
          name="gender"
          rules={[{ required: true, message: 'Please input gender !' }]}
        >
          <Radio.Group>
            <Radio value="male" className='dark:text-gray-300'>male</Radio>
            <Radio value="female" className='dark:text-gray-300'>female</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item<FieldType>
          valuePropName="checked"
          name="remember"
          layout={"horizontal"}
          className="my-4"
        >
          <Checkbox  className='text-gray-600 dark:text-gray-400'>Remember me</Checkbox>
        </Form.Item>
        <Form.Item className='w-full justify-center'>
          <Button type="primary" className='w-full p-4 rounded-xl' htmlType="submit" loading={isLoading}>
              Submit
          </Button>
        </Form.Item>
      </Form>
      <Row className=' justify-center gap-2'>
        <div dark:text-gray-300>I have account</div>
        <Link to={"/sign-in"} className=' text-[var(--color-green)] font-semibold'>
          Sign In
        </Link>
      </Row>  
      </Card>
  )
}

export default memo(SignUpStep2Form)