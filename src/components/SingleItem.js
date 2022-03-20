import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const SingleItem = (props) => {
  const [loading, setLoading] = useState(true);
  const { item, setItem } = useState(null);
  const { owner, setOwner } = useState(null);

  useEffect(() => {});

  const getItem = async () => {};

  return <div>{loading ? <p>Loading</p> : <div>Hello World</div>}</div>;
};

export default SingleItem;
