import { Flex, Slider } from 'antd'
import { calculateTime } from '../../hooks/changeTime'
import { useDispatch } from 'react-redux'
import { setCurrentTime } from '../../redux/features/playerSlice'

export default function SliderMusic({musicDuration,currentTime}:{musicDuration?:number,currentTime?:number}) {
  const dispatch=useDispatch()
  const changeCurrentTime=(second:number)=>{
    const seconds=Math.floor(second)
    dispatch(setCurrentTime(seconds))
  }
  return (
    <Flex className='gap-3 justify-between items-center leading-none text-xs text-[var(--color-gray)] dark:text-gray-200'>
        <div>{currentTime && calculateTime(currentTime)}</div>
        <Slider
            max={musicDuration}
            defaultValue={currentTime}
            value={currentTime}
            tooltip={{ formatter: (e)=>{
                return e && calculateTime(e)
            } }}
            onChange={(e:number)=>{changeCurrentTime(e)}}
            className='w-96 m-0 text-red-700' 
            />
        <div>{musicDuration && calculateTime(musicDuration)}</div>
    </Flex>
  )
}
