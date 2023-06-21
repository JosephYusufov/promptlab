import React, { useState, useEffect, Fragment } from "react";
import auth from "./../auth/auth-helper";
import { Navigate, Link, useParams } from "react-router-dom";
import { getCompletion, getCandidates, read } from "./api-intents";
import { create as createPrompt } from "./../prompts/api-prompts";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import ListView from "../elements/ListView";
import CreatePrompt from "../prompts/CreatePrompt";
import {
  CubeTransparentIcon,
  CalendarIcon,
  ArrowPathIcon,
  PlusIcon,
  PlusSmallIcon,
  Square3Stack3DIcon,
  BoltIcon,
} from "@heroicons/react/24/solid";
import {
  InformationCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import * as DOMPurify from "dompurify";
import { Transition } from "@headlessui/react";

export default function SingleIntent({ ...props }) {
  const params = useParams();
  const [intent, setIntent] = useState({});
  const [noData, setNoData] = useState(false);
  const [open, setOpen] = useState(false);
  const [completionOpen, setCompletionOpen] = useState(false);
  const [optimizeOpen, setOptimizeOpen] = useState(false);
  const [contextValues, setContextValues] = useState({});
  const [err, setErr] = useState(null);
  const [completion, setCompletion] = useState(null);
  const [completionLoading, setCompletionLoading] = useState(false);
  const [userOptimizedCompletion, setUserOptimizedCompletion] = useState(null);
  const [candidatesLoading, setCandidatesLoading] = useState(false);
  const [candidates, setCandidates] = useState(null);

  const jwt = auth.isAuthenticated();
  console.log(jwt);
  dayjs.extend(relativeTime);

  const fetchIntent = () => {
    // console.log("fetchIntent");
    // console.log(props);
    // setCompletion({ choices: [{ message: { content: "among balls" } }] });
    setCompletion(null);
    setCompletionOpen(false);
    setCompletionLoading(false);
    setContextValues({});
    setErr(null);
    setUserOptimizedCompletion(null);
    setCandidates(null);
    // setCandidates([
    //   "Provide a brief overview of {{company}}, emphasizing its {{point_1}}. Additionally, discuss the {{point_2}} and {{point_3}} of the company.",
    //   "In a few sentences, describe {{company}} and highlight its {{point_1}}, as well as {{point_2}} and {{point_3}}.",
    //   "{{company}} is a company known for its {{point_1}}. Discuss the {{point_2}} and {{point_3}} of the company in a concise manner.",
    // ]);

    if (props.intentId)
      read(
        {
          intentId: props.intentId,
        },
        { t: jwt.token }
      ).then((data) => {
        console.log(data);
        if (data && data.error) {
          console.log(data.error);
        } else {
          setNoData(data.prompts.length > 1 ? false : true);

          // Setting context variables
          let contextVariables = [];
          if (data.prompts.length) {
            const currentPrompt = data.prompts.slice(-1)[0].text;
            data.currentPrompt = currentPrompt ? currentPrompt : null;
            console.log(currentPrompt);
            // const exp = /{{.+?}}/gm;
            const exp = /(?<=\{\{).*?(?=\}\})/gm;
            if (currentPrompt && currentPrompt.match(exp)) {
              const matches = currentPrompt.match(exp);
              contextVariables = matches;
              let values = {};
              contextVariables.map((v) => (values[v] = ""));
              setContextValues(values);
            }
          }
          data.contextVariables = contextVariables;

          data.prompts.map((prompt, i) => {
            prompt.created = `Created ${dayjs(prompt.created).fromNow(
              true
            )} ago`;
            prompt.generation = `Generation ${prompt.generation}`;
          });
          data.created = `Created ${dayjs(data.created).fromNow(true)} ago`;
          setIntent(data);
        }
      });
  };
  useEffect(fetchIntent, [props.intentId]);
  // useEffect(() => {}, [props.intentId]);
  // const getCompletion = () => {};

  const clickRequestCompletion = () => {
    console.log(contextValues);
    if (completionLoading) return;
    setCompletionLoading(true);
    getCompletion(
      contextValues,
      {
        intentId: props.intentId,
      },
      { t: jwt.token }
    ).then((data) => {
      console.log(data);
      if (data.error) {
        setErr(data.error);
      } else {
        setCompletion(data);
        setUserOptimizedCompletion(data.choices[0].message.content);
      }
      setCompletionLoading(false);
    });
  };

  const clickSendOptimizedCompletion = () => {
    console.log(userOptimizedCompletion);
    if (candidatesLoading) return;
    setCandidatesLoading(true);
    getCandidates(
      userOptimizedCompletion,
      completion.choices[0].message.content,
      contextValues,
      {
        intentId: props.intentId,
      },
      { t: jwt.token }
    ).then((data) => {
      console.log(data);
      if (data.error) {
        setErr(data.error);
      } else {
        setCandidates(data);
      }
      setCandidatesLoading(false);
    });
  };

  const handleChange = (name) => (event) => {
    setContextValues({ ...contextValues, [name]: event.target.value });
  };

  const handleUserOptimizedCompletionChange = (e) => {
    setUserOptimizedCompletion(e.target.value);
  };
  const getStyledPromptTemplate = (promptTemplate) => {
    const exp = /{{.+?}}/gm;
    const expression = promptTemplate.replace(
      exp,
      (x) =>
        `<span class="text-orange-400 bg-gray-800 p-1 rounded-md text-sm font-mono">${x}</span>`
    );
    // console.log(expression);
    return expression;
    // return intent.currentPrompt;
  };

  const handleSelectCandidate = (c) => {
    createPrompt(
      { text: c, intent: intent._id, model: intent.model },
      intent._id,
      props.params,
      { t: jwt.token },
      undefined
    ).then((data) => {
      // console.log(data);
      if (data.error) {
        setErr(data.error);
      } else {
        console.log(data);
        console.log("created prompt");
        fetchIntent();
      }
    });
  };
  // const onPromptCreated = () => {
  // };
  return (
    <>
      {Object.keys(intent).length && (
        <>
          <>
            <div className="flex flex-col justify-start items-left mb-10 ">
              <h2 className="text-2xl font-regular leading-9 tracking-tight text-gray-900 dark:text-white">
                <span className="font-semibold"> {intent.name} </span>
              </h2>
              <div className="flex gap-4">
                <div className="flex gap-1 items-center">
                  <CubeTransparentIcon className="h-5 w-5 text-gray-300"></CubeTransparentIcon>
                  <div className="text-gray-300">{intent.model}</div>
                </div>
                <div className="flex gap-1 items-center">
                  <ArrowPathIcon className="h-5 w-5 text-gray-300"></ArrowPathIcon>
                  <div className="text-gray-300">
                    Generation {intent.version}
                  </div>
                </div>
                <div className="flex gap-1 items-center">
                  <CalendarIcon className="h-5 w-5 text-gray-300"></CalendarIcon>
                  <div className="text-gray-300">{intent.created}</div>
                </div>
              </div>
            </div>
            {/* <hr className="text-centerborder-t border-gray-700 mb-4"></hr>{" "} */}
          </>
          <div className="flex gap-6 justify-between items-start">
            {intent.currentPrompt && (
              <div className="w-full">
                {/* <div className="flex justify-between items-center  mb-4">
                <h2 className="text-xl text-white">Prompts</h2>
              </div> */}
                <div className="rounded-md border border-indigo-600">
                  <div className="bg-indigo-950 rounded-md py-2 px-2 flex justify-between">
                    <h3 className="text-lg text-white mx-2">Current Version</h3>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="flex gap-2 justify-center rounded-md bg-indigo-600 px-3 py-1 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        onClick={() => setOpen(true)}
                      >
                        <ArrowPathIcon className="w-5 h-5"></ArrowPathIcon>
                        <div>Update</div>
                      </button>
                      <button
                        type="button"
                        className="flex gap-2 justify-center rounded-md bg-indigo-600 px-3 py-1 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        onClick={() =>
                          setCompletionOpen((v) => {
                            if (optimizeOpen && !completionOpen) {
                              setOptimizeOpen(false);
                              return true;
                            } else return !v;
                          })
                        }
                      >
                        <Square3Stack3DIcon className="w-5 h-5"></Square3Stack3DIcon>
                        <div>Get Completion</div>
                      </button>
                      <button
                        type="button"
                        className="flex gap-2 justify-center rounded-md bg-indigo-600 px-3 py-1 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        onClick={() =>
                          setOptimizeOpen((v) => {
                            if (completionOpen && !optimizeOpen) {
                              setCompletionOpen(false);
                              return true;
                            } else return !v;
                          })
                        }
                      >
                        <BoltIcon className="w-5 h-5"></BoltIcon>
                        <div>Optimize (v1)</div>
                      </button>
                    </div>
                  </div>
                  <div className="text-white border-t border-indigo-600 px-2 py-1 transition">
                    <div>
                      <h3 className="mb-2 mt-2 px-2">Prompt Template</h3>
                      {intent && intent.prompts.length && (
                        <div
                          className="p-2 mx-2 mb-2 rounded-md border border-gray-700"
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(
                              getStyledPromptTemplate(intent.currentPrompt)
                            ),
                          }}
                        ></div>
                      )}
                    </div>
                    {/* {completionOpen && ( */}
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                      show={completionOpen}
                      // className="mb-1"
                    >
                      <div className="mb-1">
                        {intent.contextVariables && (
                          <div>
                            <h3 className="mb-2 mt-4 px-2">
                              Context Variables
                            </h3>
                            {intent.contextVariables.map(
                              (contextVariable, i) => {
                                return (
                                  <div
                                    key={`context-variable-${i}`}
                                    className="text-white px-2 mb-2 flex items-center justify-between"
                                  >
                                    <span className="font-mono text-sm p-1 text-orange-400 bg-gray-800 rounded-md mr-2">
                                      {`{{${contextVariable}}}`}
                                    </span>
                                    <input
                                      type="text"
                                      placeholder="value"
                                      name={contextVariable}
                                      value={contextValues["contextVariable"]}
                                      onChange={handleChange(contextVariable)}
                                      required
                                      className="w-3/5 text-sm p-2 bg-gray-950 rounded-md border border-gray-700 text-white"
                                    ></input>
                                  </div>
                                );
                              }
                            )}
                          </div>
                          // </div>
                        )}
                        <button
                          type="button"
                          className="mt-3 ml-2 rounded-md bg-indigo-600 px-3 py-1 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                          onClick={clickRequestCompletion}
                        >
                          {completionLoading ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 400 400"
                              strokeWidth={40}
                              stroke="#ffffff"
                              className="w-5 h-5 animate-spin"
                            >
                              <path d=" M 360 200 A 160 160 0 1 1 249 48" />
                            </svg>
                          ) : (
                            <div className="flex gap-2 justify-center">
                              <Square3Stack3DIcon className="w-5 h-5"></Square3Stack3DIcon>
                              <div>Request Completion</div>
                            </div>
                          )}
                        </button>
                        <div className="flex gap-1 items-center mt-2 ml-2">
                          <InformationCircleIcon className="w-5 h-5 text-gray-400"></InformationCircleIcon>{" "}
                          <div className="text-gray-400 text-sm">
                            Pressing this button will make a request to the
                            OpenAI Completions API.
                          </div>
                        </div>
                        {completion && (
                          <div>
                            <div className="mx-2 mt-4 mb-2 flex gap-2 items-center">
                              <CubeTransparentIcon className="w-h h-5 text-white"></CubeTransparentIcon>{" "}
                              Completion
                            </div>
                            <div className="p-3 m-2 rounded-md bg-gray-800 italic">
                              {completion.choices[0].message.content}
                            </div>
                          </div>
                        )}
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                          show={err != null}
                        >
                          <div className="flex justify-start items-center border border-red-600 p-2 mb-4 mt-4 bg-red-950/50 rounded">
                            <ExclamationCircleIcon className="w-5 h-5 text-red-600 mr-2" />
                            <p className="text-base text-sm font-medium leading-6 text-white">
                              {err}
                            </p>
                          </div>
                        </Transition>
                      </div>
                    </Transition>

                    {/* Optimize */}
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                      show={optimizeOpen}
                      // className="mb-1"
                    >
                      <div className="mb-1">
                        {intent.contextVariables && (
                          <div>
                            <div className="mx-2 my-4 flex justify-start items-center">
                              <div className="flex items-center">
                                <BoltIcon className="w-6 h-6 mr-1 text-sky-500"></BoltIcon>
                                <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% ">
                                  Optimize v1
                                </h2>
                              </div>
                              <div className="flex gap-2 items-center mt-2 ml-2">
                                <InformationCircleIcon className="w-5 h-5 text-gray-400"></InformationCircleIcon>{" "}
                                <div>
                                  <div className="text-gray-400 text-sm">
                                    1. Request a completion with real-world
                                    values. This completion will act as a
                                    baseline.
                                  </div>
                                  <div className="text-gray-400 text-sm">
                                    2. Edit the resulting completion to make it
                                    as ideal as possible. What would you want
                                    the prompt to return?
                                  </div>
                                  <div className="text-gray-400 text-sm">
                                    3. Using your ideal completion, PromptLab
                                    generates three optimized prompt candidates.
                                    Pick your favorite!
                                  </div>
                                </div>
                              </div>
                            </div>
                            <h2 className="text-lg mx-2 my-2">
                              1. Request Baseline Completion
                            </h2>
                            <h3 className="mb-2 px-2">Context Variables</h3>
                            {intent.contextVariables.map(
                              (contextVariable, i) => {
                                return (
                                  <div
                                    key={`context-variable-${i}`}
                                    className="text-white px-2 mb-2 flex items-center justify-between"
                                  >
                                    <span className="font-mono text-sm p-1 text-orange-400 bg-gray-800 rounded-md mr-2">
                                      {`{{${contextVariable}}}`}
                                    </span>
                                    <input
                                      type="text"
                                      placeholder="value"
                                      name={contextVariable}
                                      value={contextValues["contextVariable"]}
                                      onChange={handleChange(contextVariable)}
                                      required
                                      className="w-3/5 text-sm p-2 bg-gray-950 rounded-md border border-gray-700 text-white"
                                    ></input>
                                  </div>
                                );
                              }
                            )}
                          </div>
                          // </div>
                        )}
                        <button
                          type="button"
                          className="mt-3 ml-2 rounded-md bg-indigo-600 px-3 py-1 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                          onClick={clickRequestCompletion}
                        >
                          {completionLoading ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 400 400"
                              strokeWidth={40}
                              stroke="#ffffff"
                              className="w-5 h-5 animate-spin"
                            >
                              <path d=" M 360 200 A 160 160 0 1 1 249 48" />
                            </svg>
                          ) : (
                            <div className="flex gap-2 justify-center">
                              <Square3Stack3DIcon className="w-5 h-5"></Square3Stack3DIcon>
                              <div>Request Completion</div>
                            </div>
                          )}
                        </button>
                        <div className="flex gap-1 items-center mt-2 ml-2">
                          <InformationCircleIcon className="w-5 h-5 text-gray-400"></InformationCircleIcon>{" "}
                          <div className="text-gray-400 text-sm">
                            Pressing this button will make a request to the
                            OpenAI Completions API.
                          </div>
                        </div>
                        {completion && (
                          <div>
                            <div className="mx-2 mt-4 mb-2 flex gap-2 items-center">
                              <CubeTransparentIcon className="w-h h-5 text-white"></CubeTransparentIcon>{" "}
                              Completion
                            </div>
                            <div className="p-3 m-2 rounded-md bg-gray-800 italic">
                              {completion.choices[0].message.content}
                            </div>
                            <h2 className="text-white text-lg mx-2 mt-4 mb-2">
                              2. Draft Ideal Completion
                            </h2>
                            <div className="flex">
                              <textarea
                                // type="textarea"
                                placeholder="Optimized Completion"
                                // name={contextVariable}
                                value={userOptimizedCompletion}
                                onChange={handleUserOptimizedCompletionChange}
                                required
                                className="w-full text-sm p-2 m-2 bg-gray-950 rounded-md border border-gray-700 text-white"
                              ></textarea>
                            </div>
                            <button
                              type="button"
                              className="mt-3 ml-2 rounded-md bg-indigo-600 px-3 py-1 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                              onClick={clickSendOptimizedCompletion}
                            >
                              {candidatesLoading ? (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 400 400"
                                  strokeWidth={40}
                                  stroke="#ffffff"
                                  className="w-5 h-5 animate-spin"
                                >
                                  <path d=" M 360 200 A 160 160 0 1 1 249 48" />
                                </svg>
                              ) : (
                                <div className="flex gap-2 justify-center">
                                  <Square3Stack3DIcon className="w-5 h-5"></Square3Stack3DIcon>
                                  <div>Send Ideal Completion</div>
                                </div>
                              )}
                            </button>
                            {candidates && (
                              <div className="flex flex-col">
                                <h2 className="text-white text-lg mx-2 mt-4 mb-2">
                                  3. Select a Candidate
                                </h2>
                                {/* <div className="p-3 m-2 rounded-md bg-gray-800 italic"> */}
                                {candidates.map((c, i) => {
                                  return (
                                    <Link
                                      key={`candidate-${i}`}
                                      className="p-3 m-2 rounded-md bg-gray-800 italic hover:outline hover:outline-indigo-600"
                                      onClick={() => handleSelectCandidate(c)}
                                    >
                                      {c}
                                    </Link>
                                  );
                                })}
                                {/* </div> */}
                              </div>
                            )}
                          </div>
                        )}
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                          show={err != null}
                        >
                          <div className="flex justify-start items-center border border-red-600 p-2 mb-4 mt-4 mx-2 bg-red-950/50 rounded">
                            <ExclamationCircleIcon className="w-5 h-5 text-red-600 mr-2" />
                            <p className="text-base text-sm font-medium leading-6 text-white">
                              {err}
                            </p>
                          </div>
                        </Transition>
                      </div>
                    </Transition>

                    {/* )} */}
                  </div>
                </div>
                <h3 className="text-white text-lg mt-3 px-2">
                  Previous Versions
                </h3>
                <ListView
                  data={intent.prompts.slice(0, -1)}
                  noData={noData}
                  contentKeys={["text", "model", "generation", "created"]}
                  disclosureContent={true}
                  renderDisclosure={(datum) => (
                    <div className="bg-gray-800 animate p-5">
                      <h2 className="text-lg mb-2">Full Text</h2>
                      {datum.text}
                    </div>
                  )}
                  className="px-2"
                ></ListView>
              </div>
            )}
            {!intent.currentPrompt && (
              <div className="p-5 rounded-md bg-slate-900 shadow-sm w-full flex flex-col items-center">
                <h1 className="text-center text-md dark:text-white">
                  Nothing here yet!
                </h1>
                <button
                  type="button"
                  className="mt-4 flex gap-2 justify-center rounded-md bg-indigo-600 px-3 py-1 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  onClick={() => setOpen(true)}
                  //   ref={cancelButtonRef}
                >
                  <PlusIcon className="h-6"></PlusIcon> Create a Prompt Template
                </button>
              </div>
            )}

            <CreatePrompt
              className="mb-10"
              params={params}
              intent={intent}
              credentials={{ t: jwt.token }}
              text={intent.currentPrompt ? intent.currentPrompt : ""}
              cb={fetchIntent}
              open={open}
              setOpen={setOpen}
            />
            {/* <div className="about w-1/4">
              <h2 className="text-lg text-white mb-4">About</h2>
              <div className="flex justify-start items-center gap-2">
                <CubeTransparentIcon className="text-gray-400 h-5 w-5"></CubeTransparentIcon>
                <p className="text-base text-gray-400">{intent.model}</p>
              </div>
              <div className="flex justify-start items-center gap-2">
                <CalendarIcon className="text-gray-400 h-5 w-5"></CalendarIcon>
                <p className="text-base text-gray-400">{`Created ${dayjs(
                  intent.created
                ).fromNow(true)} ago`}</p>
              </div>
              <div className="flex justify-start items-center gap-2">
                <ArrowPathIcon className="text-gray-400 h-5 w-5"></ArrowPathIcon>
                <p className="text-base text-gray-400">
                  Version {intent.version}
                </p>
              </div>
            </div> */}
          </div>
        </>
      )}
    </>
  );
}
