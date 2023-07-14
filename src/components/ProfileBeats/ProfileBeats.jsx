import React, { useEffect, useState } from 'react';
import Beat from '../Beat/Beat';
import './ProfileBeats.css'

export default function ProfileBeats({ user }) {
    const [beats, setBeats] = useState([]);

    useEffect(() => {
        fetchBeats();
    }, []);

    const fetchBeats = async () => {
        // Fetch the beats from your API
        const response = await fetch(`/post/index_own?userId=${user._id}`);
        const data = await response.json();
        // console.log(data)
        setBeats(data);
        // console.log('stuff')
    };

    return (
        <div className="beat-list">
            {beats.map(beat => <Beat key={beat.post._id} beat={beat} user={user}/>)}
        </div>
    );
}