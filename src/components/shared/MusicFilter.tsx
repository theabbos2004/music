import { Col, Row } from "antd"
import { memo, useEffect, useState } from "react"
import { Link } from 'react-scroll';
import { IMusicFilter } from "../../types";

type IMenu={
    id:number,
    title:string,
    active:boolean,
    scroll?:{},
    onClicFunc:()=>void
}

function MusicFilter({data}:{data:any}) {
    const [menu,setMenu]=useState<IMenu[]>()
    
    useEffect(()=>{
        if(data){
            const newFilterMusic=data?.map((music:IMusicFilter,musicIndex:number)=>(musicIndex===0)? {...music,active:true}:music)
            setMenu(newFilterMusic)
        }
    },[data])
    
  return (
    <Row className="py-2 items-center justify-between">
        <Row className="gap-3">
            {
                menu?.map((menu:any,menuIndex:any)=>
                        menu?.scroll?
                        <Link key={menuIndex} to={menu?.scroll?.to} smooth={true} duration={500}>
                            <Col
                                className={` font-semibold flex justify-center items-center rounded-3xl px-4 py-1 cursor-pointer hover:bg-[var(--color-green)] hover:text-white ${menu.active ? "bg-[var(--color-green)] text-white":"bg-[var(--color-green-1)] text-[var(--color-gray)]"}`}
                                onClick={()=>{
                                    setMenu(inittialState=>{
                                        return inittialState?.map(IMenu=>{
                                            if(menu?.id===IMenu?.id){
                                                return {...IMenu,active:true}
                                            }
                                            else{
                                                return {...IMenu,active:false}
                                            }
                                        })
                                    })
                                    menu?.onClicFunc()
                                }}
                                >
                                {menu?.title}
                            </Col>
                        </Link>
                        :<Col
                            key={menuIndex} 
                            className={` font-semibold flex justify-center items-center rounded-3xl px-4 py-1 cursor-pointer hover:bg-[var(--color-green)] hover:text-white ${menu.active ? "bg-[var(--color-green)] text-white":"bg-[var(--color-green-1)] text-[var(--color-gray)]"}`}
                            onClick={()=>{
                                setMenu(inittialState=>{
                                    return inittialState?.map(IMenu=>{
                                        if(menu?.id===IMenu?.id){
                                            return {...IMenu,active:true}
                                        }
                                        else{
                                            return {...IMenu,active:false}
                                        }
                                    })
                                })
                                menu?.onClicFunc()
                            }}
                            >
                            {menu?.title}
                        </Col>
                )
            }
        </Row>
    </Row>
  )
}
export default memo(MusicFilter)
