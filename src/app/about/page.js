"use client";

import Link from "next/link";

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "Founder & CEO",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
      bio: "10+ years in event management",
    },
    {
      name: "Michael Chen",
      role: "CTO",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      bio: "Tech visionary and innovator",
    },
    {
      name: "Emma Wilson",
      role: "Head of Operations",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80",
      bio: "Streamlining event experiences",
    },
    {
      name: "David Martinez",
      role: "Marketing Director",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
      bio: "Building brand excellence",
    },
  ];

  const values = [
    {
      icon: "🎯",
      title: "Innovation",
      description: "Constantly pushing boundaries to create cutting-edge event solutions.",
    },
    {
      icon: "❤️",
      title: "Customer Focus",
      description: "Your success is our success. We prioritize your needs above all.",
    },
    {
      icon: "🤝",
      title: "Integrity",
      description: "Building trust through transparency and honest business practices.",
    },
    {
      icon: "🚀",
      title: "Excellence",
      description: "Delivering exceptional quality in every event we help create.",
    },
  ];

  const stats = [
    { number: "10K+", label: "Events Hosted" },
    { number: "500K+", label: "Happy Attendees" },
    { number: "50+", label: "Countries" },
    { number: "99%", label: "Satisfaction Rate" },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#0f1419] to-[#050609] relative overflow-hidden py-16 px-4">
      
      {/* Animated Background Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#206eaa]/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-[#4a9fd8]/8 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-5xl font-black bg-gradient-to-r from-white via-[#4a9fd8] to-white/60 bg-clip-text text-transparent mb-4">
            About EventWave
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Empowering event creators and attendees to connect, collaborate, and celebrate together.
          </p>
        </div>

        {/* Mission Section */}
        <div className="rounded-3xl border border-white/15 bg-gradient-to-br from-white/10 via-white/5 to-white/[0.01] backdrop-blur-lg overflow-hidden shadow-2xl shadow-[#206eaa]/20 mb-20 p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            
            {/* Mission Image */}
            <div className="relative h-80 rounded-2xl overflow-hidden group">
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80"
                alt="Our Mission"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </div>

            {/* Mission Content */}
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-black text-white mb-4">Our Mission</h2>
                <p className="text-white/70 text-base leading-relaxed mb-4">
                  At EventWave, we believe that every event has the power to create meaningful connections and unforgettable memories. Our mission is to democratize event management, making it accessible, affordable, and enjoyable for everyone.
                </p>
                <p className="text-white/70 text-base leading-relaxed">
                  From intimate gatherings to large-scale conferences, we provide the tools and support needed to bring your vision to life.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-white/15 bg-gradient-to-br from-white/10 via-white/5 to-white/[0.01] backdrop-blur-lg p-8 text-center hover:border-[#206eaa]/40 transition-all"
            >
              <div className="text-3xl font-black text-[#4a9fd8] mb-2">{stat.number}</div>
              <div className="text-white/70 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <h2 className="text-4xl font-black text-white text-center mb-12">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-white/15 bg-gradient-to-br from-white/10 via-white/5 to-white/[0.01] backdrop-blur-lg p-8 hover:border-[#206eaa]/40 hover:shadow-xl hover:shadow-[#206eaa]/20 transition-all duration-300 text-center"
              >
                <div className="text-5xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                <p className="text-white/60 text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-20">
          <h2 className="text-4xl font-black text-white text-center mb-12">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-white/15 bg-gradient-to-br from-white/10 via-white/5 to-white/[0.01] backdrop-blur-lg overflow-hidden hover:border-[#206eaa]/40 hover:shadow-xl hover:shadow-[#206eaa]/20 transition-all duration-300 group"
              >
                {/* Image */}
                <div className="h-56 overflow-hidden bg-white/5">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {/* Content */}
                <div className="p-6 text-center space-y-3">
                  <h3 className="text-lg font-bold text-white">{member.name}</h3>
                  <p className="text-[#4a9fd8] font-semibold text-sm">{member.role}</p>
                  <p className="text-white/60 text-xs">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* History Section */}
        <div className="rounded-3xl border border-white/15 bg-gradient-to-br from-white/10 via-white/5 to-white/[0.01] backdrop-blur-lg p-12 mb-20">
          <h2 className="text-3xl font-black text-white mb-8">Our Journey</h2>
          <div className="space-y-6 text-white/70">
            <p>
              <span className="font-bold text-white">2020:</span> EventWave was founded with a simple idea – to make event management simpler and more accessible for everyone.
            </p>
            <p>
              <span className="font-bold text-white">2021:</span> We reached our first 10,000 events hosted and expanded to multiple countries across Europe and Asia.
            </p>
            <p>
              <span className="font-bold text-white">2023:</span> Introduced AI-powered event recommendations and automated ticketing systems, revolutionizing how events are managed.
            </p>
            <p>
              <span className="font-bold text-white">2024:</span> Celebrated 500,000 happy attendees and expanded our platform to support virtual and hybrid events globally.
            </p>
            <p>
              <span className="font-bold text-white">2025:</span> Launched advanced analytics, enhanced mobile app, and integrated payment systems to streamline the entire event experience.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="rounded-3xl border border-white/15 bg-gradient-to-r from-[#206eaa]/20 to-[#1a5a8f]/10 backdrop-blur-lg p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Create Your Next Event?</h2>
          <p className="text-white/70 mb-8">Join thousands of event creators using EventWave to craft unforgettable experiences.</p>
          <Link
            href="/events"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-gradient-to-r from-[#206eaa] to-[#1a5a8f] hover:shadow-lg hover:shadow-[#206eaa]/40 text-white font-bold transition-all"
          >
            Explore Events
            <span>→</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
