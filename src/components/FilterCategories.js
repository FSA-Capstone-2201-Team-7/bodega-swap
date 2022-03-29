import React, { useState, useEffect, Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";

const classNames = (...classes) => {
  return classes.filter(Boolean).join(" ");
};
const FilterCategory = (props) => {
  const { list, setSelected, loading } = props;
  return loading ? (
    <div>Loading...</div>
  ) : (
    <Menu
      as="div"
      className="md:col-span-2 lg:col-span-3 text-left flex justify-self-end pt-6 pr-[5%]"
    >
      <div>
        <Menu.Button
          as="div"
          className="inline-flex rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
        >
          Search
          <ChevronDownIcon className=" -mr-1 ml-2 h-5 w-5" aria-hidden="true" />
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
          className="origin-top-left absolute  right-[7%] mt-10 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
        >
          {list.map((el, i) => {
            return (
              <Menu.Item
                key={i}
                className="py-1"
                as="div"
                onClick={(event) => {
                  setSelected(event.target.outerText);
                }}
              >
                {({ active }) => (
                  <div
                    className={classNames(
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                      "block px-4 py-2 text-sm"
                    )}
                  >
                    {el}
                  </div>
                )}
              </Menu.Item>
            );
          })}
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default FilterCategory;
