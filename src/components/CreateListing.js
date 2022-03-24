import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import ItemPic from './ItemPic';

const CreateListing = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    itemPicUrl: '',
  });
  const user = supabase.auth.user();
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData({ ...formData, [name]: value });
    console.log(formData);
  };

  return (
    <div className="listing-form">
      <form id="create-listing">
        <ItemPic
          url={formData.itemPicUrl}
          size={150}
          onUpload={(url) => {
            setFormData({ ...formData, itemPicUrl: url });
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
        <button type="submit">Create Listing</button>
      </form>
    </div>
  );
};

export default CreateListing;
