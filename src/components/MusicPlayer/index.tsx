import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Col, Flex, Row } from 'antd';
import Track from './Track';
import Player from './Player';
import Tools from './Tools';
import { nextSong, playPause, prevSong } from '../../redux/features/playerSlice';
import { RootState } from '../../redux/store';
import SliderMusic from './Slider';
import { useMainContext } from '../../contexts/MainContext';
import { useUserContext } from '../../contexts/AuthContext/AuthContext';
import { useCreateSaveMusic, useSaveMusic, useUpdateAccount } from '../../lib/react-query/queris';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const MusicPlayer = () => {
  const {collapsed}=useMainContext()
  const {currentSongs, activeSong, isActive, isPlaying , musicDuration , currentTime , currentIndex , isMusicList} = useSelector((state:RootState) => state?.player);
  const {user}=useUserContext()
  const [repeat, setRepeat] = useState<boolean>(false);
  const [shuffle, setShuffle] = useState<boolean>(false);
  const { mutateAsync: updateAccount } = useUpdateAccount()
  const { mutateAsync: createSaveMusic } = useCreateSaveMusic()
  const { mutateAsync: saveMusic } = useSaveMusic()
  const { openNotification} = useMainContext()
  const [ isMusicLoading,setIsMusicLoading]=useState<boolean>(false)
  const [ size,setSize]=useState<{width:number}>({width:1024})
  const dispatch = useDispatch();

  useEffect(() => {
      const handleSize = () => {
          setSize({width:window.innerWidth})
      };
      window.addEventListener('resize', handleSize);
      handleSize()
      return () => {
          window.removeEventListener('resize', handleSize);
      };
  }, []);

  const handlePlayPause = () => {
    if (!isActive) return;
    if (isPlaying) {
      dispatch(playPause(false));
    } else {
      dispatch(playPause(true));
    }
  };
  
  const handleNextSong = async () => {
    try{
      dispatch(playPause(false));
      if (!shuffle) {
        dispatch(nextSong((currentIndex + 1) % currentSongs.length));
      } else {
        dispatch(nextSong(Math.floor(Math.random() * currentSongs.length)));
      }
      return true
    }
    catch{
      return false
    }
  };

  const handlePrevSong = async () => {
    try{
      dispatch(playPause(false));
      if (currentIndex === 0) {
        dispatch(prevSong(currentSongs.length - 1));
      } else if (shuffle) {
        dispatch(prevSong(Math.floor(Math.random() * currentSongs.length)));
      } else {
        dispatch(prevSong(currentIndex - 1));
      }
      return true
    }
    catch{
      return false
    }
  };

  const likeMusicFunc = async (music: any) => {
    try {
        setIsMusicLoading(true)
        if(!user){
          throw new Error("register first")
        }
        const liked_musics=user?.liked_musics
        let newLikes=[]
        let availableUser=false
        if(liked_musics?.length===0){
            newLikes.push(music?.$id)
        }
        else{
            liked_musics?.forEach((like:any)=> {
                if(like?.$id !== music?.$id){
                    newLikes.push(like)
                }
                else{
                    availableUser=true
                }
            })
            !availableUser && newLikes.push(music?.$id)
        }   
      const updateMusic = await updateAccount({ user, liked_musics: newLikes })
      if (updateMusic.error) {
        throw new Error(updateMusic.error)
      }
      openNotification({ placement: 'topLeft', description: `it was succesful`, icon: <ExclamationCircleOutlined style={{ color: "var(--color-green)" }} /> })
    }
    catch (error) {
      openNotification({ placement: 'topLeft', description: `${error}`, icon: <ExclamationCircleOutlined style={{ color: "var(--color-red)" }} /> })
    }
    finally{
      setIsMusicLoading(false)
  }
  }
  const saveMusicFunc=async (music:any)=>{        
      try{
          setIsMusicLoading(true)
          if(!user){
              throw new Error("please register first")
          }
          let saveId=user?.saved?.$id
          if(!user?.saved){
              const createSaveMusicRes=await createSaveMusic({userId:user?.id})
              if(createSaveMusicRes.error){
                  throw new Error(createSaveMusicRes.error)
              }
              saveId=createSaveMusicRes?.data?.$id
              
          }
          
          let newSaves=[]
          let availableUser=false
          if(user?.saved?.musics?.length===0){
              newSaves.push(music)
          }
          else{
              user?.saved?.musics?.forEach((save:any)=> {
                  if(save?.$id!==music?.$id){
                      newSaves.push(save)
                  }
                  else{
                      availableUser=true
                  }
              })
              !availableUser && newSaves.push(music)
          }
          const saveMusicRes=await saveMusic({musics:newSaves,saveId})
          if(saveMusicRes.error){
              throw new Error(saveMusicRes.error)
          }
          availableUser?
          openNotification({ placement: 'topLeft', description: `music has been remove in save`, icon: <ExclamationCircleOutlined style={{ color: "var(--color-green)" }} /> })
          :openNotification({ placement: 'topLeft', description: `it was successful`, icon: <ExclamationCircleOutlined style={{ color: "var(--color-green)" }} /> })
          
      }
      catch(error){
          openNotification({ placement: 'topLeft', description: `${error}`, icon: <ExclamationCircleOutlined style={{ color: "var(--color-red)" }} /> })
      }
      finally{
          setIsMusicLoading(false)
      }
  }

    return (
      <Flex className={`flex-col sm:flex-row h-[6rem] sm:h-[4rem] ease-linear fixed bottom-0  z-10 bg-[var(--color-blue-1)] px-6 dark:bg-[var(--dark-bg-blue)] border-t-[0.1rem]
        ${collapsed.collapsed? "w-full sm:w-[calc(100vw-10rem)]":"w-[calc(100vw-5rem)] sm:w-[calc(100vw-6rem)]"}
        ${activeSong.music_url ? "flex" : "hidden"}`}>
        <Row className='w-full flex py-3 items-center justify-between'>
          <Col span={size?.width > 664?4:6} className='h-full'>
              <Track imgUrl={activeSong?.image_url} title={activeSong.title} singer={activeSong.singer}/>
          </Col>
          <Col span={size?.width > 664? 16 : 10} className='h-full flex flex-col justify-center items-center gap-1'>
              <Player handleNextSong={handleNextSong} handlePrevSong={handlePrevSong} handlePlayPause={handlePlayPause} activeSong={activeSong} isActive={isActive} isPlaying={isPlaying} currentTime={currentTime} repeat={repeat} likeMusicFunc={likeMusicFunc} saveMusicFunc={saveMusicFunc} isMusicLoading={isMusicLoading}/>
              {size?.width > 664 && <SliderMusic musicDuration={musicDuration} currentTime={currentTime}/>}
          </Col>
          <Col span={size?.width > 664?4:6} className='h-full justify-end'>
            <Tools setRepeat={setRepeat} repeat={repeat} setShuffle={setShuffle} shuffle={shuffle} isMusicList={isMusicList}/>
          </Col>
        </Row>
        <Row className='flex justify-center items-center sm:hidden'>
          <Col span={22}>
            <SliderMusic musicDuration={musicDuration} currentTime={currentTime}/>
          </Col>
        </Row>
      </Flex>
    )
};

export default MusicPlayer;
