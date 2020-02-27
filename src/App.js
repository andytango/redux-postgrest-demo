import { path } from "ramda";
import React, { useCallback, useEffect, useState } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { applyMiddleware, combineReducers, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import connectPostgrest from "redux-postgrest";
import { createPgRestActions } from "./actions";
import "./App.css";
import connectPgWebsocket from "./ws";
import { encode } from "base64-arraybuffer";

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
  const [imageContent, setImageContent] = useState(null);
  const dispatch = useDispatch();

  const dispatchContent = useCallback(
    (content, imageContent) => {
      processImageContent(imageContent).then(image => {
        dispatch(
          createTodoAction.post({
            content,
            content_image: image
          })
        );
      });
    },
    [dispatch]
  );

  return (
    <form
      type=""
      onSubmit={e => {
        e.preventDefault();
        dispatchContent(content, imageContent);
      }}
    >
      <input
        type="text"
        value={content}
        onChange={e => setContent(e.target.value)}
      />
      <input type="file" onChange={e => setImageContent(e.target.files)} />
      <input value="submit" type="submit" />
    </form>
  );
}

function processImageContent(files) {
  if (files.length) {
    return files[0].arrayBuffer().then(encode);
  } else {
    return Promise.resolve(null);
  }
}

const todosFromState = path(["api", "todos", "GET", "body"]);

function Todos() {
  const todos = useSelector(todosFromState);
  const [isDispatching, setIsDispatching] = useState();
  const [editState, setEditState] = useState({});
  const [imageState, setImageState] = useState({ show: false });
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

  if (todos && imageState.show) {
    return (
      <div className="todos">
        <img
          className="todo-image"
          src={`data:*/*;base64,${todos[imageState.todo_idx].content_image}`}
          onClick={() => setImageState({ show: false })}
        />
      </div>
    );
  }

  return (
    <div className="todos">
      {todos &&
        todos.map(
          ({ todo_id, content, content_image, created_at }, todo_idx) => (
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
                  <span onClick={() => editRow(todo_id, content)}>
                    {content}
                  </span>
                )}
              </strong>
              {content_image && (
                <img
                  className="todo-image"
                  width="64"
                  height="auto"
                  src={`data:*/*;base64,${content_image}`}
                  onClick={() => setImageState({ todo_idx, show: true })}
                />
              )}
              <em className="todo-date">
                {new Date(created_at).toLocaleString()}
              </em>
            </div>
          )
        )}
    </div>
  );
}

export default App;
