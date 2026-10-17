import Link from 'next/link';
import type { Metadata } from 'next';
import { getAllPosts } from '@/lib/blog';
import styles from './blog.module.css';

export const metadata: Metadata = {
  title: 'Postpartum Blog | Firstweeks',
  description: 'Expert advice and support for new and expecting mothers navigating the fourth trimester.',
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>The Firstweeks Blog</h1>
        <p className={styles.subtitle}>
          Evidence-backed advice for new and expecting mothers navigating the fourth trimester.
        </p>
      </header>

      <div className={styles.grid}>
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className={styles.card}>
            <h2 className={styles.cardTitle}>{post.title}</h2>
            <p className={styles.cardExcerpt}>{post.excerpt}</p>
            <div className={styles.cardMeta}>
              <time dateTime={post.date}>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</time>
              {post.tags.slice(0, 2).map((tag) => (
                <span key={tag} className={styles.tag}>{tag}</span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
