import './NameAvatarBox.css'

export default function NameAvatarBox({ user }){


  return(
    <>
    <div className="d-flex mt-4 align-items-center">
      <img className="avatar" src={user.avatar} alt="avatar" />
      <h3 className='ms-3'>@{user.username}</h3>
    </div>
    
    </>
  )

}