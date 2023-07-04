import React from "react";

const PLGrid = ({ ...props }) => {
  return (
    <>
      {props.children.length ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {props.children}
        </div>
      ) : (
        <div className="p-5 rounded-md bg-slate-900 shadow-sm">
          <h1 className="text-center text-md dark:text-white">
            Nothing here yet!
          </h1>
        </div>
      )}
    </>
  );
};

export default PLGrid;
