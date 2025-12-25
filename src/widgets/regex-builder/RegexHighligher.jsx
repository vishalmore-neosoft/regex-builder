import Prism from "prismjs";
import "prismjs/components/prism-regex";
import "prismjs/themes/prism-tomorrow.css";
import { useEffect, useRef } from "react";

export default function RegexHighlight({ value }) {
  const ref = useRef(null);

  useEffect(() => {
    Prism.highlightElement(ref.current);
  }, [value]);

  return (
    <pre>
      <code ref={ref} className="language-regex">
        {value}
      </code>
    </pre>
  );
}
