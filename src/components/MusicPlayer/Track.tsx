import { Col, Row } from 'antd'

export default function Track({imgUrl,title,singer}:{imgUrl?:string,title?:string,singer?:string}) {
  return (
    <Row
        className="h-full gap-2 items-center justify-center"
        >
        <Col span={6}>
            <img alt='musicImg' src={imgUrl} className="w-11 h-11 bg-[--color-green] rounded-2xl"/>
        </Col>
        <Col span={16} className='flex flex-col items-center capitalize gap-1'>
            <div className=" text-base font-bold text-center leading-none">{title}</div>
            <div className=" text-xs text-center whitespace-nowrap overflow-hidden overflow-ellipsis">{singer}</div>
        </Col>
    </Row>
  )
}
