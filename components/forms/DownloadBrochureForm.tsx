"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { useState } from 'react';
import { submitToFirestore } from '@/lib/firebase';
import Container from "@/components/layout/Container";
import Typography from "@/components/typography/Typography";
import { Input } from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const brochureSchema = zod.object({
  name: zod.string().min(2, { message: "Name must be at least 2 characters" }),
  email: zod.string().email({ message: "Invalid email address" })
});

interface DownloadBrochureFormProps {
  title?: string;
  description?: string;
  fileUrl?: string | null;
  successText?: string;
  buttonText?: string;
}

export default function DownloadBrochureForm({
  title = "Download Brochure",
  description = "Submit details to download the curriculum overview.",
  fileUrl = null,
  successText = "Thank you! Click the link below to access your PDF:",
  buttonText = "Get Brochure PDF"
}: DownloadBrochureFormProps) {
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
        timestamp: new Date().toISOString()
      });
      setSuccess(true);
      if (typeof window !== "undefined" && (window as any).triggerPushPrompt) {
        (window as any).triggerPushPrompt();
      }
      reset();
    } catch (err) {
      console.error(err);
      setError("Submission failed due to database permission restrictions. Please ensure public write rules are enabled for brochures.");
    } finally {
      setLoading(false);
    }
  };

  /* ponytail: refactored separate download page form to inherit design system primitives */
  return (
    <Container className="py-20 max-w-xl space-y-8 animate-fade-in">
      <header className="space-y-3 text-center">
        <Typography variant="display">{title}</Typography>
        <Typography variant="small">{description}</Typography>
      </header>
      {success ? (
        <div className="rounded-xl bg-emerald-55/10 border border-emerald-500/35 p-6 text-center text-sm text-emerald-600 dark:text-emerald-400">
          <Typography variant="small" className="block text-emerald-600 dark:text-emerald-400 font-medium mb-4">{successText}</Typography>
          <div className="mt-4">
            {fileUrl ? (
              <a
                href={fileUrl}
                download="TheAskt_AI_Career_Program_Curriculum.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-btn-accent-bg text-btn-accent-text hover:bg-btn-accent-hover px-6 py-2.5 text-xs font-semibold inline-block transition-colors cursor-pointer active:scale-98"
              >
                {buttonText}
              </a>
            ) : (
              <Button
                onClick={() => alert("Brochure file upload pending in Sanity CMS Studio. Please contact site administrator.")}
                variant="accent"
              >
                File Processing...
              </Button>
            )}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Name"
            placeholder="e.g. Rahul Kumar"
            error={errors.name?.message as string}
            {...register("name")}
            suppressHydrationWarning
          />
          <Input
            label="Email"
            type="email"
            placeholder="e.g. rahul@email.com"
            error={errors.email?.message as string}
            {...register("email")}
            suppressHydrationWarning
          />

          {error && <p className="text-xs text-rose-500 font-medium leading-relaxed">{error}</p>}

          <Button
            type="submit"
            disabled={loading}
            variant="primary"
            className="w-full py-3"
          >
            {loading ? "Requesting PDF..." : "Download Curriculum PDF"}
          </Button>
        </form>
      )}
    </Container>
  );
}
