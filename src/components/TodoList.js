import React, { useState } from "react";
import { useEditTodos, useGetTodos } from "../helpers/hooks";
import TodoListItem from "./TodoListItem";

export default function Todos() {
  const todos = useGetTodos();
  const [imageState, setImageState] = useState({ show: false });
  const { editRow, editState } = useEditTodos();
  const listItemProps = {
    editRow,
    editState,
    imageState,
    setImageState
  };

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
        todos.map((props, todo_idx) => (
          <TodoListItem
            {...{ ...props, ...listItemProps, todo_idx }}
            key={todo_idx}
          />
        ))}
    </div>
  );
}
