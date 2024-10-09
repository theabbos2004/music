import { Row, Slider } from 'antd'
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
    <Row className='gap-2 justify-between items-center leading-none text-xs'>
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
    </Row>
  )
}
