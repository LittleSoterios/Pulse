import React, { createRef, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'
import './UploadFile.css'
import Paperclip from '../../public/paperclip/icons8-paperclip-windows-11-filled-32.png'
import axios from 'axios'


function UploadFile({ user }) {

  const [image, setImage] = useState(null);
  const [content, setContent] = useState('');
  const [preview, setPreview] = useState(null);

  const history = useNavigate();

  const onFileChange = e => {
    setImage(e.target.files[0]);
    setPreview(URL.createObjectURL(e.target.files[0])); // Create a blob url for preview
  }

  const onTextChange = e => {
    setContent(e.target.value);
  }

  const onUpload = async () => {
    const formData = new FormData();
    formData.append('image', image);
    formData.append('content', content);
    formData.append('userEmail', user.email);
    try {
      await axios.post('/post/create', formData);
      history('/home');
    } catch (err) {
      console.error(err);
    }
  }

  const removeImage = () => {
    setImage(null);
    setPreview(null); // Remove the preview
  }

  return (
    <>
    <div className=' d-flex flex-column'>
      <Form.Control maxLength={"280"} className='text-area mt-1 ms-5' placeholder="Start typing your beat here" as='textarea' onChange={onTextChange} />
      {preview && <div className='preview-container'>
        <img className='preview' src={preview} alt="preview" />
        <button className="delete-icon" onClick={removeImage}>X</button>
      </div>}
      <div className='d-flex justify-content-between'>

        <Form.Label htmlFor='image-input'>
          <img className='paperclip ms-5' src={Paperclip} alt="paperclip" />
        </Form.Label>
        <Form.Control id='image-input' type="file" onChange={onFileChange} />
        <Button className='me-3' onClick={onUpload}>Post</Button>
      </div>
    </div>
    </>
  )
}

export default UploadFile;