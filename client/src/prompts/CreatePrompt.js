import React, { useState, useEffect, Fragment, useRef } from "react";
import { create } from "./api-prompts";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

export default function CreatePrompt({ ...props }) {
  const [values, setValues] = useState({
    text: "",
    // model: "",
    // intent: "",
    error: "",
  });
  // const [open, setOpen] = useState(false)
  const cancelButtonRef = useRef(null);
  // const jwt = auth.isAuthenticated()

  const clickSubmit = () => {
    const prompt = {
      text: values.text || undefined,
      model: values.model || undefined,
      model: props.intent.model || undefined,
      intent: props.params.intentId || undefined,
    };

    create(prompt, props.params, props.credentials, undefined).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        console.log(data);
        console.log("created prompt");
        props.setOpen(false);
        props.cb();
      }
    });
  };

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  return (
    <>
      <Transition.Root show={props.open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          initialFocus={cancelButtonRef}
          onClose={props.setOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-950 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <div className="bg-white dark:bg-slate-800 px-4 pb-4 pt-5 sm:p-6">
                    {/* close button */}
                    <button
                      className="absolute right-6 top-6 h-6 w-6"
                      onClick={() => props.setOpen(false)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="#fff"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                    <div className="sm:flex sm:items-start flex-col">
                      <h3
                        className="text-base font-semibold leading-8 text-gray-900 dark:text-white text-xl"
                        id="modal-title"
                      >
                        Create a Prompt
                      </h3>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                        show={values.error != ""}
                      >
                        <div className="flex justify-start items-center border border-red-600 mt-5 p-2 w-full bg-red-950/50 rounded">
                          <ExclamationCircleIcon className="w-5 h-5 text-red-600 mr-2" />
                          <p className="text-base text-sm font-medium leading-6 text-white">
                            {values.error}
                          </p>
                        </div>
                      </Transition>

                      <div className="mt-5 mb-5 sm:mx-auto sm:w-full">
                        <form className="space-y-6" action="#" method="POST">
                          {/* <div>
                            <label
                              htmlFor="model"
                              className="block text-sm font-medium leading-6 text-gray-900 dark:text-white"
                            >
                              Model
                            </label>
                            <div className="mt-2">
                              <input
                                id="model"
                                name="model"
                                type="text"
                                value={values.model}
                                onChange={handleChange("model")}
                                autoComplete="model"
                                required
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-slate-700"
                              />
                            </div>
                          </div> */}

                          <div>
                            <label
                              htmlFor="text"
                              className="block text-sm font-medium leading-6 text-gray-900 dark:text-white"
                            >
                              Text
                            </label>
                            <div className="mt-2">
                              <textarea
                                id="text"
                                name="text"
                                type="textarea"
                                rows="6"
                                value={values.text}
                                onChange={handleChange("text")}
                                autoComplete="text"
                                required
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-slate-700"
                              />
                            </div>
                          </div>

                          <div>
                            <button
                              type="button"
                              onClick={clickSubmit}
                              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                              Create Prompt
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
