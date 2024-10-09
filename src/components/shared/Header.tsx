import { Button, Col, Dropdown, Flex, Row, Space } from "antd";
import Search from "./Search";
import { FaMoon, FaSearch, FaSun } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import Profile from "./Profile";
import { Link, useLocation } from "react-router-dom";
import { Link as ScrollLink } from 'react-scroll';
import { useMainContext } from "../../contexts/MainContext";
import { useUserContext } from "../../contexts/AuthContext/AuthContext";
import { memo, useEffect, useState } from "react";
import { IoLogOutOutline, IoMenu } from "react-icons/io5";
import { useSignOutAccount } from "../../lib/react-query/queris";
import { Header } from "antd/es/layout/layout";


const HeaderTop=({currentUser}:{currentUser:any})=> {
    const {isAuthenticated}=useUserContext()
    const {collapsed,setSearchWord,theme,setTheme,setCollapsed}=useMainContext()
    const {mutateAsync:signOutAccount}=useSignOutAccount()
    const {pathname}=useLocation()
    const [activeSearch,setActiveSearch]=useState<boolean>(false)
    const onchageSearch=(word:string)=>{
        setSearchWord(word)
    }
    const closeSearch=()=>{
        setActiveSearch(false)
    }
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(Number(window.scrollY));
        };
        const handleSize = () => {
            window.innerWidth < 640 && setCollapsed({collapsed:true,show:false})
        };
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleSize);
        handleSize()
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleSize);
        };
    }, []);
    
  return (
    <Header
    className={`h-[3.5rem] items-center justify-between px-6 fixed z-10 border-b-[0.1rem]
        ${collapsed.collapsed? "w-full sm:w-[calc(100vw-10rem)]":"w-[calc(100vw-5rem)] sm:w-[calc(100vw-6rem)]"}
        ${pathname.includes("user")&&scrollY>10
            ?"dark:bg-[var(--dark-bg-blue)] bg-gray-800/50 backdrop-blur-sm"
            :pathname.includes("user")?"bg-transparent border-b-0"
            :"bg-white dark:bg-[var(--dark-bg-blue)]"}
        ${pathname.includes("setting")?"hidden":"flex"}`}
        >
            <Flex className={` items-center gap-2 font-bold text-2xl `}>
                <IoMenu 
                    className={`size-6 text-[var(--color-blue-1)] cursor-pointer ${activeSearch || collapsed.show ?"hidden":"block sm:hidden"}`}
                    onClick={()=>{setCollapsed({collapsed:false,show:true})}}
                />
                <Link to={"/"} className=" no-underline text-[--color-green] hover:text-gray-400">
                    Music
                </Link>
            </Flex>
            <Col className={`flex items-center ${activeSearch?"block":"hidden sm:block"}`}>
                <ScrollLink to={"filterMusic_Top Like"} smooth={true} duration={500} className="size-full flex justify-center items-center">
                    <Search event={{onchageSearch,closeSearch}}/>
                </ScrollLink>
            </Col>
            <Col className="flex gap-4 items-center">
                <FaSearch 
                    className={`size-5 text-[var(--color-blue-1)] cursor-pointer ${activeSearch?"hidden":"block sm:hidden"}`}
                    onClick={()=>{setActiveSearch(true)}}
                    />
                {
                    theme==="light"?
                    <FaMoon 
                        className={`size-5 text-[var(--color-blue-1)] cursor-pointer ${activeSearch?"hidden":"block"}`}
                        onClick={()=>{
                            setTheme("dark")
                        }}
                        />
                        :<FaSun 
                        className={`size-6 text-[var(--color-blue-1)] cursor-pointer ${activeSearch?"hidden":"block"}`}
                        onClick={()=>{
                            setTheme("light")
                    }}
                    />
                }
                <>
                    {
                        pathname.includes("user")?
                        <Row className="flex gap-4">
                            {/* <IoMdNotifications className="size-7 text-[var(--color-blue-1)] cursor-pointer"/> */}
                            <Dropdown menu={{ items:[
                                {
                                    key: '1',
                                    label: (
                                    <Link to={`${pathname}/setting/profile`}>
                                        Setting
                                    </Link>
                                    ),
                                    icon:<IoMdSettings  className="size-5 text-[var(--color-blue-1)] cursor-pointer"/>
                                },
                                {
                                    key: '2',
                                    label: (
                                    <div onClick={()=>{signOutAccount()}}>
                                        Log out
                                    </div>
                                    ),
                                    icon: <IoLogOutOutline className=" size-5 text-[var(--color-blue-1)] cursor-pointer"/>,
                                }]}}
                                >
                                <Space>
                                    <IoMdSettings  className="size-7 text-[var(--color-blue-1)] cursor-pointer"/>
                                </Space>
                            </Dropdown>
                        </Row>
                        : isAuthenticated ?
                            <>
                                {/* <IoMdNotifications className="size-7 text-[var(--color-blue-1)] cursor-pointer"/> */}
                                <Link to={`/user/${currentUser?.$id}`}>
                                    <Profile 
                                        IconClassName="text-[var(--color-green)]" 
                                        classNameBox={`size-7 border-[var(--color-green)] cursor-pointer`}
                                        />
                                </Link>
                            </>
                            :<>
                                <Button>
                                    <Link to="sign-up">
                                        Sign Up
                                    </Link>
                                </Button>
                                <Button type="primary">
                                    <Link to="sign-in">
                                        Sign In
                                    </Link>
                                </Button>
                            </>
                    }
                </>
            </Col>
            
    </Header>
  )
}
export default memo(HeaderTop)
