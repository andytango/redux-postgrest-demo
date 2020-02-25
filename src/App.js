import Axios from "axios";
import { path } from "ramda";
import React, { useCallback, useEffect, useState } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { applyMiddleware, combineReducers, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import connectPostgrest from "redux-postgrest";
import "./App.css";

const { reducer, middleware } = connectPostgrest({
  url: "http://localhost:8000",
  http: Axios
});

const store = createStore(
  combineReducers({ api: reducer }),
  composeWithDevTools(applyMiddleware(middleware))
);

const ws = new WebSocket('ws://localhost:8080/')

ws.addEventListener('message', onWsMessage)

function onWsMessage({data}) {
  const {resource} = JSON.parse(data)
  store.dispatch({type: resource})
}

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <header className="App-header">
          <p>Todos</p>
        </header>
        <div>
          <TodoForm />
          <hr />
          <Todos />
        </div>
      </div>
    </Provider>
  );
}

function TodoForm() {
  const [content, setContent] = useState("");
  const dispatch = useDispatch();
  const dispatchContent = useCallback(
    content => {
      dispatch({
        type: "todos",
        meta: { method: "POST", data: { content } }
      });
    },
    [dispatch]
  );

  return (
    <form
      type=""
      onSubmit={e => {
        e.preventDefault();
        dispatchContent(content);
      }}
    >
      <input value={content} onChange={e => setContent(e.target.value)} />
      <input value="submit" type="submit" />
    </form> 
  );
}

const todosFromState = path(["api", "todos", "GET", "data"]);

function Todos() {
  const todos = useSelector(todosFromState);
  const [isDispatching, setIsDispatching] = useState();
  const dispatch = useDispatch();
  const dispatchLoadAction = useCallback(() => {
    setIsDispatching(true);
    dispatch({ type: "todos" });
  }, [setIsDispatching, dispatch]);

  useEffect(() => {
    if (!todos && !isDispatching) {
      dispatchLoadAction();
    }
  }, [dispatchLoadAction, todos, isDispatching]);

  return (
    <div className="todos">
      <div className="todos-actions">
        <button onClick={dispatchLoadAction}>Refresh</button>
      </div>
      {todos &&
        todos.map(({ content, created_at }, key) => (
          <div className="todo" key={key}>
            <strong>{content}</strong>
            <em className="todo-date">
              {new Date(created_at).toLocaleString()}
            </em>
          </div>
        ))}
    </div>
  );
}

export default App;
