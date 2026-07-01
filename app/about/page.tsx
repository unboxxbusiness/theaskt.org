import type { Metadata } from 'next';
import Link from 'next/link';
import Container from "@/components/layout/Container";
import Typography from "@/components/typography/Typography";
import FeatureCard from "@/components/cards/FeatureCard";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "About Us — TheAskt",
  description: "Learn AI, Build Skills, and Create Opportunities with TheAskt, an AI learning and career platform.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  /* ponytail: refactored about page to use typography, container, features, and button components */
  return (
    <Container className="py-20 space-y-12 max-w-3xl animate-fade-in">
      <header className="space-y-4 text-center">
        <span className="text-[10px] font-bold uppercase tracking-wider text-link font-sans block">Our Identity</span>
        <Typography variant="display">About TheAskt</Typography>
        <p className="text-lg text-text-secondary leading-8 max-w-xl mx-auto italic">
          Learn AI. Build Skills. Create Opportunities.
        </p>
      </header>

      <hr className="border-border-primary" />

      <section className="space-y-6 leading-[1.8] text-sm font-serif">
        <Typography variant="body-large">
          TheAskt is an AI learning and career platform that helps people develop practical AI skills for the modern workplace.
        </Typography>
        <Typography variant="body-large">
          We create educational content, practical resources, and career-focused programs that make artificial intelligence easier to understand and apply in real-world situations.
        </Typography>
        <Typography variant="body-large">
          Whether you're a student, graduate, professional, freelancer, or career changer, our goal is to help you stay ahead by learning the tools, workflows, and skills that organizations use today.
        </Typography>
      </section>

      <hr className="border-border-primary" />

      <section className="space-y-6">
        <Typography variant="h2">What We Do</Typography>
        <Typography variant="small" className="max-w-md">We focus on three simple goals to accelerate your career:</Typography>
        <div className="grid gap-6 sm:grid-cols-3 pt-2">
          <FeatureCard title="Learn" description="Explore practical articles, guides, AI tools, and industry insights." />
          <FeatureCard title="Build" description="Develop hands-on skills through projects, workflows, and real-world learning." />
          <FeatureCard title="Grow" description="Prepare for better career opportunities with portfolio development, mentorship, and career guidance." />
        </div>
      </section>

      <hr className="border-border-primary" />

      <section className="space-y-4 leading-[1.8] text-sm">
        <Typography variant="h2">AI Career Program™</Typography>
        <Typography variant="body-large">
          Our AI Career Program™ helps learners move beyond theory by building practical experience through projects, business use cases, and guided learning.
        </Typography>
        <Typography variant="body-large">
          The program is designed to prepare learners for today's AI-powered workplace.
        </Typography>
      </section>

      <hr className="border-border-primary" />

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Typography variant="h3">Our Mission</Typography>
          <Typography variant="small" className="block leading-relaxed">
            To help people learn practical AI, build valuable skills, and create better career opportunities.
          </Typography>
        </div>
        <div className="space-y-2">
          <Typography variant="h3">Our Vision</Typography>
          <Typography variant="small" className="block leading-relaxed">
            To build a trusted platform where people can learn, grow, and prepare for the future of work through practical AI education.
          </Typography>
        </div>
      </div>

      <hr className="border-border-primary" />

      <section className="text-center py-10 bg-bg-secondary border border-border-primary rounded-2xl space-y-6">
        <div className="space-y-2">
          <Typography variant="h2" className="text-center">Join TheAskt</Typography>
          <Typography variant="small" className="max-w-sm mx-auto block leading-relaxed">
            Whether you're starting your AI journey or advancing your career, TheAskt provides the knowledge, resources, and learning experience to help you move forward with confidence.
          </Typography>
        </div>
        <div className="pt-1">
          <Button variant="primary" size="md" as={Link} href="/career-program">
            Explore Career Program
          </Button>
        </div>
      </section>
    </Container>
  );
}
