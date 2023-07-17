import { Style } from "@mui/icons-material"
import NameAvatarBox from "../NameAvatarBox/NameAvatarBox"
import './FollowCard.css'
import { useState } from "react"
import sendRequest from "../../utilities/send-request"

export default function FollowCard({ profile, user}){
  const [following, setFollowing] = useState(profile.following)



  const handleFollow = async () =>{
    try {
      const response = await sendRequest(`/api/users/follow/${profile.profile._id}`, 'POST')

      await response

      setFollowing(true)
    } catch (err) {
      console.log(err)
    }
  }
  
  const handleUnfollow = async () =>{
    try {
      const response = await sendRequest(`/api/users/unfollow/${profile.profile._id}`, 'POST')

      await response
      
      setFollowing(false)
    } catch (err) {
      console.log(err)
    }
  }
  


  return(
    <>
    <div className="d-flex justify-content-between">
      <NameAvatarBox profile={profile.profile}/>
      <div className="follow-btn">
        <h5 style={following ? {filter: 'invert(0.5)'} : {}} onClick={following ? handleUnfollow : handleFollow}>{following ? 'unfollow' : 'follow'}</h5>
      </div>
    </div>
    </>
  )
}