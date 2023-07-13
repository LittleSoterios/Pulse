import React from 'react';

export default function Beat({ beat }) {
    return (
        <div className="beat d-flex flex-column">
            <h2>{beat.user}</h2>
            <p>{beat.text}</p>
            {beat.media ? <img className='beat-img' alt='beat-media' src={beat.media}></img> : '' }
        </div>
    );
}