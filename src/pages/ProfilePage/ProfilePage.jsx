import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { Link } from 'react-router-dom';
import * as userService from '../../utilities/users-service';

export default function ProfilePage({ user, setUser }) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  function handleLogOut() {
    userService.logOut();
    setUser(null);
  }

  return (
    <>
    <div className='d-flex mt-4 ms-4 me-4 border-bottom'>
      <div className='d-flex flex-column'>
        <h1>{user.displayName}</h1>
        <h5>@{user.username}</h5>
      <Button className='mt-4 settings-btn' variant="primary" onClick={handleShow}>
        Settings
      </Button>
      </div>
      <img className='profile-avatar ms-4 mb-4' src={user.avatar} alt="avatar" />
    </div>
      

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