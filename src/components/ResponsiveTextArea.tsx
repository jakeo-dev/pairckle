// taken from https://medium.com/@oherterich/creating-a-textarea-with-dynamic-height-using-react-and-typescript-5ed2d78d9848

import { FormEvent, useEffect, useRef } from "react";

export default function ResponsiveTextArea({
  onInput,
  value,
  className,
  placeholder,
  maxLength,
  required,
  id,
}: {
  onInput: (arg: FormEvent<HTMLTextAreaElement>) => void;
  value: string;
  className: string;
  placeholder: string;
  maxLength: number;
  required: boolean;
  id: string;
}) {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    function handleTextAreaResize() {
      if (textAreaRef.current) {
        textAreaRef.current.style.height = "0px";
        const scrollHeight = textAreaRef.current.scrollHeight;
        textAreaRef.current.style.height = scrollHeight + "px";
      }
    }

    // resize text area when value of textarea is changed
    handleTextAreaResize();

    // resize text area when window is resized
    window.addEventListener("resize", handleTextAreaResize);

    return () => window.removeEventListener("resize", handleTextAreaResize);
  }, [value]);

  return (
    <textarea
      onInput={onInput}
      value={value}
      placeholder={placeholder}
      className={`bg-gray-400/10 hover:bg-gray-400/20 focus:bg-gray-400/20 border-gray-400/30 border-2 rounded-md text-left transition px-3 py-2 overflow-auto resize-none pb-3 ${className}`}
      ref={textAreaRef}
      rows={1}
      maxLength={maxLength != -1 ? maxLength : undefined}
      required={required}
      id={id} // for labels
    />
  );
}
