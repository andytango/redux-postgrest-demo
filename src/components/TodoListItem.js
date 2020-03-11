import React, { useCallback } from "react";
import { useGetEditFormState, useSetEditFormState } from "../hooks/todos";
import { useDispatchShowTodoImage } from "../hooks/todoImage";
import TodoDeleteButton from "./TodoDeleteButton";
import TodoEditForm from "./TodoEditForm";

export default function TodoListItem({
  todo_id,
  content,
  content_image,
  created_at,
  todo_idx
}) {
  const editFormState = useGetEditFormState();
  const setEditFormState = useSetEditFormState();
  const isEditing = editFormState.todo_id === todo_id;
  const onContentClick = useCallback(
    () => setEditFormState({ todo_id, content }),
    [setEditFormState, todo_id, content]
  );
  const dispatchShowTodoImage = useDispatchShowTodoImage(todo_idx);

  return (
    <div className="todo">
      <TodoDeleteButton {...{ todo_id }} />
      <strong>
        {isEditing ? (
          <TodoEditForm {...{ todo_id }} />
        ) : (
          <span onClick={onContentClick}>{content}</span>
        )}
      </strong>
      {content_image && (
        <TodoImage {...{ content_image }} onClick={dispatchShowTodoImage} />
      )}
      <TodoDate date={created_at} />
    </div>
  );
}

function TodoImage({ content_image, ...props }) {
  return (
    <img
      className="todo-image"
      alt="uploaded with the todo"
      src={`data:*/*;base64,${content_image}`}
      {...props}
    />
  );
}

function TodoDate({ date }) {
  return <span className="todo-date">{new Date(date).toLocaleString()}</span>;
}
