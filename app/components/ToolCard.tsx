import Link from "next/link";

interface ToolCardProps {
  href?: string;
  title: string;
  description: string;
  inactive?: boolean;
}

export default function ToolCard({
  href,
  title,
  description,
  inactive = false,
}: ToolCardProps) {
  const className = `flex flex-col rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 min-h-[140px] ${
    inactive
      ? "opacity-50"
      : "hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
  }`;

  const content = (
    <>
      <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
        {title}
      </h2>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">{description}</p>
    </>
  );

  if (inactive || !href) {
    return <div className={className}>{content}</div>;
  }

  return (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}
