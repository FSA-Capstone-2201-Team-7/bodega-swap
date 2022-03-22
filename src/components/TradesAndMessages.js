import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { HaggleView } from '.';

const TradesAndMessages = () => {
  const user = supabase.auth.user()
  console.log('user', user)
  

  return <div>hello</div>;
};

export default TradesAndMessages;
