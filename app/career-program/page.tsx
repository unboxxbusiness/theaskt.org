import type { Metadata } from 'next';
import Link from 'next/link';
import { client } from '@/lib/sanity';
import { siteSettingsQuery } from '@/lib/queries';
import CareerBrochureForm from '@/components/forms/CareerBrochureForm';
import { ArrowRight, BookOpen, Layers, CheckCircle2, ChevronRight, ChevronDown } from 'lucide-react';
import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import Typography from "@/components/typography/Typography";
import Accordion from "@/components/ui/Accordion";
import FeatureCard from "@/components/cards/FeatureCard";
import Button from "@/components/ui/Button";

export const revalidate = 600; // Revalidate dynamic settings every 10 minutes

export const metadata: Metadata = {
  title: "AI Career Program | Learn Practical AI Skills & Build Real Projects | TheAskt",
  description: "Build practical AI skills through hands-on projects, business automation, AI tools, portfolio development, and career guidance. Download the AI Career Program brochure from TheAskt and discover a practical path to future career opportunities.",
  alternates: {
    canonical: "/career-program",
  },
};

export default async function CareerProgram() {
  const settings = await client.fetch(siteSettingsQuery).catch(() => null);

  const faqs = [
    {
      title: "Do I need coding experience?",
      content: "No. The program is designed for beginners as well as professionals looking to build practical AI skills."
    },
    {
      title: "Is this suitable for students?",
      content: "Yes. Whether you're in college or recently graduated, the curriculum is designed to help you build practical experience."
    },
    {
      title: "Will I build real projects?",
      content: "Yes. Projects are an essential part of the program and help you build a professional portfolio."
    },
    {
      title: "How long is the program?",
      content: "The AI Career Program follows a structured 12-month learning journey."
    },
    {
      title: "Will I receive a certificate?",
      content: "Yes. Learners who successfully complete the program receive a certificate of completion."
    },
    {
      title: "Do you provide career support?",
      content: "Yes. Career guidance, portfolio development, interview preparation, and professional mentoring are included."
    },
    {
      title: "Can working professionals join?",
      content: "Absolutely. Many learners join to upgrade their skills while continuing their current jobs."
    }
  ];

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://theaskt.com';

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.title,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.content
      }
    }))
  };

  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": "AI Career Program",
    "description": "Build practical AI skills through hands-on projects, business automation, AI tools, portfolio development, and career guidance.",
    "provider": {
      "@type": "EducationalOrganization",
      "name": "TheAskt",
      "sameAs": baseUrl
    }
  };

  /* ponytail: refactored career program view utilizing typography, layout, accordion, and feature cards */
  return (
    <Container className="py-12 space-y-16 animate-fade-in">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([faqSchema, courseSchema]) }}
      />
      
      {/* 1. Page Header Hero */}
      <section className="text-center space-y-6 max-w-4xl mx-auto py-8">
        <Typography variant="display">AI Career Program</Typography>
        <Typography variant="lead" className="max-w-2xl mx-auto leading-relaxed">
          Learn Practical AI Skills. Build Real Experience. Create Better Career Opportunities.
        </Typography>
        <div className="flex flex-wrap gap-3 items-center justify-center pt-3">
          <Button variant="primary" size="lg" as="a" href="#brochure-section">
            Download Program Brochure
          </Button>
          <Button variant="secondary" size="lg" as="a" href="/book-session">
            Book a Free Career Session
          </Button>
        </div>
      </section>

      <hr className="border-border-primary" />

      {/* 2. Core Narrative */}
      <section className="space-y-8 max-w-3xl mx-auto font-serif leading-[1.8]">
        <div className="space-y-4">
          <Typography variant="h2" className="text-left font-sans">The Future Doesn't Need More Certificates</Typography>
          <Typography variant="body-large">
            Every year, millions of students graduate. Thousands complete online courses. Many earn certificates. Yet employers continue to struggle to find candidates with practical skills.
          </Typography>
          <Typography variant="body-large">
            The problem isn't a lack of information. The problem is a lack of implementation. Most people learn. Very few build.
          </Typography>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 max-w-4xl mx-auto font-sans">
          <div className="p-6 border border-border-primary bg-bg-secondary space-y-4 hover:shadow-lg hover:border-text-secondary/25 transition-all duration-300">
            <Typography variant="h3">Traditional Learning</Typography>
            <ul className="list-disc pl-5 space-y-2 text-xs text-text-secondary">
              <li>Theory-first education</li>
              <li>Memorizing concepts</li>
              <li>Watching endless videos</li>
              <li>Collecting certificates</li>
              <li>Limited real-world exposure</li>
              <li>Little portfolio evidence</li>
            </ul>
          </div>
          <div className="p-6 border border-[#FCA311] rounded-2xl bg-bg-secondary space-y-4 relative overflow-hidden hover:shadow-xl hover:scale-[1.01] transition-all duration-300">
            <span className="absolute top-3 right-3 text-[8px] font-bold uppercase tracking-wider text-[#A86200] bg-[#FFF6E5] px-2 py-0.5 rounded-full">TheAskt Method</span>
            <Typography variant="h3">TheAskt Approach</Typography>
            <ul className="list-disc pl-5 space-y-2 text-xs text-text-secondary font-semibold">
              <li className="text-text-h">Learn by building</li>
              <li className="text-text-h">Practical AI workflows</li>
              <li className="text-text-h">Real business scenarios</li>
              <li className="text-text-h">Hands-on projects</li>
              <li className="text-text-h">Portfolio development</li>
              <li className="text-text-h">Career-focused guidance</li>
            </ul>
          </div>
        </div>

        <p className="text-center text-xs text-text-secondary italic max-w-md mx-auto font-sans">
          Our goal isn't simply to teach AI. Our goal is to help you become someone who can apply AI in real work.
        </p>
      </section>

      <hr className="border-border-primary" />

      {/* 3. Why AI Skills Matter & Who is it for */}
      <div className="grid gap-12 sm:grid-cols-2">
        <section className="space-y-4">
          <Typography variant="h2" className="text-left">Why AI Skills Matter</Typography>
          <div className="text-xs text-text-secondary space-y-3 leading-relaxed">
            <p>AI is transforming every industry.</p>
            <p>Businesses are adopting new tools to improve productivity, automate repetitive work, and make better decisions.</p>
            <p>This creates opportunities for people who know how to use these tools effectively.</p>
            <p className="font-semibold text-text-h">Learning AI isn't about replacing your career. It's about strengthening it.</p>
          </div>
        </section>

        <section className="space-y-4">
          <Typography variant="h2" className="text-left">Who Is This Program For?</Typography>
          <Typography variant="small" className="leading-relaxed block">
            Whether you're just starting out or planning your next career move, this program is designed to help you build practical skills.
          </Typography>
          <div className="grid grid-cols-2 gap-2 text-xs text-text-secondary">
            <div className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-link" /> Students</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-link" /> Graduates</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-link" /> Working Professionals</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-link" /> Career Switchers</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-link" /> Freelancers</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-link" /> Entrepreneurs</div>
          </div>
        </section>
      </div>

      <hr className="border-border-primary" />

      {/* 4. What You'll Learn (Curriculum) */}
      <Section className="space-y-8">
        <div className="space-y-2 text-center max-w-xl mx-auto">
          <Typography variant="h2">What You'll Learn</Typography>
          <Typography variant="small" className="leading-relaxed">The curriculum focuses on practical implementation instead of theory alone.</Typography>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
          <FeatureCard title="AI Foundations" description="Understand how modern AI works and where it's creating opportunities." icon={<span className="text-[10px] font-bold text-link uppercase font-sans">Module 1</span>} />
          <FeatureCard title="AI Productivity" description="Learn how professionals use AI to research, write, analyze, and work more efficiently." icon={<span className="text-[10px] font-bold text-link uppercase font-sans">Module 2</span>} />
          <FeatureCard title="Prompt Engineering" description="Write better prompts and communicate effectively with AI systems." icon={<span className="text-[10px] font-bold text-link uppercase font-sans">Module 3</span>} />
          <FeatureCard title="Business Automation" description="Automate repetitive workflows using modern no-code and AI-powered tools." icon={<span className="text-[10px] font-bold text-link uppercase font-sans">Module 4</span>} />
          <FeatureCard title="CRM & Client Mgmt" description="Understand how businesses manage customers, sales, and communication." icon={<span className="text-[10px] font-bold text-link uppercase font-sans">Module 5</span>} />
          <FeatureCard title="AI Chatbots" description="Learn how conversational AI is used to improve customer experience." icon={<span className="text-[10px] font-bold text-link uppercase font-sans">Module 6</span>} />
          <FeatureCard title="Business Systems" description="Discover how modern organizations improve productivity using digital workflows." icon={<span className="text-[10px] font-bold text-link uppercase font-sans">Module 7</span>} />
          <FeatureCard title="Career Development" description="Build professional skills that support long-term career growth." icon={<span className="text-[10px] font-bold text-link uppercase font-sans">Module 8</span>} />
        </div>
      </Section>

      <hr className="border-border-primary" />

      {/* 5. Projects and Outputs */}
      <Section className="space-y-8">
        <div className="space-y-3 text-center max-w-xl mx-auto">
          <Typography variant="h2">Learn by Building</Typography>
          <Typography variant="small" className="leading-relaxed block">
            Watching videos isn't enough. Real confidence comes from building. Throughout the program you'll work on practical projects inspired by real business use cases.
          </Typography>
          <Typography variant="small" className="italic font-semibold text-text-muted block">You'll learn how to think, solve problems, and implement—not simply memorize.</Typography>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          <FeatureCard title="AI Research Assistant" description="Build custom search crawlers and semantic summaries maps." />
          <FeatureCard title="Support Chatbots" description="Deploy Conversational AI widgets resolving customer queries." />
          <FeatureCard title="Automation Workflows" description="Construct automated triggers linking webhooks to internal databases." />
          <FeatureCard title="CRM Setup" description="Configure leads collection and customer relations databases pipelines." />
          <FeatureCard title="AI Content Workflows" description="Set up bulk drafts publishers using OpenAI API and structured schemas." />
          <FeatureCard title="Productivity Dashboards" description="Build dashboard metrics tracking project outputs and calendar milestones." />
          <FeatureCard title="Portfolio Website" description="Deploy a clean resume platform showcasing your published build artifacts." />
          <FeatureCard title="Business Documentation" description="Construct automated standard operating procedures manuals." />
          <FeatureCard title="Personal AI Workspace" description="Deploy a command-center aggregating all custom chatbot models." />
        </div>

        <div className="p-6 border border-border-primary bg-bg-secondary rounded-2xl space-y-3 max-w-xl mx-auto">
          <Typography variant="h3" className="text-sm">What You'll Graduate With:</Typography>
          <div className="grid grid-cols-2 gap-2 text-xs text-text-secondary">
            <div>✓ Practical AI Skills</div>
            <div>✓ Real Project Experience</div>
            <div>✓ Professional Portfolio</div>
            <div>✓ Business Understanding</div>
            <div>✓ Confidence Using AI Tools</div>
            <div>✓ Structured Learning Framework</div>
            <div className="col-span-2">✓ Career Readiness</div>
          </div>
        </div>
      </Section>

      <hr className="border-border-primary" />

      {/* 6. Learning Journey Flowchart */}
      <Section className="space-y-8">
        <Typography variant="h2" className="text-center">Your Learning Journey</Typography>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 max-w-4xl mx-auto pt-4 text-center">
          <div className="p-4 border border-border-primary bg-bg-secondary rounded-xl w-full max-w-[160px] space-y-1 hover:-translate-y-1 hover:border-link hover:shadow-lg transition-all duration-300 cursor-default">
            <span className="text-[9px] font-bold text-link uppercase tracking-wider font-sans block">Phase 1</span>
            <h4 className="text-xs font-bold text-text-h">Learn</h4>
            <p className="text-[10px] text-text-secondary leading-relaxed">Build strong foundations in AI and automation.</p>
          </div>
          <ChevronRight className="h-5 w-5 text-text-muted hidden md:block rotate-90 md:rotate-0" />
          <div className="p-4 border border-border-primary bg-bg-secondary rounded-xl w-full max-w-[160px] space-y-1 hover:-translate-y-1 hover:border-link hover:shadow-lg transition-all duration-300 cursor-default">
            <span className="text-[9px] font-bold text-link uppercase tracking-wider font-sans block">Phase 2</span>
            <h4 className="text-xs font-bold text-text-h">Practice</h4>
            <p className="text-[10px] text-text-secondary leading-relaxed">Apply concepts through exercises.</p>
          </div>
          <ChevronRight className="h-5 w-5 text-text-muted hidden md:block rotate-90 md:rotate-0" />
          <div className="p-4 border border-[#FCA311] bg-bg-secondary rounded-xl w-full max-w-[160px] space-y-1 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 cursor-default">
            <span className="text-[9px] font-bold text-link uppercase tracking-wider font-sans block">Phase 3</span>
            <h4 className="text-xs font-bold text-text-h">Build</h4>
            <p className="text-[10px] text-text-secondary leading-relaxed">Complete real-world business projects.</p>
          </div>
          <ChevronRight className="h-5 w-5 text-text-muted hidden md:block rotate-90 md:rotate-0" />
          <div className="p-4 border border-border-primary bg-bg-secondary rounded-xl w-full max-w-[160px] space-y-1 hover:-translate-y-1 hover:border-link hover:shadow-lg transition-all duration-300 cursor-default">
            <span className="text-[9px] font-bold text-link uppercase tracking-wider font-sans block">Phase 4</span>
            <h4 className="text-xs font-bold text-text-h">Portfolio</h4>
            <p className="text-[10px] text-text-secondary leading-relaxed">Organize projects in a professional portfolio.</p>
          </div>
          <ChevronRight className="h-5 w-5 text-text-muted hidden md:block rotate-90 md:rotate-0" />
          <div className="p-4 border border-border-primary bg-bg-secondary rounded-xl w-full max-w-[160px] space-y-1 hover:-translate-y-1 hover:border-link hover:shadow-lg transition-all duration-300 cursor-default">
            <span className="text-[9px] font-bold text-link uppercase tracking-wider font-sans block">Phase 5</span>
            <h4 className="text-xs font-bold text-text-h">Grow</h4>
            <p className="text-[10px] text-text-secondary leading-relaxed">Prepare for interviews and job markets.</p>
          </div>
        </div>
      </Section>

      <hr className="border-border-primary" />

      {/* 7. Differentiation & Support */}
      <div className="grid gap-12 sm:grid-cols-2">
        <section className="space-y-4">
          <Typography variant="h2" className="text-left">What Makes Us Different?</Typography>
          <ul className="space-y-3 text-xs text-text-secondary leading-relaxed list-inside list-none">
            <li><strong className="text-text-h block mb-0.5">Focus on Implementation:</strong> Many programs teach tools. We teach implementation.</li>
            <li><strong className="text-text-h block mb-0.5">Building After Learning:</strong> Many courses end after the videos. Our focus begins after learning.</li>
            <li><strong className="text-text-h block mb-0.5">Complete Workflows:</strong> Instead of teaching isolated tools, we teach complete workflows.</li>
            <li><strong className="text-text-h block mb-0.5">Showcase Assets:</strong> Instead of collecting certificates, you'll build work you can showcase.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <Typography variant="h2" className="text-left">Career Support</Typography>
          <Typography variant="small" className="leading-relaxed block">
            Learning doesn't stop after completing the curriculum. We also help you prepare for the next step.
          </Typography>
          <ul className="space-y-3 text-xs text-text-secondary leading-relaxed list-inside list-none">
            <li><strong className="text-text-h block mb-0.5">1-on-1 Mentoring:</strong> Get feedback on your projects and career path.</li>
            <li><strong className="text-text-h block mb-0.5">Portfolio Development:</strong> Build a clean personal website to showcase your published assets.</li>
            <li><strong className="text-text-h block mb-0.5">Interview Preparation:</strong> Practice technical interviews and workflow walkthroughs.</li>
            <li><strong className="text-text-h block mb-0.5">Partner Submissions:</strong> We submit verified student portfolios directly to our hiring partners.</li>
          </ul>
        </section>
      </div>

      <hr className="border-border-primary" />

      {/* 8. Learner Testimonials */}
      <section className="space-y-6">
        <Typography variant="h2" className="text-center">Hear From Our Learners</Typography>
        <div className="grid gap-6 sm:grid-cols-3 max-w-4xl mx-auto text-left font-serif">
          <div className="p-5 border border-border-primary bg-bg-secondary rounded-xl space-y-2">
            <span className="text-[9px] font-bold text-text-muted uppercase font-sans block">Alumni Student</span>
            <p className="text-xs text-text-secondary leading-relaxed italic">"The program helped me shift from reading tutorials to building structured APIs and database workflows for clients."</p>
            <span className="text-[10px] font-bold text-text-h block pt-1">— Full Stack Developer</span>
          </div>
          <div className="p-5 border border-border-primary bg-bg-secondary rounded-xl space-y-2">
            <span className="text-[9px] font-bold text-text-muted uppercase font-sans block">Working Professional</span>
            <p className="text-xs text-text-secondary leading-relaxed italic">"I saved hours of repetitive operations work in my company by automating CRM updates using Make.com and OpenAI APIs."</p>
            <span className="text-[10px] font-bold text-text-h block pt-1">— Operations Manager</span>
          </div>
          <div className="p-5 border border-border-primary bg-bg-secondary rounded-xl space-y-2">
            <span className="text-[9px] font-bold text-text-muted uppercase font-sans block">Community Member</span>
            <p className="text-xs text-text-secondary leading-relaxed italic">"The structured modules and active mentorship resolved my questions around vector databases and chatbot deployments."</p>
            <span className="text-[10px] font-bold text-text-h block pt-1">— Freelance Designer</span>
          </div>
        </div>
      </section>

      <hr className="border-border-primary" />

      {/* 9. Frequently Asked Questions */}
      <Section className="space-y-6 max-w-3xl mx-auto">
        <Typography variant="h2" className="text-center">Frequently Asked Questions</Typography>
        <Accordion items={faqs} />
      </Section>

      <hr className="border-border-primary" id="brochure-section" />

      {/* 10. Brochure Download Form */}
      <div className="grid gap-12 sm:grid-cols-12 max-w-4xl mx-auto">
        <div className="sm:col-span-6 space-y-4 leading-[1.8] text-sm">
          <Typography variant="h2" className="text-left font-serif text-3xl font-extrabold">Download the Program Brochure</Typography>
          <Typography variant="small" className="leading-relaxed block">
            Want to explore the complete program before making a decision? Download the brochure to learn everything included in the AI Career Program.
          </Typography>
          <div className="space-y-1.5 pt-2">
            <Typography variant="h4">Inside you'll find:</Typography>
            <ul className="list-disc pl-5 space-y-1 text-xs text-text-secondary">
              <li>Complete Curriculum & module breakdown</li>
              <li>Learning Roadmap & module checklist</li>
              <li>Module projects list</li>
              <li>Mentoring & Career support details</li>
              <li>Admission process details</li>
              <li>Program Outcomes & FAQs</li>
            </ul>
          </div>
        </div>

        <div className="sm:col-span-6">
          <CareerBrochureForm fileUrl={settings?.brochureFileUrl} />
        </div>
      </div>

      <hr className="border-border-primary" />

      {/* 11. Questions & Footer Banner */}
      <section className="text-center py-12 bg-bg-secondary border border-border-primary rounded-2xl space-y-6 max-w-3xl mx-auto">
        <div className="space-y-2">
          <Typography variant="h2" className="text-center">Still Have Questions?</Typography>
          <Typography variant="small" className="max-w-md mx-auto block leading-relaxed">
            Choosing the right learning program is an important decision. If you'd like to understand whether this program is the right fit for your goals, schedule a free career session with our team.
          </Typography>
        </div>
        <div>
          <Button variant="primary" size="md" as={Link} href="/book-session">
            Book a Free Career Session &rarr;
          </Button>
        </div>
      </section>

      <section className="text-center space-y-4 max-w-2xl mx-auto">
        <Typography variant="h1" className="text-center font-serif text-2xl font-extrabold">Your Future Starts With the Skills You Build Today</Typography>
        <Typography variant="small" className="leading-relaxed block">
          Technology will continue to evolve. The people who continue learning, adapting, and building practical skills will be better prepared for the opportunities ahead.
        </Typography>
        <Typography variant="small" className="italic leading-relaxed text-text-muted block">
          The AI Career Program is designed to help you move from learning concepts to building real capabilities.
        </Typography>
        <div className="text-[11px] text-link hover:text-link-hover font-bold transition-colors pt-2">
          Learn AI. Build Skills. Create Opportunities.
        </div>
        <div className="pt-2">
          <Button variant="primary" size="sm" as="a" href="#brochure-section">
            Download Program Brochure
          </Button>
        </div>
      </section>

    </Container>
  );
}
