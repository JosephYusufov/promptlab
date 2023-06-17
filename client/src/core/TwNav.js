import { Fragment, useEffect, useState } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  BellIcon,
  XMarkIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { Link, redirect, useLocation, useNavigate } from "react-router-dom";
import auth from "./../auth/auth-helper";
import logo from "../assets/images/logo.png";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const isActive = (location, path) => location.pathname == path;

export default function TwNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [menuItems, setMenuItems] = useState([
    { name: "Sign Up", href: "/signup" },
    { name: "Sign In", href: "/signin" },
  ]);
  const [userMenuItems, setUserMenuItems] = useState([]);

  useEffect(() => {
    if (auth.isAuthenticated()) {
      setUser(auth.isAuthenticated().user);
    }
  }, []);

  useEffect(() => {
    if (auth.isAuthenticated()) {
      setUser(auth.isAuthenticated().user);
    }
  }, [location]);

  useEffect(() => {
    if (user) {
      setMenuItems([
        // { name: "Prompts", href: "/prompts/" + user._id },
        { name: "Intents", href: "/intents/" + user._id },
        { name: "Projects", href: "/project/user/" + user._id },
      ]);
      setUserMenuItems([
        { name: "Your Profile", href: "#" },
        { name: "Settings", href: "#" },
        {
          name: "Sign Out",
          href: "#",
          onClick: () => {
            auth.clearJWT(() => {
              setUser(null);
              navigate("/");
            });
          },
        },
      ]);
    } else {
      setMenuItems([
        { name: "Sign Up", href: "/signup" },
        { name: "Sign In", href: "/signin" },
      ]);
      setUserMenuItems([]);
    }
  }, [user]);
  return (
    <>
      <div className="min-h-full">
        <Disclosure
          as="nav"
          className="bg-gray-950 z-20 relative border-b border-gray-700"
        >
          {({ open }) => (
            <>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                  <div className="flex items-center">
                    <Link to={"/"} className="flex flex-shrink-0">
                      <img className="h-8 w-8" src={logo} alt="Your Company" />
                      <h2 className="text-xl text-white font-bold ml-2">
                        PromptLab
                      </h2>
                    </Link>
                    <div className="hidden md:block">
                      <div className="ml-10 flex items-baseline space-x-4">
                        {menuItems.map((item) => (
                          <Link
                            key={item.name}
                            to={item.href}
                            className={
                              (isActive(location, item.href)
                                ? "underline"
                                : "hover:underline") +
                              " underline-offset-4 rounded-md px-3 text-white py-2 text-sm font-medium"
                            }
                            aria-current={
                              isActive(location, item.href) ? "page" : undefined
                            }
                            onClick={item.onClick ? item.onClick : () => {}}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                  {user && (
                    <div className="hidden md:block">
                      <div className="ml-4 flex items-center md:ml-6">
                        <button
                          type="button"
                          className="rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                        >
                          <span className="sr-only">View notifications</span>
                          <BellIcon className="h-6 w-6" aria-hidden="true" />
                        </button>

                        {/* Profile dropdown */}
                        <Menu as="div" className="relative ml-3">
                          <div>
                            <Menu.Button className="flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                              <span className="sr-only">Open user menu</span>
                              <button
                                type="button"
                                className="rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                              >
                                <span className="sr-only">
                                  View notifications
                                </span>
                                <UserIcon
                                  className="h-6 w-6"
                                  aria-hidden="true"
                                />
                              </button>
                            </Menu.Button>
                          </div>
                          <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                          >
                            <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-gray-950 py-1 shadow-lg ring-1 border border-gray-700 ring-black ring-opacity-5 focus:outline-none">
                              {userMenuItems.map((item, i) => (
                                <Menu.Item key={item.name}>
                                  {({ active }) => (
                                    <a
                                      href={item.href}
                                      onClick={item.onClick}
                                      className={classNames(
                                        active
                                          ? "underline"
                                          : "hover:underline",
                                        "block px-4 py-2 text-sm text-white bg-gray-950 underline-offset-4",
                                        i < userMenuItems.length - 1
                                          ? "border-b border-gray-700"
                                          : ""
                                      )}
                                    >
                                      {item.name}
                                    </a>
                                  )}
                                </Menu.Item>
                              ))}
                            </Menu.Items>
                          </Transition>
                        </Menu>
                      </div>
                    </div>
                  )}
                  <div className="-mr-2 flex md:hidden">
                    {/* Mobile menu button */}
                    <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      ) : (
                        <Bars3Icon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      )}
                    </Disclosure.Button>
                  </div>
                </div>
              </div>

              <Disclosure.Panel className="md:hidden">
                <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                  {menuItems.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as="a"
                      href={item.href}
                      className={
                        isActive(location, item.href)
                          ? "bg-gray-900 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                      }
                      aria-current={
                        isActive(location, item.href) ? "page" : undefined
                      }
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                </div>
                {/* <div className="border-t border-gray-700 pb-3 pt-4">
                  <div className="flex items-center px-5">
                    <div className="flex-shrink-0">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={user.imageUrl}
                        alt=""
                      />
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium leading-none text-white">
                        {user.name}
                      </div>
                      <div className="text-sm font-medium leading-none text-gray-400">
                        {user.email}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="ml-auto flex-shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                    >
                      <span className="sr-only">View notifications</span>
                      <BellIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="mt-3 space-y-1 px-2">
                    {userMenuItems.map((item) => (
                      <Disclosure.Button
                        key={item.name}
                        as="a"
                        href={item.href}
                        onClick={item.onClick}
                        className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                      >
                        {item.name}
                      </Disclosure.Button>
                    ))}
                  </div>
                </div> */}
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
        {/* <main> */}
        {/* <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8"> */}
        {/* Your content */}
        {/* </div> */}
        {/* </main> */}
      </div>
    </>
  );
}
