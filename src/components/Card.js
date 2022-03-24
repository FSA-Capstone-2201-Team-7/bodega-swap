import React from 'react';
import { useLocation } from 'react-router-dom';

const Card = (props) => {
  const { name, description, imageUrl, category, ownerId } = props;
  const dropDownhandler = () => {

  }

  console.log('props', name);
  return name || description ? (
      <div className="max-w-sm rounded overflow-hidden shadow-lg ">
        <button type="button" onClick={() => dropDownhandler()}>
          <img className="h-96 w-96" src={imageUrl} alt="" />
        </button>
        <div className="px-6 py-4 pt-4 pb-2">
          <div className="font-bold text-xl mb-2">{name || null}</div>
          <p className="text-gray-700 text-base">{description || null}</p>
        </div>
       
      </div>
    ) : (
      <div className="max-w-sm rounded overflow-hidden shadow-lg ">
        <img className="h-96 w-96" src={imageUrl} alt="" />
      </div>
    );
      
   
 
};
export default Card;

//className="h-96 w-96"
