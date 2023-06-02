const backendUri =
  window.location.protocol +
  "//" +
  (window.location.hostname == "localhost"
    ? "localhost:3001"
    : `api.${window.location.hostname.replace("www.", "")}`);

const create = async (intent, params, credentials, signal) => {
  // console.log(credentials);
  try {
    let response = await fetch(
      backendUri + "/api/intents/user/" + params.userId,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + credentials.t,
        },
        body: JSON.stringify(intent),
      }
    );
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

const list = async (params, credentials, signal) => {
  try {
    let response = await fetch(
      backendUri + "/api/intents/user/" + params.userId,
      {
        method: "GET",
        // signal: signal,
        headers: {
          Authorization: "Bearer " + credentials.t,
        },
      }
    );
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

const read = async (params, credentials, signal) => {
  try {
    let response = await fetch(
      backendUri +
        "/api/intents/user/" +
        params.userId +
        "/intent/" +
        params.intentId,
      {
        method: "GET",
        signal: signal,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + credentials.t,
        },
      }
    );
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

// const update = async (params, credentials, user) => {
//   try {
//     let response = await fetch('/api/users/' + params.userId, {
//       method: 'PUT',
//       headers: {
//         'Accept': 'application/json',
//         'Content-Type': 'application/json',
//         'Authorization': 'Bearer ' + credentials.t
//       },
//       body: JSON.stringify(user)
//     })
//     return await response.json()
//   } catch(err) {
//     console.log(err)
//   }
// }

// const remove = async (params, credentials) => {
//   try {
//     let response = await fetch('/api/users/' + params.userId, {
//       method: 'DELETE',
//       headers: {
//         'Accept': 'application/json',
//         'Content-Type': 'application/json',
//         'Authorization': 'Bearer ' + credentials.t
//       }
//     })
//     return await response.json()
//   } catch(err) {
//     console.log(err)
//   }
// }

export {
  create,
  list,
  read,
  // update,
  // remove
};
