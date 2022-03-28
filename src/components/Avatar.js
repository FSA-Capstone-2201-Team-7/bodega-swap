import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import VisuallyHidden from "@reach/visually-hidden";

const Avatar = ({ url, size, onUpload }) => {
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (url) downloadImage(url);
  }, [url]);

  const downloadImage = (path) => {
    try {
      const { data, error } = supabase.storage
        .from("avatars")
        .getPublicUrl(path);
      if (error) {
        throw error;
      }
      setAvatarUrl(data.publicURL);
    } catch (error) {
      console.error("Error downloading image: ", error.message);
    }
  };

  const uploadAvatar = async (event) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      let { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      onUpload(filePath);
    } catch (error) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div aria-live="polite">
      <img
        src={avatarUrl ? avatarUrl : `https://place-hold.it/${size}x${size}`}
        alt={avatarUrl ? "Avatar" : "No image"}
        className="avatar image"
        style={{ height: size, width: size }}
      />
      {uploading ? (
        "Uploading..."
      ) : (
        <div className="block mt-2">
          <label
            className=" rounded-lg bg-indigo-500 px-4 py-2 text-sm uppercase text-white"
            htmlFor="single"
          >
            Upload an avatar
          </label>
          <VisuallyHidden>
            <input
              type="file"
              id="single"
              accept="image/*"
              onChange={uploadAvatar}
              disabled={uploading}
            />
          </VisuallyHidden>
        </div>
      )}
    </div>
  );
};

export default Avatar;
