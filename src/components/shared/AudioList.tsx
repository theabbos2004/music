import { Col, Row } from "antd";
import { useEffect, useState } from "react";
import { BsHeart, BsPauseCircleFill, BsPlayCircleFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { IActiveSong } from "../../types";
import { playPause, setActiveSong, setIsMusicList } from "../../redux/features/playerSlice";

export default function AudioList() {
  const {currentSongs,isMusicList,isPlaying,activeSong}=useSelector((state:RootState)=>state?.player)
  const [musicList,setMusicList]=useState<any[]>()
  const dispatch=useDispatch()
  useEffect(()=>{
      const newCurrentSongs=currentSongs?.map((state:IActiveSong)=>{
        return {...state,liked:[]}
      })
      setMusicList(newCurrentSongs)
  },[currentSongs])
  return (
    <Col 
      className={`${isMusicList?"flex":"hidden"}  flex-col p-3 fixed right-0 top-16 h-[calc(100%-8rem)] w-64 bg-[var(--color-gray)] rounded-s-xl z-20 gap-3`}
      onMouseLeave={()=>dispatch(setIsMusicList())}
      >
      {
        musicList && musicList?.map((music,index)=>(
          <Row 
            key={index}
            className="flex justify-between items-center cursor-pointer rounded-xl p-1"
            onMouseEnter={()=>setMusicList((IState:any)=>IState.map(((ISMusic:any)=> ISMusic.$id===music.$id ? {...ISMusic,hover:true} : {...ISMusic,hover:false})))}
            onMouseLeave={()=>setMusicList((IState:any)=>IState.map(((ISMusic:any)=>ISMusic.$id===music.$id ? {...ISMusic,hover:false} :{...ISMusic,hover:false})))}
            >
            <Col
              span={4}
              >
                <div 
                  className=" w-8 h-8 bg-slate-600 bg-cover bg-no-repeat bg-center flex justify-center items-center rounded-xl"
                  style={{backgroundImage:music.image_url ? `url("${music.image_url}")` : 'url("../../../public/vite.svg")'}}
                  >
                    {
                      isPlaying && music?.hover && activeSong.title==music.title ?
                      <BsPauseCircleFill
                        onClick={()=>{
                          dispatch(playPause(false))
                        }} 
                        className={`text-[var(--color-green)]  text-base`}
                      />
                      : music?.hover ? <BsPlayCircleFill 
                        onClick={()=>{
                          dispatch(playPause(false))
                          dispatch(setActiveSong({songs:currentSongs,song:music,i:index}))
                          dispatch(playPause(true))
                        }}
                        className={`text-[var(--color-green)]  text-base`}
                        />
                      :""
                    }
                </div>
            </Col>
            <Col span={16} className="flex flex-col justify-center leading-none">
              <div className=" text-gray-100 capitalize">{music.title}</div>
              <div className=" text-gray-300 capitalize text-xs">{music.singer}</div>
            </Col>
            <Col span={4} className=" flex justify-center items-center">
                <BsHeart/>
            </Col>
          </Row>
        ))
      }
    </Col>
  )
}
