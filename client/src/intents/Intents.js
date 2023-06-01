import React, { useState, useEffect } from "react";
import auth from "./../auth/auth-helper";
import { Navigate, Link, useParams } from "react-router-dom";
import { list } from "./api-intents";
import CreateIntent from "./CreateIntent";
import ListView from "../elements/ListView";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

export default function Intents() {
  const params = useParams();
  const [intents, setIntents] = useState([]);
  const [noIntents, setNoIntents] = useState(false);
  const [open, setOpen] = useState(false);
  const jwt = auth.isAuthenticated();
  dayjs.extend(relativeTime);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    // console.log(params);
    list(
      {
        userId: params.userId,
      },
      { t: jwt.token },
      signal
    ).then((data) => {
      // console.log(data);
      if (data && data.error) {
        console.log(data.error);
      } else {
        if (!data.length) setNoIntents(true);
        data.map((intent, i) => {
          intent.created = `Created ${dayjs(intent.created).fromNow(true)} ago`;
          intent.linkPath = `/intents/${params.userId}/intent/${intent._id}`;
        });
        setIntents(data);
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, [params.userId]);

  const onIntentCreated = () => {
    list(
      {
        userId: params.userId,
      },
      { t: jwt.token },
      undefined
    ).then((data) => {
      // console.log(data);
      if (data && data.error) {
        console.log(data.error);
      } else {
        if (!data.length) setNoIntents(true);
        else setNoIntents(false);
        data.map((intent, i) => {
          intent.created = `Created ${dayjs(intent.created).fromNow(true)} ago`;
          intent.linkPath = `/intents/${params.userId}/intent/${intent._id}`;
        });
        setIntents(data);
      }
    });
  };
  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="mb-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-white">
          Intents
        </h2>
        <button
          type="button"
          className="basis-30 flex gap-2 justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={() => setOpen(true)}
          //   ref={cancelButtonRef}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="#fff"
            className="w-5 h-5"
          >
            <path d="M2 4.25A2.25 2.25 0 014.25 2h2.5A2.25 2.25 0 019 4.25v2.5A2.25 2.25 0 016.75 9h-2.5A2.25 2.25 0 012 6.75v-2.5zM2 13.25A2.25 2.25 0 014.25 11h2.5A2.25 2.25 0 019 13.25v2.5A2.25 2.25 0 016.75 18h-2.5A2.25 2.25 0 012 15.75v-2.5zM11 4.25A2.25 2.25 0 0113.25 2h2.5A2.25 2.25 0 0118 4.25v2.5A2.25 2.25 0 0115.75 9h-2.5A2.25 2.25 0 0111 6.75v-2.5zM15.25 11.75a.75.75 0 00-1.5 0v2h-2a.75.75 0 000 1.5h2v2a.75.75 0 001.5 0v-2h2a.75.75 0 000-1.5h-2v-2z" />
          </svg>
          New
        </button>
      </div>
      <CreateIntent
        className="mb-10"
        params={params}
        credentials={{ t: jwt.token }}
        cb={onIntentCreated}
        open={open}
        setOpen={setOpen}
      />
      <ListView
        data={intents}
        noData={noIntents}
        contentKeys={["name", "model", "created"]}
        linkKey="linkPath"
      />
    </>
  );
}
