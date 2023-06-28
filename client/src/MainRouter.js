import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./core/Home";
import Users from "./user/Users";
import Signup from "./user/Signup";
import Signin from "./auth/Signin";
import EditProfile from "./user/EditProfile";
import Profile from "./user/Profile";
import Prompts from "./prompts/Prompts";
import SinglePrompt from "./prompts/SinglePrompt";
import PrivateRoute from "./auth/PrivateRoute";
import TwNav from "./core/TwNav";
import Intents from "./intents/Intents";
import SingleIntent from "./intents/SingleIntent";
import Projects from "./projects/Projects";
import SingleProject from "./projects/SingleProject";
import PLStripe from "./stripe/PLStripe";
import PLSubscribe from "./stripe/PLSubscribe";

const MainRouter = () => {
  return (
    <div>
      {/* <Menu /> */}
      <TwNav />
      <main>
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 mt-16 pt-5">
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/users" element={<Users />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signin" element={<Signin />} />
            <Route
              path="/user/edit/:userId"
              element={
                <PrivateRoute>
                  <EditProfile />
                </PrivateRoute>
              }
            />
            <Route
              path="/user/:userId"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path="/prompts/:userId"
              element={
                <PrivateRoute>
                  <Prompts />
                </PrivateRoute>
              }
            />
            <Route
              path="/prompts/:userId/prompt/:promptId"
              element={
                <PrivateRoute>
                  <SinglePrompt />
                </PrivateRoute>
              }
            />
            <Route
              path="/intents/:userId/"
              element={
                <PrivateRoute>
                  <Intents />
                </PrivateRoute>
              }
            />
            <Route
              path="/intents/:userId/intent/:intentId"
              element={
                <PrivateRoute>
                  <SingleIntent />
                </PrivateRoute>
              }
            />
            <Route
              path="/project/user/:userId"
              element={
                <PrivateRoute>
                  <Projects />
                </PrivateRoute>
              }
            />
            <Route
              path="/project/:projectId"
              element={
                <PrivateRoute>
                  <SingleProject />
                </PrivateRoute>
              }
            />
            <Route path="/stripe" element={<PLStripe></PLStripe>} />
            <Route path="/subscribe" element={<PLSubscribe></PLSubscribe>} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default MainRouter;
