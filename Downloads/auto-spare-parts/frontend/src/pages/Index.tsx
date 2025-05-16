
import React from 'react';
import Layout from '../components/layout/Layout';
import HeroSection from '../components/home/HeroSection';
import FeaturedProducts from '../components/home/FeaturedProducts';
import TopRatedProducts from '../components/home/TopRatedProducts';
import CategorySection from '../components/home/CategorySection';
import BannerSection from '../components/home/BannerSection';
import BenefitsSection from '../components/home/BenefitsSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import BlogSection from '../components/home/BlogSection';
import CtaSection from '../components/home/CtaSection';
import NewsletterSection from '../components/home/NewsletterSection';

const Index: React.FC = () => {
  return (
    <Layout>
      {/* Hero section (top of the page) */}
      <HeroSection />
      
      {/* Product showcases and categories */}
      <BenefitsSection />
      <FeaturedProducts />
      <CategorySection />
      <BannerSection />
      
      {/* Social proof and engagement */}
      <TopRatedProducts />
      <TestimonialsSection />
      
      {/* Blog and newsletter */}
      <BlogSection />
      <NewsletterSection />
      
      {/* Final call to action */}
      <CtaSection />
    </Layout>
  );
};

export default Index;
