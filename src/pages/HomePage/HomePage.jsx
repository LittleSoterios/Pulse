import BeatList from "../../components/BeatList/BeatList"

export default function HomePage({ user }) {
  return (
    <>
      <h2>Home</h2>
      <BeatList user={user}></BeatList>
    </>    
  )
}