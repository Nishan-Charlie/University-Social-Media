import { useRef, useState } from "react";
import ReactQuill, { Quill } from "react-quill";
import * as Emoji from "quill-emoji";
// import { markdownToHtml, htmlToMarkdown } from "./Parser";
import ImageResize from "quill-image-resize-module-react";

import "react-quill/dist/quill.snow.css";
import "quill-emoji/dist/quill-emoji.css";

Quill.register("modules/emoji", Emoji);
Quill.register("modules/imageResize", ImageResize);

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, false] }],
  ["bold", "italic", "underline", "strike", "blockquote", "link"],
  [{ list: "ordered" }, { list: "bullet" }],
  [{ indent: "-1" }, { indent: "+1" }],
  [{ color: [] }], // Add color option here
  ["emoji"],
  ["clean"],
  ["image"],
];

const TOOLBAR_STYLES = {
  backgroundColor: "blue",
  display: "flex",
  justifyContent: "space-between",
};

export default function Editor(props) {
  const [value, setValue] = useState("");
  const reactQuillRef = useRef(null);

  const onChange = (content) => {
    console.log({ content });
    setValue(content);

    if (props.onChange) {
      props.onChange({
        html: content,
        // markdown: htmlToMarkdown(content),
      });
    }
  };

  return (
    <ReactQuill
      style={{ height: "250px" }}
      ref={reactQuillRef}
      theme="snow"
      placeholder="Write your question"
      modules={{
        imageResize: {
          modules: ["Resize", "DisplaySize", "Toolbar"],
          displaySize: true,
          size: {
            width: "100",
            height: "75",
          },
          style: "width: 100px; height: 75px;",
        },
        toolbar: {
          container: TOOLBAR_OPTIONS,
          style: TOOLBAR_STYLES,
        },
        "emoji-toolbar": true,
        "emoji-textarea": false,
        "emoji-shortname": true,
      }}
      value={value}
      onChange={onChange}
    />
  );
}
