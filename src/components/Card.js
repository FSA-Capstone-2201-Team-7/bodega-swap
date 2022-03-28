import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { Menu, Transition } from "@headlessui/react";

const classNames = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

const Card = (props) => {
  const {
    name,
    description,
    imageUrl,
    category,
    ownerId,
    id,
    firstButton,
    secondButton = "",
  } = props;
  const dropDownhandler = () => {};

  return description ? (
    <div className="max-w-sm rounded overflow-hidden shadow-lg ">
      <button type="button" onClick={() => dropDownhandler()}>
        <Link to={`/items/${id}`}>
          <img className="h-96 w-96" src={imageUrl} alt="" />
        </Link>
      </button>

      <Menu as="div">
        <div>
          <Menu.Button
            as="div"
            className="inline-flex justify-center w-full  shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
          >
            <ChevronDownIcon
              className="-mr-1 ml-2 h-5 w-5"
              aria-hidden="true"
            />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items
            as="div"
            className="origin-top-right relative right-0 mt-2 w-96 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none px-6 py-4 pt-4 pb-2"
          >
            <Menu.Item className="py-1" as="div">
              <div className="font-bold text-xl mb-2">{name || null}</div>
            </Menu.Item>
            <Menu.Item className="py-1" as="div">
              <p className="text-gray-700 text-base text-ellipsis overflow-hidden pb-[5%]">
                {description || null}
              </p>
            </Menu.Item>
            <Menu.Item>
              {firstButton || <button type="button"></button>}
            </Menu.Item>
            <Menu.Item>
              {secondButton || <button type="button"></button>}
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  ) : (
    <div className="max-w-sm rounded overflow-hidden shadow-lg ">
      <Link to={`/items/${id}`}>
        <img className="h-96 w-96" src={imageUrl} alt="" />
        <p>{name}</p>
      </Link>
      {firstButton || null}
      {secondButton || null}
    </div>
  );
};
export default Card;

// <div className="px-6 py-4 pt-4 pb-2">
//   <div className="font-bold text-xl mb-2">{name || null}</div>
//   <p className="text-gray-700 text-base text-ellipsis overflow-hidden">
//     {description || null}
//   </p>
// </div>;
