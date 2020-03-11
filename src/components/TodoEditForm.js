import React from "react";

export default function TodoEditForm({ todo_id, editTodo }) {
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
