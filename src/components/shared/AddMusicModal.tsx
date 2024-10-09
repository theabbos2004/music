import { Button, ConfigProvider, Form, FormProps, Input, Modal, Row, Upload } from 'antd';
import { IActiveSong } from '../../types';
import { RcFile } from 'antd/es/upload';
import { useMainContext } from '../../contexts/MainContext';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useState } from 'react';

export default function AddMusicModal({isModalOpen,toggleModal,submitFunc}:{isModalOpen:any,toggleModal:any,submitFunc:any}) {
    const { openNotification ,theme} = useMainContext()
    const [ isLoading , setIsLoading] = useState<boolean>()
    const [form] = Form.useForm();

    const uploadProps = {
        beforeUpload: (file:any)=>handleUpload(file),
        maxCount: 1,
    };
    const handleUpload = (file: RcFile) => {
    try{
        const isMp3 = file.type === 'audio/mpeg';
        if (!isMp3) {
        throw Error("You can only upload MP3 files!")
        }
    }
    catch(error){
        openNotification({ placement: 'topLeft', description: `${error}`, icon: <ExclamationCircleOutlined style={{ color: "var(--color-green)" }} /> })
    }
    };
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
      

      const onFinish: FormProps<IActiveSong>['onFinish'] = async (values) => {
        setIsLoading(true)
        try {
            const { title, singer,image_url,music_url} = values
            if(title && singer){
                const newMusic=await submitFunc({title,singer,image_url:image_url.file.originFileObj,music_url:music_url.file.originFileObj})
                if (newMusic.error) {
                    throw new Error(newMusic.error)
                }
                setIsLoading(false)
                toggleModal("music", false)
                openNotification({ placement: 'topLeft', description: "musiqa yartildi", icon: <ExclamationCircleOutlined style={{ color: "var(--color-green)" }} /> })
                form.resetFields()
            }
        }
        catch(error){
            toggleModal("music", false)
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
        title="Add Music"
        open={isModalOpen?.title==="music" && isModalOpen?.target}
        onOk={() => toggleModal("music", false)}
        onCancel={() => toggleModal("music", false)}
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


            <Form.Item<IActiveSong>
                name="title" 
                className="my-4"
                rules={[{ required: true, message: 'Please input title!'}]}
            >
                <Input  className='gap-1' placeholder="song title" />
            </Form.Item>
            <Form.Item<IActiveSong>
                name="singer" 
                className="my-4"
                rules={[{ required: true, message: "Please input singer name!"}]}
            >
                <Input  className='gap-1' placeholder="singer name" />
            </Form.Item>
            <Form.Item<IActiveSong>
                name="image_url"
                className='flex justify-center'
                rules={[{ required: true, message: "Please upload Image!" }]}
            >
                <Upload className="" style={{width:"100%"}} name="logo" action="/upload.do" listType="picture"  maxCount={1}>
                    <Button className=' w-full text-wrap'>Click to upload image</Button>
                </Upload>
            </Form.Item>

            <Form.Item<IActiveSong>
                name="music_url"
                className='flex justify-center'
                rules={[{ required: true, message: "Please upload music!" }]}
            >
                <Upload {...uploadProps} accept=".mp3,.wav"  maxCount={1}>
                    <Button>Click to upload music</Button>
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
