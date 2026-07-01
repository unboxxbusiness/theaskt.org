"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { useState } from 'react';
import { submitToFirestore } from '@/lib/firebase';
import { Input, Select } from '../ui/Input';
import Button from '../ui/Button';
import Typography from '../typography/Typography';

const brochureSchema = zod.object({
  name: zod.string().min(2, { message: "Name must be at least 2 characters" }),
  email: zod.string().email({ message: "Invalid email address" }),
  phone: zod.string().min(8, { message: "Phone number must be at least 8 digits" }),
  status: zod.string().min(1, { message: "Please select your current status" })
});

interface CareerBrochureFormProps {
  fileUrl?: string | null;
}

export default function CareerBrochureForm({ fileUrl = null }: CareerBrochureFormProps) {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(brochureSchema)
  });

  const onSubmit = async (data: any) => {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      await submitToFirestore("brochureDownloads", {
        name: data.name,
        email: data.email,
        phone: data.phone,
        status: data.status,
        timestamp: new Date().toISOString()
      });
      setSuccess(true);
      if (typeof window !== "undefined" && (window as any).triggerPushPrompt) {
        (window as any).triggerPushPrompt();
      }
      reset();
    } catch (err) {
      console.error(err);
      setError("Submission failed due to database permission restrictions. Please check Firestore security rules.");
    } finally {
      setLoading(false);
    }
  };

  /* ponytail: modular components integrated to eliminate raw HTML tags */
  return (
    <div className="rounded-2xl border border-border-primary bg-bg-secondary p-6 md:p-8 space-y-6">
      <Typography variant="h3" className="border-b border-border-primary pb-3">Download Brochure</Typography>
      {success ? (
        <div className="rounded-xl bg-emerald-55/10 border border-emerald-500/35 p-6 text-center text-sm text-emerald-600 dark:text-emerald-400">
          <Typography variant="h3" className="text-emerald-600 dark:text-emerald-400 mb-2">Request Successful!</Typography>
          <Typography variant="small" className="block leading-relaxed mb-4">Your details have been registered. Click the link below to get the brochure PDF:</Typography>
          {fileUrl ? (
            <a
              href={fileUrl}
              download="TheAskt_AI_Career_Program_Curriculum.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-btn-accent-bg text-btn-accent-text hover:bg-btn-accent-hover px-6 py-2.5 text-xs font-semibold inline-block transition-colors cursor-pointer active:scale-98"
            >
              Get Brochure PDF
            </a>
          ) : (
            <Button
              onClick={() => alert("Brochure file upload pending in Sanity CMS Studio. Please contact site administrator.")}
              variant="accent"
            >
              File Processing...
            </Button>
          )}
          <button
            onClick={() => setSuccess(false)}
            className="mt-4 block mx-auto text-xs text-text-secondary hover:text-link font-semibold transition-colors underline cursor-pointer"
          >
            Submit Another Request
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="e.g. Rahul Kumar"
            error={errors.name?.message as string}
            {...register("name")}
            suppressHydrationWarning
          />

          <Input
            label="Email Address"
            placeholder="e.g. rahul@email.com"
            error={errors.email?.message as string}
            {...register("email")}
            suppressHydrationWarning
          />

          <Input
            label="Phone Number"
            placeholder="e.g. +91 98765 43210"
            error={errors.phone?.message as string}
            {...register("phone")}
            suppressHydrationWarning
          />

          <Select
            label="Current Status"
            error={errors.status?.message as string}
            {...register("status")}
          >
            <option value="">Select Current Status</option>
            <option value="Student">Student</option>
            <option value="Graduate">Graduate</option>
            <option value="Working Professional">Working Professional</option>
            <option value="Career Switcher">Career Switcher</option>
            <option value="Freelancer">Freelancer</option>
            <option value="Entrepreneur">Entrepreneur</option>
            <option value="Other">Other</option>
          </Select>

          {error && <p className="text-xs text-rose-500 font-medium leading-relaxed">{error}</p>}

          <Button
            type="submit"
            disabled={loading}
            variant="primary"
            className="w-full py-3"
          >
            {loading ? "Registering..." : "Download Brochure"}
          </Button>
        </form>
      )}
    </div>
  );
}
