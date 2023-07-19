import React, { useEffect, useState } from 'react';
import Beat from '../Beat/Beat';
import './LikesList.css'
import sendRequest from '../../utilities/send-request';


export default function LikesList({ user }) {
  const [beats, setBeats] = useState([]);
  
  const fetchBeats = async () => {
      // Fetch the beats from your API
      
      const response = await sendRequest(`/post/index_likes`)
      const data = await response
            
      setBeats( data);
      // console.log('stuff')
  };

  useEffect(() => {
      fetchBeats();
  }, []);

  const handleDelete = async (beatId) =>{
    try {
      await sendRequest(`/post/delete/${beatId}`, 'DELETE')
      const updatedBeats = beats.filter(beat => beat.post._id !== beatId);
      console.log(updatedBeats)
      setBeats(updatedBeats);
      

    } catch (err) {
      console.log(err)
    }
  }


  return (
      <div className="beat-list">
          {beats.map(beat => <Beat key={beat.post._id} beat={beat} user={user} handleDelete={handleDelete}/>)}
      </div>
  );
}