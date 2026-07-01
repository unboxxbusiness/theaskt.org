"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { submitToFirestore } from '@/lib/firebase';
import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import Typography from "@/components/typography/Typography";
import Accordion from "@/components/ui/Accordion";
import { Input, Select, Textarea } from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const bookingSchema = zod.object({
  name: zod.string().min(2, { message: "Name must be at least 2 characters" }),
  email: zod.string().email({ message: "Invalid email address" }),
  phone: zod.string().min(8, { message: "Phone number must be at least 8 digits" }),
  status: zod.string().min(1, { message: "Please select your current status" }),
  qualification: zod.string().min(2, { message: "Qualification must be at least 2 characters" }),
  occupation: zod.string().optional(),
  city: zod.string().min(2, { message: "City must be at least 2 characters" }),
  interest: zod.string().min(1, { message: "Please select what you are interested in" }),
  goals: zod.string().min(10, { message: "Goals must be at least 10 characters" }),
  mode: zod.string().min(1, { message: "Please select meeting mode" }),
  date: zod.string().min(1, { message: "Please select preferred date" }),
  time: zod.string().min(1, { message: "Please select preferred time" })
});

export default function BookSessionForm() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(bookingSchema)
  });

  const onSubmit = async (data: any) => {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      await submitToFirestore("careerSessionBookings", {
        name: data.name,
        email: data.email,
        phone: data.phone,
        status: data.status,
        qualification: data.qualification,
        occupation: data.occupation || "",
        city: data.city,
        interest: data.interest,
        goals: data.goals,
        mode: data.mode,
        date: data.date,
        time: data.time,
        timestamp: new Date().toISOString()
      });
      setSuccess(true);
      reset();
    } catch (err) {
      console.error(err);
      setError("Submission failed. Please try again or contact us directly.");
    } finally {
      setLoading(false);
    }
  };

  const faqs = [
    {
      title: "Is the career session free?",
      content: "Yes. The initial career session is complimentary and designed to help you explore your options."
    },
    {
      title: "Do I need prior AI experience?",
      content: "No. The session is open to beginners as well as professionals looking to upskill."
    },
    {
      title: "Am I required to enroll after the session?",
      content: "No. Booking a career session does not obligate you to join any program. The purpose is to help you make an informed decision."
    },
    {
      title: "Can I attend online?",
      content: "Yes. Most career sessions are conducted online, with in-person sessions available where applicable."
    }
  ];

  return (
    <Container className="py-20 space-y-16 animate-fade-in">
      
      {/* Header */}
      <header className="space-y-4 text-center border-b border-border-primary pb-8 max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-text-muted hover:text-link transition-colors mb-2">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Home
        </Link>
        <span className="text-[10px] font-bold uppercase tracking-wider text-link font-sans block">Mentorship Session</span>
        <Typography variant="display">Book a Career Session</Typography>
        <Typography variant="h2" className="text-center text-text-secondary leading-tight mt-2">Get Personal Guidance for Your AI Career</Typography>
        <Typography variant="small" className="max-w-xl mx-auto block leading-relaxed pt-2">
          Whether you're just starting your career, switching industries, or looking to develop practical AI skills, a one-on-one career session can help you make informed decisions. 
          Our career sessions are designed to understand your goals, answer your questions, and help you choose the right learning path.
        </Typography>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Column: Context Info (7/12 Width) */}
        <div className="lg:col-span-7 space-y-10 leading-[1.8] text-sm font-serif">
          
          <section className="space-y-4">
            <Typography variant="h3" className="font-sans">What You'll Discuss</Typography>
            <p className="text-xs font-sans text-text-secondary">During your session, we'll help you understand:</p>
            <ul className="list-disc pl-5 space-y-2 font-sans text-xs text-text-secondary">
              <li>Your current skills and experience</li>
              <li>Career opportunities in AI</li>
              <li>Whether the AI Career Program™ is right for you</li>
              <li>Learning roadmap based on your goals</li>
              <li>Industry tools and skills to focus on</li>
              <li>Project and portfolio expectations</li>
              <li>Career support and opportunities</li>
            </ul>
            <p className="text-xs italic text-text-muted font-sans">Our goal is to provide practical guidance—not a sales pitch.</p>
          </section>

          <hr className="border-border-primary" />

          <section className="space-y-4 font-sans">
            <Typography variant="h3" className="font-sans">Who Should Book a Session?</Typography>
            <p className="text-xs text-text-secondary">This session is suitable for:</p>
            <div className="grid grid-cols-2 gap-2 text-xs text-text-secondary">
              <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-link"></span> Students</div>
              <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-link"></span> Graduates</div>
              <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-link"></span> Working Professionals</div>
              <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-link"></span> Career Switchers</div>
              <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-link"></span> Freelancers</div>
              <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-link"></span> Entrepreneurs</div>
            </div>
          </section>

          <hr className="border-border-primary" />

          <section className="space-y-4 font-sans">
            <Typography variant="h3" className="font-sans">What to Expect</Typography>
            <ul className="list-disc pl-5 space-y-2 text-xs text-text-secondary">
              <li>Understanding your background</li>
              <li>Discussing your career goals</li>
              <li>Reviewing suitable learning paths</li>
              <li>Explaining the AI Career Program™</li>
              <li>Answering your questions</li>
              <li>Next-step recommendations</li>
            </ul>
            <div className="grid grid-cols-2 gap-4 pt-2 text-xs text-text-secondary">
              <div className="p-4 border border-border-primary bg-bg-secondary rounded-lg">
                <strong className="text-text-h block mb-1">Duration</strong>
                20–30 minutes
              </div>
              <div className="p-4 border border-border-primary bg-bg-secondary rounded-lg">
                <strong className="text-text-h block mb-1">Mode</strong>
                Online or In-Person (where available)
              </div>
            </div>
          </section>

          <hr className="border-border-primary" />

          {/* FAQs */}
          <section className="space-y-6">
            <Typography variant="h3" className="font-sans">Frequently Asked Questions</Typography>
            <Accordion items={faqs} />
          </section>
        </div>

        {/* Right Column: Booking Form (5/12 Width) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2 border-b border-border-primary pb-4">
            <Typography variant="h3" className="font-sans">Book Your Session</Typography>
            <Typography variant="small" className="block">
              Complete the form below to request your career session.
            </Typography>
          </div>

          {success ? (
            <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/35 p-6 text-center text-sm text-emerald-600 dark:text-emerald-400 font-serif italic">
              <h4 className="font-bold text-base mb-2">Request Received!</h4>
              <p className="text-xs leading-relaxed">
                Once we receive your request:<br/>
                1. We'll review your information.<br/>
                2. Our team will contact you to confirm your session.<br/>
                3. You'll receive the meeting details by email or phone.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-bg-secondary p-6 rounded-2xl border border-border-primary" noValidate>
              <Typography variant="h4" className="border-b border-border-primary pb-2 mb-4">Booking Form</Typography>

              <Input
                label="Full Name"
                placeholder="e.g. Rahul Kumar"
                error={errors.name?.message as string}
                {...register("name")}
                suppressHydrationWarning
              />

              <Input
                label="Email Address"
                type="email"
                placeholder="e.g. rahul@email.com"
                error={errors.email?.message as string}
                {...register("email")}
                suppressHydrationWarning
              />

              <Input
                label="Phone Number"
                type="tel"
                placeholder="e.g. +91 9876543210"
                error={errors.phone?.message as string}
                {...register("phone")}
                suppressHydrationWarning
              />

              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Current Status"
                  error={errors.status?.message as string}
                  {...register("status")}
                >
                  <option value="">Select Status</option>
                  <option value="Student">Student</option>
                  <option value="Graduate">Graduate</option>
                  <option value="Working Professional">Working Professional</option>
                  <option value="Career Switcher">Career Switcher</option>
                  <option value="Freelancer">Freelancer</option>
                  <option value="Business Owner">Business Owner</option>
                  <option value="Other">Other</option>
                </Select>

                <Input
                  label="Qualification"
                  placeholder="e.g. B.Tech / MBA"
                  error={errors.qualification?.message as string}
                  {...register("qualification")}
                  suppressHydrationWarning
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Occupation (Optional)"
                  placeholder="e.g. Analyst"
                  {...register("occupation")}
                  suppressHydrationWarning
                />

                <Input
                  label="City"
                  placeholder="e.g. Mumbai"
                  error={errors.city?.message as string}
                  {...register("city")}
                  suppressHydrationWarning
                />
              </div>

              <Select
                label="What are you interested in?"
                error={errors.interest?.message as string}
                {...register("interest")}
              >
                <option value="">Select Topic</option>
                <option value="AI Career Program™">AI Career Program™</option>
                <option value="AI Tools">AI Tools</option>
                <option value="Career Guidance">Career Guidance</option>
                <option value="Portfolio Building">Portfolio Building</option>
                <option value="Business Automation">Business Automation</option>
                <option value="General Enquiry">General Enquiry</option>
              </Select>

              <Select
                label="Preferred Meeting Mode"
                error={errors.mode?.message as string}
                {...register("mode")}
              >
                <option value="">Select Mode</option>
                <option value="Online">Online</option>
                <option value="In-Person">In-Person (if available)</option>
              </Select>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Preferred Date"
                  type="date"
                  error={errors.date?.message as string}
                  {...register("date")}
                  suppressHydrationWarning
                  className="cursor-pointer"
                />

                <Input
                  label="Preferred Time"
                  type="time"
                  error={errors.time?.message as string}
                  {...register("time")}
                  suppressHydrationWarning
                  className="cursor-pointer"
                />
              </div>

              <Textarea
                label="Tell us about your goals"
                rows={4}
                placeholder="Share a few details about your background..."
                error={errors.goals?.message as string}
                {...register("goals")}
                suppressHydrationWarning
              />

              {error && <p className="text-xs text-rose-500 font-medium leading-relaxed" role="alert">{error}</p>}

              <Button
                type="submit"
                disabled={loading}
                variant="primary"
                className="w-full py-3"
              >
                {loading ? "Submitting..." : "Request Career Session"}
              </Button>
            </form>
          )}

          {/* After You Submit Side Note */}
          <div className="p-4 border border-border-primary bg-bg-secondary rounded-xl space-y-1.5 font-sans">
            <Typography variant="h4" className="text-[10px]">After You Submit</Typography>
            <ol className="list-decimal pl-4 space-y-1 text-[11px] text-text-secondary leading-relaxed">
              <li>We'll review your information.</li>
              <li>Our team will contact you to confirm your session.</li>
              <li>You'll receive the meeting details by email or phone.</li>
            </ol>
          </div>
        </div>

      </div>

      <hr className="border-border-primary" />

      {/* Footer Banner */}
      <section className="text-center py-10 bg-bg-secondary border border-border-primary rounded-2xl space-y-4 max-w-3xl mx-auto">
        <Typography variant="h2">Ready to Take the Next Step?</Typography>
        <Typography variant="small" className="max-w-sm mx-auto block leading-relaxed">
          Every career begins with a conversation. Book your career session today and take the first step toward learning practical AI skills.
        </Typography>
        <div className="text-[11px] text-link hover:text-link-hover font-bold transition-colors">
          Learn AI. Build Skills. Create Opportunities.
        </div>
      </section>

    </Container>
  );
}
