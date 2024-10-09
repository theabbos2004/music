/* eslint-disable jsx-a11y/media-has-caption */
import { memo, useEffect, useRef, useState } from 'react';
import { Row, Spin } from 'antd';
import { BsBookmark, BsCaretLeft, BsCaretRight, BsHeart, BsPauseCircleFill, BsPlayCircleFill } from 'react-icons/bs';
import { useDispatch } from 'react-redux';
import { playPause, setCurrentTime, setMusicDuration } from '../../redux/features/playerSlice';

const Player = ({ activeSong,isPlaying, currentTime, volume, repeat, handlePlayPause,handlePrevSong,handleNextSong }: { activeSong?: any,isActive:boolean, isPlaying?: any, currentTime: any, volume?: any, repeat?: any, handlePlayPause?: any ,handlePrevSong:()=>Promise<boolean>,handleNextSong:()=>Promise<boolean>}) => {

  const audioRef = useRef<HTMLAudioElement>(null);
  const [isMusicPlay, setIsMusicPlay] = useState<boolean>(false)
  const dispatch = useDispatch()
  useEffect(() => {
    const updateDuration = () => {
      if (audioRef?.current?.duration) {
        const seconds = Math.floor(audioRef.current.duration);
        dispatch(setMusicDuration(seconds))
      }
    };
    const updateProgress = () => {
      if (audioRef?.current?.currentTime) {
        const currentTime = audioRef.current.currentTime
        dispatch(setCurrentTime(currentTime))
      }
    };

    audioRef?.current?.addEventListener('loadeddata', updateDuration);
    audioRef?.current?.addEventListener('timeupdate', updateProgress);

    return () => {
      if (audioRef?.current) {
        audioRef.current.removeEventListener('loadeddata', updateDuration);
        audioRef.current.removeEventListener('timeupdate', updateProgress);
      }
    };
  }, [audioRef.current?.readyState]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        setIsMusicPlay(false)
        audioRef.current.play()
          .then(() => {setIsMusicPlay(true)})
          .catch(() => {audioRef.current?.pause()});
      } else {
        setIsMusicPlay(true)
        audioRef.current.pause()
      }
    }
  }, [audioRef, isPlaying, activeSong])

  useEffect(() => {
    if (audioRef.current && currentTime === Math.round(currentTime)) {
      audioRef.current.currentTime = currentTime
    }
  }, [currentTime])  
  return (
    <Row className='justify-center items-center gap-2'>
      <BsBookmark 
        className=' cursor-pointer'
      />
      <Row className=' items-center gap-1 text-xl text-[var(--color-gray)]'>
        <BsCaretLeft 
          onClick={async ()=>{
            const handlePrevSongRes= await handlePrevSong()
            handlePrevSongRes && dispatch(playPause(true))
          }}
          className=' cursor-pointer'
        />
        {
          !isMusicPlay? 
            <div className=' h-[1.8rem] w-[1.8rem] rounded-2xl flex justify-center items-center bg-[var(--color-green)]'>
              <Spin size="small"/>
            </div>
          : isPlaying ?
            <BsPauseCircleFill
              onClick={handlePlayPause}
              className='text-[var(--color-green)]  text-3xl cursor-pointer'
            />
          : <BsPlayCircleFill
              onClick={handlePlayPause}
              className='text-[var(--color-green)]  text-3xl cursor-pointer'
            />
        }
        <BsCaretRight 
          onClick={async ()=>{
            const handleNextSongRes= await handleNextSong()
            handleNextSongRes && dispatch(playPause(true))
          }}
          className=' cursor-pointer'
        />
      </Row>
      <BsHeart 
        className=' cursor-pointer'
      />
      <audio
        className='hidden'
        src={activeSong?.music_url}
        ref={audioRef}
        loop={repeat}
      />
    </Row>
  );
};

export default memo(Player);
