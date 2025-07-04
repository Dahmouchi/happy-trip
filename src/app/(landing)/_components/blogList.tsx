/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import HeroSub from "./hero-sub";
import SafeHTML from "@/components/SafeHTML";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

// --- Blog Card Component ---
const BlogCard = ({ blog }: any) => {
  function formatDate(date: Date): string {
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }
  return (
    <motion.div
      className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {/* Image with hover effect and category badge */}
      <div className="relative h-52 md:h-64 overflow-hidden">
        <img
          src={blog?.imageUrl || "/placeholder-image.jpg"}
          alt={blog?.title}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <div className="absolute top-4 left-4"></div>
      </div>

      {/* Content section */}
      <div className="p-6">
        {/* Date and status */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <span>{formatDate(blog.createdAt)}</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium`}>
            <span className="bg-white text-blue-600 text-xs font-semibold px-3 py-1 rounded-full shadow-md">
              {blog?.category || "Uncategorized"}
            </span>
          </span>
        </div>

        {/* Title and description */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {blog?.title}
        </h3>
        <div className="relative">
          <SafeHTML
            html={`${blog?.description}`}
            className="text-gray-600 mb-5 line-clamp-1 transition-all duration-300"
          />

          {/* Read More gradient overlay */}
        </div>

        {/* Author and Read More button */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center">
            <img
              src="/logo.png"
              alt="Author"
              className="w-8 h-8 rounded-full border-2 border-white shadow-sm mr-3 object-cover"
            />
            <div>
              <p className="text-sm font-medium text-gray-800">
                HappyTrip Staff
              </p>
              <p className="text-xs text-gray-500">Administration</p>
            </div>
          </div>

            <Link
            href={`/blogs/${blog.id}`}
            className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center transition-colors"
            >
            Lire la suite
            <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
        </div>
      </div>
    </motion.div>
  );
};

// --- Search Bar Component ---
const SearchBar = ({ searchQuery, setSearchQuery }: any) => {
  return (
    <div className="relative ">
      <input
      type="text"
      placeholder="Rechercher des articles..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="w-full px-4 py-3 pl-10 rounded-lg border bg-white border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
      />
      <svg
      className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
      </svg>
    </div>
  );
};

// --- Newsletter Component ---
const Newsletter = () => {
  return (
    <div className="bg-blue-50 rounded-xl p-6 md:p-8 my-12">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          Abonnez-vous à notre newsletter
        </h3>
        <p className="text-gray-600">
          Recevez les derniers articles et actualités directement dans votre boîte mail
        </p>
      </div>
      <form className="flex flex-col md:flex-row gap-3">
        <input
          type="email"
          placeholder="Votre adresse e-mail"
          className="flex-grow px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
        >
          S&apos;abonner
        </button>
      </form>
    </div>
  );
};

// --- Main Blog Page Component ---
const BlogPage = ({ blogs: initialBlogs }: any) => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const blogsPerPage = 6;
  console.log("ini", initialBlogs);
  // Filter blogs based on category and search query
  const filteredBlogs = initialBlogs.filter((blog: any) => {
    const matchesCategory =
      activeCategory === "all" || blog?.category === activeCategory;
    const matchesSearch = blog?.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Get paginated blogs (excluding featured blog)
  const paginatedBlogs = filteredBlogs.slice(0, page * blogsPerPage);

  // Check if there are more blogs to load
  const hasMore = filteredBlogs.length > 1 + page * blogsPerPage;

  // Load more blogs
  const loadMore = () => {
    setPage(page + 1);
  };
  const breadcrumbLinks = [
    { href: "/", text: "Home" },
    { href: "/blogs", text: "Blogs" },
  ];
  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <div className="container mx-auto  pb-12">
        {/* Page Header */}
        <HeroSub
          title={`Our Blog`}
          description={`Discover the latest insights, tips, and news from our team of experts`}
          breadcrumbLinks={breadcrumbLinks}
        />
        <div className="flex items-center justify-end px-4 py-2  bg-[#8ebd21]">
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </div>

        {/* Search Bar */}
        <div className="lg:px-8 pt-4 px-4">
          {/* Blog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {paginatedBlogs.map((blog: any) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="text-center mt-12">
                <button
                onClick={loadMore}
                className="bg-white hover:bg-gray-50 text-blue-600 font-medium px-6 py-3 rounded-lg border border-blue-200 shadow-sm transition-colors"
                >
                Charger plus d&apos;articles
                </button>
            </div>
          )}

          {/* No Results Message */}
          {filteredBlogs.length === 0 && (
            <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Aucun article trouvé
                </h3>
                <p className="text-gray-500">
                Essayez de modifier votre recherche ou vos filtres pour trouver ce que vous cherchez.
                </p>
            </div>
          )}

          {/* Newsletter */}
          <Newsletter />
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
