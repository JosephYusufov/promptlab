import React, { useState, useEffect } from "react";
import auth from "./../auth/auth-helper";
import { Navigate, Link, useParams } from "react-router-dom";
import { list } from "./api-intents";
import CreateIntent from "./CreateIntent";
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
    console.log(params);
    list(
      {
        userId: params.userId,
      },
      { t: jwt.token },
      signal
    ).then((data) => {
      console.log(data);
      if (data && data.error) {
        console.log(data.error);
      } else {
        if (!data.length) setNoIntents(true);
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
      console.log(data);
      if (data && data.error) {
        console.log(data.error);
      } else {
        if (!data.length) setNoIntents(true);
        else setNoIntents(false);
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
      {/* Loading wheel */}
      {!intents.length && !noIntents && (
        <div className={"flex justify-center items-center mt-10"}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="#4f46e5"
            className="w-6 h-6 animate-spin"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
        </div>
      )}
      {noIntents && (
        <div className="p-5 rounded-md bg-slate-900 shadow-sm">
          <h1 className="text-center text-md dark:text-white">
            You have no Intents yet.
          </h1>
        </div>
      )}
      <ul role="list" class="divide-y-4 divide-transparent ">
        {intents.map((intent, idx) => {
          return (
            <li className="hello" key={`intent-${idx}`}>
              <Link
                to={`/intents/${params.userId}/intent/${intent._id}`}
                className="flex justify-between items-center gap-x-6 p-3 rounded-md bg-slate-900 shadow-sm hover:bg-slate-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                <div class="w-5/6 flex gap-x-4">
                  <div class="w-full min-w-0 flex-auto">
                    <p class="mb-2 text-xs font-semibold leading-5 text-gray-900 dark:text-gray-300">
                      {intent.model}
                    </p>
                    <p className="w-full truncate text-md leading-6 text-gray-500 dark:text-white">
                      {intent.name}
                    </p>
                    <p class="text-xs leading-5 text-gray-500 dark:text-gray-300">
                      Created <time dateTime={intent.created}></time>{" "}
                      {dayjs(intent.created).fromNow(true)} ago
                    </p>
                  </div>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="white"
                  className="w-6 h-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
