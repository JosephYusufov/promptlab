import React, { useState, useEffect } from "react";
import auth from "./../auth/auth-helper";
import { Link, useParams } from "react-router-dom";
import { read as readProject } from "./api-project";
import { read as readIntent } from "./../intents/api-intents";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import ListView from "../elements/ListView";
import CreateIntent from "../intents/CreateIntent";
import Sidebar from "../elements/Sidebar";
import SingleIntent from "../intents/SingleIntent";
import SingleContext from "../context/SingleContext";
import {
  CubeTransparentIcon,
  CalendarIcon,
  ArrowPathIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import CreateContext from "./../context/CreateContext";
import PLTooltip from "../elements/PLTooltip";
import ShareProject from "./ShareProject";

export default function SingleProject({ ...props }) {
  const params = useParams();
  const [project, setProject] = useState({});
  const [intentId, setIntentId] = useState(null);
  const [contextId, setContextId] = useState(null);
  const [noData, setNoData] = useState(false);
  const [noContexts, setNoContexts] = useState(false);
  const [open, setOpen] = useState(false);
  const [createContextOpen, setCreateContextOpen] = useState(false);
  const [tabs, setTabs] = useState([
    { name: "Intents", isActive: true },
    { name: "Context", isActive: false },
    { name: "Share", isActive: false },
    { name: "Settings", isActive: false },
  ]);
  const jwt = auth.isAuthenticated();
  // console.log(jwt);
  dayjs.extend(relativeTime);

  const fetchAndUpdateProject = () => {
    // setProject({});
    // setIntentId(null);
    setNoData(false);
    setNoContexts(false);
    setOpen(false);
    readProject(
      {
        projectId: params.projectId,
      },
      { t: jwt.token }
    ).then((data) => {
      // console.log(data);
      if (data && data.error) {
        console.log(data.error);
      } else {
        if (!data.intents.length) setNoData(true);
        if (!data.contexts.length) setNoContexts(true);
        data.intents.map((intent, i) => {
          intent.created = `Created ${dayjs(intent.created).fromNow(true)} ago`;
          intent.version = `Generation ${intent.version}`;
        });
        setProject(data);
      }
    });
  };

  const onSelect = (intent) => {
    console.log(intent);
    setIntentId(intent._id);
  };

  const onSelectContext = (context) => {
    console.log(context);
    setContextId(context._id);
  };

  useEffect(fetchAndUpdateProject, [params]);

  const isActiveTab = (s) => {
    let isActive = false;
    tabs.map((tab) => {
      if (s == tab.name && tab.isActive) isActive = true;
    });
    return isActive;
  };

  return (
    <div className="h-screen flex flex-col h-[calc(100vh-4rem)]">
      <div className="border-b border-gray-700 mb-7">
        <div className=" flex justify-start items-center mb-7 ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="#fff"
            className="h-6 w-6 inline mr-2"
          >
            <path d="M2 4.25A2.25 2.25 0 014.25 2h2.5A2.25 2.25 0 019 4.25v2.5A2.25 2.25 0 016.75 9h-2.5A2.25 2.25 0 012 6.75v-2.5zM2 13.25A2.25 2.25 0 014.25 11h2.5A2.25 2.25 0 019 13.25v2.5A2.25 2.25 0 016.75 18h-2.5A2.25 2.25 0 012 15.75v-2.5zM11 4.25A2.25 2.25 0 0113.25 2h2.5A2.25 2.25 0 0118 4.25v2.5A2.25 2.25 0 0115.75 9h-2.5A2.25 2.25 0 0111 6.75v-2.5zM15.25 11.75a.75.75 0 00-1.5 0v2h-2a.75.75 0 000 1.5h2v2a.75.75 0 001.5 0v-2h2a.75.75 0 000-1.5h-2v-2z" />
          </svg>
          <h2 className="relative text-center text-2xl font-regular leading-9 tracking-tight text-gray-900 dark:text-white">
            {/* <span>{jwt.user.username}</span> / */}
            <span className="font-semibold"> {project.name} </span>
            {project.is_pro && (
              <p className="absolute top-0 right-0 mt-[-10px] mr-[-30px] text-xs text-right  font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% ">
                PRO
              </p>
            )}
          </h2>
        </div>
        <div className="flex justify-start gap-12 ">
          {tabs.map((tab, i) => {
            return (
              <Link
                key={`tab-${i}`}
                className={`relative text-white px-3 pb-2 ${
                  tab.isActive && "border-b-2 border-indigo-600"
                } `}
                onClick={() => {
                  setTabs((state) => {
                    const newTabs = state.map((v) => {
                      if (v.name == tab.name) v.isActive = true;
                      else v.isActive = false;
                      return v;
                    });
                    return newTabs;
                  });
                }}
              >
                {tab.name == "Share" && !project.is_pro && (
                  // <div>
                  <p className="absolute top-0 right-0 mt-[-10px] mr-[-10px] text-xs text-right  font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% ">
                    PRO
                  </p>
                  // </div>
                )}
                <div>{tab.name}</div>
              </Link>
            );
          })}
        </div>
      </div>
      {/* <hr className="text-center mb-4"></hr> */}
      <div>
        {isActiveTab("Intents") && (
          <div className="h-5/6 flex justify-between items-start gap-5">
            <div className="w-1/4 h-full">
              <div className="flex justify-between items-center  mb-4">
                <div className="flex items-center">
                  <h2 className="text-xl text-white">Intents</h2>\
                  <PLTooltip
                    content={
                      'Intents are used to store different versions of Prompt Templates.\nFor example, if you\'re testing a prompt to detect sarcasm in a sentence, you would name your Intent:\n\n"Detect Sarcasm".'
                    }
                  ></PLTooltip>
                </div>
                <button
                  type="button"
                  className="flex gap-2 justify-center rounded-md bg-indigo-600 px-3 py-1 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  onClick={() => setOpen(true)}
                  //   ref={cancelButtonRef}
                >
                  <PlusIcon className="w-5 h-5"></PlusIcon>
                </button>
              </div>

              <Sidebar
                data={project.intents}
                noData={noData}
                contentKeys={["name", "model", "version", "created"]}
                onSelect={onSelect}
                className="h-full overflow-auto"
              ></Sidebar>
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
            <div className="intent w-[calc(75%-1.5rem)]">
              <SingleIntent
                intentId={intentId}
                project={project}
              ></SingleIntent>
            </div>
          </div>
        )}
        {isActiveTab("Context") && (
          <div className="h-5/6 flex justify-between items-start gap-5">
            <div className="w-1/4 h-full">
              <div className="flex justify-between items-center  mb-4">
                <h2 className="text-xl text-white">Context Variables</h2>
                <button
                  type="button"
                  className="flex gap-2 justify-center rounded-md bg-indigo-600 px-3 py-1 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  onClick={() => setCreateContextOpen(true)}
                  //   ref={cancelButtonRef}
                >
                  <PlusIcon className="w-5 h-5"></PlusIcon>
                </button>
              </div>

              <Sidebar
                data={project.contexts}
                noData={noContexts}
                onSelect={onSelectContext}
                renderListItem={(datum) => {
                  return (
                    <div className="text-indigo-400 font-bold bg-gray-800 p-1 rounded-md text-sm font-mono">
                      {datum.name}
                    </div>
                  );
                }}
                className="h-full overflow-auto"
              ></Sidebar>
            </div>
            <CreateContext
              className="mb-10"
              params={params}
              project={project}
              credentials={{ t: jwt.token }}
              cb={fetchAndUpdateProject}
              open={createContextOpen}
              setOpen={setCreateContextOpen}
            />
            <div className="intent w-[calc(75%-1.5rem)]">
              <SingleContext
                contextId={contextId}
                fetchProject={fetchAndUpdateProject}
              ></SingleContext>
            </div>
          </div>
        )}
        {isActiveTab("Share") && (
          <ShareProject project={project} cb={fetchAndUpdateProject} />
        )}
      </div>
    </div>
  );
}
