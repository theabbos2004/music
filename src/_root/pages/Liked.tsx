import { useEffect, useState } from "react";
import { LikedComp } from "../../components";
import { appwriteConfig, client } from "../../lib/AppWrite/config";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { useMainContext } from "../../contexts/MainContext";
import { useCreateSaveMusic, usegetCurrentUserQuery, useGetUser, useSaveMusic, useUpdateAccount } from "../../lib/react-query/queris";
import { ExclamationCircleOutlined } from '@ant-design/icons';


export default function Liked() {
  const { openNotification } = useMainContext()
  const { data: currentUser } = usegetCurrentUserQuery()
  const { mutateAsync: updateAccount } = useUpdateAccount()
  const { mutateAsync: getUser } = useGetUser()
  const { mutateAsync: createSaveMusic } = useCreateSaveMusic()
  const { mutateAsync: saveMusic } = useSaveMusic()
  const [user, setUser] = useState<{ liked_musics: any ,saved:any,$id:string}>()

  const { isPlaying, activeSong, currentIndex } = useSelector((state: RootState) => state?.player);
  useEffect(() => {
    if (currentUser) {
      getUserFunc()
      const unSubscribeMusicCol = client.subscribe([`databases.${appwriteConfig.databaseId}.collections.${appwriteConfig.savesCollectionId}.documents`,`databases.${appwriteConfig.databaseId}.collections.${appwriteConfig.userCollectionId}.documents`,`databases.${appwriteConfig.databaseId}.collections.${appwriteConfig.musicsCollectionId}.documents`, `databases.${appwriteConfig.databaseId}.collections.${appwriteConfig.userCollectionId}.documents`], () => {
        getUserFunc()
      });
      return () => {
        unSubscribeMusicCol()
      }
    }
  }, [currentUser])

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
  const likeMusicFunc = async (music: any) => {
    try {
        let newLikes=[]
        
        let availableUser=false
        if(user?.liked_musics?.length===0){
            newLikes.push(music?.$id)
        }
        else{
            user?.liked_musics?.forEach((like:any)=> {
                if(like?.$id !== music?.$id){
                    newLikes.push(like)
                }
                else{
                    availableUser=true
                }
            })
            !availableUser && newLikes.push(music?.$id)
        }   
      const updateMusic = await updateAccount({ user: currentUser?.data, liked_musics: newLikes })
      if (updateMusic.error) {
        throw new Error(updateMusic.error)
      }
      openNotification({ placement: 'topLeft', description: `it was succesful`, icon: <ExclamationCircleOutlined style={{ color: "var(--color-green)" }} /> })
    }
    catch (error) {
      openNotification({ placement: 'topLeft', description: `${error}`, icon: <ExclamationCircleOutlined style={{ color: "var(--color-red)" }} /> })
    }
  }
  const saveMusicFunc=async (music:any)=>{        
    try{
        if(!user){
            throw new Error("please register first")
        }
        let saveId=user?.saved?.$id
        if(!user?.saved){
            const createSaveMusicRes=await createSaveMusic({userId:user?.$id})
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
}
  return (
    <section className="min-h-[100vh] mt-[3.5rem] p-4 dark:bg-[var(--dark-bg-blue)] dark:text-white">
      <LikedComp user={user} currentUser={currentUser?.data} musics={user?.liked_musics} song={{ isPlaying, activeSong, currentIndex }} likeMusicFunc={likeMusicFunc} saveMusicFunc={saveMusicFunc} />
    </section>
  )
}
