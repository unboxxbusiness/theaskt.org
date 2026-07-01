"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { useState } from 'react';
import { submitToFirestore } from '@/lib/firebase';
import Container from "@/components/layout/Container";
import Typography from "@/components/typography/Typography";
import { Input, Select, Textarea } from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Link from 'next/link';

const contactSchema = zod.object({
  name: zod.string().min(2, { message: "Name must be at least 2 characters" }),
  email: zod.string().email({ message: "Invalid email address" }),
  subject: zod.string().min(1, { message: "Please select a topic" }),
  message: zod.string().min(10, { message: "Message must be at least 10 characters" })
});

export default function ContactForm() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(contactSchema)
  });

  const onSubmit = async (data: any) => {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      await submitToFirestore("contactMessages", {
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
        timestamp: new Date().toISOString()
      });
      setSuccess(true);
      reset();
    } catch (err) {
      console.error(err);
      setError("Submission failed. Please try again or email us directly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-20 space-y-16 animate-fade-in">
      
      {/* Editorial Header */}
      <header className="space-y-4 text-center border-b border-border-primary pb-8 max-w-3xl mx-auto">
        <span className="text-[10px] font-bold uppercase tracking-wider text-link font-sans block">Support & Enquiries</span>
        <Typography variant="display">Contact Us</Typography>
        <Typography variant="h2" className="text-center text-text-secondary leading-tight mt-2">We'd Love to Hear From You</Typography>
        <Typography variant="small" className="max-w-xl mx-auto block leading-relaxed pt-2">
          Have a question about TheAskt, our AI Career Program™, or our learning resources? We're here to help. 
          Whether you're interested in admissions, partnerships, career guidance, or general enquiries, our team is happy to assist you.
        </Typography>
      </header>

      {/* Main 2-Column Contact Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        
        {/* Left Side: Contact Form (3/5 Width) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="space-y-2 border-b border-border-primary pb-4">
            <Typography variant="h3">Get in Touch</Typography>
            <Typography variant="small" className="block">
              Use the contact form below, and we'll respond as soon as possible. We typically reply within <strong className="text-text-h font-semibold">1–2 business days</strong>.
            </Typography>
          </div>

          {success ? (
            <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/35 p-6 text-center text-sm text-emerald-600 dark:text-emerald-400 font-serif italic">
              Message sent successfully! We will get back to you shortly.
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-bg-secondary p-6 rounded-2xl border border-border-primary" noValidate>
              <Input
                label="Full Name"
                placeholder="e.g. Rahul Kumar"
                error={errors.name?.message as string}
                aria-describedby={errors.name ? "name-error" : undefined}
                {...register("name")}
                suppressHydrationWarning
              />

              <Input
                label="Email Address"
                type="email"
                placeholder="e.g. rahul@email.com"
                error={errors.email?.message as string}
                aria-describedby={errors.email ? "email-error" : undefined}
                {...register("email")}
                suppressHydrationWarning
              />

              <Select
                label="Subject"
                error={errors.subject?.message as string}
                aria-describedby={errors.subject ? "subject-error" : undefined}
                {...register("subject")}
              >
                <option value="">Choose a Topic</option>
                <option value="General Enquiry">General Enquiry</option>
                <option value="AI Career Program™">AI Career Program™</option>
                <option value="Admissions">Admissions</option>
                <option value="Career Consultation">Career Consultation</option>
                <option value="Partnership">Partnership</option>
                <option value="Technical Support">Technical Support</option>
                <option value="Media & Press">Media & Press</option>
                <option value="Other">Other</option>
              </Select>

              <Textarea
                label="Message"
                rows={5}
                placeholder="Tell us how we can help..."
                error={errors.message?.message as string}
                aria-describedby={errors.message ? "message-error" : undefined}
                {...register("message")}
                suppressHydrationWarning
              />

              {error && <p className="text-xs text-rose-500 font-medium leading-relaxed" role="alert">{error}</p>}

              <Button
                type="submit"
                disabled={loading}
                variant="primary"
                className="w-full py-3"
              >
                {loading ? "Sending..." : "Send Message"}
              </Button>
            </form>
          )}
        </div>

        {/* Right Side: Informative Panels (2/5 Width) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Need Help With? */}
          <div className="space-y-4">
            <Typography variant="h4" className="border-b border-border-primary pb-2">Need Help With?</Typography>
            <div className="space-y-4">
              <div>
                <Typography variant="h3" className="text-xs font-bold mb-0.5">AI Career Program™</Typography>
                <Typography variant="small" className="block leading-relaxed">Learn more about the curriculum, admissions process, fees, and upcoming batches.</Typography>
              </div>
              <div>
                <Typography variant="h3" className="text-xs font-bold mb-0.5">Career Consultation</Typography>
                <Typography variant="small" className="block leading-relaxed">Book a one-on-one session to discuss your learning goals and career path.</Typography>
              </div>
              <div>
                <Typography variant="h3" className="text-xs font-bold mb-0.5">Partnerships</Typography>
                <Typography variant="small" className="block leading-relaxed">Interested in collaborating with TheAskt? We'd love to hear your ideas.</Typography>
              </div>
              <div>
                <Typography variant="h3" className="text-xs font-bold mb-0.5">Technical Support</Typography>
                <Typography variant="small" className="block leading-relaxed">Experiencing an issue with the website or learning resources? Let us know.</Typography>
              </div>
            </div>
          </div>

          {/* Before You Contact Us */}
          <div className="p-5 border border-border-primary bg-bg-secondary rounded-xl space-y-2">
            <Typography variant="h3" className="text-sm">Before You Contact Us</Typography>
            <Typography variant="small" className="block leading-relaxed">
              You may find answers to common questions in our <Link href="/learn" className="text-link hover:text-link-hover font-semibold transition-colors underline decoration-dotted decoration-1 underline-offset-4">Learn</Link> section, where we regularly publish articles, guides, and resources about AI, careers, and our programs.
            </Typography>
          </div>

          {/* Business Hours */}
          <div className="space-y-2">
            <Typography variant="h3" className="text-sm font-bold text-text-h">Business Hours</Typography>
            <div className="text-xs text-text-secondary space-y-1">
              <p><strong className="text-text-h font-medium">Monday – Saturday</strong></p>
              <p>9:00 AM – 6:00 PM (IST)</p>
              <Typography variant="caption" className="text-[10px]">Closed on Sundays and public holidays.</Typography>
            </div>
          </div>

          {/* Stay Connected */}
          <div className="space-y-2 border-t border-border-primary pt-6">
            <Typography variant="h3" className="text-sm font-bold text-text-h">Stay Connected</Typography>
            <Typography variant="small" className="block leading-relaxed mb-3">
              Follow TheAskt for practical AI insights, learning resources, program updates, and career opportunities.
            </Typography>
            <div className="text-[11px] text-link hover:text-link-hover font-bold transition-colors">
              Learn AI. Build Skills. Create Opportunities.
            </div>
          </div>

        </div>
      </div>
    </Container>
  );
}
