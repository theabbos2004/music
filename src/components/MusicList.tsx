import { Col, Flex, Row } from "antd";
import { AddAlbumModal, AddMusicModal, MusicCard, MusicFilter } from "./shared";
import { memo, useEffect, useState } from "react";
import { useCreateMusic, useCreateSaveMusic,  useDelColDoc, useGetFilterMusic,useSaveMusic, useUpdateAccount } from "../lib/react-query/queris";
import { playPause, setActiveSong } from "../redux/features/playerSlice";
import { IActiveSong } from "../types";
import { FilterMusicsList } from ".";
import { IoMdAddCircleOutline } from "react-icons/io";
import { appwriteConfig } from "../lib/AppWrite/config";
import { useMainContext } from "../contexts/MainContext";
import { ExclamationCircleOutlined } from '@ant-design/icons';


function MusicList({ user, song ,currentUser,musics,albums,admin}: { user: any, song: { isPlaying: boolean, activeSong: IActiveSong, currentIndex: number },currentUser:any ,musics:any,albums?:any,admin?:boolean}) {    
    const [filterMusic, setFilterMusic] = useState<[]>()
    const [showMenu, setShowMenu] = useState("music")
    const [isModalOpen, setIsModalOpen] = useState<{ title: string, target: boolean }>();
    const [selectedAlbum, seSelectedAlbum] = useState<any>()
    const { data: getFilterMusic } = useGetFilterMusic()
    const { mutateAsync: createMusic } = useCreateMusic()
    const { mutateAsync: delColDoc } = useDelColDoc()
    const { mutateAsync: updateAccount } = useUpdateAccount()
    const { mutateAsync: createSaveMusic } = useCreateSaveMusic()
    const { mutateAsync: saveMusic } = useSaveMusic()
    const [ isMusicLoading,setIsMusicLoading]=useState<boolean>()
    const { openNotification} = useMainContext()
    useEffect(() => {
        if (getFilterMusic) {
            const newfilterMusic: any = []
            getFilterMusic?.data?.map((menu: any) => {
                newfilterMusic.push({ ...menu, scroll: { to: `filterMusic_${menu?.title}` }, onClicFunc: () => { setShowMenu("music") } })
            })
            newfilterMusic.push({ id: "12", title: "Albums", onClicFunc: () => { setShowMenu("albums") } })
            setFilterMusic(newfilterMusic)
        }
    }, [getFilterMusic])

    const toggleModal = (title: string, target: boolean) => {
        setIsModalOpen({ title, target });
    };
    

    const addMusicSubmitFunc = async ({ title, singer, image_url, music_url }: { title: string, singer: string, image_url: any, music_url: any }) => {
        const newMusic = await createMusic({
            creator: currentUser?.$id,
            title,
            singer,
            image_url,
            music_url,
            albums: selectedAlbum?.$id && showMenu === "albums/musics" ? [selectedAlbum?.$id] : null
        })
        return newMusic
    }
    const delMusicFunc = async (doccumentId: string) => {
        try {
            const delColDocRes = await delColDoc({ collectionId: appwriteConfig.musicsCollectionId, doccumentId })
            if (delColDocRes?.error) {
                throw new Error(delColDocRes.error)
            }
            openNotification({ placement: 'topLeft', description: "music has been removed", icon: <ExclamationCircleOutlined style={{ color: "var(--color-green)" }} /> })
        }
        catch (error) {
            openNotification({ placement: 'topLeft', description: `${error}`, icon: <ExclamationCircleOutlined style={{ color: "var(--color-green)" }} /> })
        }
    }
    const delAlbumFunc = async (doccumentId: string) => {
        try {
            const delColDocRes = await delColDoc({ collectionId: appwriteConfig.albumsCollectionId, doccumentId })
            if (delColDocRes?.error) {
                throw new Error(delColDocRes.error)
            }
            openNotification({ placement: 'topLeft', description: "album has been removed", icon: <ExclamationCircleOutlined style={{ color: "var(--color-green)" }} /> })
        }
        catch (error) {
            openNotification({ placement: 'topLeft', description: `${error}`, icon: <ExclamationCircleOutlined style={{ color: "var(--color-green)" }} /> })
        }
    }
    const likeMusicFunc = async (music: any) => {
        try {
            const {liked_musics}=user
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
          const updateMusic = await updateAccount({ user: currentUser, liked_musics: newLikes })
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
            setIsMusicLoading(true)
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
        finally{
            setIsMusicLoading(false)
        }
    }
    
    return (
        <Col className="pb-[5rem] px-6">
            <Row className="flex-col sm:flex-row items-center justify-center sm:justify-between">
                <MusicFilter data={filterMusic} />
            </Row>
            {
                showMenu === "music" ?
                    <FilterMusicsList user={user}  admin={admin} filterMusics={getFilterMusic?.data} musics={musics} playPause={playPause} song={{activeSong:song.activeSong,isPlaying:song.isPlaying,currentIndex:song.currentIndex}}  setActiveSong={setActiveSong}
                        isMusicLoading={isMusicLoading}
                        addButton={{ onclick: () => toggleModal("music", true), title: "add", body: "music" }}
                        delMusicFunc={delMusicFunc}
                        likeMusicFunc={likeMusicFunc}
                        saveMusicFunc={saveMusicFunc}
                    />
                    :
                    showMenu === "albums" ?
                        <Col className="gap-4 mt-2">
                            <Col className=" font-semibold text-xl text-[var(--color-gray)]">Albums</Col>
                            <Row className=" gap-4 justify-center">
                                {admin&&<Col
                                    className="gap-2"
                                >
                                    <Flex className="justify-center items-center">
                                        <Col
                                            className={`w-32 h-32 rounded-2xl bg-cover bg-no-repeat bg-center flex justify-center items-center bg-[var(--color-blue-1)] cursor-pointer`}
                                            onClick={() => toggleModal("album", true)}
                                        >
                                            <IoMdAddCircleOutline className='size-12 text-[var(--color-gray)]' />
                                        </Col>
                                    </Flex>
                                    <Col>
                                        <div className=" text-xl font-semibold text-center dark:text-gray-200">add</div>
                                        <div className=" text-sm text-center dark:text-gray-500">album</div>
                                    </Col>
                                </Col>}
                                {
                                    albums?.map((album: any, albumIndex: number) => (
                                        <MusicCard key={albumIndex} admin={admin} music={album} musicIndex={albumIndex} parentIdx={23} 
                                        deleteItemFunc={delAlbumFunc} 
                                        likeMusicFunc={likeMusicFunc}
                                        saveMusicFunc={saveMusicFunc}
                                            event={{
                                                onClick: () => {
                                                    setShowMenu("albums/musics")
                                                    seSelectedAlbum(album)
                                                }
                                            }} />
                                    ))
                                }
                            </Row>
                        </Col>
                        :
                    showMenu === "albums/musics" ?
                        <FilterMusicsList user={user} admin={admin} filterMusics={getFilterMusic?.data} musics={selectedAlbum?.musics} playPause={playPause} song={{activeSong:song.activeSong,isPlaying:song.isPlaying,currentIndex:song.currentIndex}} setActiveSong={setActiveSong}
                            addButton={{ onclick: () => toggleModal("music", true), title: "add", body: "music" }}
                            isMusicLoading={isMusicLoading}
                            delMusicFunc={delMusicFunc}
                            likeMusicFunc={likeMusicFunc}
                            saveMusicFunc={saveMusicFunc}
                        />
                        : ""
            }
            <AddMusicModal isModalOpen={isModalOpen} toggleModal={toggleModal} submitFunc={addMusicSubmitFunc} />
            <AddAlbumModal isModalOpen={isModalOpen} toggleModal={toggleModal} />
        </Col>
    )
}
export default memo(MusicList)