import React from 'react'


const Main = ({session}) => {
  return (
    <div>
      {/* <img
        src="https://pbs.twimg.com/media/Da4LRjeWAAAZkLj?format=jpg&name=medium"
        alt=""
      />
      <div>-----</div> */}
     
        <div className='bg-white border overflow-hidden'>
          <img
            src="https://pbs.twimg.com/media/ElK-sofWAAY8iE7?format=jpg&name=large"
            alt=""
            className="h-96 w-full object-cover object-fit"
          />
          <div className='absolute w-full py-2.5 bottom-0 inset-x-0 bg-blue-400 text-white text-xs text-center leading-4'>hello</div>

        </div>
     

      {/* <div>----</div>
      <img
        src="https://pbs.twimg.com/media/CoFWFV9WAAE3agy?format=jpg&name=large"
        alt=""
      /> */}
    </div>
  );
}

export default Main