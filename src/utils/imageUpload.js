export const checkImage = (file) => {
  let err = "";

  if (!file) {
    return (err = "Please add an image");
  }

  if (file.size > 1024 * 1024) {
    return (err = "File size should be less than 1 mb");
  }

  if (file.type !== "image/jpeg" && file.type !== "image/png") {
    return (err = "File format is wrong");
  }

  return err;
};

export const imageUpload = async (images) => {
  let imgArr = [];
  for (const item of images) {
    const formData = new FormData();
    formData.append("file", item);
    formData.append("upload_preset", "nayq9vjv");
    formData.append("cloud_name", "dmiu93fth");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dmiu93fth/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    imgArr.push({ public_id: data.public_id, url: data.secure_url });
  }
  return imgArr;
};
