import React from "react";
import { Provider } from "react-redux";
import { applyMiddleware, combineReducers, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import connectPostgrest from "redux-postgrest";
import connectPgWebsocket from "../helpers/ws";
import TodoForm from "./TodoForm";
import TodoHeader from "./TodoHeader";
import Todos from "./TodoList";

const { reducer, middleware } = connectPostgrest({
  url: "http://localhost:8000"
});

const store = createStore(
  combineReducers({ api: reducer }),
  composeWithDevTools(
    connectPgWebsocket({ url: "ws://localhost:8080" }),
    applyMiddleware(middleware)
  )
);

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <div className="App-container">
          <TodoHeader />
          <div>
            <TodoForm />
            <hr />
            <Todos />
          </div>
        </div>
      </div>
    </Provider>
  );
}

export default App;
