

function cloudinaryUpload(file){

  const formData = new FormData();
  const url = "https://api.cloudinary.com/v1_1/dhwzby5cr/image/upload";
  
  formData.append("file", file);
  formData.append("vij7dmte");

    fetch(url, {
      method: "POST",
      body: formData
    })
      .then((response) => {
        console.log(response)
        console.log(response.text())
        return response.text();
      })
      
}

module.exports = cloudinaryUpload
