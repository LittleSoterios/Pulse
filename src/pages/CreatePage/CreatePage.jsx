import CreateBox from "../../components/CreateBox/CreateBox";
import cloudinaryUpload from "../../utilities/cloudinary-upload";
import UploadFile from "../../components/UploadFile/UploadFile";
import NameAvatarBox from "../../components/NameAvatarBox/NameAvatarBox";

export default function CreatePage({ user }) {

  
  return (
    <>
    <h2>Create</h2>
    <NameAvatarBox user={user}/>
    <UploadFile user={user}/>
    </>
    
  );
}