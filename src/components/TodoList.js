import React, { useState, useCallback } from "react";
import {
  useGetTodos,
  useDeleteTodos,
  usePatchTodos,
  useEditTodos
} from "../helpers/hooks";

export default function Todos() {
  const todos = useGetTodos();
  const [imageState, setImageState] = useState({ show: false });
  const { editRow, editState } = useEditTodos();

  if (todos && imageState.show) {
    return (
      <div className="todos">
        <img
          className="todo-image"
          alt="uploaded with the todo"
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
              <TodoDeleteButton {...{ todo_id }} />
              <strong>
                {editState.todo_id === todo_id ? (
                  <TodoEditForm {...{ todo_id, editRow, editState }} />
                ) : (
                  <span onClick={() => editRow(todo_id, content)}>
                    {content}
                  </span>
                )}
              </strong>
              {content_image && (
                <img
                  className="todo-image"
                  alt="uploaded with the todo"
                  src={`data:*/*;base64,${content_image}`}
                  onClick={() => setImageState({ todo_idx, show: true })}
                />
              )}
              <span className="todo-date">
                {new Date(created_at).toLocaleString()}
              </span>
            </div>
          )
        )}
    </div>
  );
}

function TodoDeleteButton({ todo_id }) {
  const dispatchDeleteAction = useDeleteTodos();
  return <button onClick={() => dispatchDeleteAction(todo_id)}>╳</button>;
}

function TodoEditForm({ todo_id, editRow, editState: { content } }) {
  const dispatchPatchAction = usePatchTodos();
  const handleButtonClick = useCallback(
    payload => {
      editRow({});
      dispatchPatchAction(todo_id, payload);
    },
    [editRow, dispatchPatchAction, todo_id]
  );

  return (
    <span>
      <input
        type="text"
        onChange={e => editRow(todo_id, e.target.value)}
        value={content}
      />
      <button onClick={() => handleButtonClick(content)}>Done</button>
    </span>
  );
}
