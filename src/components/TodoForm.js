import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { createTodoAction } from "../helpers/actions";
import { processImageContent } from "../helpers/images";

export default function TodoForm() {
  const [content, setContent] = useState("");
  const [imageContent, setImageContent] = useState(null);
  const dispatch = useDispatch();

  const dispatchContent = useCallback(
    (content, imageContent) => {
      processImageContent(imageContent).then(image => {
        dispatch(createTodoAction.post({ content, content_image: image }));
      });
    },
    [dispatch]
  );

  return (
    <form
      type=""
      onSubmit={e => {
        e.preventDefault();
        dispatchContent(content, imageContent);
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
