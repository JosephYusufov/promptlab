import { XMarkIcon } from "@heroicons/react/24/outline";
import React, { useState, useEffect } from "react";
import { update } from "./api-project";
import auth from "../auth/auth-helper";
import { Link } from "react-router-dom";

export default function ShareProject({ ...props }) {
  const [values, setValues] = useState({ email: "" });
  const [project, setProject] = useState(props.project);
  const jwt = auth.isAuthenticated();

  useEffect(() => {
    setProject(props.project ?? {});
    // console.log(props);
  }, [props]);

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleRemove = async (member) => {
    console.log(member);
    update(
      { projectId: project.id },
      { members: { remove: [member.email] } },
      { t: jwt.token }
    ).then((data) => {
      console.log(data);
      if (data && data.error) {
        console.log(data.error);
      } else {
        props.cb();
      }
    });
  };

  const handleAdd = async (newMemberEmail) => {
    console.log(newMemberEmail);
    update(
      { projectId: project.id },
      { members: { add: [newMemberEmail] } },
      { t: jwt.token }
    ).then((data) => {
      console.log(data);
      if (data && data.error) {
        console.log(data.error);
      } else {
        props.cb();
      }
    });
  };

  return (
    <>
      {project.is_pro ? (
        <div className="h-5/6">
          <h2 className="text-xl text-white">Manage Access</h2>
          <h3 className="text-lg text-white mt-4">Current Members</h3>
          <div className="current-members flex justify-start gap-2 md:grid-cols-4 my-4">
            {project.members.map((m) => {
              return (
                <div className="flex items-center">
                  <p className="text-white py-1 px-3 rounded-l-md bg-gray-700">
                    {m.username}
                  </p>
                  <button
                    type="button"
                    className="rounded-r-md flex gap-2 justify-center bg-indigo-600 px-1 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onClick={() => handleRemove(m)}
                  >
                    <XMarkIcon className="h-5 w-5"></XMarkIcon>
                  </button>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-start rounded-md mt-2 max-w-min">
            <input
              id="email"
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange("email")}
              autoComplete="email"
              placeholder="User Email"
              required
              className="rounded-l-md py-1.5 border-0 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-700"
            />
            <button
              type="button"
              className="rounded-r-md flex w-28 gap-2 justify-center bg-indigo-600 px-1 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={() => handleAdd(values.email)}
            >
              Add to Project
            </button>
          </div>
        </div>
      ) : (
        <div className="h-5/6">
          <div className="p-5 rounded-md bg-slate-900 shadow-sm w-full flex flex-col items-center">
            <h2 className="text-xl text-white">
              Sharing is a PromptLab Pro feature.
            </h2>
            <Link
              key={"go-pro"}
              to={"/subscribe"}
              className={
                "mt-4 text-lg font-bold bg-indigo-600 underline-offset-4 rounded-md px-3 text-white py-2 font-medium"
              }
            >
              Go Pro
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
