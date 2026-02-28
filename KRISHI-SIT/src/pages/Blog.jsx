import React from "react";
import "./Blog.css";

const BlogCard = ({ title, description, image, category, date }) => {
  return (
    <div className="blog-card">
      <div className="blog-image-wrapper">
        <img src={image} alt={title} className="blog-image" />
        <div className="image-overlay"></div>
        <span className="blog-category">{category}</span>
      </div>

      <div className="blog-content">
        <h3 className="blog-title">{title}</h3>
        <p className="blog-description">{description}</p>

        <div className="blog-footer">
          <span className="blog-date">{date}</span>
          <button className="read-more-btn">
            Read Article
            <span className="arrow">→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Blog() {
  const blogPosts = [
    {
      id: 1,
      category: "Design",
      title: "Mastering Responsive Design in Figma",
      description:
        "Learn how to create scalable and responsive layouts using Auto Layout in Figma. This guide walks you through modern UI workflows and best practices.",
      image:
        "https://images.unsplash.com/photo-1559028012-481c04fa702d",
      date: "Feb 27, 2026"
    },
    {
      id: 2,
      category: "Development",
      title: "React Performance Optimization Techniques",
      description:
        "Discover powerful techniques to improve your React app performance including memoization, lazy loading, and proper component structuring.",
      image:
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee",
      date: "Feb 24, 2026"
    },
    {
      id: 3,
      category: "UI/UX",
      title: "Modern UI Principles for Clean Interfaces",
      description:
        "Explore typography, spacing systems, and visual hierarchy principles that help you design premium and user-friendly digital products.",
      image:
        "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e",
      date: "Feb 20, 2026"
    }
  ];

  return (
    <div className="blog-container">
      <div className="background-blur blur1"></div>
      <div className="background-blur blur2"></div>

      <h1 className="blog-heading">
        Our <span>Latest Articles</span>
      </h1>

      <div className="blog-grid">
        {blogPosts.map((post) => (
          <BlogCard key={post.id} {...post} />
        ))}
      </div>
    </div>
  );
}