const backendUri =
  window.location.protocol +
  "//" +
  (window.location.hostname == "localhost"
    ? "localhost:3001"
    : `api.${window.location.hostname.replace("www.", "")}`);

const create = async (context, params, credentials, signal) => {
  // console.log(credentials);
  try {
    let response = await fetch(backendUri + "/api/context", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + credentials.t,
      },
      body: JSON.stringify(context),
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

const read = async (params, credentials, signal) => {
  try {
    let response = await fetch(
      backendUri + "/api/context/" + params.contextId,
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

const update = async (context, params, credentials, signal) => {
  // console.log(credentials);
  try {
    let response = await fetch(
      backendUri + "/api/context/" + params.contextId,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + credentials.t,
        },
        body: JSON.stringify(context),
      }
    );
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

export { create, read, update };
