import React, { useState, useEffect } from "react";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

const PLCard = ({ ...props }) => {
  return (
    // <div className={`bg-gray-950 border border-gray-700 ${props.className}`}>
    <Link
      key={props.key}
      className={`relative pl-card-item rounded-md border border-gray-700 flex justify-between items-center gap-x-6 py-2 px-3 bg-inherit shadow-sm hover:decoration-solid focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
      to={props.linkTo}
    >
      {props.pro && (
        <p className="absolute top-1 right-2 text-xs text-right  font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% ">
          PRO
        </p>
      )}
      <div className="flex gap-x-4">
        <div className="w-full min-w-0 flex-auto">
          <p
            className={`text-left my-1 w-full truncate text-lg leading-6 text-gray-500 dark:text-white`}
          >
            {props.title}
          </p>
          <div className="flex justify-start items-center ">
            <div className="text-xs font-semibold leading-5 text-gray-900 dark:text-gray-300 flex items-center justify-start mr-4">
              {props.subTitle1}
            </div>
            <div className="text-xs leading-5 text-gray-500 dark:text-gray-300 mr-4">
              {props.subTitle2}
            </div>
          </div>
          <div className="text-xs leading-5 text-gray-500 dark:text-gray-300">
            {props.subTitle3}
          </div>
        </div>
      </div>
    </Link>
    //   </div>
  );
};

export default PLCard;
