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
      console.log('this is likes',  data)       
      setBeats( data);
      // console.log('stuff')
  };

  useEffect(() => {
      fetchBeats();
  }, []);


  return (
      <div className="beat-list">
          {beats.map(beat => <Beat key={beat.post._id} beat={beat} user={user}/>)}
      </div>
  );
}