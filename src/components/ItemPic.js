import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import VisuallyHidden from '@reach/visually-hidden';

const ItemPic = ({ url, size, onUpload, mode }) => {
  const [itemPicUrl, setItemPicUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (url) {
      downloadImage(url);
    } else if (!url) setItemPicUrl(null);
  }, [url]);

  /* most of the below code came from supabase, so if it looks
weird, it is probably a result of coding for the particularities of supabase's storage system. */

  const downloadImage = (path) => {
    try {
      const { data, error } = supabase.storage
        .from('item-pics')
        .getPublicUrl(path);
      if (error) {
        throw error;
      }
      setItemPicUrl(data.publicURL);
    } catch (error) {
      console.error('Error downloading image: ', error.message);
    }
  };

  const uploadItemPic = async (event) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      let { error: uploadError } = await supabase.storage
        .from('item-pics')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      onUpload(filePath, mode);
    } catch (error) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ width: size }} aria-live="polite">
      <img
        src={itemPicUrl ? itemPicUrl : `https://place-hold.it/${size}x${size}`}
        alt={itemPicUrl ? 'Item Picture' : 'No image'}
        className="avatar image"
        style={{ height: size, width: size }}
      />
      {uploading ? (
        'Uploading...'
      ) : (
        <div>
          <label
            className="mt-2 rounded-lg bg-purple-400 px-4 py-2 text-sm uppercase text-white"
            htmlFor="single"
          >
            Upload a picture
          </label>
          <VisuallyHidden>
            <input
              type="file"
              id="single"
              accept="image/*"
              onChange={uploadItemPic}
              disabled={uploading}
            />
          </VisuallyHidden>
        </div>
      )}
    </div>
  );
};

export default ItemPic;
