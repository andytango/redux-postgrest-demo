import { applyMiddleware, combineReducers, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { connectPgRest } from "redux-postgrest";
import connectPgWebsocket from "./helpers/ws";
import editTodo from './reducers/editTodoForm'

const { reducer, middleware } = connectPgRest({
  url: "http://localhost:8000"
});

const store = createStore(
  combineReducers({ api: reducer, editTodo }),
  composeWithDevTools(
    connectPgWebsocket({ url: "ws://localhost:8080" }),
    applyMiddleware(middleware)
  )
);

export default store;
