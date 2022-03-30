import React from "react";

const AgreedButton = (props) => {
  const { info, handleAcceptance, swap } = props;

  return info.userAccept ? (
    swap.inbound_accept === true && swap.outbound_accept === true ? (
      <div>
        <label for="my-modal-5" class="btn modal-button w-full">
          Mark Complete
        </label>
      </div>
    ) : (
      <button className="btn loading">Waiting...</button>
    )
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
