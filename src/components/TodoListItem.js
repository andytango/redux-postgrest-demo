import React, { useCallback } from "react";
import { useDeleteTodo, usePatchTodo } from "../helpers/hooks";

export default function TodoListItem({
  todo_id,
  content,
  content_image,
  created_at,
  editRow,
  editState,
  setImageState,
  todo_idx
}) {
  return (
    <div className="todo">
      <TodoDeleteButton {...{ todo_id }} />
      <strong>
        {editState.todo_id === todo_id ? (
          <TodoEditForm {...{ todo_id, editRow, editState }} />
        ) : (
          <span onClick={() => editRow(todo_id, content)}>{content}</span>
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
      <span className="todo-date">{new Date(created_at).toLocaleString()}</span>
    </div>
  );
}

function TodoDeleteButton({ todo_id }) {
  const dispatchDeleteAction = useDeleteTodo();
  return <button onClick={() => dispatchDeleteAction(todo_id)}>╳</button>;
}

function TodoEditForm({ todo_id, editRow, editState: { content } }) {
  const dispatchPatchAction = usePatchTodo();
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
