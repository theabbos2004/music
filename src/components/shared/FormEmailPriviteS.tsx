import { Button, Col, Form, Input, Row } from 'antd';
import { IFORMEDITPROFILE } from '../../types';

export default function FormEmailPriviteS() {
    return (
        <Row className='gap-10 w-full justify-center items-center'>
            <Col className='w-60'>
                <Form.Item<IFORMEDITPROFILE>
                    name='email'
                    className="my-4"
                    rules={[{ required: true, message: 'Please input new email!' }]}
                >
                    <Input type='email' className='gap-1' placeholder="newEmail" />
                </Form.Item>

                <Form.Item<IFORMEDITPROFILE>
                    name="password"
                    className="my-4"
                    rules={[{ required: true, message: 'Please input old password!' }]}
                >
                    <Input className='gap-1' placeholder="old password" />
                </Form.Item>
                <Form.Item className='w-full justify-center'>
                    <Button type="primary" className='w-full p-4 rounded-xl' htmlType="submit">
                        Change Email
                    </Button>
                </Form.Item>
            </Col>
        </Row>
    )
}
