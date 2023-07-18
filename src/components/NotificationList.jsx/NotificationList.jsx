import { useEffect, useState } from "react"
import sendRequest from "../../utilities/send-request"
import Notification from "../Notification/Notification"

export default function NotificationList(){

  const [notifications, setNotifications] = useState([])

  useEffect(() =>{
    fetchNotifications()
  },[])

  const fetchNotifications = async () =>{
    const response = await sendRequest('api/users/get_notifications')
    const data = await response
    setNotifications(data)

  }




  return (
    <>
    <h2>Notifications</h2>
    <div>
      {notifications.map((notification, index) =>{
        return <Notification key={index} post={notification.post} from={notification.from} type={notification.type}></Notification>
      })}
    </div>
    </>
  )
}