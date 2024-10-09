import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Col, Row } from 'antd';
import Track from './Track';
import Player from './Player';
import Tools from './Tools';
import { nextSong, playPause, prevSong } from '../../redux/features/playerSlice';
import { RootState } from '../../redux/store';
import SliderMusic from './Slider';

const MusicPlayer = () => {
  const {currentSongs, activeSong, isActive, isPlaying , musicDuration , currentTime , currentIndex , isMusicList} = useSelector((state:RootState) => state?.player);
  const [repeat, setRepeat] = useState<boolean>(false);
  const [shuffle, setShuffle] = useState<boolean>(false);
  const dispatch = useDispatch();

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
    return (
      <Row className={`h-[4rem] fixed bottom-0  z-10 bg-[var(--color-blue-1)] px-6 ${true?"w-[calc(100%-5rem)] left-[5rem]":"w-[calc(100%-10rem)] left-[10rem] justify-between items-center"} ${activeSong.music_url ? "flex" : "hidden"}`}>
        <Col span={6} className='h-full'>
            <Track imgUrl={activeSong?.image_url} title={activeSong.title} singer={activeSong.singer}/>
        </Col>
        <Col span={16} className='h-full flex flex-col justify-center items-center gap-1'>
            <Player handleNextSong={handleNextSong} handlePrevSong={handlePrevSong} handlePlayPause={handlePlayPause} activeSong={activeSong} isActive={isActive} isPlaying={isPlaying} currentTime={currentTime} repeat={repeat}/>
            <SliderMusic musicDuration={musicDuration} currentTime={currentTime}/>
        </Col>
        <Col span={2} className='h-full'>
          <Tools setRepeat={setRepeat} repeat={repeat} setShuffle={setShuffle} shuffle={shuffle} isMusicList={isMusicList}/>
        </Col>
      </Row>
    )
};

export default MusicPlayer;
