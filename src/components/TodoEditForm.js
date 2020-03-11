import React from "react";
import { useGetEditFormState, useDispatchEditTodo, useSetEditFormState } from "../hooks/todos";

export default function TodoEditForm({ todo_id }) {
  const editFormState = useGetEditFormState()
  const setEditFormState = useSetEditFormState()
  const submitTodo = useDispatchEditTodo()
  
  return (
    <span>
      <input
        type="text"
        onChange={e => setEditFormState({ todo_id, content: e.target.value })}
        value={editFormState.content}
      />
      <button onClick={submitTodo}>Done</button>
    </span>
  );
}
