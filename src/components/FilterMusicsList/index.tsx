import { Col, Flex, Row } from 'antd';
import { memo } from 'react';
import { IoMdAddCircleOutline } from 'react-icons/io';
import { Element } from 'react-scroll';
import { MusicCard } from '../shared';

function FilterMusicslist({ user,admin, musics,isMusicLoading,song:{activeSong, isPlaying, currentIndex},filterMusics,addButton,delMusicFunc,likeMusicFunc,saveMusicFunc,viewMusicFunc}: any) {
    return (
        <Col>
            {
                musics?.length > 0 ?
                    filterMusics?.map((filterMusic: any, filterMusicIndex: number) => 
                        (
                        <Element name={`filterMusic_${filterMusic.title}`} className="element" key={filterMusicIndex} >
                            <Row className="my-4">
                                <div className=" font-semibold text-xl text-[var(--color-gray)] dark:text-gray-300">{filterMusic.title}</div>
                            </Row>
                            <Flex wrap className="w-full justify-center" gap="middle">
                               {admin&& <Col
                                    className="gap-2"
                                >
                                    <Flex className="justify-center items-center">
                                        <Col
                                            className={`w-32 h-32 rounded-2xl bg-cover bg-no-repeat bg-center flex justify-center items-center bg-[var(--color-blue-1)] cursor-pointer`}
                                            onClick={()=>addButton?.onclick()}
                                        >
                                            <IoMdAddCircleOutline className='size-12 text-[var(--color-gray)]'/>
                                        </Col>
                                    </Flex>
                                    <Col>
                                        <div className=" text-xl font-semibold text-center dark:text-gray-200">{addButton?.title}</div>
                                        <div className=" text-sm text-center dark:text-gray-500">{addButton?.body}</div>
                                    </Col>
                                </Col>}
                                {
                                        filterMusic?.filter(musics)
                                        .map((music: any, musicIndex: number) => (
                                            <MusicCard key={musicIndex} admin={admin} musics={musics} music={music} musicIndex={musicIndex} parentIdx={filterMusicIndex} song={{activeSong,currentIndex,isPlaying}} 
                                            user={user}
                                            deleteItemFunc={delMusicFunc} 
                                            likeMusicFunc={likeMusicFunc}
                                            saveMusicFunc={saveMusicFunc}
                                            isMusicLoading={isMusicLoading}
                                            viewMusicFunc={viewMusicFunc}
                                            />
                                        ))
                                }
                            </Flex>
                        </Element>
                    ))
                    :
                    admin?<Flex className='w-full min-h-52 justify-center  items-center'>
                         <Col
                            className="gap-2"
                            >
                            <Flex className="justify-center items-center">
                                <Col
                                    className={`w-32 h-32 rounded-2xl bg-cover bg-no-repeat bg-center flex justify-center items-center bg-[var(--color-blue-1)] cursor-pointer`}
                                    onClick={addButton?.onclick}
                                >
                                    <IoMdAddCircleOutline className='size-12 text-[var(--color-gray)]'/>
                                </Col>
                            </Flex>
                            <Col>
                                <div className=" text-xl font-semibold text-center">{addButton?.title}</div>
                                <div className=" text-sm text-center">{addButton?.body}</div>
                            </Col>
                        </Col>
                    </Flex>:""
            }
        </Col>
    )
}
export default memo(FilterMusicslist)