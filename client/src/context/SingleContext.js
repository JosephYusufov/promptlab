import React, { useState, useEffect, Fragment } from "react";
import auth from "../auth/auth-helper";
import { Navigate, Link, useParams } from "react-router-dom";
import { read, update } from "./api-context";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
// import CreateContext from "../context/CreateContext";
import {
  CubeTransparentIcon,
  CalendarIcon,
  ArrowPathIcon,
  PlusIcon,
  PlusSmallIcon,
  Square3Stack3DIcon,
  BoltIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/solid";
import {
  InformationCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import * as DOMPurify from "dompurify";
import { Transition } from "@headlessui/react";

export default function SingleContext({ ...props }) {
  const params = useParams();
  const [context, setContext] = useState({});
  const [loading, setLoading] = useState(false);
  // const [noData, setNoData] = useState(false);
  const [open, setOpen] = useState(false);
  const [err, setErr] = useState(null);
  const [textArea, setTextArea] = useState("");
  //   data: "",
  // });

  const jwt = auth.isAuthenticated();
  console.log(jwt);
  dayjs.extend(relativeTime);

  const fetchContext = () => {
    setContext(null);
    setErr(null);
    setTextArea("");

    if (props.contextId)
      read(
        {
          contextId: props.contextId,
        },
        { t: jwt.token }
      ).then((data) => {
        console.log(data);
        if (data && data.error) {
          console.log(data.error);
        } else {
          data.created = `Created ${dayjs(data.created).fromNow(true)} ago`;
          setContext(data);
          setTextArea(data.data);
        }
      });
  };
  useEffect(fetchContext, [props.contextId]);
  // useEffect(() => {}, [props.intentId]);
  // const getCompletion = () => {};

  const handleChange = (name) => (event) => {
    setTextArea(event.target.value);
  };

  const saveContext = () => {
    update(
      { ...context, data: textArea },
      {
        contextId: props.contextId,
      },
      { t: jwt.token }
    ).then((data) => {
      console.log(data);
      if (data && data.error) {
        console.log(data.error);
      } else {
        fetchContext();
        props.fetchProject();
      }
    });
  };
  return (
    <>
      {context && Object.keys(context).length && (
        <>
          <>
            <div className="flex flex-col justify-start items-left mb-5 ">
              <h2 className="text-2xl font-regular leading-9 tracking-tight text-gray-900  text-white">
                <span className="font-semibold"> {context.name} </span>
              </h2>
              <div className="flex gap-4">
                <div className="flex gap-1 items-center">
                  <CalendarIcon className="h-5 w-5 text-gray-300"></CalendarIcon>
                  <div className="text-gray-300">{context.created}</div>
                </div>
              </div>
            </div>
            {/* <hr className="text-centerborder-t border-gray-700 mb-4"></hr>{" "} */}
          </>
          <div className="flex justify-center items-center">
            <div className=" w-full">
              <textarea
                id="text"
                name="data"
                type="textarea"
                rows="6"
                value={textArea}
                onChange={handleChange("textArea")}
                autoComplete="data"
                required
                className="font-mono block w-full rounded-md border-0 py-1.5 text-gray-900  text-white shadow-sm ring-1 ring-inset ring-gray-300  ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6  bg-gray-950"
              />
            </div>
          </div>
          {context.data != textArea && (
            <button
              type="button"
              className="mt-4 flex gap-2 justify-center rounded-md bg-indigo-600 px-3 py-1 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={saveContext}
            >
              <ArrowDownTrayIcon className="w-5 h-5"></ArrowDownTrayIcon>
              <div>Save</div>
            </button>
          )}
        </>
      )}
    </>
  );
}
