import React, { useCallback } from "react";
import TodoDeleteButton from "./TodoDeleteButton";
import TodoEditForm from "./TodoEditForm";
import { useGetEditFormState, useSetEditFormState } from "../helpers/hooks";

export default function TodoListItem({
  todo_id,
  content,
  content_image,
  created_at,
  setImageState,
  todo_idx
}) {
  const editFormState = useGetEditFormState()
  const setEditFormState = useSetEditFormState()
  const isEditing = editFormState.todo_id === todo_id;
  const onContentClick = useCallback(() => setEditFormState({ todo_id, content }), [
    setEditFormState,
    todo_id,
    content
  ]);
  const onImageClick = useCallback(() => {
    setImageState({ todo_idx, show: true });
  }, [todo_idx, setImageState]);

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
      {content_image && <TodoImage onClick={onImageClick} />}
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
    />
  );
}

function TodoDate({date}) {
  return <span className="todo-date">{new Date(date).toLocaleString()}</span>;
}
