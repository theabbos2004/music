import { Col, Flex, Form, Row, Upload, } from "antd";
import Profile from "./Profile";
import { IFORMEDITPROFILE } from "../../types";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function ProfileLeft({ user, edit }: { user: any, edit?: boolean }) {
    const [bgImage, setBgImage] = useState<any>()
    const {pathname}=useLocation()
    useEffect(()=>{
        setBgImage({urlImg:user?.imageUrl})
    },[user])
    
    return (
        <Flex className={`flex-col gap-1 sm:gap-0 items-around ${edit ? "w-full" : "w-2/4 sm:w-3/4 lg:w-2/4 xl:w-1/3"}`}>
            <Flex className="gap-6">
                <Col span={edit? 10 : ""}>
                    <Form.Item<IFORMEDITPROFILE>
                        name="imageUrl"
                        className="m-0"
                        getValueFromEvent={(e: any) => {
                                const imageUrl=URL.createObjectURL(e.file.originFileObj)
                                setBgImage({imageUrl,files:e.files})
                                return e?.file.originFileObj
                        }}>
                            {
                                pathname.includes("setting") ?
                                    <Upload
                                            name="avatar"
                                            listType={"picture-circle"}
                                            className="avatar-uploader flex flex-col w-full h-full"
                                            showUploadList={false}
                                            fileList={bgImage?.files}
                                        >
                                            <Profile
                                                IconClassName="w-full text-[var(--color-green)]"
                                                classNameBox="size-4/6 border-[var(--color-green)] cursor-pointer"
                                                imageUrl={bgImage?.imageUrl}
                                            />
                                        </Upload>
                                :
                                    <div className="size-16 sm:size-20">
                                        <Profile
                                            IconClassName="w-full text-[var(--color-green)]"
                                            classNameBox="size-full border-[var(--color-green)]"
                                            imageUrl={bgImage?.imageUrl}
                                        />
                                    </div>
                            }
                    </Form.Item>
                </Col>
                <Col span={edit?12:14} className="px-4 flex flex-col">
                    <Row className="flex-nowrap h-2/4 gap-4 items-center justify-between">
                        {
                            pathname.includes("setting") ?
                                <Form.Item<IFORMEDITPROFILE>
                                    name="name"
                                    className="m-0 p-0"
                                    rules={[{ required: true, message: 'Please input your name!' }]}
                                >
                                    <input 
                                        autoComplete="on"
                                        className='w-full gap-1 text-white whitespace-nowrap overflow-hidden overflow-ellipsis border-0 bg-transparent outline-none' placeholder="name" 
                                        readOnly={!edit} />
                                </Form.Item>
                            :
                            <div className=" gap-1 text-white whitespace-nowrap overflow-hidden overflow-ellipsis border-0 bg-transparent outline-none">
                                {user?.name}
                            </div>
                        }
                    </Row>
                    <Row className={`hidden sm:flex h-2/4 items-center gap-2 text-[var(--color-gray)] justify-between ${pathname.includes("setting") && "hidden"}`}>
                        <Col className="text-center">
                            <div>{user?.followers?.length || '0'}</div>
                            <div>followers</div>
                        </Col>
                        <Col className=" text-center">
                            <div>{user?.follwing?.length || '0'}</div>
                            <div>following</div>
                        </Col>
                        <Col className=" text-center">
                            <div>{user?.musicsList?.length || '0'}</div>
                            <div>musics</div>
                        </Col>
                    </Row>
                </Col>
            </Flex>
            <Flex className={`sm:hidden h-2/4 gap-4 items-center text-[var(--color-gray)] justify-between ${pathname.includes("setting") && "hidden"}`}>
                <Col className=" flex gap-1 text-center">
                    <div>{user?.followers?.length || '0'}</div>
                    <div>followers</div>
                </Col>
                <Col className="flex gap-1 text-center">
                    <div>{user?.follwing?.length || '0'}</div>
                    <div>following</div>
                </Col>
                <Col className="flex gap-1 text-center">
                    <div>{user?.musicsList?.length || '0'}</div>
                    <div>musics</div>
                </Col>
            </Flex>
        </Flex>
    )
}