import React, { useState, useEffect } from "react";
import auth from "./../auth/auth-helper";
import { Navigate, Link, useParams } from "react-router-dom";
import { read } from "./api-intents";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import ListView from "../elements/ListView";

export default function SingleIntent({ ...props }) {
  const params = useParams();
  const [intent, setIntent] = useState({});
  //   const [noIntents, setNoIntents] = useState(false);
  //   const [open, setOpen] = useState(false);
  const jwt = auth.isAuthenticated();
  console.log(jwt);
  dayjs.extend(relativeTime);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    // console.log(params);
    read(
      {
        userId: params.userId,
        intentId: params.intentId,
      },
      { t: jwt.token },
      signal
    ).then((data) => {
      // console.log(data);
      if (data && data.error) {
        console.log(data.error);
      } else {
        // if (!data.length) setNoIntents(true);
        setIntent(data);
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, [params]);

  return (
    <>
      <div className="flex justify-start items-center mb-10 ">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="#fff"
          className="h-6 w-6 inline mr-2"
        >
          <path d="M2 4.25A2.25 2.25 0 014.25 2h2.5A2.25 2.25 0 019 4.25v2.5A2.25 2.25 0 016.75 9h-2.5A2.25 2.25 0 012 6.75v-2.5zM2 13.25A2.25 2.25 0 014.25 11h2.5A2.25 2.25 0 019 13.25v2.5A2.25 2.25 0 016.75 18h-2.5A2.25 2.25 0 012 15.75v-2.5zM11 4.25A2.25 2.25 0 0113.25 2h2.5A2.25 2.25 0 0118 4.25v2.5A2.25 2.25 0 0115.75 9h-2.5A2.25 2.25 0 0111 6.75v-2.5zM15.25 11.75a.75.75 0 00-1.5 0v2h-2a.75.75 0 000 1.5h2v2a.75.75 0 001.5 0v-2h2a.75.75 0 000-1.5h-2v-2z" />
        </svg>
        <h2 className=" text-center text-2xl font-regular leading-9 tracking-tight text-gray-900 dark:text-white">
          <span>{jwt.user.username}</span> /
          <span className="font-semibold"> {intent.name} </span>
        </h2>
      </div>
      <div className="flex justify-between items-start">
        <ListView></ListView>
      </div>
    </>
  );
}
