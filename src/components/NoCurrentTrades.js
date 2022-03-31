import React from "react";


const NoCurrentTrades = (props) => {
const {inbound } = props

  return inbound ? (
    <div>
      <div>No Current In-Bound</div>
      {/* <button type="button">
        Check Out 
      </button> */}
    </div>
  ) : (
    <div>
      <div>No Current Out-Bound</div>
    </div>
  );
} 

export default NoCurrentTrades