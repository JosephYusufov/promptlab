import React, { useState, useEffect } from "react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { Tooltip } from "react-tooltip";

const PLTooltip = ({ ...props }) => {
  // let [data, setData] = useState(props.data);
  // let [contentKeys, setContentKeys] = useState(props.contentKeys);
  // let [noData, setNoData] = useState(props.noData);
  // let [selected, setSelected] = useState(null);
  return (
    <div>
      <InformationCircleIcon
        className="text-gray-400 h-5 w-5"
        id="my-anchor-element"
      >
        stuff
      </InformationCircleIcon>{" "}
      <Tooltip
        anchorSelect="#my-anchor-element"
        place="bottom"
        className="bg-gray-700 text-base whitespace-pre-line roudned-md max-w-[300px]"
      >
        {props.content}
      </Tooltip>
    </div>
  );
};

export default PLTooltip;
