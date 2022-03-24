import React from 'react';
// const style = {
//    journal-scroll::-webkit-scrollbar: {
//         width: 6px;
//         cursor: pointer;
//     }

//     #journal-scroll::-webkit-scrollbar-track {
//         background-color: rgba(229, 231, 235, var(--bg-opacity));
//         cursor: pointer;
//     }

//     #journal-scroll::-webkit-scrollbar-thumb {
//         cursor: pointer;
//         background-color: #a0aec0;
//     }
// }

const Chat = () => {
  return (
    <div className="bg-gray-300 h-screen flex justify-center rounded shadow-2xl">
      <div className=" flex justify-center grid grid-cols-1 ">
        <div className="w-96 bg-white rounded shadow-2xl">
          <nav class=" h-10 bg-gray-900 rounded-tr rounded-tl flex justify-between items-center">
            <div class="flex justify-center items-center">
              {' '}
              <span class="text-xl font-medium text-gray-300 ml-1">
                USERNAMES?
              </span>{' '}
            </div>
          </nav>
          <div className="overflow-auto px-1 py-1">messages here</div>
        </div>
        <div className="bg-white">
          <div className="relative ">
            <div className="absolute top-48 ">
              <input
                type="text"
                className="rounded-full w-96 pl-12 pr12  py-8 focus:outline-none h-auto placeholder-gray-100 bg-gray-900 text-white"
                placeholder="Type a message..."
              />

              <div className=" w-96 rounded-full bg-blue-300 text-center items-center flex justify-center focus:outline-none hover:bg-gray-900 hover:text-white ">
                <button
                  className="rounded-full  text-center flex justify-center focus:outline-none hover:bg-gray-900 hover:text-white"
                  onClick={() => console.log('message send')}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
