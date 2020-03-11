import React, { useCallback } from "react";
import TodoDeleteButton from "./TodoDeleteButton";
import TodoEditForm from "./TodoEditForm";

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
  const onContentClick = useCallback(() => setEditState({ todo_id, content }), [
    setEditState,
    todo_id,
    content
  ]);
  const isEditing = editState.todo_id === todo_id;
  const onImageClick = useCallback(() => {
    setImageState({ todo_idx, show: true });
  }, [todo_idx, setImageState]);

  return (
    <div className="todo">
      <TodoDeleteButton {...{ todo_id }} />
      <strong>
        {isEditing ? (
          <TodoEditForm {...{ todo_id, editTodo }} />
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
