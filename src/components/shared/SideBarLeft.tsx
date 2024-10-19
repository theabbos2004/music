import { memo, useEffect, useState } from 'react'
import { sidebarLinks } from "../../constants";
import * as IconAi from 'react-icons/ai';
import * as IconFa from 'react-icons/fa';
import * as IconBs from "react-icons/bs";
import * as IconFa6 from "react-icons/fa6";
import * as IconRi from "react-icons/ri";
import { Link, useLocation } from 'react-router-dom';
import Sider from 'antd/es/layout/Sider';
import { Button, Col, Row } from 'antd';
import { useMainContext } from '../../contexts/MainContext';
import { useGetAccount } from '../../lib/react-query/queris';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useUserContext } from '../../contexts/AuthContext/AuthContext';
import { IoCloseOutline } from 'react-icons/io5';

function SideBarLeft() {
    const { theme, collapsed, setCollapsed, openNotification } = useMainContext()
    const { isAuthenticated } = useUserContext()
    const { pathname } = useLocation()
    const { mutateAsync: getAccount } = useGetAccount()
    const [user, setUser] = useState<{ labels: any }>()
    const [width, setWidth] = useState<number>(1200)
    useEffect(() => {
        isAuthenticated && getUserFunc()
    }, [isAuthenticated])



    useEffect(() => {
        handleSize()
        window.addEventListener('resize', handleSize);
        return () => { window.removeEventListener('resize', handleSize) };
    }, []);

    const handleSize = () => { setWidth(window.innerWidth) };

    const getUserFunc = async () => {
        try {
            const getAccountRes = await getAccount()
            if (getAccountRes.error) {
                throw new Error(getAccountRes.error)
            }
            setUser(getAccountRes?.data)
        }
        catch (error) {
            openNotification({ placement: 'topLeft', description: `${error}`, icon: <ExclamationCircleOutlined style={{ color: "var(--color-green)" }} /> })
        }
    }
    return (
        <Sider trigger={null} collapsible collapsed={false} theme={theme}
            className={`
                ${!collapsed?.show ? "hidden" : "flex"} relative ${pathname.includes("setting") ? "hidden" : "sm:flex"}`}
            style={{ borderRight: "0.1rem solid white" }}
            width={collapsed?.collapsed ? "10rem" : "5rem"}
        >
            <Col className={`${collapsed?.collapsed ? "w-[10rem]":"w-[5rem]"} h-[100vh] fixed`}>
                <Col
                    className={`w-full h-[3.5rem] flex items-center ${collapsed?.collapsed ? "justify-end pr-5":"justify-center"}`}
                >
                    {
                        width > 640 ?
                            <Button
                                type="text"
                                icon={collapsed?.collapsed ? <IconRi.RiMenuFill /> : <IconRi.RiMenu3Fill />}
                                onClick={() => setCollapsed({ collapsed: !collapsed.collapsed, show: true })}
                                className='text-[var(--color-blue-1)] text-xl'
                            />
                            :
                            <Button
                                type="text"
                                icon={<IoCloseOutline/>}
                                onClick={() => setCollapsed({ collapsed: !collapsed.collapsed, show: false })}
                                className='text-xl cursor-pointer text-[var(--color-green)]'
                            />
                    }
                </Col>
                <Col
                    className={`w-full flex flex-col justify-center items-center absolute top-1/2 translate-y-[-50%] p-2 ${collapsed?.collapsed ? "left-1/2 translate-x-[-50%]":"left-2/4 translate-x-[-50%]"}`}
                >
                    {
                        sidebarLinks?.map(menu => {
                            const IconAnt = (IconAi as any)[menu.icon] || (IconFa as any)[menu.icon] || (IconBs as any)[menu.icon] || (IconFa6 as any)[menu.icon]
                            return (
                                (user?.labels.includes("admin") && menu?.categorize?.includes("admin")
                                    || !menu?.categorize?.includes("admin") && !menu?.categorize?.includes("premium"))
                                && <Row
                                    key={menu.key}
                                    className='w-full my-4 cursor-pointer px-1'
                                >
                                    <Link
                                        to={menu.route}
                                        className={`flex items-center w-full ${collapsed?.collapsed && "gap-2"}`}
                                    >
                                        <Col span={2}>
                                            <div className={`w-1 h-4 ${pathname === menu.route && 'bg-[var(--color-green)]'}`}></div>
                                        </Col>
                                        <Col
                                            span={22}
                                            className={`flex items-center gap-3 ${!collapsed?.collapsed && "justify-center"}`}
                                        >
                                            <IconAnt
                                                className={`text-xl ${pathname === menu.route ? 'text-[var(--color-green)]' : 'text-[var(--color-blue-1)]'}`}
                                            />
                                            <div
                                                className={`font-semibold overflow-hidden text-ellipsis 
                                                    ${collapsed?.collapsed && collapsed?.show ? "block" : "hidden"} 
                                                    ${pathname === menu.route ? 'text-[var(--color-green)]'
                                                        : 'text-[var(--color-blue-1)]'}`}
                                            >{menu.label}</div>
                                        </Col>
                                    </Link>
                                </Row>
                            )
                        })
                    }

                </Col>
            </Col>
        </Sider>
    )
}
export default memo(SideBarLeft)