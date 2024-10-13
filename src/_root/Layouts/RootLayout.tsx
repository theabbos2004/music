import { memo } from 'react';
import { Layout } from 'antd';
import { AudioList, SideBarLeft } from '../../components/shared';
import { Outlet } from 'react-router-dom';
import HeaderTop from '../../components/shared/Header';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import MusicPlayer from '../../components/MusicPlayer';
import { usegetCurrentUserQuery } from '../../lib/react-query/queris';


const RootLayout : React.FC=()=>{
  const player = useSelector((state:RootState) => state.player);
  const {data:currentUser}=usegetCurrentUserQuery()
  return (
    <Layout className="min-h-[100vh]">
      <SideBarLeft/>
      <Layout className='dark:bg-[var(--dark-bg-blue)]'>
        <HeaderTop currentUser={currentUser?.data}/>
        <Outlet/>
        <AudioList/>
        {player?.activeSong?.music_url && (
            <MusicPlayer/>
        )}
      </Layout>
    </Layout>
  );
}
export default memo(RootLayout)