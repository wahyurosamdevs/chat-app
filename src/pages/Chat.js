import React from 'react'
import {Container, Row, Col} from 'react-bootstrap'
import MessageForm from '../components/MessageForm';
import Sidebar from '../components/Sidebar';

function Chat() {
  return (
    <Container>
      <Row>
        <Col>
          <Sidebar />
        </Col>
        <Col>
          <MessageForm />
        </Col>
      </Row>
    </Container>
  )
}

export default Chat;