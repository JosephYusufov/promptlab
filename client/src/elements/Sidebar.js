import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

const Sidebar = ({ ...props }) => {
  let [data, setData] = useState(props.data);
  let [contentKeys, setContentKeys] = useState(props.contentKeys);
  let [noData, setNoData] = useState(props.noData);
  let [selected, setSelected] = useState(null);

  useEffect(() => {
    setData(props.data);
    setContentKeys(props.contentKeys);
    setNoData(props.noData);
  }, [props]);

  useEffect(() => {
    if (props.onSelect != undefined && selected) {
      console.log(selected);
      props.onSelect(selected);
    }
  }, [selected]);

  const handleClick = (datum) => {
    setSelected(datum);
  };

  return (
    <div className={props.className}>
      {/* No data, but it is still being loaded */}
      {data && data.length == 0 && !noData && (
        <div className={"flex justify-center items-center mt-10"}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 400 400"
            strokeWidth={40}
            stroke="#4f46e5"
            className="w-8 h-8 animate-spin"
          >
            <path d=" M 360 200 A 160 160 0 1 1 249 48" />
          </svg>
        </div>
      )}
      {/* No data, finished loading */}
      {noData && (
        <div className="p-5 rounded-md bg-slate-900 shadow-sm">
          <h1 className="text-center text-md dark:text-white">
            Nothing here yet!
          </h1>
        </div>
      )}
      {/* data */}
      {data && !data.length == 0 && (
        <ul role="list" className="divide-y divide-gray-600 ">
          {data.map((item, i) => {
            return (
              <li key={`item-${i}`}>
                <Link
                  onClick={() => handleClick(item)}
                  className={`${
                    selected && selected._id == item._id ? "active" : ""
                  } pl-list-view-item flex justify-between items-center gap-x-6 py-2 px-3 rounded-sm bg-inherit shadow-sm hover:decoration-solid focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
                >
                  <div className="flex gap-x-4 w-5/6">
                    <div className="w-full min-w-0 flex-auto">
                      <p
                        className={`text-left my-1 w-full truncate text-lg leading-6 text-gray-500 dark:text-white`}
                      >
                        {item[contentKeys[0]]}
                      </p>
                      <div className="flex justify-start items-center ">
                        <div className="text-xs font-semibold leading-5 text-gray-900 dark:text-gray-300 flex items-center justify-start mr-4">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="w-5 h-5 mr-1"
                          >
                            <path
                              fillRule="evenodd"
                              d="M9.638 1.093a.75.75 0 01.724 0l2 1.104a.75.75 0 11-.724 1.313L10 2.607l-1.638.903a.75.75 0 11-.724-1.313l2-1.104zM5.403 4.287a.75.75 0 01-.295 1.019l-.805.444.805.444a.75.75 0 01-.724 1.314L3.5 7.02v.73a.75.75 0 01-1.5 0v-2a.75.75 0 01.388-.657l1.996-1.1a.75.75 0 011.019.294zm9.194 0a.75.75 0 011.02-.295l1.995 1.101A.75.75 0 0118 5.75v2a.75.75 0 01-1.5 0v-.73l-.884.488a.75.75 0 11-.724-1.314l.806-.444-.806-.444a.75.75 0 01-.295-1.02zM7.343 8.284a.75.75 0 011.02-.294L10 8.893l1.638-.903a.75.75 0 11.724 1.313l-1.612.89v1.557a.75.75 0 01-1.5 0v-1.557l-1.612-.89a.75.75 0 01-.295-1.019zM2.75 11.5a.75.75 0 01.75.75v1.557l1.608.887a.75.75 0 01-.724 1.314l-1.996-1.101A.75.75 0 012 14.25v-2a.75.75 0 01.75-.75zm14.5 0a.75.75 0 01.75.75v2a.75.75 0 01-.388.657l-1.996 1.1a.75.75 0 11-.724-1.313l1.608-.887V12.25a.75.75 0 01.75-.75zm-7.25 4a.75.75 0 01.75.75v.73l.888-.49a.75.75 0 01.724 1.313l-2 1.104a.75.75 0 01-.724 0l-2-1.104a.75.75 0 11.724-1.313l.888.49v-.73a.75.75 0 01.75-.75z"
                              clipRule="evenodd"
                            />
                          </svg>

                          {item[contentKeys[1]]}
                        </div>
                        <div className="text-xs leading-5 text-gray-500 dark:text-gray-300 mr-4">
                          {item[contentKeys[2]]}
                        </div>
                      </div>
                      {contentKeys.length > 3 && (
                        <div className="text-xs leading-5 text-gray-500 dark:text-gray-300">
                          {item[contentKeys[3]]}
                        </div>
                      )}
                    </div>
                  </div>
                  <ChevronRightIcon className="w-5 h-5 mr-2 text-white"></ChevronRightIcon>
                </Link>
              </li>
              // </Disclosure>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Sidebar;
