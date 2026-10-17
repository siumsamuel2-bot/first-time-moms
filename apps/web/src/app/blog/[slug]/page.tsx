import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPostData, getAllPostSlugs } from '@/lib/blog';
import { renderMarkdown } from '@/lib/markdown';
import styles from './post.module.css';

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const post = getPostData(params.slug);
  if (!post) return {};
  return {
    title: `${post.title} | Firstweeks Blog`,
    description: post.excerpt,
  };
}

export default function BlogPostPage({ params }: Props) {
  const post = getPostData(params.slug);
  if (!post) notFound();

  const rawParts = post.content.split('---\n');
  const hasDisclaimer = rawParts.length > 1;
  const disclaimerMd = hasDisclaimer ? (rawParts[0] ?? '').trim() : '';
  const contentMd = hasDisclaimer ? rawParts.slice(1).join('---\n') : post.content;
  const disclaimerHtml = disclaimerMd ? renderMarkdown(disclaimerMd) : '';
  const contentHtml = renderMarkdown(contentMd);

  return (
    <main className={styles.page}>
      <Link href="/blog" className={styles.backLink}>
        &larr; Back to blog
      </Link>

      <header className={styles.header}>
        <h1 className={styles.title}>{post.title}</h1>
        <div className={styles.meta}>
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </time>
          {post.tags.map((tag) => (
            <span key={tag} className={styles.tag}>{tag}</span>
          ))}
        </div>
      </header>

      {disclaimerHtml && (
        <div className={styles.disclaimer} dangerouslySetInnerHTML={{ __html: disclaimerHtml }} />
      )}

      <div className={styles.content} dangerouslySetInnerHTML={{ __html: contentHtml }} />

      <div className={styles.cta}>
        <p className={styles.ctaTitle}>Get a personalized postpartum plan</p>
        <p className={styles.ctaText}>
          Take our free 2-minute quiz to get tailored advice for where you are right now.
        </p>
        <Link href="/quiz" className={styles.ctaButton}>
          Take the Free Quiz &rarr;
        </Link>
      </div>
    </main>
  );
}
