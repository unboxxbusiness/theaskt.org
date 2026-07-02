import Link from "next/link";
import { formatDate } from "@/lib/date";

interface SidebarArticle {
  title: string;
  slug: string;
  authorName?: string;
  publishedAt?: string;
  categoryName?: string;
}

interface LearnSidebarListProps {
  articles: SidebarArticle[];
}

export default function LearnSidebarList({ articles }: LearnSidebarListProps) {
  return (
    <aside className="space-y-0">
      {/* Section Header */}
      <div className="border-l-2 border-link pl-3 mb-5">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-text-h">
          Latest
        </span>
      </div>

      {/* Article list */}
      <ol className="space-y-0">
        {articles.slice(0, 5).map((article, idx) => (
          <li
            key={article.slug}
            className="flex items-start gap-3 py-4 border-b border-border-primary last:border-b-0 group"
          >
            {/* Rank number */}
            <span className="font-serif text-2xl font-extrabold text-text-muted/30 leading-none flex-shrink-0 mt-0.5 select-none w-8">
              {String(idx + 1).padStart(2, "0")}
            </span>
            {/* Content */}
            <div className="space-y-1 min-w-0">
              <Link href={`/learn/${article.slug}`} className="block">
                <h4 className="text-xs sm:text-sm font-bold font-serif leading-snug text-text-h group-hover:text-link transition-colors line-clamp-2">
                  {article.title}
                </h4>
              </Link>
              <p className="text-[10px] text-text-muted font-sans">
                {article.authorName && <>By {article.authorName}</>}
                {article.publishedAt && (
                  <> &middot; {formatDate(article.publishedAt)}</>
                )}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </aside>
  );
}
