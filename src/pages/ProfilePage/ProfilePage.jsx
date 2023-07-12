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
      <h1>Profile</h1>
      <h2>{user.name}</h2>
      <Button variant="primary" onClick={handleShow}>
        Settings
      </Button>

      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Settings</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
        <Link to="" onClick={handleLogOut}>Log Out</Link>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}