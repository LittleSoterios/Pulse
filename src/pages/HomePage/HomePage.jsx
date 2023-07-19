import BeatList from "../../components/BeatList/BeatList"
import Pulse from '../../public/Pulse-Logo.svg'
import { useEffect, useState } from "react"
import sendRequest from "../../utilities/send-request"
import { Loading } from "../../components/Loading/Loading";


export default function HomePage({ user, setUser }) {

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() =>{
    const getHistory = async () =>{
      const response = await sendRequest('/api/users/get_history')
      const data = await response
      setUser(data.settings)
      setIsLoading(false)
    }
    getHistory()
  },[setUser])

  if(isLoading){
    return(
      <Loading></Loading>
    )
  }
  
  
  return (
    <>
    <div className="d-flex justify-content-center">
      <img className="pulse-home" src={Pulse} alt="pulse" />
    </div>
      
      <BeatList user={user}></BeatList>
    </>    
  )
}