/* eslint-disable @typescript-eslint/no-unused-vars */
import prisma from "@/lib/prisma";
import { Blog } from "@prisma/client";
import React from "react";
import BlogPage from "../_components/blogList";
const sampleBlogs = [
  {
    id: 1,
    title: "10 Essential Tips for Modern Web Design in 2025",
    excerpt: "Discover the latest trends and best practices in web design that will help your website stand out in 2025. From micro-interactions to accessibility improvements.",
    coverImage: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    category: "Design",
    date: "June 10, 2025",
    readTime: 8,
    author: {
      name: "Alex Johnson",
      role: "Senior Designer",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    }
  },
  {
    id: 2,
    title: "The Future of JavaScript: What's Coming in ES2025",
    excerpt: "An in-depth look at the upcoming features in ECMAScript 2025 and how they will change the way we write JavaScript code. Learn about new syntax, performance improvements, and more.",
    coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    category: "Development",
    date: "June 5, 2025",
    readTime: 12,
    author: {
      name: "Samantha Lee",
      role: "JavaScript Developer",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    }
  },
  {
    id: 3,
    title: "How AI is Transforming Content Creation",
    excerpt: "Artificial Intelligence is revolutionizing how we create and consume content. From automated writing to personalized recommendations, explore the impact of AI on the content landscape.",
    coverImage: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    category: "Technology",
    date: "May 28, 2025",
    readTime: 10,
    author: {
      name: "Marcus Chen",
      role: "AI Researcher",
      avatar: "https://randomuser.me/api/portraits/men/22.jpg"
    }
  },
  {
    id: 4,
    title: "Building Accessible Websites: A Comprehensive Guide",
    excerpt: "Learn how to make your websites accessible to everyone, including people with disabilities. This guide covers WCAG guidelines, practical tips, and tools to help you build inclusive web experiences.",
    coverImage: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    category: "Accessibility",
    date: "May 20, 2025",
    readTime: 15,
    author: {
      name: "Priya Sharma",
      role: "Accessibility Specialist",
      avatar: "https://randomuser.me/api/portraits/women/67.jpg"
    }
  },
  {
    id: 5,
    title: "The Psychology of Color in Marketing",
    excerpt: "Colors have a profound impact on consumer behavior. Discover how to use color psychology to enhance your marketing efforts and create more effective visual communications.",
    coverImage: "https://images.unsplash.com/photo-1505330622279-bf7d7fc918f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    category: "Marketing",
    date: "May 15, 2025",
    readTime: 7,
    author: {
      name: "David Wilson",
      role: "Marketing Strategist",
      avatar: "https://randomuser.me/api/portraits/men/75.jpg"
    }
  },
  {
    id: 6,
    title: "Responsive Design Strategies for Complex Layouts",
    excerpt: "Creating responsive designs for complex layouts can be challenging. This article shares practical strategies and techniques to handle complex UI components across different screen sizes.",
    coverImage: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    category: "Design",
    date: "May 8, 2025",
    readTime: 9,
    author: {
      name: "Emma Rodriguez",
      role: "UX Designer",
      avatar: "https://randomuser.me/api/portraits/women/32.jpg"
    }
  },
  {
    id: 7,
    title: "Getting Started with WebAssembly in 2025",
    excerpt: "WebAssembly has evolved significantly. Learn how to get started with WASM in 2025, including tooling, frameworks, and real-world applications that leverage its performance benefits.",
    coverImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    category: "Development",
    date: "April 30, 2025",
    readTime: 14,
    author: {
      name: "James Kim",
      role: "Systems Engineer",
      avatar: "https://randomuser.me/api/portraits/men/42.jpg"
    }
  },
  {
    id: 8,
    title: "Sustainable Web Design: Reducing Digital Carbon Footprint",
    excerpt: "The environmental impact of digital products is often overlooked. Discover how to design and develop websites with sustainability in mind, reducing their carbon footprint without compromising user experience.",
    coverImage: "https://images.unsplash.com/photo-1500835556837-99ac94a94552?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    category: "Sustainability",
    date: "April 22, 2025",
    readTime: 11,
    author: {
      name: "Olivia Green",
      role: "Sustainability Advocate",
      avatar: "https://randomuser.me/api/portraits/women/58.jpg"
    }
  },
  {
    id: 9,
    title: "The Rise of Micro-Frontends: Breaking Down Monoliths",
    excerpt: "Micro-frontend architecture is changing how teams build and deploy web applications. Learn about the benefits, challenges, and implementation strategies for adopting micro-frontends in your organization.",
    coverImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    category: "Architecture",
    date: "April 15, 2025",
    readTime: 13,
    author: {
      name: "Thomas Brown",
      role: "Software Architect",
      avatar: "https://randomuser.me/api/portraits/men/55.jpg"
    }
  },
  {
    id: 10,
    title: "Optimizing Web Performance with Core Web Vitals",
    excerpt: "Core Web Vitals have become crucial for SEO and user experience. This guide explains how to measure, optimize, and maintain good scores for LCP, FID, and CLS to ensure your website performs well.",
    coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    category: "Performance",
    date: "April 8, 2025",
    readTime: 10,
    author: {
      name: "Sophia Martinez",
      role: "Performance Engineer",
      avatar: "https://randomuser.me/api/portraits/women/22.jpg"
    }
  }
];

const sampleCategories = ["Design", "Development", "Technology", "Accessibility", "Marketing", "Sustainability", "Architecture", "Performance"];
const Blogs = async () => {
  const blog: Blog[] | null = await prisma.blog.findMany({
    where: {
      status: true,
    },
  });
  return <div > <BlogPage
       blogs={blog} 
       categories={sampleCategories} 
     /></div>;
};

export default Blogs;
