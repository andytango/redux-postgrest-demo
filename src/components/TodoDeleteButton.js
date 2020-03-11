import React from "react";
import { useDeleteTodo } from "../helpers/hooks";

export default function TodoDeleteButton({ todo_id }) {
  const dispatchDeleteAction = useDeleteTodo();
  return <button onClick={() => dispatchDeleteAction(todo_id)}>╳</button>;
}
