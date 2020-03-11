import React from "react";
import { useDeleteTodo } from "../hooks/todos";

export default function TodoDeleteButton({ todo_id }) {
  const dispatchDeleteAction = useDeleteTodo();
  return <button onClick={() => dispatchDeleteAction(todo_id)}>╳</button>;
}
