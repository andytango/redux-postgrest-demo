import React from "react";
import { useListTodos } from "../helpers/hooks";
import { useDispatchHideTodoImage, useSelectTodoImage, useTodoImageState } from "../hooks/todoImage";
import TodoListItem from "./TodoListItem";

export default function Todos() {
  const todos = useListTodos();
  const dispatchHideTodoImage = useDispatchHideTodoImage()
  const imageState = useTodoImageState();
  const todo_image =  useSelectTodoImage();

  if (todos && imageState.show) {
    return (
      <div className="todos">
        <img
          className="todo-image-full"
          alt="uploaded with the todo"
          src={todo_image}
          onClick={dispatchHideTodoImage}
        />
      </div>
    );
  }

  return (
    <div className="todos">
      {todos &&
        todos.map((props, todo_idx) => (
          <TodoListItem {...{ ...props, todo_idx }} key={todo_idx} />
        ))}
    </div>
  );
}
