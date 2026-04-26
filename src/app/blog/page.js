"use client";

import Link from "next/link";

const blogPosts = [
  {
    id: 1,
    title: "The Future of Live Events",
    excerpt: "Discover how technology is transforming the way we experience live entertainment and connecting audiences worldwide.",
    category: "Events",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1511379938547-c1f69b13d835?auto=format&fit=crop&w=600&q=80",
    date: "March 15, 2025",
  },
  {
    id: 2,
    title: "Finding Your Perfect Venue",
    excerpt: "A comprehensive guide to choosing the right venue for your next event, from intimate gatherings to large conferences.",
    category: "Guide",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1519671482677-504be0271ff5?auto=format&fit=crop&w=600&q=80",
    date: "March 10, 2025",
  },
  {
    id: 3,
    title: "Music Festival Trends 2025",
    excerpt: "Explore the latest trends in music festivals including innovative stage designs, emerging genres, and artist lineups.",
    category: "Trends",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    date: "March 5, 2025",
  },
  {
    id: 4,
    title: "Virtual Events: The New Standard",
    excerpt: "Learn how virtual and hybrid events are reshaping the industry and creating new opportunities for attendees globally.",
    category: "Technology",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80",
    date: "February 28, 2025",
  },
  {
    id: 5,
    title: "Ticketing Strategies for Success",
    excerpt: "Expert tips on pricing, marketing, and distribution strategies to maximize your event ticket sales.",
    category: "Business",
    readTime: "9 min read",
    image: "https://images.unsplash.com/photo-1489749798305-4fea3ba63d60?auto=format&fit=crop&w=600&q=80",
    date: "February 20, 2025",
  },
  {
    id: 6,
    title: "Customer Experience in Events",
    excerpt: "Creating memorable experiences for attendees through thoughtful design, engagement, and personalization.",
    category: "Experience",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80",
    date: "February 15, 2025",
  },
];

const categories = ["All", "Events", "Guide", "Trends", "Technology", "Business", "Experience"];

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#0f1419] to-[#050609] relative overflow-hidden py-16 px-4">
      
      {/* Animated Background Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#206eaa]/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-[#4a9fd8]/8 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black bg-gradient-to-r from-white via-[#4a9fd8] to-white/60 bg-clip-text text-transparent mb-4">
            EventWave Blog
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Insights, trends, and tips for creating unforgettable events
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex gap-3 justify-center mb-16 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                cat === "All"
                  ? "bg-gradient-to-r from-[#206eaa] to-[#1a5a8f] text-white shadow-lg shadow-[#206eaa]/40"
                  : "border border-white/20 text-white/70 hover:border-[#206eaa]/40 hover:text-white hover:bg-white/5"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="group rounded-2xl border border-white/15 bg-gradient-to-br from-white/10 via-white/5 to-white/[0.01] backdrop-blur-lg overflow-hidden hover:border-[#206eaa]/40 hover:shadow-xl hover:shadow-[#206eaa]/20 transition-all duration-300"
            >
              {/* Image Container */}
              <div className="relative h-48 overflow-hidden bg-white/5">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-lg bg-[#206eaa]/80 text-white text-xs font-bold backdrop-blur-sm">
                    {post.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                
                {/* Meta Info */}
                <div className="flex items-center justify-between text-xs text-white/50">
                  <span>{post.date}</span>
                  <span>{post.readTime}</span>
                </div>

                {/* Title */}
                <h2 className="text-xl font-bold text-white group-hover:text-[#4a9fd8] transition-colors line-clamp-2">
                  {post.title}
                </h2>

                {/* Excerpt */}
                <p className="text-white/60 text-sm line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Read More Link */}
                <div className="pt-2">
                  <Link
                    href={`/blog/${post.id}`}
                    className="inline-flex items-center gap-2 text-[#4a9fd8] hover:text-[#6ba5d4] font-semibold text-sm transition-colors"
                  >
                    Read More
                    <span>→</span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Featured Section */}
        <div className="rounded-3xl border border-white/15 bg-gradient-to-br from-white/10 via-white/5 to-white/[0.01] backdrop-blur-lg overflow-hidden shadow-2xl shadow-[#206eaa]/20 mt-16 p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            
            {/* Featured Image */}
            <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden group">
              <img
                src="https://images.unsplash.com/photo-1487215078519-e21cc028cb29?auto=format&fit=crop&w=600&q=80"
                alt="Featured"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>

            {/* Featured Content */}
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="inline-block px-3 py-1 rounded-lg bg-[#206eaa]/20 border border-[#206eaa]/40 text-[#4a9fd8] text-xs font-bold">
                  Featured Article
                </span>
                <h3 className="text-3xl font-black text-white">
                  How to Plan an Unforgettable Event
                </h3>
              </div>

              <p className="text-white/70 text-base leading-relaxed">
                From concept to execution, learn the essential steps and strategies for creating an event that will leave a lasting impression on your attendees.
              </p>

              <Link
                href="/blog/featured"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[#206eaa] to-[#1a5a8f] hover:shadow-lg hover:shadow-[#206eaa]/40 text-white font-bold transition-all"
              >
                Read Featured Article
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mt-16 rounded-2xl border border-white/15 bg-gradient-to-r from-[#206eaa]/20 to-[#1a5a8f]/10 backdrop-blur-lg p-8 md:p-12 text-center">
          <h3 className="text-2xl font-bold text-white mb-2">
            Subscribe to Our Newsletter
          </h3>
          <p className="text-white/60 mb-6">
            Get the latest event trends, tips, and exclusive content delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-[#206eaa] focus:bg-white/15 outline-none transition-all"
            />
            <button className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#206eaa] to-[#1a5a8f] hover:shadow-lg hover:shadow-[#206eaa]/40 text-white font-bold transition-all">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
