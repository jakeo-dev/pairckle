// taken from https://medium.com/@oherterich/creating-a-textarea-with-dynamic-height-using-react-and-typescript-5ed2d78d9848

import { FormEvent, useEffect, useRef } from "react";

export default function ResponsiveTextArea({
  onChange,
  value,
  className,
  placeholder,
  maxLength,
  required,
  id,
}: {
  onChange: (arg: FormEvent<HTMLTextAreaElement>) => void;
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
      onChange={onChange}
      value={value}
      placeholder={placeholder}
      className={`resize-none overflow-auto rounded-lg border-2 border-neutral-400/40 bg-transparent px-3.5 py-2 text-sm outline-none transition hover:bg-neutral-400/10 focus:bg-neutral-400/10 focus:ring-2 focus:ring-blue-300/75 active:bg-neutral-400/20 md:text-base ${className}`}
      ref={textAreaRef}
      rows={1}
      maxLength={maxLength != -1 ? maxLength : undefined}
      required={required}
      id={id} // for labels
    />
  );
}
