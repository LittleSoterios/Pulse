import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { Link } from 'react-router-dom';
import * as userService from '../../utilities/users-service';
import ProfileBeats from '../../components/ProfileBeats/ProfileBeats';
import sendRequest from '../../utilities/send-request';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import LikesList from '../../components/LikesList/LikesList';

export default function ProfilePage({ user, setUser }) {
  const [show, setShow] = useState(false);
  const [history, setHistory]  = useState({followers: [], following: []});

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() =>{
    getHistory()
  },[])
  
  const getHistory = async () =>{
    const response = await sendRequest('/api/users/get_history')
    const data = await response
    console.log(data)
    setHistory(data)
    
  }
  
  function handleLogOut() {
    userService.logOut();
    setUser(null);
  }

  return (
    <>
    <div className='d-flex mt-4 ms-4 me-4 '>
      <div className='d-flex flex-column'>
        <h1>{user.displayName}</h1>
        <h5>@{user.username}</h5>
        <h5>{history.followers.length} followers <span className='ms-3'> {history.following.length} following</span></h5>
      <Button className='mt-4 settings-btn mb-4' variant="primary" onClick={handleShow}>
        Settings
      </Button>
      </div>
      <img className='profile-avatar ms-4 mb-4' src={user.avatar} alt="avatar" />
    </div>
    <Tabs
      defaultActiveKey="beats"
      id="uncontrolled-tab-example"
      className="mb-3"
    >
      <Tab className='tab' eventKey="beats" title="Beats">
        <div>
      <ProfileBeats user={user} likes={false}></ProfileBeats>
    </div>
      </Tab>
      <Tab  eventKey="likes" title="Likes">
      <LikesList user={user}></LikesList>
      </Tab>
      
    </Tabs>
    
      

      <Offcanvas className='off-canvas' show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Settings</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
        <Link className="link" to="" onClick={handleLogOut}>Log Out</Link>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}