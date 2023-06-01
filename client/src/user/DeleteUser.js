import React, { useState } from "react";
import PropTypes from "prop-types";
import auth from "./../auth/auth-helper";
import { remove } from "./api-user.js";
import { Navigate } from "react-router-dom";

export default function DeleteUser(props) {
  const [open, setOpen] = useState(false);
  const [redirect, setRedirect] = useState(false);

  const jwt = auth.isAuthenticated();
  const clickButton = () => {
    setOpen(true);
  };
  const deleteAccount = () => {
    remove(
      {
        userId: props.userId,
      },
      { t: jwt.token }
    ).then((data) => {
      if (data && data.error) {
        console.log(data.error);
      } else {
        auth.clearJWT();
        setRedirect(true);
      }
    });
  };
  const handleRequestClose = () => {
    setOpen(false);
  };

  if (redirect) {
    return <Navigate to="/" />;
  }
  return (
    <span>
      <button aria-label="Delete" onClick={clickButton} color="secondary">
        delete
      </button>

      <div open={open} onClose={handleRequestClose}>
        <div>{"Delete Account"}</div>
        <div>
          <p>Confirm to delete your account.</p>
        </div>
        <div>
          <button onClick={handleRequestClose} color="primary">
            Cancel
          </button>
          <button
            onClick={deleteAccount}
            color="secondary"
            autoFocus="autoFocus"
          >
            Confirm
          </button>
        </div>
      </div>
    </span>
  );
}
DeleteUser.propTypes = {
  userId: PropTypes.string.isRequired,
};
