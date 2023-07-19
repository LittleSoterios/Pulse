import React, { useEffect, useState, useRef, useCallback } from 'react';
import Beat from '../Beat/Beat';
import './BeatList.css'
import sendRequest from '../../utilities/send-request';

const BeatWithRef = React.forwardRef((props, ref) => <Beat ref={ref} {...props} />);

export default function BeatList({user}) {
  

  const [beats, setBeats] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);  // Add a new state to track if a fetch is ongoing
  const [hasMore, setHasMore] = useState(true)

  const observer = useRef();
  const lastBeatRef = useCallback(node => {
    if (loading) return;  // Don't observe the last beat while loading
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPageNumber => prevPageNumber + 1);
      }
    }, 
    { rootMargin: '500px' });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);  // Add loading to the dependencies

  useEffect(() => {
      fetchBeats();
  }, [page]);

  const fetchBeats = async () => {
      setLoading(true);  // Set loading to true at the start of the fetch
      const response = await sendRequest(`/post/index?page=${page}`);
      const data = await response
      
      setBeats(oldBeats => [...oldBeats, ...data.pack]);
      setLoading(false);  // Set loading back to false when the fetch is done
      setHasMore(data.hasMore)
  }

  const handleDelete = async (beatId) =>{
    try {
      await sendRequest(`/post/delete/${beatId}`, 'DELETE')
      const updatedBeats = beats.filter(beat => beat.post._id !== beatId);
      setBeats(updatedBeats);
      

    } catch (err) {
      console.log(err)
    }
  }

  return (
      <div className="beat-list">
          {beats.map((beat, index) => {
              if (beats.length === index + 1) {
                  return  <BeatWithRef ref={lastBeatRef} key={beat.post._id} beat={beat} user={user} handleDelete={handleDelete}/>
              } else {
                  return <Beat key={beat.post._id} beat={beat} user={user} handleDelete={handleDelete}/>
              }
          })}
      </div>
  );
}