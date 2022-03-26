import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import ItemPic from './ItemPic';
import { useNavigate, useParams } from 'react-router-dom';

const CreateOrEditListing = (props) => {
  //Props passed down to this component will determine whether a listing in question
  //is being edited, or created. If it is being edited, the 'mode' prop will be 'edit'.
  //If it is being created, the 'mode' prop will be 'create'.
  const [loading, setLoading] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    listed: null,
    itemPicUrl: '',
    itemPicName: '',
  });

  const user = supabase.auth.user();
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    const getItem = async () => {
      try {
        setLoading(true);
        let { data, error, status } = await supabase
          .from('items')
          .select('name, description, category, listed, image_url, image_name')
          .eq('id', params.id)
          .limit(1)
          .single();
        if (error) throw error;
        if (data) {
          // console.log(data);
          setFormData({
            name: data.name,
            description: data.description,
            category: data.category,
            listed: data.listed,
            itemPicName: data.image_name,
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (props.mode === 'edit') {
      getItem();
    } else
      setFormData({
        name: '',
        description: '',
        category: '',
        listed: null,
        itemPicUrl: '',
        itemPicName: '',
      });
  }, [props.mode]);

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData({ ...formData, [name]: value });
    console.log(formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let fullUrl = supabase.storage
        .from('item-pics')
        .getPublicUrl(formData.itemPicName);
      console.log(fullUrl);
      let { data, error } = await supabase.from('items').upsert([
        {
          id: params.id,
          name: formData.name,
          description: formData.description,
          category: formData.category,
          image_url: fullUrl.data.publicURL,
          ownerId: user.id,
          image_name: formData.itemPicName,
          listed: formData.listed,
        },
      ]);

      if (error) {
        throw error;
      }
      if (data) {
        props.mode === 'create'
          ? alert('Listing Successfully Created!')
          : alert('Listing Updated Successfully!');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setFormData({
        name: '',
        description: '',
        category: '',
        itemPicUrl: '',
        itemPicName: '',
      });
      navigate('/myAccount');
    }
  };

  return (
    <div className="listing-form">
      <form id="create-listing" onSubmit={handleSubmit}>
        <ItemPic
          url={formData.itemPicName}
          size={150}
          mode={props.mode}
          onUpload={async (url, mode) => {
            if (mode === 'edit')
              await supabase.storage
                .from('item-pics')
                .remove([formData.itemPicName]);
            setFormData({ ...formData, itemPicName: url });
          }}
        />
        <label htmlFor="name">Name</label>
        <input
          name="name"
          placeholder="Name"
          required={true}
          value={formData.name}
          onChange={handleChange}
        />
        <label htmlFor="description">Description</label>
        <input
          name="description"
          placeholder="Description"
          required={true}
          value={formData.description}
          onChange={handleChange}
        />

        <label htmlFor="category">Category</label>
        <select name="category" value={formData.value} onChange={handleChange}>
          <option value={`Arts & Crafts`}>{`Arts & Crafts`}</option>
          <option value="Books">Books</option>
          <option value={`Clothing & Apparel`}>{`Clothing & Apparel`}</option>
          <option value="Collectibles">Collectibles</option>
          <option value="Electronics">Electronics</option>
          <option value={`Food & Drink`}>{`Food & Drink`}</option>
          <option value="Furniture">Furniture</option>
          <option value="Home Decor">Home Decor</option>
          <option
            value={`Music & Musical Instruments`}
          >{`Music & Musical Instruments`}</option>
          <option value={`Makeup & Cosmetics`}>{`Makeup & Cosmetics`}</option>
          <option value={`Office & Workplace`}>{`Office & Workplace`}</option>
          <option value={`Sports & Outdoor`}>{`Sports & Outdoor`}</option>
          <option value={`Tools & Appliances`}>{`Tools & Appliances`}</option>
          <option value={`Toys & Games`}>{`Toys & Games`}</option>
          <option
            value={`Vehicle & Automotive`}
          >{`Vehicle & Automotive`}</option>
          <option
            value={`Video Games & Consoles`}
          >{`Video Games & Consoles`}</option>
          <option value="Other/Misc.">Other/Misc.</option>
        </select>

        <label>Listing Status</label>

        <label htmlFor="listed">Listed</label>
        <input
          name="listed"
          id="listed"
          type="radio"
          value={true}
          onChange={handleChange}
        />

        <label htmlFor="unlisted">Unlisted</label>
        <input
          name="listed"
          id="unlisted"
          type="radio"
          value={false}
          onChange={handleChange}
        />

        <button type="submit">
          {props.mode === 'edit' ? 'Edit Listing' : 'Create Listing'}
        </button>
      </form>
    </div>
  );
};

export default CreateOrEditListing;
