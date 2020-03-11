import React from "react";
import { useDeleteTodo } from "../helpers/hooks";

export default function TodoListItem({
  todo_id,
  content,
  content_image,
  created_at,
  editTodo,
  setImageState,
  todo_idx
}) {
  const { editState, setEditState } = editTodo;
  return (
    <div className="todo">
      <TodoDeleteButton {...{ todo_id }} />
      <strong>
        {editState.todo_id === todo_id ? (
          <TodoEditForm {...{ todo_id, editTodo }} />
        ) : (
          <span onClick={() => setEditState({ todo_id, content })}>
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
      <span className="todo-date">{new Date(created_at).toLocaleString()}</span>
    </div>
  );
}

function TodoDeleteButton({ todo_id }) {
  const dispatchDeleteAction = useDeleteTodo();
  return <button onClick={() => dispatchDeleteAction(todo_id)}>╳</button>;
}

function TodoEditForm({ todo_id, editTodo }) {
  const { editState, setEditState, submitTodo } = editTodo;
  return (
    <span>
      <input
        type="text"
        onChange={e => setEditState({ todo_id, content: e.target.value })}
        value={editState.content}
      />
      <button onClick={submitTodo}>Done</button>
    </span>
  );
}
