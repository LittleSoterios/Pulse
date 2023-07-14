import BeatList from "../../components/BeatList/BeatList"
import Pulse from '../../public/Pulse-Logo.svg'


export default function HomePage({ user }) {
  return (
    <>
    <div className="d-flex justify-content-center">
      <img className="pulse-home" src={Pulse} alt="pulse" />
    </div>
      
      <BeatList user={user}></BeatList>
    </>    
  )
}