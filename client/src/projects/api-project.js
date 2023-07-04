const backendUri =
  window.location.protocol +
  "//" +
  (window.location.hostname == "localhost"
    ? "localhost:3001"
    : `api.${window.location.hostname.replace("www.", "")}`);

const create = async (project, credentials) => {
  try {
    let response = await fetch(backendUri + "/api/project", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + credentials.t,
      },
      body: JSON.stringify(project),
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

const update = async (params, body, credentials) => {
  try {
    let response = await fetch(
      backendUri + "/api/project/" + params.projectId,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + credentials.t,
        },
        body: JSON.stringify(body),
      }
    );
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

const list = async (params, credentials) => {
  try {
    let response = await fetch(
      backendUri + "/api/project/user/" + params.userId,
      {
        method: "GET",
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

const read = async (params, credentials) => {
  try {
    let response = await fetch(
      backendUri + "/api/project/" + params.projectId,
      {
        method: "GET",
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

const createIntentAndAddToProject = async (intent, params, credentials) => {
  try {
    let response = await fetch(
      backendUri + "/api/project/" + params.projectId,
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
  createIntentAndAddToProject,
  update,
  // remove
};
