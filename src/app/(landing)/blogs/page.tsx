/* eslint-disable @typescript-eslint/no-unused-vars */
import prisma from "@/lib/prisma";
import { Blog } from "@prisma/client";
import React from "react";
import BlogPage from "../_components/blogList";

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
