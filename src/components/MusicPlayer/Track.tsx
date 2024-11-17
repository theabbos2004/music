import { Col, Row } from 'antd'

export default function Track({imgUrl,title,singer}:{imgUrl?:string,title?:string,singer?:string}) {
  return (
    <Row
        className="h-full gap-2 items-center justify-center"
        >
        <Col span={10}>
            <img alt='musicImg' src={imgUrl} className="w-11 h-11 bg-[--color-green] rounded-2xl"/>
        </Col>
        <Col span={12} className='flex flex-col items-start capitalize gap-1'>
            <div className=" text-base font-bold text-center leading-none dark:text-gray-100 whitespace-nowrap overflow-hidden overflow-ellipsis">{title}</div>
            <div className=" text-xs text-center whitespace-nowrap overflow-hidden overflow-ellipsis dark:text-gray-200">{singer}</div>
        </Col>
    </Row>
  )
}
