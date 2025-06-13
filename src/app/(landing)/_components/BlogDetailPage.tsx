/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import SafeHTML from '@/components/SafeHTML';

// --- Related Blog Card Component ---
const RelatedBlogCard = ({ blog }:any) => {
  const router = useRouter();
  
  return (
    <div 
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      onClick={() => router.push(`/blog/${blog.id}`)}
    >
      <div className="h-40 overflow-hidden">
        <img 
          src={blog.imageUrl || "https://via.placeholder.com/400x250?text=Blog+Image"} 
          alt={blog.title} 
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-4">
        {blog.category && (
          <span className="text-xs font-semibold text-blue-600 mb-2 block">
            {blog.category}
          </span>
        )}
        <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-2">
          {blog.title}
        </h3>
        <p className="text-sm text-gray-500">
          {new Date(blog.createdAt).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </div>
    </div>
  );
};

// --- Share Buttons Component ---
const ShareButtons = ({ blogId, blogTitle }:any) => {
  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/blog/${blogId}` : '';
  
  const shareLinks = [
    {
      name: 'Twitter',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      ),
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(blogTitle)}&url=${encodeURIComponent(shareUrl)}`,
      color: 'bg-blue-400 hover:bg-blue-500'
    },
    {
      name: 'Facebook',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      name: 'LinkedIn',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(blogTitle)}`,
      color: 'bg-blue-700 hover:bg-blue-800'
    },
    {
      name: 'WhatsApp',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      ),
      url: `https://wa.me/?text=${encodeURIComponent(`${blogTitle} ${shareUrl}`)}`,
      color: 'bg-green-500 hover:bg-green-600'
    }
  ];

  return (
    <div className="flex flex-col space-y-3">
      <h3 className="text-lg font-semibold text-gray-700">Partager</h3>
      <div className="flex space-x-2">
        {shareLinks.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${link.color} text-white p-2 rounded-full transition-colors`}
            aria-label={`Partager sur ${link.name}`}
          >
            {link.icon}
          </a>
        ))}
      </div>
    </div>
  );
};

// --- Main Blog Detail Component ---
const BlogDetailPage = ({ blog, relatedBlogs = [] }:any) => {
  const router = useRouter();
  
  // Format date
  const formattedDate = new Date(blog.createdAt).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="bg-gray-50 min-h-screen font-sans lg:p-16 p-2">
      {/* Hero Section */}
      <div className="relative w-full h-[40vh] md:h-[50vh] lg:h-[60vh] overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10 rounded-lg"></div>
        <img 
          src={blog.imageUrl || "https://via.placeholder.com/1920x1080?text=Blog+Header"} 
          alt={blog.title} 
          className="w-full h-full object-cover rounded-lg"
        />
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="container mx-auto px-2 md:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {blog.category && (
                <span className="inline-block bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
                  {blog.category}
                </span>
              )}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 max-w-4xl mx-auto">
                {blog.title}
              </h1>
              <p className="text-gray-200 text-sm md:text-base">
                Publié le {formattedDate}
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 md:px-8 -mt-10 relative z-30">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <motion.div 
            className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6 md:p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Back Button */}
            <button 
              onClick={() => router.back()}
              className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Retour aux articles
            </button>

            {/* Blog Content */}
            <div className="prose prose-lg max-w-none">
              {/* This is where you would render the blog content */}
              {/* Since your model doesn't have a content field, I'm using description */}
              <div className="mb-8">
                {blog.description ? (
                  <SafeHTML html={`${blog.description}`} className="text-gray-700 leading-relaxed" />
                ) : (
                  <div className="space-y-4">
                    <p className="text-gray-700 leading-relaxed">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, 
                      nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl. Sed euismod, nisl vel ultricies lacinia, 
                      nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl. 
                      Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.
                    </p>
                    <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Sous-titre de l&apos;article</h2>
                    <p className="text-gray-700 leading-relaxed">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, 
                      nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl. Sed euismod, nisl vel ultricies lacinia, 
                      nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                      <li>Premier point important à retenir</li>
                      <li>Deuxième élément à considérer</li>
                      <li>Troisième aspect intéressant</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Tags */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                <span className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">
                  #blog
                </span>
                {blog.category && (
                  <span className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">
                    #{blog.category.toLowerCase().replace(/\s+/g, '')}
                  </span>
                )}
              </div>
            </div>

            {/* Share Section (Mobile) */}
            <div className="mt-8 pt-6 border-t border-gray-200 lg:hidden">
              <ShareButtons blogId={blog.id} blogTitle={blog.title} />
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {/* Share Section (Desktop) */}
            <div className="bg-white rounded-lg shadow-lg p-6 hidden lg:block">
              <ShareButtons blogId={blog.id} blogTitle={blog.title} />
            </div>

            {/* Related Articles */}
            {relatedBlogs.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Articles similaires</h3>
                <div className="space-y-4">
                  {relatedBlogs.map((relatedBlog:any) => (
                    <RelatedBlogCard key={relatedBlog.id} blog={relatedBlog} />
                  ))}
                </div>
              </div>
            )}

            {/* Newsletter */}
            <div className="bg-blue-50 rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Restez informé</h3>
              <p className="text-gray-600 text-sm mb-4">
                Abonnez-vous à notre newsletter pour recevoir nos derniers articles
              </p>
              <form className="space-y-3">
                <input
                  type="email"
                  placeholder="Votre adresse email"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  S&apos;abonner
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
export default BlogDetailPage;

