import { RedditActivity } from '../types';

export function generateDemoData(username: string): RedditActivity[] {
  const now = Date.now() / 1000;
  const day = 86400;
  
  const subreddits = ['technology', 'artificial', 'programming', 'productmanagement', 'careerguidance', 'machinelearning', 'startups', 'webdev', 'dataisbeautiful', 'futurology'];
  
  const postTemplates = [
    { title: "What AI tools are you using for product management in 2024?", body: "I've been exploring different AI tools to help with product management workflows. Currently using ChatGPT for user story generation and Claude for competitive analysis. What tools have you found most useful?", sub: 'productmanagement', score: 45, comments: 23 },
    { title: "The future of AI in software development - my predictions", body: "After working in tech for 10 years, here are my thoughts on how AI will reshape software development. Code generation is just the beginning. We'll see AI-assisted architecture decisions, automated testing strategies, and intelligent deployment systems.", sub: 'technology', score: 128, comments: 67 },
    { title: "How I transitioned from engineering to product management", body: "After 5 years as a software engineer, I made the switch to PM. Here's what I learned, what surprised me, and what I wish I knew before making the transition. The biggest challenge was shifting from technical problem-solving to user-centric thinking.", sub: 'careerguidance', score: 89, comments: 34 },
    { title: "Building a real-time dashboard with React and WebSockets", body: "Just finished building a real-time analytics dashboard. Used React for the frontend, Node.js with Socket.io for the backend, and Redis for pub/sub. Here's the architecture and some lessons learned about handling thousands of concurrent connections.", sub: 'webdev', score: 67, comments: 19 },
    { title: "GPT-4 vs Claude for code review - my experience", body: "I've been testing both GPT-4 and Claude for automated code review over the past month. Here's a detailed comparison of their strengths and weaknesses. Spoiler: they're both good but in different ways.", sub: 'artificial', score: 156, comments: 89 },
    { title: "Machine learning model deployment best practices", body: "After deploying dozens of ML models to production, here are the patterns that have worked best for me. From model versioning to monitoring drift, these are the things I wish someone had told me earlier.", sub: 'machinelearning', score: 92, comments: 41 },
    { title: "Is a CS degree still worth it in 2024?", body: "With the rise of bootcamps, online courses, and AI coding tools, I'm questioning whether a traditional CS degree provides enough value. What are your thoughts? Especially interested in hearing from both degree holders and self-taught developers.", sub: 'careerguidance', score: 234, comments: 156 },
    { title: "My startup's tech stack - what we chose and why", body: "We're a Series A startup building a B2B SaaS product. Here's our complete tech stack breakdown: React + TypeScript frontend, Go backend, PostgreSQL database, deployed on AWS with Kubernetes. Happy to answer questions about our choices.", sub: 'startups', score: 78, comments: 29 },
    { title: "The most underrated programming language of 2024", body: "I think Rust is getting all the attention, but Elixir is quietly becoming one of the most practical languages for building scalable systems. Here's why I think more teams should consider it for their next project.", sub: 'programming', score: 145, comments: 98 },
    { title: "Data visualization trends I'm excited about", body: "The evolution of data visualization tools has been incredible. From D3.js to Observable to the latest AI-powered visualization tools. Here are the trends I'm most excited about and some examples of what's possible.", sub: 'dataisbeautiful', score: 56, comments: 12 },
  ];
  
  const commentTemplates = [
    { body: "Great point about the importance of user research in product development. I've found that even 30 minutes of user interviews can reveal insights that months of internal discussion miss.", sub: 'productmanagement', score: 34 },
    { body: "I've been using LangChain for building RAG applications and it's been a game-changer. The abstraction layer makes it much easier to experiment with different vector stores and embedding models.", sub: 'artificial', score: 28 },
    { body: "TypeScript has completely changed how I approach frontend development. The type safety alone has reduced our bug count by about 40%. Definitely recommend for any team working on larger codebases.", sub: 'webdev', score: 45 },
    { body: "The key to successful product management is understanding that you're not building features, you're solving problems. Always start with the user's pain point, not the solution.", sub: 'productmanagement', score: 67 },
    { body: "For anyone considering a career switch to tech - don't underestimate the value of domain expertise. Your previous industry knowledge can be a huge differentiator.", sub: 'careerguidance', score: 89 },
    { body: "I've been experimenting with fine-tuning open-source models for specific tasks and the results have been impressive. Llama 2 fine-tuned on domain-specific data can outperform GPT-4 for narrow use cases.", sub: 'machinelearning', score: 52 },
    { body: "Hot take: most companies don't need microservices. A well-structured monolith with clear module boundaries will serve 90% of teams better than a distributed system.", sub: 'programming', score: 112 },
    { body: "The best career advice I ever received: optimize for learning, not for title or salary, especially in your first 10 years. The compound interest of skills is incredible.", sub: 'careerguidance', score: 156 },
    { body: "WebSocket performance tip: use binary protocols like MessagePack instead of JSON for high-frequency updates. We saw a 60% reduction in payload size.", sub: 'webdev', score: 38 },
    { body: "AI tools are augmenting my workflow, not replacing it. I still spend most of my time on strategy, stakeholder communication, and user empathy. The tools just help me execute faster.", sub: 'artificial', score: 73 },
    { body: "One thing I've learned about startups: your first 10 customers will teach you more than any market research. Get out of the building and talk to them.", sub: 'startups', score: 41 },
    { body: "The transformer architecture continues to amaze me. It's not just for NLP anymore - we're seeing it applied to computer vision, protein folding, and even music generation.", sub: 'futurology', score: 34 },
    { body: "React Server Components are going to change how we think about data fetching. The ability to stream components from the server while keeping interactivity on the client is powerful.", sub: 'webdev', score: 56 },
    { body: "For anyone building AI products: focus on the UX, not just the model. A mediocre model with great UX will outperform a great model with terrible UX every time.", sub: 'productmanagement', score: 98 },
    { body: "Docker + Kubernetes has simplified our deployment pipeline enormously. What used to take hours now takes minutes. The learning curve is worth it.", sub: 'programming', score: 29 },
  ];
  
  const activities: RedditActivity[] = [];
  
  // Generate posts
  postTemplates.forEach((post, i) => {
    const daysAgo = Math.floor(Math.random() * 60) + 1;
    activities.push({
      id: `post_${i}`,
      title: post.title,
      body: post.body,
      subreddit: post.sub,
      url: `https://www.reddit.com/r/${post.sub}/comments/demo${i}`,
      created_utc: now - (daysAgo * day),
      score: post.score,
      num_comments: post.comments,
      permalink: `/r/${post.sub}/comments/demo${i}`,
      type: 'post',
    });
  });
  
  // Generate comments
  commentTemplates.forEach((comment, i) => {
    const daysAgo = Math.floor(Math.random() * 60) + 1;
    activities.push({
      id: `comment_${i}`,
      body: comment.body,
      subreddit: comment.sub,
      parent_title: postTemplates[i % postTemplates.length].title,
      url: `https://www.reddit.com/r/${comment.sub}/comments/demo${i}/comment_${i}`,
      created_utc: now - (daysAgo * day),
      score: comment.score,
      permalink: `/r/${comment.sub}/comments/demo${i}/comment_${i}`,
      type: 'comment',
    });
  });
  
  // Sort by date (most recent first)
  return activities.sort((a, b) => b.created_utc - a.created_utc);
}
