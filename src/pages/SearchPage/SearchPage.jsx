import { useState } from "react";
import FollowCard from "../../components/FollowCard/FollowCard";
import sendRequest from "../../utilities/send-request";

export default function SearchPage({ user }) {
  
  const [profiles, setProfiles] = useState([])



  const handleSearch = async (e) =>{
    const response = await sendRequest(`/api/users/search?search=${e.target.value}`)
    const data = await response;
    setProfiles(data)

  }
  
  
  return (
    <>
    <h2>Search</h2>
    <div className="d-flex justify-content-center">
      <input className="search-box" type="text" placeholder="search" onChange={handleSearch} />
    </div>
    <div className="follow-list">
      {profiles.map(profile => <FollowCard key={profile.profile._id} profile={profile} user={user}/>)}
    </div>
    </>
  );
}