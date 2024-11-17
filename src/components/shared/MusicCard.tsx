import { Col, Flex } from 'antd';
import { useRef, useState } from 'react'
import { BsPauseCircleFill, BsPlayCircleFill } from 'react-icons/bs';
import { RiDeleteBinFill, RiHeart3Fill, RiHeart3Line ,RiBookmarkLine, RiBookmarkFill } from 'react-icons/ri';
import { useDispatch } from 'react-redux';
import { playPause, setActiveSong } from '../../redux/features/playerSlice';

export default function MusicCard({ user,admin, musics,music,musicIndex, parentIdx ,song, deleteItemFunc,event,likeMusicFunc,saveMusicFunc,viewMusicFunc,isMusicLoading}: {user?:any,admin?:boolean,musics?:any, music?: any,musicIndex:number, event?: {onClick:any} ,parentIdx:number,song?:{activeSong:any,currentIndex:any,isPlaying:any},deleteItemFunc?:any,likeMusicFunc?:any,saveMusicFunc?:any,viewMusicFunc?:any,isMusicLoading?:any}) {
    const [musicEvent, setMusicEvent] = useState<{ id?: string; parentIdx?: number, hover?: boolean }>({})

    const musicRef=useRef<any>()
    
    const handleMouseEnter = (id: string, parentIdx: number) => {
        setMusicEvent(() => ({
            id,
            parentIdx,
            hover: true
        }));
    };
    const handleMouseLeave = (id: string, parentIdx: number) => {
        setMusicEvent(() => ({
            id,
            parentIdx,
            hover: false
        }));
    };
    const dispatch = useDispatch()
    
    return (
        <Col
            ref={musicRef}
            className="gap-2"
        >
            <Flex className="justify-center items-center">
                <Col
                    className={`w-32 h-32 rounded-2xl bg-cover bg-no-repeat bg-center flex justify-center items-center ${!music?.saves && !music?.likes && "cursor-pointer"}`}
                    style={{ backgroundImage: music.image_url ? `url(${music.image_url})` : 'url("../../../public/vite.svg")' }}
                    onMouseEnter={() => {
                        handleMouseEnter(music.$id, parentIdx)
                    }}
                    onMouseLeave={() => {
                        handleMouseLeave(music.$id, parentIdx)
                    }}
                    onClick={()=>{event?.onClick()}}
                >
                    <BsPauseCircleFill
                        onClick={(e:any) => {
                            dispatch(playPause(false));
                            e.stopPropagation()
                        }}
                        className={`text-[var(--color-green)] text-5xl cursor-pointer
                        ${musics && musicEvent.id === music.$id && musicEvent.parentIdx === parentIdx && song?.isPlaying && music.title === song?.activeSong.title && musicEvent.hover && song?.currentIndex == musicIndex ? "block" : "hidden"}`}
                    />
                    <BsPlayCircleFill
                        onClick={async (e:any) => {
                            e.stopPropagation()
                            viewMusicFunc(music)
                            dispatch(setActiveSong({ song: music, songs: musics, i: musicIndex }));
                            dispatch(playPause(true));
                        }}
                        className={`text-[var(--color-green)] cursor-pointer  text-5xl ${musics && musicEvent.id === music.$id && musicEvent.parentIdx === parentIdx && musicEvent.hover && (music.title !== song?.activeSong.title || music.title === song?.activeSong.title && !song?.isPlaying) ? "block" : "hidden"}`}
                    />
                    <RiDeleteBinFill
                        className={`size-5 absolute top-2 right-2 text-red-700 cursor-pointer ${admin&&musicEvent.id === music.$id && musicEvent.parentIdx === parentIdx && musicEvent.hover ? "block" : "hidden"}`}
                        onClick={(e:any) => {
                            e.stopPropagation()
                            if(!isMusicLoading){
                                deleteItemFunc(music)
                            }
                        }}
                    />
                    <Flex className={`absolute  w-full flex justify-between items-center gap-1 px-2 py-1 bottom-0`}>
                        <Flex className={`flex justify-between items-center gap-1 ${!likeMusicFunc && "hidden"}`}>
                            {
                                user?.liked_musics?.filter((likedMusic:any)=>likedMusic?.$id===music?.$id).length>0 && musics?
                                    <RiHeart3Fill
                                    key={music?.$id}
                                        className={`size-5 text-red-700 cursor-pointer`}
                                        onClick={(e:any) => {
                                            e.stopPropagation()
                                            if(!isMusicLoading){
                                                likeMusicFunc(music)
                                            }
                                        }}
                                    />
                                    :musics && <RiHeart3Line
                                    key={music?.$id}
                                        className={`size-5 text-red-700 cursor-pointer`}
                                        onClick={(e:any) => {
                                            e.stopPropagation()
                                             if(!isMusicLoading){
                                                 likeMusicFunc(music)
                                             }
                                        }}
                                    />
                            }
                            <div className='text-red-700 text-lg'>{music?.likes?.length}</div>
                        </Flex>
                        <Flex className={`flex justify-between items-center gap-1 ${!saveMusicFunc && "hidden"}`}>
                            {                                
                                music?.saves?.length > 0 && music?.saves?.filter((savedMusic:any)=>savedMusic?.$id===user?.saved?.$id).length > 0?
                                <RiBookmarkFill
                                    key={music?.$id}
                                    className={`size-5 text-[var(--color-blue-1)] cursor-pointer`}
                                    onClick={(e:any) => {
                                        e.stopPropagation()
                                         if(!isMusicLoading){
                                             saveMusicFunc(music)
                                         }
                                }}/>
                                :<RiBookmarkLine
                                className={`size-5 text-[var(--color-blue-1)] cursor-pointer`}
                                onClick={(e:any) => {
                                    e.stopPropagation()
                                     if(!isMusicLoading){
                                         saveMusicFunc(music)
                                     }
                                }}
                            />
                            }
                        </Flex>
                    </Flex>
                </Col>
            </Flex>
            <Col>
                <div className=" text-xl font-semibold text-center dark:text-gray-200">{music?.title}</div>
                <div className=" text-sm text-center dark:text-gray-500">{music?.singer}</div>
            </Col>
        </Col>
    )
}
