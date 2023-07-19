import React, { useDebugValue, useEffect, useState } from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Button from 'react-bootstrap/Button';
import NameAvatarBox from '../NameAvatarBox/NameAvatarBox';
import './Beat.css'
import Sun from '../../public/sun/icons8-sun-48.svg'
import Dots from '../../public/dots/icons8-dots-48.png'
import sendRequest from '../../utilities/send-request';
import { ShowChartOutlined } from '@mui/icons-material';

const Beat = React.forwardRef(({ beat, user, handleDelete }, ref) => {
  const [likes, setLikes] = useState(beat.post.likes.length)
  const user_liked = beat.post.likes.includes(user.user)
  const [liked, setLiked] = useState(user_liked)
  const [show, setShow] = useState(false)

  

  useEffect(()=>{
    setLiked(beat.post.likes.includes(user.user))
  }, [beat.post.likes, user.user, beat.user])

  const handleLike = async () =>{
    try {
      const response = await sendRequest(`/post/like/${beat.post._id}`,'POST') // ! need to refactor everything to use sendrequest
      
      const data = await response
      setLikes(data.likes.length)
      setLiked(true)
    } catch (err) {
      
    }
  }
  const handleDislike = async () =>{
    try {
      const response = await sendRequest(`/post/dislike/${beat.post._id}`, 'POST')
      
      const data = await response
      setLikes(data.likes.length)
      setLiked(false)
    } catch (err) {
      
    }
  }

  const handleDeleteShow = () => setShow(true)
  const handleDeleteHide = () => setShow(false)

  const handleDeleteBeat = async () =>{
    handleDelete(beat.post._id)
    setShow(false)
  }


  return (
    <>
    
    <div ref={ref} className="beat d-flex flex-column mb-1 ">
      <div className='d-flex justify-content-between'>
      <NameAvatarBox profile={beat.user} key={beat.user._id}></NameAvatarBox>
      {beat.user.user == user.user ? <img className='dots' src={Dots} alt='dots' onClick={handleDeleteShow}></img> : ''}
      </div>
      <div className='d-flex flex-column left-border'>
        <p className='ms-4 mt-0 me-4'>{beat.post.text}</p>
        {beat.post.media ? <img className='beat-img mb-3 me-4' alt='beat-media' src={beat.post.media}></img> : ''}
        <div className='d-flex '>
          <img className='like-icon' style={liked ? {filter: 'invert(48%) sepia(79%) saturate(2476%) hue-rotate(20deg) brightness(118%) contrast(119%)'} : {}} src={Sun} alt="Sun" onClick={liked ? handleDislike : handleLike }/> <p className='ms-1 like-number'>{likes}</p>
        </div>
      </div>
    </div>
    <Offcanvas placement='bottom' className='off-canvas' show={show} onHide={handleDeleteHide}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Beat Settings</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
        <div className='d-flex flex-column justify-content-center'>
          
          <Button className='avatar-btn' onClick={handleDeleteBeat}>Delete Beat</Button>

        </div>
        </Offcanvas.Body>
      </Offcanvas>
    

    </>



  );
});
export default Beat