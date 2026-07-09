import Markdown from "react-markdown";

export function TipMarkdown({ body }: { body: string }) {
  return (
    <div className="tips-md">
      <Markdown>{body}</Markdown>
    </div>
  );
}
