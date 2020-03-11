import React, { useState } from "react";
import { useCreateTodo } from "../helpers/hooks";

export default function TodoForm() {
  const [content, setContent] = useState("");
  const [imageContent, setImageContent] = useState(null);
  const createTodo = useCreateTodo();

  return (
    <form
      type=""
      onSubmit={e => {
        e.preventDefault();
        createTodo(content, imageContent);
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
