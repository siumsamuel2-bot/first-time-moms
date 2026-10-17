import fs from 'fs';
import path from 'path';

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  tags: string[];
}

const BLOG_DIR = path.join(process.cwd(), '..', '..', 'marketing', 'blog');

const POST_META: Record<string, { title: string; date: string; tags: string[]; excerpt: string }> = {
  'the-first-6-weeks-what-every-new-mom-should-know': {
    title: 'The First 6 Weeks: What Every New Mom Should Know About Postpartum Recovery',
    date: '2026-06-01',
    tags: ['recovery', 'fourth trimester', 'new mom'],
    excerpt: 'The first 6 weeks after delivery are critical for your physical and mental health. This guide covers what to expect week by week, red flags, and how to advocate for yourself.',
  },
  'postpartum-depression-vs-baby-blues': {
    title: 'Postpartum Depression vs. Baby Blues: How to Tell the Difference and What to Do',
    date: '2026-06-05',
    tags: ['mental health', 'PPD', 'baby blues'],
    excerpt: 'Learn the key differences between baby blues and postpartum depression, when to seek help, and how to find support.',
  },
  'newborn-sleep-101': {
    title: "Newborn Sleep 101: What's Normal, What's Not, and How to Survive",
    date: '2026-06-08',
    tags: ['sleep', 'newborn', 'survival'],
    excerpt: 'Newborn sleep can feel like a mystery. Here is what to expect, when to worry, and how to protect your own sleep as a new parent.',
  },
  'when-to-call-the-doctor-postpartum': {
    title: 'When to Call the Doctor: Postpartum Warning Signs',
    date: '2026-06-10',
    tags: ['health', 'warning signs', 'safety'],
    excerpt: 'A clear guide to postpartum warning signs every new mom should know — and when to seek emergency care.',
  },
  'c-section-recovery-day-by-day': {
    title: 'C-Section Recovery Day by Day: A Complete Timeline',
    date: '2026-06-12',
    tags: ['C-section', 'recovery', 'surgery'],
    excerpt: 'A day-by-day guide to what C-section recovery actually looks like, from hospital discharge to full healing.',
  },
  'the-ultimate-newborn-feeding-guide': {
    title: 'The Ultimate Newborn Feeding Guide: Breastfeeding, Pumping, Formula, and Mixed',
    date: '2026-06-15',
    tags: ['feeding', 'breastfeeding', 'formula', 'pumping'],
    excerpt: 'A comprehensive guide to newborn feeding options, common challenges, and how to choose what is right for your family.',
  },
  'how-partners-can-help-postpartum': {
    title: 'How Partners Can Help During the Postpartum Period',
    date: '2026-06-18',
    tags: ['partners', 'support', 'relationships'],
    excerpt: 'A practical guide for partners who want to show up meaningfully during the postpartum period.',
  },
  'postpartum-self-care': {
    title: "Postpartum Self-Care: What Actually Helps (and What Doesn't)",
    date: '2026-06-20',
    tags: ['self-care', 'mental health', 'recovery'],
    excerpt: 'Realistic, evidence-backed self-care strategies for the fourth trimester.',
  },
  'finding-your-mom-village-postpartum': {
    title: 'Finding Your Mom Village: How to Build Community Postpartum',
    date: '2026-06-22',
    tags: ['community', 'support', 'isolation'],
    excerpt: 'How to find and build your postpartum support network — even when you feel isolated.',
  },
  'baby-milestones-month-1-3': {
    title: 'Baby Milestones Month 1-3: What to Expect',
    date: '2026-06-25',
    tags: ['milestones', 'baby development', 'newborn'],
    excerpt: 'A guide to your baby\'s developmental milestones in the first three months.',
  },
  'returning-to-work-after-baby': {
    title: 'Returning to Work After Baby: A Survival Guide',
    date: '2026-06-28',
    tags: ['work', 'transition', 'pumping', 'childcare'],
    excerpt: 'Practical advice for navigating the transition back to work after maternity leave.',
  },
  'preparing-for-baby-number-two': {
    title: 'Preparing for Baby Number Two: What No One Tells You',
    date: '2026-06-30',
    tags: ['siblings', 'second baby', 'transition'],
    excerpt: 'Honest advice for preparing your family — and yourself — for a second child.',
  },
};

export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs.readdirSync(BLOG_DIR)
    .filter(f => f.endsWith('.md'))
    .map(f => f.replace(/\.md$/, ''));
}

export function getPostData(slug: string): BlogPost | null {
  const meta = POST_META[slug];
  if (!meta) return null;

  const filePath = path.join(BLOG_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, 'utf-8');
  const lines = raw.split('\n');
  const contentLines: string[] = [];
  let started = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === '---' && !started) {
      started = true;
      continue;
    }
    if (started) {
      contentLines.push(line);
    }
  }

  return {
    slug,
    title: meta.title,
    date: meta.date,
    tags: meta.tags,
    excerpt: meta.excerpt,
    content: contentLines.join('\n').trim(),
  };
}

export function getAllPosts(): BlogPost[] {
  const slugs = getAllPostSlugs();
  return slugs
    .map(getPostData)
    .filter((p): p is BlogPost => p !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
