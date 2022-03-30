import React from "react";
import {
  ThumbUpIcon,
  ChatAlt2Icon,
  GiftIcon,
  CursorClickIcon,
} from "@heroicons/react/outline";
function StepBar() {
  return (
    <div className="w-full py-6">
      <div className=" flex ">
        <div className="w-1/4">
          <div className="relative mb-2">
            <div className="w-10 h-10 mx-auto bg-indigo-500 rounded-full text-lg text-white flex items-center">
              <span className="text-center text-white w-full">
                <CursorClickIcon className="w-full p-2" />
              </span>
            </div>
          </div>

          <div className="text-xs text-center md:text-base">
            Create Proposal
          </div>
        </div>

        <div className="w-1/4">
          <div className="relative mb-2">
            <div className="absolute w-[calc(100%-2rem-1rem)] -translate-x-1/2 top-1/2 flex align-center items-center align-middle content-center">
              <div className="w-full bg-gray-200 rounded items-center align-middle align-center flex-1">
                <div className="w-full bg-indigo-300 py-1 rounded"></div>
              </div>
            </div>

            <div className="w-10 h-10 mx-auto bg-indigo-500 rounded-full text-lg text-white flex items-center">
              <span className="text-center text-white w-full">
                <ChatAlt2Icon className="w-full p-2" />
              </span>
            </div>
          </div>

          <div className="text-xs text-center md:text-base">Chat</div>
        </div>

        <div className="w-1/4">
          <div className="relative mb-2">
            <div className="absolute w-[calc(100%-2rem-1rem)] top-1/2 -translate-x-1/2 flex align-center items-center align-middle content-center">
              <div className="w-full bg-gray-200 rounded items-center align-middle align-center flex-1">
                <div className="w-1/3 bg-indigo-300 py-1 rounded"></div>
              </div>
            </div>

            <div className="w-10 h-10 mx-auto bg-white border-2 border-gray-200 rounded-full text-lg text-white flex items-center">
              <span className="text-center text-gray-600 w-full">
                <GiftIcon className="w-full p-2" />
              </span>
            </div>
          </div>

          <div className="text-xs text-center md:text-base">Meet Up</div>
        </div>

        <div className="w-1/4">
          <div className="relative mb-2">
            <div className="absolute w-[calc(100%-2rem-1rem)] top-1/2 flex align-center -translate-x-1/2 items-center align-middle content-center">
              <div className="w-full bg-gray-200 rounded items-center align-middle align-center flex-1">
                <div className="w-0 bg-indigo-300 py-1 rounded"></div>
              </div>
            </div>

            <div className="w-10 h-10 mx-auto bg-white border-2 border-gray-200 rounded-full text-lg text-white flex items-center">
              <span className="text-center text-gray-600 w-full">
                <ThumbUpIcon className="w-full p-2" />
              </span>
            </div>
          </div>

          <div className="text-xs text-center md:text-base">Rate</div>
        </div>
      </div>
    </div>
  );
}

export default StepBar;
