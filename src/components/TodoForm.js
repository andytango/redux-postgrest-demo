import React from "react";
import { useCreateTodo } from "../helpers/hooks";

export default function TodoForm() {
  const { content, setContent, setImageContent, submitTodo } = useCreateTodo();

  return (
    <form
      type=""
      onSubmit={e => {
        e.preventDefault();
        submitTodo();
      }}
    >
      <div>
        <input
          placeholder="I need to..."
          type="text"
          value={content}
          onChange={e => setContent(e.target.value)}
        />
        <input value="＋" type="submit" />
      </div>
      <div>
        <input type="file" onChange={e => setImageContent(e.target.files)} />
      </div>
    </form>
  );
}
