import { Style } from "@mui/icons-material"
import NameAvatarBox from "../NameAvatarBox/NameAvatarBox"
import './FollowCard.css'
import { useState } from "react"

export default function FollowCard({ profile, user}){
  const [following, setFollowing] = useState(profile.following)



  const handleFollow = async () =>{
    try {
      const response = await fetch(`/api/users/follow/${profile.profile._id}?userId=${user._id}`, {
        method: 'POST'
      })

      await response.json()

      setFollowing(true)
    } catch (err) {
      console.log(err)
    }
  }
  
  const handleUnfollow = async () =>{
    try {
      const response = await fetch(`/api/users/unfollow/${profile.profile._id}?userId=${user._id}`, {
        method: 'POST'
      })

      await response.json()
      
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