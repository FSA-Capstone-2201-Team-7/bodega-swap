import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import ItemPic from './ItemPic';

const EditListing = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    imageUrl: '',
    active: null,
  });

  return <div>Hello</div>;
};

export default EditListing;
