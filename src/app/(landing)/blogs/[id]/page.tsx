import React from "react";
import HeroSub from "../../_components/hero-sub";
import { Blog } from "@prisma/client";
import prisma from "@/lib/prisma";
import BlogDetailPage from "../../_components/BlogDetailPage";

const BlogDetails = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const blog: Blog | null = await prisma.blog.findUnique({
      where: {
        id,
      },
    });
  const breadcrumbLinks = [
    { href: "/", text: "Home" },
    { href: "/blogs", text: "Blogs" },
    { href: `/blogs/${id}`, text: `${blog?.title}`},
  ];
  return (
    <div>
      <HeroSub
      title="Notre Blog"
      description="Découvrez les dernières actualités, conseils et nouveautés de notre équipe d'experts"
      breadcrumbLinks={breadcrumbLinks}
      />
      <BlogDetailPage
      blog={blog}
      />
    </div>
  );
};

export default BlogDetails;
