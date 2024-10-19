import { Button, ConfigProvider, Form, FormProps, Input, Modal, Upload } from 'antd';
import { ICreateAlbum } from '../../types';
import { useMainContext } from '../../contexts/MainContext';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useCreateAdvertising, usegetCurrentUserQuery } from '../../lib/react-query/queris';

export default function AddAdvertisingModal({isModalOpen,toggleModal}:{isModalOpen:any,toggleModal:any}) {
    const { openNotification,theme } = useMainContext()
    const [ isLoading , setIsLoading] = useState<boolean>()
    const [fileList, setFileList] = useState<any[]>([]);
    const [form] = Form.useForm();
    const {mutateAsync:createAdvertising}=useCreateAdvertising()
      const modalStyles = {
        content:{
            backgroundColor:`${theme==="dark"&&"var(--color-blue-1)"}`,
        },
        header: {
            display: "flex",
            justifyContent: "center",
            backgroundColor:"transparent",
        },
        body: {
        },
        mask: {
          backdropFilter: 'blur(10px)',
        },
      };
      const {data:currentUser}=usegetCurrentUserQuery()

      const onFinish: FormProps<ICreateAlbum>['onFinish'] = async (values) => {
        setIsLoading(true)
        try {
            const { title,image_url} = values
            const newMusic = await createAdvertising({
                creator:currentUser?.data?.$id,
                title,
                image_url:image_url.file.originFileObj
            })
            if (newMusic.error) {
                throw new Error(newMusic.error)
            }
            setIsLoading(false)
            toggleModal({title:"advertising",target:false})
            openNotification({ placement: 'topLeft', description: "new advertising has created", icon: <ExclamationCircleOutlined style={{ color: "var(--color-green)" }} /> })
            form.resetFields()
        }
        catch(error){
            toggleModal({title:"advertising",target:false})
            setIsLoading(false)
            openNotification({ placement: 'topLeft', description: `${error}`, icon: <ExclamationCircleOutlined style={{ color: "var(--color-green)" }} /> })
        }
      }
  return (
    <ConfigProvider
    modal={{
        styles: modalStyles,
    }}
>
    <Modal
        title="Add advertising"
        open={isModalOpen?.title==="advertising" && isModalOpen?.target}
        onOk={() => toggleModal({title:"advertising",target:false})}
        onCancel={() => toggleModal({title:"advertising",target:false})}
        footer={null}
        width={300}
    >
        <Form
            form={form}
            initialValues={{
                remember: false
            }}
            name="create-music"
            onFinish={onFinish}
            layout="vertical"
            className=' w-full py-4'
            autoComplete="off"
        >


            <Form.Item<ICreateAlbum>
                name="title" 
                className="my-4"
                rules={[{ required: true, message: 'Please input title!'}]}
            >
                <Input  className='gap-1' placeholder="title" />
            </Form.Item>
            <Form.Item<ICreateAlbum>
                name="image_url"
                className='flex justify-center'
                rules={[{ required: true, message: "Please upload Image!" }]}
            >
                <Upload accept=".jpg,.png" className='w-full' action="/upload.do" listType="picture"  maxCount={1} fileList={fileList} onChange={({fileList})=>setFileList(fileList)}>
                    <Button className='w-full text-wrap'>Click to upload image</Button>
                </Upload>
            </Form.Item>
            <Form.Item className='w-full justify-center'>
            <Button type="primary" className='w-full p-4 rounded-xl' htmlType="submit" loading={isLoading}>
                Submit
            </Button>
            </Form.Item>
        </Form>
    </Modal>
    </ConfigProvider>
  )
}
