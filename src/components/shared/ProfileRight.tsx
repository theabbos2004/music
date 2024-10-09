import { Col, Row } from "antd";

export default function ProfileRight({user,edit}:{user:any,edit?:boolean}) {
  return (
    <Col className={`flex flex-col w-2/6 sm:w-1/4 gap-1 sm:0 ${edit && "hidden"}`}>
        <Row className="h-16 sm:h-2/4 sm:items-center justify-end text-white">
            <p>{user?.bio||"bio"}</p>
        </Row>
        <Row className="items-center justify-end text-[var(--color-gray)]">
            <p>{user?.contact||"contact"}</p>
        </Row>
    </Col>
  )
}
