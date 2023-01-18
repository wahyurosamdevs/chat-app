import React, { useContext, useEffect, useRef, useState } from 'react'
import {Button, Row, Col, Form} from 'react-bootstrap'
import { useSelector } from 'react-redux';
import { AppContext, socket } from '../context/appContext';
import '../styles/MessageForm.css'

function MessageForm() {
  const [message, setMessage] = useState("");
  const user = useSelector((state) => state.user);
  const { socket, currentRoom, setMessages, messages, privateMemberMsg} = useContext(AppContext);
  const messageEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  },[messages])

  function getFormatDate() {
    const date = new Date();
    const year = date.getFullYear();
    let month = (1 + date.getMonth()).toString();

    month = month.length  > 1 ? month : "0" + month;
    let day = date.getDate().toString();
    day = day.length > 1 ? day : "0" + day;

    return month + "/" + day + "/" + year;
  }

  function handleSubmit(e){
    e.preventDefault();
    const today = new Date();
    const minutes = today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes();
    const time = today.getHours() + ":" + minutes;
    const roomId = currentRoom;
    socket.emit("message-room", roomId, message, user, time, todayDate);
    setMessage("");
  }

  function scrollToBottom(){
    messageEndRef.current?.scrollIntoView({behavior: "smooth"});
  }

  const todayDate = getFormatDate(); 

  socket.off("room-messages").on("room-messages", (roomMessages) => {
    console.log("room messages");
    console.log(roomMessages);
    setMessages(roomMessages);
    console.log(messages.length);
  })
  return (
    <>
      <div className='message-output'>
        {user && !privateMemberMsg?._id && <div className='alert alert-info'>You are in the {currentRoom} room</div>}
        {user && privateMemberMsg?._id && (
          <>
            <div className='alert alert-info conversation-info'>
              <div>
                Your conversation with {privateMemberMsg.name} <img src={privateMemberMsg.picture} className="conversation-profile-picture" />
              </div>
            </div>
          </>
        )}

        {!user && <div className='alert alert-danger rounded-0'>Please login</div>}

        {user && messages.map(({_id: date, messageByDate},idx) => (
            <div key={idx}>
              <p className='alert alert-info text-center message-date-indicator'>{date}</p>
              {messageByDate?.map(({content, time, from: sender}, msgIdx) => (
                <div className={sender?.email == user?.email ? "message" : "incoming-message"} key={msgIdx}>
                  <div className='message-inner'>
                    <div className='d-flex align-item-center mb-3'>
                      <img src={sender.picture} style={{ width:35, height:35, objectFit: 'cover', borderRadius: '50%', marginRight: 10 }} />
                      <p className='message-sender'>{sender._id == user?._id ? "You" : sender.name}</p>
                    </div>
                    <p className='message-content'>{content}</p>
                    <p className='message-timestamp-left'>{time}</p>
                  </div>
                </div>
              ))}
            </div>
          ))
        }
        <div ref={messageEndRef} />
      </div>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={10}>
            <Form.Group>
              <Form.Control type='text' placeholder='Your Message' disabled={!user} value={message} onChange={(e) => setMessage(e.target.value)} ></Form.Control>
            </Form.Group>
          </Col>
          <Col md={2}>
            <Button variant='primary' type='submit' style={{width:"100%", backgroundColor:"orange" }} disabled={!user}> 
              <i className='fas fa-paper-plane'></i>
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  )
}

export default MessageForm;