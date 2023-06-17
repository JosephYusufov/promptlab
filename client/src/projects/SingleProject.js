import React, { useState, useEffect } from "react";
import auth from "./../auth/auth-helper";
import { useParams } from "react-router-dom";
import { read } from "./api-project";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import ListView from "../elements/ListView";
import CreateIntent from "../intents/CreateIntent";
import Sidebar from "../elements/Sidebar";
import {
  CubeTransparentIcon,
  CalendarIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

export default function SingleProject({ ...props }) {
  const params = useParams();
  const [project, setProject] = useState({});

  const [noData, setNoData] = useState(false);
  const [open, setOpen] = useState(false);
  const jwt = auth.isAuthenticated();
  console.log(jwt);
  dayjs.extend(relativeTime);

  const fetchAndUpdateProject = () => {
    read(
      {
        projectId: params.projectId,
      },
      { t: jwt.token }
    ).then((data) => {
      console.log(data);
      if (data && data.error) {
        console.log(data.error);
      } else {
        if (!data.intents.length) setNoData(true);
        data.intents.map((intent, i) => {
          intent.created = `Created ${dayjs(intent.created).fromNow(true)} ago`;
          intent.version = `Generation ${intent.version}`;
        });
        setProject(data);
      }
    });
  };

  useEffect(fetchAndUpdateProject, [params]);

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
          <span className="font-semibold"> {project.name} </span>
        </h2>
      </div>
      <hr className="text-centerborder-t border-gray-700 mb-4"></hr>
      <div className="flex gap-6 justify-between items-start">
        <div className="w-1/4">
          <div className="flex justify-between items-center  mb-4">
            <h2 className="text-xl text-white">Intents</h2>
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

          <ListView
            data={project.intents}
            noData={noData}
            contentKeys={["name", "model", "generation", "created"]}
            sidebar={true}
            disclosureContent={true}
            renderDisclosure={(datum) => (
              <div className="bg-gray-800 animate p-5">
                <h2 className="text-lg mb-2">Full Text</h2>
                {datum.text}
              </div>
            )}
          ></ListView>
        </div>
        <CreateIntent
          className="mb-10"
          params={params}
          project={project}
          credentials={{ t: jwt.token }}
          cb={fetchAndUpdateProject}
          open={open}
          setOpen={setOpen}
        />
        <div className="intent w-3/4">
          <h2 className="text-lg text-white mb-4">About</h2>
          <div className="flex justify-start items-center gap-2">
            <CubeTransparentIcon className="text-gray-400 h-5 w-5"></CubeTransparentIcon>
            <p className="text-base text-gray-400">{project.model}</p>
          </div>
          <div className="flex justify-start items-center gap-2">
            <CalendarIcon className="text-gray-400 h-5 w-5"></CalendarIcon>
            <p className="text-base text-gray-400">{`Created ${dayjs(
              project.created
            ).fromNow(true)} ago`}</p>
          </div>
          <div className="flex justify-start items-center gap-2">
            <ArrowPathIcon className="text-gray-400 h-5 w-5"></ArrowPathIcon>
            <p className="text-base text-gray-400">Version {project.version}</p>
          </div>
        </div>
      </div>
    </>
  );
}
