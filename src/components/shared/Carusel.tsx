import React, { memo, useEffect, useRef, useState } from 'react';
import { Carousel, Col, Flex, Row } from 'antd';
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
  <div className={`p-4 relative`}> 
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
                className='h-[15rem] sm:h-[25rem] sm:w-full md:w-11/12 lg:w-3/4 xl:w-2/3 text-white bg-[var(--color-green-1)] rounded-[1.5rem] overflow-hidden m-[0 2rem] mx-auto'
                onMouseEnter={()=>setMusicEvent(IState=>{
                  return {...IState,hover:true}
                })}
                onMouseLeave={()=>setMusicEvent(IState=>{
                  return {...IState,hover:false}
                })}
                >
                  <Col span={6} className='bg-[var(--color-gray)] dark:bg-slate-700 flex items-end'>
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
      <Flex className=' justify-center absolute top-[60%] sm:top-2/3 right-[4%] lg:right-[12%] xl:right-[17%] w-3/5 sm:w-3/5 md:w-2/4 lg:w-2/5 xl:w-1/3 gap-2'>
        {
          advertising?.map((music:any,musicIndex:number)=><Col key={musicIndex} span={7} className='sm:h-20 rounded-xl overflow-hidden shadow-sm shadow-stone-700'>
            <img
              src={music.image_url}
              className='w-full h-full object-cover object-center'
              onClick={()=>caruselRef.current.goTo(musicIndex)}
            />
          </Col>)
        }    
      </Flex>
  </div>)
  }

export default memo(Carusel);