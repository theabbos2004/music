import { memo } from 'react'
import { sidebarSettingsLinks, userAbality } from "../../constants";
import * as IconAi from 'react-icons/ai';
import * as IconFa from 'react-icons/fa';
import * as IconBs from "react-icons/bs";
import * as IconFa6 from "react-icons/fa6";
import * as IconRi from "react-icons/ri";
import * as IconIo5 from 'react-icons/io5'
import { Link, useLocation } from 'react-router-dom';
import Sider from 'antd/es/layout/Sider';
import { Button, Col, Row } from 'antd';
import { useMainContext } from '../../contexts/MainContext';

function SettingSideBar() {
    const {theme,collapsedSetting,setCollapsedSetting}=useMainContext()
    const { pathname } = useLocation()
    return (
        <Sider trigger={null} collapsible collapsed={collapsedSetting} theme={theme} className='h-min-[calc(100vh)] border-r-2 relative' width={collapsedSetting ? "6rem" : "10rem"}>
            <Col
                className={`w-full h-[3.5rem] hidden sm:flex items-center ${collapsedSetting ? "justify-center" : "justify-end pr-5"}`}
            >
                <Button
                    type="text"
                    icon={collapsedSetting ? <IconRi.RiMenuFill /> : <IconRi.RiMenu3Fill />}
                    onClick={() => setCollapsedSetting(!collapsedSetting)}
                    className='text-[var(--color-blue-1)] text-xl'
                />
            </Col>
            <Col
                className={`w-full flex flex-col justify-center items-center absolute top-1/2 translate-y-[-50%] p-2 ${collapsedSetting ? "left-2/4 translate-x-[-50%]" : "left-1/2 translate-x-[-50%]"}`}
            >
                {
                    sidebarSettingsLinks?.map(menu => {
                        const IconAnt = (IconAi as any)[menu.icon] || (IconFa as any)[menu.icon] || (IconBs as any)[menu.icon] || (IconFa6 as any)[menu.icon] || (IconIo5 as any)[menu.icon]
                        return (
                            userAbality.filter((abality)=>menu.label===abality.label)&&
                            <Row
                                key={menu.key}
                                className='w-full my-4 cursor-pointer px-1'
                                >
                                <Link 
                                    to={menu.route} 
                                    className={`flex items-center w-full ${!collapsedSetting && "gap-2"}`}
                                    >
                                    <Col span={2}>
                                        <div className={`w-1 h-4 ${pathname.includes(menu.route) && 'bg-[var(--color-green)]'}`}></div>
                                    </Col>
                                    <Col 
                                        span={22} 
                                        className={`flex items-center gap-3 ${collapsedSetting && "justify-center"}`}
                                        >
                                        <IconAnt 
                                            className={`text-xl ${pathname.includes(menu.route) ? 'text-[var(--color-green)]' : 'text-[var(--color-blue-1)]'}`} 
                                            />
                                        <div
                                            className={` font-semibold overflow-hidden text-ellipsis 
                                                ${collapsedSetting ? "hidden" : "block"} 
                                                ${pathname.includes(menu.route) ? 'text-[var(--color-green)]'
                                                    : 'text-[var(--color-blue-1)]'}`}
                                            >{menu.label}</div>
                                    </Col>
                                </Link>
                            </Row>
                        )
                    })
                }

            </Col>
        </Sider>
    )
}
export default memo(SettingSideBar)