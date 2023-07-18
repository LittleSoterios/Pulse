import './Notification.css'

export default function Notification({ from, post, type }) {


  return (
    <>
    
      {type === 'like' ? (
        <div className="d-flex align-items-center notification-box ">
        <img className="avatar" src={from.avatar} alt="avatar" />
        <div className='d-flex flex-column'>
          <h3 className='ms-3'>{from.displayName}</h3>
          <small className='ms-3'>liked your post: {post.text}</small>
        </div>
      </div>
      ) : (
        <div className="d-flex align-items-center notification-box">
        <img className="avatar" src={from.avatar} alt="avatar" />
        <div className='d-flex flex-column'>
          <h3 className='ms-3'>{from.displayName}</h3>
          <small className='ms-3'>followed you!</small>
        </div>
      </div>
      )}
    </>
  )
}