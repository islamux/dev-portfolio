import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

interface ReactMarkdownContentProps {
  content: string;
  className?: string;
}


// Render markdown content with github flavored support and syntax highliting for code  blocks.
export function MarkdownContent({
  content,
  className = "",
}: ReactMarkdownContentProps) {

  return (
    <article
      className={`
      prose 
        prose-slate
        dark:prose-invert
        max-w-none
        prose-headings:font-bold
        prose-h1:text-4xl
        prose-h2:text-3xl
        prose-h3:text-2xl
        prose-a:text-brand-500
        prose-a:no-underline
        hover:prose-a:underline
        prose-code:text-brand-600
        dark:prose-code:text-brand-400
        prose-pre:bg-gray-100
        dark:prose-pre:bg-gray-900
        ${className}
      `}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}
