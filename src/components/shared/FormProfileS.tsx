import { Button, Col, DatePicker, Form, Input, Radio, Row } from 'antd';
import { IFORMEDITPROFILE } from '../../types';

export default function FormProfileS() {
    return (
        <Row className='px-6 flex-col items-center sm:flex-row w-full justify-around'>
            <Col span={12} className=' flex flex-col items-center'>
                <Col className='w-60'>
                    <Form.Item<IFORMEDITPROFILE>
                        name='bio'
                        className="my-4"
                    >
                        <Input className='gap-1' placeholder="bio" />
                    </Form.Item>

                    <Form.Item<IFORMEDITPROFILE>
                        name="contact"
                        className="my-4"
                    >
                        <Input className='gap-1' placeholder="contact" />
                    </Form.Item>
                    <Form.Item className='w-full justify-center hidden sm:block'>
                        <Button type="primary" className='w-full p-4 rounded-xl' htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Col>
            </Col>
            <Col span={12} className=' flex flex-col items-center'>
                <Col className='w-60'>
                    <Form.Item<IFORMEDITPROFILE>
                        name="gender"
                        className="my-4 w-full"
                        rules={[{ required: true, message: 'Please input your gander!' }]}
                    >
                        <Radio.Group name="radiogroup" className='w-full flex justify-around'>
                            <Radio value={"male"} className='dark:text-white p-0 m-0'>male</Radio>
                            <Radio value={"feMale"} className='dark:text-white p-0 m-0'>feMale</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item<IFORMEDITPROFILE>
                        name="date"
                        className="my-4 w-full"
                    >
                        <DatePicker className='w-full'/>
                    </Form.Item>
                </Col>
            </Col>
            <Col span={12} className='mt-10 flex flex-col items-center sm:hidden'>
                <Col className='w-60'>
                    <Form.Item className='w-full justify-center'>
                        <Button type="primary" className='w-full p-4 rounded-xl' htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Col>
            </Col>
        </Row>
    )
}
