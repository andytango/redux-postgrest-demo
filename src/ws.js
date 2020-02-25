export default function connectPgWebsocket({ url }) {
  return next => {
    return reducer => {
      const store = next(reducer);
      const ws = new WebSocket(url);

      addWsMessageListener(ws, store);

      return store;
    };
  };
}

function addWsMessageListener(ws, store) {
  ws.addEventListener("message", ({ data }) => handleWsMessage(store, data));
}

function handleWsMessage(store, data) {
  try {
    dispatchWsMessage(store, data);
  } catch (e) {
    console.error("Could not process message:");
    console.error(data);
    console.error(e);
  }
}

function dispatchWsMessage(store, data) {
  const { resource } = JSON.parse(data);
  store.dispatch({ type: resource });
}
