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

export default function ProfilePage({ user, setUserToken, setUser }) {


  const [show, setShow] = useState(false);
  const [showAvatarCanvas, setShowAvatarCanvas] = useState(false); // state to control avatar offcanvas
  const [history, setHistory]  = useState({followers: [], following: []});
  const [setting, setSetting] = useState({displayName: user.displayName, username: user.username, bio: '', avatar: ''})
  
  
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  
  // Handlers for avatar offcanvas
  const handleAvatarCanvasClose = () => setShowAvatarCanvas(false);
  const handleAvatarCanvasShow = () => setShowAvatarCanvas(true);

  useEffect(() =>{
    getHistory()
  },[])
  
  const getHistory = async () =>{
    const response = await sendRequest('/api/users/get_history')
    const data = await response
    setHistory(data.history)
    setSetting(data.settings)
    
  }
  
  function handleLogOut() {
    userService.logOut();
    setUserToken(null);
    setUser(null)
    console.log(userService.getToken())
  }

  return (
    <>
    <div className='d-flex mt-4 ms-4 me-4 '>
      <div className='d-flex flex-column'>
        <h1>{setting.displayName}</h1>
        <h5>@{setting.username}</h5>
        <h5>{history.followers.length} followers <span className='ms-3'> {history.following.length} following</span></h5>
      <Button className='mt-4 settings-btn mb-4' variant="primary" onClick={handleShow}>
        Settings
      </Button>
      </div>
      {/* Profile picture click opens the avatar offcanvas */}
      <img className='profile-avatar ms-4 mb-4' src={setting.avatar} alt="avatar" onClick={handleAvatarCanvasShow} />
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
      <LikesList user={user} history={history}></LikesList>
      </Tab>
      
    </Tabs>
    
      
      {/* Avatar Offcanvas */}
      <Offcanvas placement='bottom' className='off-canvas' show={showAvatarCanvas} onHide={handleAvatarCanvasClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Change Profile Picture</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
        <div className='d-flex flex-column justify-content-center'>
          <Link to='/avatar' className='avatar-btn'>Change Avatar</Link>
          <Button className='avatar-btn'>View Avatar</Button>

        </div>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Settings Offcanvas */}
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