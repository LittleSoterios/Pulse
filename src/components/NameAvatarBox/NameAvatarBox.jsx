import './NameAvatarBox.css'

export default function NameAvatarBox({ profile }){


  return(
    <>
    <div className="d-flex mt-4 align-items-center">
      <img className="avatar" src={profile.avatar} alt="avatar" />
      <div className='d-flex flex-column'>
        <h4 className='ms-3'>{profile.displayName}</h4>
        <small className='ms-3'>@{profile.username}</small>
      </div>
    </div>
    
    </>
  )

}