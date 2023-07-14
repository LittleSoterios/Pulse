import React, { useState } from 'react';
import NameAvatarBox from '../NameAvatarBox/NameAvatarBox';
import './Beat.css'
import Sun from '../../public/sun/icons8-sun-48.svg'

export default function Beat({ beat, user }) {
  const [likes, setLikes] = useState(beat.post.likes.length)
  const user_liked = beat.post.likes.includes(user._id)
  const [liked, setLiked] = useState(user_liked)

  const handleLike = async () =>{
    try {
      const response = await fetch(`/post/like/${beat.post._id}?userId=${user._id}`,{
        method: 'POST',
      })
      
      const data = await response.json()
      setLikes(data.likes.length)
      setLiked(true)
    } catch (err) {
      
    }
  }
  const handleDislike = async () =>{
    try {
      const response = await fetch(`/post/dislike/${beat.post._id}?userId=${user._id}`,{
        method: 'POST',
      })
      
      const data = await response.json()
      setLikes(data.likes.length)
      setLiked(false)
    } catch (err) {
      
    }
  }


  return (
    <div className="beat d-flex flex-column mb-1 ">
      <NameAvatarBox profile={beat.user} key={beat.user._id}></NameAvatarBox>
      <div className='d-flex flex-column left-border'>
        <p className='ms-4 mt-0 me-4'>{beat.post.text}</p>
        {beat.post.media ? <img className='beat-img mb-3 me-4' alt='beat-media' src={beat.post.media}></img> : ''}
        <div className='d-flex '>
          <img className='like-icon' style={liked ? {filter: 'invert(48%) sepia(79%) saturate(2476%) hue-rotate(20deg) brightness(118%) contrast(119%)'} : {}} src={Sun} alt="Sun" onClick={liked ? handleDislike : handleLike }/> <p className='ms-1 like-number'>{likes}</p>
        </div>
      </div>
    </div>
  );
}