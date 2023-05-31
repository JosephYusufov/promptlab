import React, { useState, useEffect } from "react";
import auth from "./../auth/auth-helper";
import { Navigate, Link, useParams } from "react-router-dom";
import { read } from "./api-intents";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

export default function SingleIntent({ ...props }) {
  const params = useParams();
  const [intent, setIntent] = useState({});
  //   const [noIntents, setNoIntents] = useState(false);
  //   const [open, setOpen] = useState(false);
  const jwt = auth.isAuthenticated();
  dayjs.extend(relativeTime);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    console.log(params);
    read(
      {
        userId: params.userId,
        intentId: params.intentId,
      },
      { t: jwt.token },
      signal
    ).then((data) => {
      console.log(data);
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
      <div className="flex justify-between items-center">
        <h2 className="mb-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-white">
          {intent.name}
        </h2>
      </div>
    </>
  );
}
