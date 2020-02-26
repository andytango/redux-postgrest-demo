import Axios from "axios";
import { path } from "ramda";
import React, { useCallback, useEffect, useState } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { applyMiddleware, combineReducers, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import connectPostgrest from "redux-postgrest";
import "./App.css";
import connectPgWebsocket from "./ws";
import { createPgRestActions } from "./actions";

const { reducer, middleware } = connectPostgrest({
  url: "http://localhost:8000",
  http: Axios
});

const store = createStore(
  combineReducers({ api: reducer }),
  composeWithDevTools(
    connectPgWebsocket({ url: "ws://localhost:8080" }),
    applyMiddleware(middleware)
  )
);

const createTodoAction = createPgRestActions("todos");

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
    content => dispatch(createTodoAction.post({ content })),
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
  const [editState, setEditState] = useState({});
  const dispatch = useDispatch();

  const dispatchLoadAction = useCallback(() => {
    setIsDispatching(true);
    dispatch(createTodoAction.get());
  }, [setIsDispatching, dispatch]);

  const dispatchDeleteAction = useCallback(
    todo_id => dispatch(createTodoAction.delete({ todo_id: `eq.${todo_id}` })),
    [dispatch]
  );

  const editRow = useCallback(
    (todo_id, content) => setEditState({ todo_id, content }),
    [setEditState]
  );

  const dispatchPatchAction = useCallback(() => {
    dispatch(
      createTodoAction.delete(
        { todo_id: `eq.${editState.todo_id}` },
        { content: editState.content }
      )
    );
    setEditState({});
  }, [dispatch, editState]);

  useEffect(() => {
    if (!todos && !isDispatching) {
      dispatchLoadAction();
    }
  }, [dispatchLoadAction, todos, isDispatching]);

  return (
    <div className="todos">
      {todos &&
        todos.map(({ todo_id, content, created_at }) => (
          <div className="todo" key={todo_id}>
            <button onClick={() => dispatchDeleteAction(todo_id)}>X</button>
            <strong>
              {editState.todo_id === todo_id ? (
                <span>
                  <input
                    type="text"
                    onChange={e => editRow(todo_id, e.target.value)}
                    value={editState.content}
                  />
                  <button onClick={() => dispatchPatchAction()}>Done</button>
                </span>
              ) : (
                <span onClick={() => editRow(todo_id, content)}>{content}</span>
              )}
            </strong>
            <em className="todo-date">
              {new Date(created_at).toLocaleString()}
            </em>
          </div>
        ))}
    </div>
  );
}

export default App;
