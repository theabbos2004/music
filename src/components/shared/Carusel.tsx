import React, { memo, useEffect, useRef, useState } from 'react';
import { Carousel, Col, Flex, Row, Skeleton, Space } from 'antd';
import { useGetAdvertising } from '../../lib/react-query/queris';
import { BsPauseCircleFill, BsPlayCircleFill } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { playPause, setActiveSong } from '../../redux/features/playerSlice';
import { RootState } from '../../redux/store';

type IMusicEvent={
  hover:boolean
}

const Carusel: React.FC = () => {
  const {data:getAdvertising}=useGetAdvertising()
  const { isPlaying , activeSong , currentIndex} = useSelector((state:RootState) => state?.player);
  const [musicEvent,setMusicEvent]=useState<IMusicEvent>()
  const [advertising,setAdvertising]=useState<any>()
  const caruselRef=useRef<any>()
  const dispatch = useDispatch();

  useEffect(()=>{
    let newAdvertising=getAdvertising?.data?.documents[Math.floor(Math.random()*getAdvertising?.data?.documents.length)]
    setAdvertising(newAdvertising?.musics)
  },[getAdvertising?.data])
  return (
  <div className={`p-4 px-8 sm:px-4 relative w-full`}> 
      {
        advertising?
          <Carousel 
              autoplay 
              infinite={true}
              speed={300}
              draggable={true}
              ref={caruselRef}
          >
            {
              advertising?.map((music:any,index:number)=>
                <div key={index} className='flex flex-row justify-center'>
                  <Row 
                    className='h-[18rem] sm:h-[25rem] sm:w-full md:w-11/12 lg:w-3/4 xl:w-2/3 text-white rounded-[1.5rem] overflow-hidden m-[0 2rem] mx-auto'
                    onMouseEnter={()=>setMusicEvent(IState=>{
                      return {...IState,hover:true}
                    })}
                    onMouseLeave={()=>setMusicEvent(IState=>{
                      return {...IState,hover:false}
                    })}
                    >
                      <Col span={6} className=' dark:bg-slate-700 bg-slate-700 flex items-end'>
                          <Col className='bottom-20 absolute w-[200%] px-2 z-[1] text-center'>
                              <div className='w-full text-3xl whitespace-wrap overflow-hidden overflow-ellipsis'>{music?.singer}</div>
                              <div className='pt-2 text-xl whitespace-nowrap overflow-hidden overflow-ellipsis'>{music?.title}</div>
                          </Col>
                      </Col>
                      <Col
                        span={18}
                        className={`bg-cover bg-no-repeat bg-center flex justify-center items-center`}
                        style={{backgroundImage:music.image_url ? `url("${music.image_url}")` : 'url("../../../public/vite.svg")'}}
                        >
                          {
                            musicEvent?.hover && isPlaying && music.title === activeSong.title && currentIndex==index ? 
                              <BsPauseCircleFill
                                onClick={()=>{
                                  dispatch(playPause(false));
                                }} 
                                className='text-[var(--color-green)]  text-5xl'
                              />
                            : musicEvent?.hover ? <BsPlayCircleFill 
                              onClick={async()=>{
                                dispatch(setActiveSong({song:music,songs:advertising,i:index}));
                                dispatch(playPause(true));
                              }}
                              className='text-[var(--color-green)]  text-5xl'
                            />
                            :""
                          }
                      </Col>
                  </Row>
                </div>
              )
            }
          </Carousel> 
        :<Space className=' relative h-[18rem] sm:h-[25rem] sm:w-full md:w-11/12 lg:w-3/4 xl:w-2/3 text-white  rounded-[1.5rem] overflow-hidden m-[0 2rem] mx-auto flex flex-col'>
            <Skeleton.Node active={true} style={{position:"absolute",top:0,left:0, width: "100%",height:"100%",borderRadius:"1rem" }}><></></Skeleton.Node>
        </Space>
      }
      {
        advertising?
          <Flex className='justify-between absolute top-[60%] sm:top-[60%] right-[8%] lg:right-[15%] xl:right-[20%] w-3/5 sm:w-3/5 md:w-2/4 lg:w-2/5 h-1/4 sm:h-1/4 xl:h-1/4 gap-2'>
          {
            advertising?.map((music:any,musicIndex:number)=><Col key={musicIndex} span={7} className=' rounded-xl overflow-hidden shadow-sm shadow-stone-700'>
              <img
                src={music.image_url}
                className='w-full h-full object-cover object-center'
                onClick={()=>caruselRef.current.goTo(musicIndex)}
              />
            </Col>)
          }    
        </Flex>
        : <Space className='absolute top-[60%] sm:top-[60%] right-[8%] lg:right-[15%] xl:right-[20%] w-3/5 sm:w-3/1 md:w-2/4 lg:w-2/5 h-1/4 sm:h-1/4 xl:h-1/4 overflow-hidden'>
        <Skeleton.Node active={true} style={{position:"absolute",top:0,width: "30%",height:"100%",borderRadius:"1rem" }}><></></Skeleton.Node>
        <Skeleton.Node active={true} style={{position:"absolute",top:0,left:"33%",width: "30%",height:"100%",borderRadius:"1rem" }}><></></Skeleton.Node>
        <Skeleton.Node active={true} style={{position:"absolute",top:0,left:"66%",width: "30%",height:"100%",borderRadius:"1rem" }}><></></Skeleton.Node>
      </Space>
      }
  </div>)
  }

export default memo(Carusel);