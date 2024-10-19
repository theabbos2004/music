import { useSelector } from 'react-redux'
import { MusicList } from '../../components'
import { Carusel } from '../../components/shared'
import { useMainContext } from '../../contexts/MainContext'
import { useGetAlbums, usegetCurrentUserQuery, useGetMusics, useGetUser } from '../../lib/react-query/queris'
import { RootState } from '../../redux/store'
import { useEffect, useState } from 'react'
import { appwriteConfig, client } from '../../lib/AppWrite/config'
import { ExclamationCircleOutlined } from '@ant-design/icons';

export default function Home() {
  const { openNotification ,searchWord} = useMainContext()
  const { data: currentUser } = usegetCurrentUserQuery()
  const { isPlaying, activeSong, currentIndex } = useSelector((state: RootState) => state?.player);
  const { mutateAsync: getMusics } = useGetMusics()
  const { mutateAsync: getAlbums } = useGetAlbums()
  const { mutateAsync: getUser } = useGetUser()
  const [user, setUser] = useState()
  const [musics, setMusics] = useState()
  const [albums, setAlbums] = useState()
 
  useEffect(() => {
    getMusicsFunc()
    getAlbumsFunc()
    currentUser?.data && getUserFunc()
    const unSubscribeMusicCol = client.subscribe([`databases.${appwriteConfig.databaseId}.collections.${appwriteConfig.viewsCollectionId}.documents`,`databases.${appwriteConfig.databaseId}.collections.${appwriteConfig.musicsCollectionId}.documents`,`databases.${appwriteConfig.databaseId}.collections.${appwriteConfig.savesCollectionId}.documents`, `databases.${appwriteConfig.databaseId}.collections.${appwriteConfig.albumsCollectionId}.documents`, `databases.${appwriteConfig.databaseId}.collections.${appwriteConfig.userCollectionId}.documents`], () => {
      getMusicsFunc()
      getAlbumsFunc()
      currentUser?.data && getUserFunc()
    });
    return () => {
      unSubscribeMusicCol()
    }
  }, [])
  useEffect(()=>{
    getMusicsFunc()
  },[searchWord])
  const getMusicsFunc = async () => {
    try {
      const getMusicsRes = await getMusics()
      if (getMusicsRes.error) {
        throw new Error(getMusicsRes.error)
      }
      let musics=getMusicsRes?.data?.documents?.filter((music:any)=>music?.title?.toLowerCase().includes(searchWord?.toLowerCase()) && music)
      setMusics(musics)
    }
    catch (error) {
      openNotification({ placement: 'topLeft', description: `${error}`, icon: <ExclamationCircleOutlined style={{ color: "var(--color-green)" }} /> })
    }
  }
  const getAlbumsFunc = async () => {
    try {
      const getAlbumsRes = await getAlbums()
      if (getAlbumsRes.error) {
        throw new Error(getAlbumsRes.error)
      }
      setAlbums(getAlbumsRes?.data?.documents)
    }
    catch (error) {
      openNotification({ placement: 'topLeft', description: `${error}`, icon: <ExclamationCircleOutlined style={{ color: "var(--color-green)" }} /> })
    }
  }
  const getUserFunc = async () => {
    try {
      const getUserRes = await getUser({ userId: currentUser?.data?.$id })
      if (getUserRes.error) {
        throw new Error(getUserRes.error)
      }
      setUser(getUserRes?.data)
    }
    catch (error) {
      openNotification({ placement: 'topLeft', description: `${error}`, icon: <ExclamationCircleOutlined style={{ color: "var(--color-green)" }} /> })
    }
  }  
  if(!currentUser){
    return <div></div>
  }
  
  return (
    <div className={`w-full min-h-[100vh] mt-[3.5rem] pb-[5rem] sm:px-6 dark:bg-[var(--dark-bg-blue)]`}>
      <Carusel />
      <MusicList
        user={user}
        song={{ isPlaying, activeSong, currentIndex }}
        currentUser={currentUser?.data}
        musics={musics}
        albums={albums}
        admin={false}
      />
    </div>
  )
}
