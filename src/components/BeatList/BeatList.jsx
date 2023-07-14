import React, { useEffect, useState } from 'react';
import Beat from '../Beat/Beat';
import './BeatList.css'

export default function BeatList({user}) {
    const [beats, setBeats] = useState([]);

    useEffect(() => {
        fetchBeats();
    }, []);

    const fetchBeats = async () => {
        // Fetch the beats from your API
        const response = await fetch("/post/index");
        const data = await response.json();
        setBeats(data);
    };

    return (
        <div className="beat-list">
            {beats.map(beat => <Beat key={beat.post._id} beat={beat} user={user} />)}
        </div>
    );
}