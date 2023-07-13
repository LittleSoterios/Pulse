import { useState } from 'react';
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import * as usersService from '../../utilities/users-service';

export default function LoginForm({ setUser, showLogin, setShowLogin }) {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  function handleChange(evt) {
    setCredentials({ ...credentials, [evt.target.name]: evt.target.value });
    setError('');
  }

  async function handleSubmit(evt) {
    // Prevent form from being submitted to the server
    evt.preventDefault();
    try {
      // The promise returned by the signUp service method 
      // will resolve to the user object included in the
      // payload of the JSON Web Token (JWT)
      const user = await usersService.login(credentials);
      setUser(user);
    } catch {
      setError('Log In Failed - Try Again');
    }
  }

  return (
    <>
<Card className='signup-form d-flex flex-column align-items-center' style={{width: '90vmin'}}>
        <Card.Body className='' >
          <Card.Title>LOG IN</Card.Title>
        <div className="form-container d-flex flex-column justify-content-center">
          <Form className='signup-form' autoComplete="off" onSubmit={handleSubmit}>
            <Form.Label className='mt-2'>Email</Form.Label>
            <Form.Control type="email" name="email" value={credentials.email} onChange={handleChange} required />
            <Form.Label className='mt-2'>Password</Form.Label>
            <Form.Control type="password" name="password" value={credentials.password} onChange={handleChange} required />
            <div className='d-flex justify-content-between mt-3'>
              <Button className='mt-2 login' onClick={() => setShowLogin(!showLogin)}>SIGN UP</Button>
              <Button className='mt-2 signup' type="submit" >LOG IN</Button>
            </div>
          </Form>
        </div>
        <p className="error-message">&nbsp;{error}</p>
        </Card.Body>
      </Card>

</>
  );
}
