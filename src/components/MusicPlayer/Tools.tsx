import { Row } from 'antd'
import { BsMenuButtonWide, BsShuffle } from 'react-icons/bs'
import { TiArrowSync } from 'react-icons/ti'
import { IoCloseOutline } from "react-icons/io5";
import { useDispatch } from 'react-redux'
import { setActiveSong, setIsMusicList} from '../../redux/features/playerSlice'
import { Dispatch, memo, SetStateAction } from 'react'

function Tools({setRepeat,repeat,setShuffle,shuffle,isMusicList}:{setRepeat:Dispatch<SetStateAction<boolean>>,repeat:boolean,setShuffle:Dispatch<SetStateAction<boolean>>,shuffle:boolean,isMusicList:boolean}) {
  const dispatch=useDispatch()  
  return (
    <Row className='h-full flex justify-end items-center gap-2 text-xl text-[var(--color-gray)] dark:text-gray-200'>
        <TiArrowSync className={`text-xl cursor-pointer ${repeat&&'text-[var(--color-green)]'}`} onClick={()=>setRepeat(state=>!state)}/>
        <BsShuffle className={`text-base cursor-pointer ${shuffle&& 'text-[var(--color-green)]'}`}  onClick={()=>setShuffle(state=>!state)}/>
        <BsMenuButtonWide
            className={`text-base cursor-pointer ${isMusicList && "text-[var(--color-green)]"}`}
            onClick={()=>dispatch(setIsMusicList())}
        />
        <IoCloseOutline
            className={`text-xl cursor-pointer hover:text-[var(--color-green)] `}
            onClick={()=>dispatch(setActiveSong({ song: ''}))}
        />
    </Row>
  )
}
export default memo(Tools)