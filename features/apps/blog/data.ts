import type { BlogPost, Serie } from './utils';

export type PostCategory = 'Scrolls' | 'Ravens' | 'Grimoires' | 'Founders' | 'Engineers';

export const SERIES: Serie[] = [
    {
        id: 'product-eng-101',
        title: 'The Product Engineer Handbook',
        description: 'Bridging the gap between code and customer value.',
        coverUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=400&auto=format&fit=crop'
    },
    {
        id: 'system-arch-patterns',
        title: 'System Architecture Patterns',
        description: 'Blueprints for scalable distributed systems.',
        coverUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=400&auto=format&fit=crop'
    },
    {
        id: 'startup-zero-to-one',
        title: 'Zero to One: The Dev Logs',
        description: 'Documenting the messy reality of building a startup.',
        coverUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=400&auto=format&fit=crop'
    }
];

export const BLOG_POSTS: BlogPost[] = [
    {
        id: '1',
        uuid: 'mock-post-001',
        title: "Your product ideas probably suck (that's ok)",
        excerpt: "You have an idea for a new product and you think it's really, really good. You're tempted to dive straight into building it. This is a trap.",
        date: "Dec 16, 2025",
        category: "Ravens",
        author: "Max The Hedgehog",
        thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop",
        readTime: "5 min",
        serieId: 'product-eng-101',
        content: `# Your product ideas probably suck

You have an idea for a new product and you think it's really, really good. You're tempted to dive straight into building it.

## The Validation Trap

Most founders fail because they build things people don't actually want.

### Step 1: Validate your problem is real
Before coding, talk to 10 potential users. Don't ask them if they like your idea. Ask them about their problems.

### Step 2: Validate users want your solution
Show them a mockup. A drawing on a napkin is enough.

## Common Failure Modes

- **Problem #1**: Not explaining your solution clearly.
- **Problem #2**: You lack credibility in the space.

## What's after validation?

Once you have proof, then and only then, you start the "Grimoire" phase of engineering.

> [!info] Project Philosophy
> "Build for yourself, then for the world." - Unknown Architect.`
    },
    {
        id: '2',
        uuid: 'mock-post-002',
        title: "Product engineer vs Software engineer: How are they different?",
        excerpt: "The lines are blurring, but there is a distinct mindset shift when you move from pure code to product ownership.",
        date: "Dec 10, 2025",
        category: "Scrolls",
        author: "Sara Miteva",
        thumbnail: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=400&auto=format&fit=crop",
        readTime: "8 min",
        serieId: 'product-eng-101',
        content: `# The Great Divide

Are you building a feature or a product?

## Defining the Roles

### The Software Engineer
Focused on technical excellence, scalability, and clean code.

### The Product Engineer
Focused on user outcomes, business impact, and rapid iteration.

## Why it matters

Modern teams need engineers who understand the "Why" as much as the "How".

## Conclusion

Both are necessary, but the best products are built by teams that bridge the gap.`
    },
    {
        id: '3',
        uuid: 'mock-post-003',
        title: "How we built user behavior analysis with multi-modal LLMs",
        excerpt: "5 not-so-easy steps to integrating Gemini 2.5 Flash into your analytics pipeline.",
        date: "Nov 28, 2025",
        category: "Grimoires",
        author: "James Hawkins",
        thumbnail: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=400&auto=format&fit=crop",
        readTime: "12 min",
        serieId: 'system-arch-patterns',
        content: `# Multi-modal Analytics

The next frontier of data is not just numbers, but actions and intent captured via vision and text.

## Technical Architecture

We used Gemini 2.5 Flash to process session replays.

### Data Ingestion Pipeline
How we moved gigabytes of video data into the model.

### Inference and Feedback Loops
Mapping LLM outputs to structured SQL data.

## Challenges Faced

- Token limits on long session recordings.
- Cost optimization strategies.

## The Results

We saw a 40% increase in insight generation speed compared to manual review.`
    }
];

export const SLACK_FEED = [
    {
        id: 1,
        channel: '#devrel',
        title: 'A great writeup on React Server Components',
        text: 'Read this a couple months ago, but just thought it worth sharing: great writeup on React Server Components',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hedge'
    },
    {
        id: 2,
        channel: '#where-in-the-world',
        text: 'new cafe opened 5 minutes walk from home',
        image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=400&auto=format&fit=crop',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'
    }
];

export const LATEST_QUESTIONS = [
    { topic: 'Adding STOP_REASON and thoughtSTokenCount to gemini logs', time: '5 hours ago' },
    { topic: 'Electron + PostHog: best practice for main & renderer identity consistency?', time: '8 hours ago' },
    { topic: 'New "Logs Beta" integration', time: '7 hours ago' }
];

export const AUTHORS = Array.from(new Set(BLOG_POSTS.map(p => p.author)));
export const CATEGORIES: PostCategory[] = ['Ravens', 'Scrolls', 'Grimoires', 'Founders', 'Engineers'];

export const publishScroll = (newPost: BlogPost) => {
    BLOG_POSTS.unshift(newPost);
};
