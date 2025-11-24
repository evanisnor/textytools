import Link from "next/link";

interface ToolCardProps {
  href?: string;
  title: string;
  description: string;
  onClick?: () => void;
  children?: React.ReactNode;
  backgroundColor?: string;
}

export default function ToolCard({
  href,
  title,
  description,
  onClick,
  children,
  backgroundColor,
}: ToolCardProps) {
  const defaultBg = "bg-white dark:bg-zinc-900";
  const defaultHoverBg = "hover:bg-zinc-100 dark:hover:bg-zinc-800";
  const bgClass = backgroundColor || defaultBg;
  const hoverBgClass = backgroundColor ? "" : defaultHoverBg;

  const isInteractive = Boolean(onClick || href);
  const className = `flex flex-col rounded-lg border border-zinc-200 dark:border-zinc-800 ${bgClass} p-6 hover:border-zinc-300 dark:hover:border-zinc-700 ${hoverBgClass} transition-colors ${isInteractive ? "cursor-pointer" : ""}`;

  const content = (
    <>
      <div className="flex-1">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
          {title}
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {description}
        </p>
      </div>
      {children}
    </>
  );

  if (onClick) {
    return (
      <button onClick={onClick} className={`${className} text-left`}>
        {content}
      </button>
    );
  }

  if (!href) {
    return <div className={className}>{content}</div>;
  }

  return (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}
