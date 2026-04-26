"use client";

import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubmitMessage("Thank you for your message! We'll get back to you soon.");
      setFormData({ name: "", email: "", subject: "", message: "" });
      
      setTimeout(() => setSubmitMessage(""), 5000);
    } catch (error) {
      setSubmitMessage("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: "📧",
      title: "Email",
      content: "support@eventwave.com",
      description: "We respond within 24 hours",
    },
    {
      icon: "📞",
      title: "Phone",
      content: "+1 (555) 123-4567",
      description: "Available 9 AM - 6 PM EST",
    },
    {
      icon: "📍",
      title: "Address",
      content: "123 Event Street, NYC 10001",
      description: "Visit our headquarters",
    },
    {
      icon: "🕐",
      title: "Business Hours",
      content: "Mon - Fri: 9 AM - 6 PM",
      description: "Sat - Sun: Closed",
    },
  ];

  const faqItems = [
    {
      question: "How do I create an event?",
      answer: "Simply sign up, fill in your event details, and start selling tickets! Our intuitive platform guides you through every step.",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, bank transfers, and digital payment methods like PayPal and Apple Pay.",
    },
    {
      question: "How long does ticket delivery take?",
      answer: "Digital tickets are delivered instantly via email. Physical tickets are typically shipped within 2-3 business days.",
    },
    {
      question: "Can I cancel or modify my event?",
      answer: "Yes! You can modify event details anytime. Cancellations are allowed up to 7 days before the event date.",
    },
    {
      question: "Do you offer customer support?",
      answer: "Absolutely! We offer 24/7 email support and live chat during business hours. Our team is here to help!",
    },
    {
      question: "Are there any hidden fees?",
      answer: "No hidden fees! We're transparent about all costs. You'll see the exact breakdown before confirming.",
    },
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
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black bg-gradient-to-r from-white via-[#4a9fd8] to-white/60 bg-clip-text text-transparent mb-4">
            Get In Touch
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactInfo.map((info, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-white/15 bg-gradient-to-br from-white/10 via-white/5 to-white/[0.01] backdrop-blur-lg p-6 hover:border-[#206eaa]/40 hover:shadow-xl hover:shadow-[#206eaa]/20 transition-all duration-300"
            >
              <div className="text-4xl mb-4">{info.icon}</div>
              <h3 className="text-lg font-bold text-white mb-2">{info.title}</h3>
              <p className="text-[#4a9fd8] font-semibold text-sm mb-1">{info.content}</p>
              <p className="text-white/50 text-xs">{info.description}</p>
            </div>
          ))}
        </div>

        {/* Contact Form & Map */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          
          {/* Contact Form */}
          <div className="rounded-3xl border border-white/15 bg-gradient-to-br from-white/10 via-white/5 to-white/[0.01] backdrop-blur-lg p-8 shadow-2xl shadow-[#206eaa]/20">
            <h2 className="text-2xl font-bold text-white mb-6">Send us a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-white/70 mb-2 uppercase tracking-wide">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your name"
                  className="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-[#206eaa] focus:bg-white/15 focus:ring-1 focus:ring-[#206eaa]/40 transition-all outline-none text-sm"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-white/70 mb-2 uppercase tracking-wide">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your@email.com"
                  className="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-[#206eaa] focus:bg-white/15 focus:ring-1 focus:ring-[#206eaa]/40 transition-all outline-none text-sm"
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-semibold text-white/70 mb-2 uppercase tracking-wide">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="What is this about?"
                  className="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-[#206eaa] focus:bg-white/15 focus:ring-1 focus:ring-[#206eaa]/40 transition-all outline-none text-sm"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-semibold text-white/70 mb-2 uppercase tracking-wide">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Your message..."
                  rows="5"
                  className="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-[#206eaa] focus:bg-white/15 focus:ring-1 focus:ring-[#206eaa]/40 transition-all outline-none text-sm resize-none"
                />
              </div>

              {/* Submit Message */}
              {submitMessage && (
                <div className={`p-3 rounded-lg text-xs text-center ${
                  submitMessage.includes("Thank you")
                    ? "bg-green-500/10 border border-green-500/30 text-green-400"
                    : "bg-red-500/10 border border-red-500/30 text-red-400"
                }`}>
                  {submitMessage}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-[#206eaa] to-[#1a5a8f] hover:from-[#1a5a8f] hover:to-[#0f3d5a] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all shadow-lg shadow-[#206eaa]/40"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>

          {/* Map & Social */}
          <div className="space-y-8">
            
            {/* Map Placeholder */}
            <div className="rounded-3xl border border-white/15 bg-gradient-to-br from-white/10 via-white/5 to-white/[0.01] backdrop-blur-lg overflow-hidden h-64 lg:h-80 shadow-2xl shadow-[#206eaa]/20">
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=600&q=80"
                alt="Location"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Social Links */}
            <div className="rounded-2xl border border-white/15 bg-gradient-to-br from-white/10 via-white/5 to-white/[0.01] backdrop-blur-lg p-8">
              <h3 className="text-xl font-bold text-white mb-6">Follow Us</h3>
              <div className="grid grid-cols-2 gap-4">
                {["Twitter", "LinkedIn", "Instagram", "Facebook"].map((social) => (
                  <button
                    key={social}
                    className="px-4 py-3 rounded-lg border border-white/20 text-white hover:border-[#206eaa]/40 hover:bg-white/5 transition-all font-semibold text-sm"
                  >
                    {social}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-4xl font-black text-white text-center mb-12">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {faqItems.map((item, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-white/15 bg-gradient-to-br from-white/10 via-white/5 to-white/[0.01] backdrop-blur-lg p-6 hover:border-[#206eaa]/40 transition-all"
              >
                <h3 className="text-lg font-bold text-white mb-3 flex items-start gap-3">
                  <span className="text-[#4a9fd8] text-xl mt-1">Q</span>
                  {item.question}
                </h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter */}
        <div className="rounded-3xl border border-white/15 bg-gradient-to-r from-[#206eaa]/20 to-[#1a5a8f]/10 backdrop-blur-lg p-12 text-center">
          <h3 className="text-2xl font-bold text-white mb-2">Stay Updated</h3>
          <p className="text-white/60 mb-6">Subscribe to get updates about new features and exclusive offers.</p>
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
