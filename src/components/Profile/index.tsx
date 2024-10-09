import { Button, Flex, Form, Upload } from 'antd';
import { memo, useEffect, useState } from 'react'
import { ProfileLeft, ProfileRight } from '../shared';
import { IFORMEDITPROFILE } from '../../types';


function ProfileInfo({ user, edit }: { user?: any, edit?: boolean }) {
    const [bgImage, setBgImage] = useState<any>()
    useEffect(()=>{
        setBgImage({urlImg:user?.bg_img_url})
    },[user])
      
    return (
        <div 
            className={`relative w-full`} 
            >
            <Form.Item<IFORMEDITPROFILE>
                name="bg_img_url"
                style={{backgroundImage:`url(${bgImage?.urlImg})`}}
                className='h-60 bg-center bg-cover bg-gray-500 dark:bg-gray-800 flex justify-center items-center m-0 p-0'
                getValueFromEvent={(e: any) => {
                    const urlImg=URL.createObjectURL(e.file.originFileObj)
                    setBgImage({urlImg,files:e.files})
                    return e?.file.originFileObj
            }}
            >
                <Upload fileList={bgImage?.files} name="logo" action="/upload.do" listType="picture" maxCount={1} showUploadList={false}>
                    <Button className={`p-4 rounded-xl bg-slate-600 text-white ${!edit && "hidden"}`}>Upload img</Button>
                </Upload>
            </Form.Item>
            <Flex className='w-full px-6  translate-y-[calc(-50%+0.5rem)] sm:translate-y-[-50%] m-auto justify-between rounded-xl'>
                <ProfileLeft user={user} edit={edit} />
                <ProfileRight user={user} edit={edit} />
            </Flex>
        </div>
    )
}
export default memo(ProfileInfo)
