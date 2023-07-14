import { useState } from "react";
import { Form } from "react-bootstrap";
import FollowCard from "../../components/FollowCard/FollowCard";

export default function SearchPage({ user }) {
  
  const [profiles, setProfiles] = useState([])



  const handleSearch = async (e) =>{
    const response = await fetch(`/api/users/search?search=${e.target.value}&userId=${user._id}`)
    const data = await response.json();
    setProfiles(data)

  }
  
  
  return (
    <>
    <h2>Search</h2>
    <div className="d-flex justify-content-center">
      <input className="search-box" type="text" placeholder="search" onChange={handleSearch} />
    </div>
    <div className="follow-list">
      {console.log(profiles)}
      {profiles.map(profile => <FollowCard key={profile.profile._id} profile={profile} user={user}/>)}
    </div>
    </>
  );
}