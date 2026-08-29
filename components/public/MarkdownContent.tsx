import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MarkdownContent({ content }: { content: string }) {
  return (
    <div className="prose prose-gray max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          table: ({ ...props }) => (
            <div className="overflow-x-auto my-4">
              <table className="min-w-full border border-gray-200 text-sm" {...props} />
            </div>
          ),
          th: ({ ...props }) => (
            <th className="border border-gray-200 bg-gray-50 px-3 py-2 text-left font-medium" {...props} />
          ),
          td: ({ ...props }) => (
            <td className="border border-gray-200 px-3 py-2" {...props} />
          ),
          img: ({ ...props }) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="rounded my-4 max-w-full h-auto" {...props} alt={props.alt ?? ""} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}