import { Component } from 'react';
import { signUp } from '../../utilities/users-service';
import UploadFile from '../UploadFile/UploadFile';
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import './SignUpForm.css'
import { useNavigate } from 'react-router-dom';



export default class SignUpForm extends Component {
  state = {
    displayName: '',
    username: '',
    email: '',
    password: '',
    confirm: '',
    error: '',
    navigate: useNavigate
  };

  

  handleChange = (evt) => {
    this.setState({
      [evt.target.name]: evt.target.value,
      error: ''
    });
  };

  

  handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      const {displayName, username, email, password} = this.state;
      const formData = {displayName, username, email, password};
      // The promise returned by the signUp service
      // method will resolve to the user object included
      // in the payload of the JSON Web Token (JWT)
      const user = await signUp(formData);
      this.props.setUserToken(user);
      const navigate = this.state.navigate()
      navigate('/home')
    } catch {
      // An error occurred
      // Probably due to a duplicate email
      this.setState({ error: 'Sign Up Failed - Try Again' });
    }
  };

  render() {
    const disable = this.state.password !== this.state.confirm;
    return (
      <Card className='form-container d-flex flex-column align-items-center mt-5' style={{width: '90vmin'}}>
        <Card.Body className='' >
          <Card.Title className='signup-card'>SIGN UP</Card.Title>
        <div className="form-container d-flex flex-column justify-content-center">
          <Form className='signup-form' autoComplete="off" onSubmit={this.handleSubmit}>
            <Form.Label className='mt-2'>Display Name</Form.Label>
            <Form.Control type="text" name="displayName" value={this.state.displayName} onChange={this.handleChange} required />
            <Form.Label className='mt-2'>Username</Form.Label>
            <Form.Control type="text" name="username" value={this.state.username} onChange={this.handleChange} required />
            <Form.Label className='mt-2'>Email</Form.Label>
            <Form.Control type="email" name="email" value={this.state.email} onChange={this.handleChange} required />
            <Form.Label className='mt-2'>Password</Form.Label>
            <Form.Control type="password" name="password" value={this.state.password} onChange={this.handleChange} required />
            <Form.Label className='mt-2'>Confirm</Form.Label>
            <Form.Control  type="password" name="confirm" value={this.state.confirm} onChange={this.handleChange} required />
            <div className='d-flex justify-content-between mt-3'>
              <Button className='mt-2 login' onClick={() => this.props.setShowLogin(!this.props.showLogin)}>Already have an account? Login!</Button>
              <Button className='mt-2 signup' type="submit" disabled={disable}>SIGN UP</Button>
            </div>
          </Form>
        </div>
        <p className="error-message">&nbsp;{this.state.error}</p>
        </Card.Body>
      </Card>
    );
  }
}