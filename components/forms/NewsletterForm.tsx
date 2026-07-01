"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { useState } from "react";
import { submitToFirestore } from "@/lib/firebase";
import { Input } from "../ui/Input";
import Button from "../ui/Button";
import Typography from "../typography/Typography";

const newsletterSchema = zod.object({
  name: zod.string().min(2, { message: "Name must be at least 2 characters" }),
  email: zod.string().email({ message: "Invalid email address" }),
  mobile: zod.string().min(10, { message: "Mobile number must be at least 10 digits" })
});

interface NewsletterFormProps {
  heading?: string;
  description?: string;
  buttonText?: string;
  successMessage?: string;
  layout?: "stacked" | "inline" | "card";
}

export default function NewsletterForm({
  heading = "Subscribe to Our Newsletter",
  description = "Get our weekly briefs and technical guides directly to your inbox.",
  buttonText = "Subscribe",
  successMessage = "Successfully subscribed!",
  layout = "inline"
}: NewsletterFormProps) {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(newsletterSchema)
  });

  const onSubmit = async (data: any) => {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      await submitToFirestore("newsletterSubscribers", {
        name: data.name,
        email: data.email,
        mobile: data.mobile,
        timestamp: new Date().toISOString()
      });
      setSuccess(true);
      if (typeof window !== "undefined" && (window as any).triggerPushPrompt) {
        (window as any).triggerPushPrompt();
      }
      reset();
    } catch (err) {
      console.error(err);
      setError("Submission failed due to database permission restrictions. Please ensure public write rules are enabled.");
    } finally {
      setLoading(false);
    }
  };

  if (layout === "card") {
    return (
      <div className="p-6 border border-card-border bg-bg-card rounded-xl space-y-4 max-w-md w-full mx-auto shadow-sm transition-all hover:border-card-hover-border">
        <div>
          <Typography variant="h3">{heading}</Typography>
          <Typography variant="small" className="mt-1.5">{description}</Typography>
        </div>
        {success ? (
          <p className="text-xs font-semibold text-emerald-600">{successMessage}</p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <Input
              type="text"
              placeholder="e.g. Rahul Kumar"
              error={errors.name?.message as string}
              {...register("name")}
              suppressHydrationWarning
            />
            <Input
              type="email"
              placeholder="e.g. rahul@email.com"
              error={errors.email?.message as string}
              {...register("email")}
              suppressHydrationWarning
            />
            <Input
              type="tel"
              placeholder="e.g. +91 98765 43210"
              error={errors.mobile?.message as string}
              {...register("mobile")}
              suppressHydrationWarning
            />

            {error && <p className="text-[10px] text-rose-500 leading-relaxed font-medium">{error}</p>}

            <Button
              type="submit"
              loading={loading}
              variant="accent"
              className="w-full mt-1"
            >
              {buttonText}
            </Button>
          </form>
        )}
      </div>
    );
  }

  /* ponytail: inline stacked layout matches clean blog and footer widgets */
  return (
    <div className="space-y-3">
      {heading && <Typography variant="h4" className="text-footer-heading">{heading}</Typography>}
      {description && <Typography variant="small" className="text-footer-link leading-relaxed">{description}</Typography>}
      {success ? (
        <p className="text-xs text-emerald-600 mt-2 font-medium">{successMessage}</p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-2 space-y-2">
          <Input
            type="text"
            placeholder="e.g. Rahul Kumar"
            error={errors.name?.message as string}
            {...register("name")}
            suppressHydrationWarning
          />
          <Input
            type="email"
            placeholder="e.g. rahul@email.com"
            error={errors.email?.message as string}
            {...register("email")}
            suppressHydrationWarning
          />
          <Input
            type="tel"
            placeholder="e.g. +91 98765 43210"
            error={errors.mobile?.message as string}
            {...register("mobile")}
            suppressHydrationWarning
          />

          {error && <p className="text-[10px] text-rose-500 leading-relaxed font-medium">{error}</p>}

          <Button
            type="submit"
            loading={loading}
            variant="primary"
            className="w-full"
          >
            {buttonText}
          </Button>
        </form>
      )}
    </div>
  );
}
