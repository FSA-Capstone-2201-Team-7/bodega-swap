import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const AgreedButton = (props) => {

  const { info, handleAcceptance, swap, inOrOut } = props;

 
  return swap.inbound_accept === true && swap.outbound_accept === true ? (
    <label htmlFor="my-modal-5" className="btn modal-button w-full">
      Mark Complete
    </label>
  ) : info.userAccept ? (
    <button className="btn loading">Waiting...</button>
  ) : (
    <button
      className="btn btn-xs sm:btn-sm md:btn-md w-full"
      onClick={() => handleAcceptance(info)}
    >
      Accept Terms
    </button>
  );

};

export default AgreedButton;
