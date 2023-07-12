
import UploadFile from "../UploadFile/UploadFile"
import { useState } from "react"
import cloudinaryUpload from "../../utilities/cloudinary-upload";

export default function CreateBox({ user }){
  const[post, setPost] = useState({
    media: '',
    text: ''
  })
  
  const [error, setError] = useState('')

  function handleChange(evt){
    setPost({...post, [evt.target.name]: evt.target.value})
    setError('')
  }

  async function handleSubmit(evt){
    evt.preventDefault()
    const file = evt.target.files[0]
    if (file){
      const response = cloudinaryUpload(file)
      console.log(response)
    }
  }

  return(
    <>
    {/* <UploadFile user={user}/> */}
    <div>
      <div className="form-container">
        <form autoComplete="off" onSubmit={handleSubmit}>
          <label>Content</label>
          <input type="text" name="content" value={post.content} onChange={handleChange} required />
          <label>Image</label>
          <input type="file" name="image" />
          <button type="submit">LOG IN</button>
        </form>
      </div>
      <p className="error-message">&nbsp;{error}</p>
    </div>
    </>
  )

}