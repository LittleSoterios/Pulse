import Pencil from '../../public/pencil/icons8-pencil-48.png'
import Cross from '../../public/cross/icons8-cross-96.png'
import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import { Link, useNavigate } from 'react-router-dom'
import { cropImage } from "../../utilities/crop-image";
import axios from 'axios'
import { getToken } from '../../utilities/users-service';
import sendRequest from '../../utilities/send-request';
import { Loading } from '../../components/Loading/Loading';

export default function ChangeAvatarPage({ user, setUser }) {
  const [image, setImage] = useState(null);
  
  const [setting, setSetting] = useState({displayName: user.displayName, username: user.username, bio: '', avatar: ''})
  const [preview, setPreview] = useState(setting.avatar);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() =>{
    getHistory()
  },[])
  
  const getHistory = async () =>{
    const response = await sendRequest('/api/users/get_history')
    const data = await response
    
    setSetting(data.settings)
    setPreview(data.settings.avatar)
    setIsLoading(false);
    
  }


  const onFileChange = async (e) => {
    const file = e.target.files[0];
    setImage(file);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const img = new Image();
      img.src = reader.result;
      img.onload = async () => {
        const croppedImage = await cropImage(img);
        setPreview(croppedImage);
      };
    };
    reader.readAsDataURL(file);
  };


  const onSaveChanges = async () =>{
    console.log('does this')
    const formData = new FormData();
    formData.append('image', image);
    const token = getToken()
    const headers = { headers:{
      'authorization' : `Bearer ${token}`
    }
    }
    try {
      const response = await axios.post('api/users/change_avatar', formData, headers);
      const data = response.data
      console.log(data)
      setUser(data)
      
      navigate('/profile');
    } catch (err) {
      console.error(err);
    }

  }

  if(isLoading){
    return(
      <Loading></Loading>
    )
  }

  return (
    <div className="avatar-page">
      <Link to="/profile" className="avatar-close">
        <img className="cross" src={Cross} alt="" />
      </Link>
      <img className="avatar-img-change" src={preview} alt="avatar" />

      <Form.Label htmlFor="image-input" className="change-avatar-link">
        <img className="pencil" src={Pencil} alt="paperclip" />
      </Form.Label>
      <Form.Control id="image-input" type="file" onChange={onFileChange} />
      <div className='d-flex justify-content-center mt-5'>
      <Button className='save-changes' onClick={onSaveChanges}>Save Changes</Button>

      </div>
    </div>
  );
}