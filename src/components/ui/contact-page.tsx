"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import {
  Check,
  Copy,
  LucideIcon,
  Mail,
  MapPin,
  Phone,
  LinkedinIcon,
  InstagramIcon,
} from 'lucide-react';
import { Button, ButtonProps } from '@/components/ui/button';

const APP_EMAIL = 'b.11.08.bandana@gmail.com';
const APP_PHONE = '+91 8197613412';
const APP_PHONE_2 = '+91 9110412394';
const APP_PHONE_3 = '+91 9483379575';

export function ContactPage() {
  const socialLinks = [
    {
      icon: LinkedinIcon,
      href: 'https://linkedin.com/in/sshahaider',
      label: 'LinkedIn',
    },
    {
      icon: InstagramIcon,
      href: 'https://instagram.com/sshahaider',
      label: 'Instagram',
    },
  ];

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a]/90 text-slate-100 rounded-3xl overflow-hidden border border-purple-500/20 shadow-2xl">
      <div className="mx-auto h-full max-w-6xl lg:border-x border-white/10">

        <div
          aria-hidden
          className="absolute inset-0 isolate -z-10 opacity-80 contain-strict pointer-events-none"
        >
          <div className="bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,rgba(168,85,247,0.15)_0,rgba(99,102,241,0.05)_50%,transparent_80%)] absolute top-0 left-0 h-320 w-140 -translate-y-87.5 -rotate-45 rounded-full" />
          <div className="bg-[radial-gradient(50%_50%_at_50%_50%,rgba(168,85,247,0.1)_0,transparent_80%)] absolute top-0 left-0 h-320 w-60 [translate:5%_-50%] -rotate-45 rounded-full" />
          <div className="bg-[radial-gradient(50%_50%_at_50%_50%,rgba(168,85,247,0.1)_0,transparent_80%)] absolute top-0 left-0 h-320 w-60 -translate-y-87.5 -rotate-45 rounded-full" />
        </div>

        <div className="flex grow flex-col justify-center px-6 md:px-10 pt-16 pb-12">
          <h1 className="text-4xl font-bold md:text-5xl font-heading text-white tracking-tight">
            Contact Us
          </h1>

          <p className="text-slate-400 mt-2 text-base font-sans">
            Get in touch with the Club Idea Hub support team.
          </p>
        </div>

        <BorderSeparator />

        <div className="grid md:grid-cols-3">

          <Box
            icon={Mail}
            title="Email"
            description="We respond to all emails within 24 hours."
          >
            <a
              href={`mailto:${APP_EMAIL}`}
              className="font-mono-code text-base font-medium tracking-wide hover:underline text-purple-300 hover:text-purple-200 break-all"
            >
              {APP_EMAIL}
            </a>

            <CopyButton className="size-8 ml-auto text-slate-300 hover:text-white" test={APP_EMAIL} />
          </Box>

          <Box
            icon={MapPin}
            title="Visual Architect"
            description="Dept of AI"
          >
            <span className="font-mono-code text-base font-medium tracking-wide text-purple-300">
              Dept of AI
            </span>
          </Box>

          <Box
            icon={Phone}
            title="Phone"
            description="We're available Mon-Fri, 9am-5pm."
            className="border-b-0 md:border-r-0"
          >
            <div className="flex flex-col gap-3 w-full">

              <div className="flex items-center justify-between gap-x-2">
                <a
                  href={`tel:${APP_PHONE}`}
                  className="block font-mono-code text-sm font-medium tracking-wide hover:underline text-purple-300 hover:text-purple-200"
                >
                  {APP_PHONE} <span className="text-slate-400 font-sans text-xs">(Professor)</span>
                </a>
                <CopyButton className="size-8 text-slate-300 hover:text-white" test={APP_PHONE} />
              </div>

              <div className="flex items-center justify-between gap-x-2">
                <a
                  href={`tel:${APP_PHONE_2}`}
                  className="block font-mono-code text-sm font-medium tracking-wide hover:underline text-purple-300 hover:text-purple-200"
                >
                  {APP_PHONE_2} <span className="text-slate-400 font-sans text-xs">(Student)</span>
                </a>
                <CopyButton className="size-8 text-slate-300 hover:text-white" test={APP_PHONE_2} />
              </div>

              <div className="flex items-center justify-between gap-x-2">
                <a
                  href={`tel:${APP_PHONE_3}`}
                  className="block font-mono-code text-sm font-medium tracking-wide hover:underline text-purple-300 hover:text-purple-200"
                >
                  {APP_PHONE_3} <span className="text-slate-400 font-sans text-xs">(Student)</span>
                </a>
                <CopyButton className="size-8 text-slate-300 hover:text-white" test={APP_PHONE_3} />
              </div>

            </div>
          </Box>

        </div>

        <BorderSeparator />

        <div className="relative flex h-full min-h-[280px] items-center justify-center p-8">

          <div
            className={cn(
              'z-0 absolute inset-0 size-full pointer-events-none',
              'bg-[radial-gradient(rgba(168,85,247,0.15)_1px,transparent_1px)]',
              'bg-[size:32px_32px]',
              '[mask-image:radial-gradient(ellipse_at_center,black_40%,transparent)]',
            )}
          />

          <div className="relative z-10 space-y-6 text-center">

            <h2 className="text-center text-3xl font-bold md:text-4xl font-heading text-white">
              Find us online
            </h2>

            <div className="flex flex-wrap items-center justify-center gap-4">

              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/5 hover:bg-purple-500/20 text-white flex items-center gap-x-2 rounded-full border border-white/10 px-5 py-2.5 transition-all duration-300 hover:border-purple-400/50"
                >
                  <link.icon className="size-4 text-purple-400" />

                  <span className="font-mono-code text-sm font-medium tracking-wide">
                    {link.label}
                  </span>
                </a>
              ))}

            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

function BorderSeparator() {
  return <div className="w-full h-px border-b border-white/10" />;
}

type ContactBox = React.ComponentProps<'div'> & {
  icon: LucideIcon;
  title: string;
  description: string;
};

function Box({
  title,
  description,
  className,
  children,
  ...props
}: ContactBox) {
  return (
    <div
      className={cn(
        'flex flex-col justify-between border-b md:border-r md:border-b-0 border-white/10 bg-white/[0.02]',
        className,
      )}
    >
      <div className="bg-white/5 flex items-center gap-x-3 border-b border-white/10 p-4">
        <props.icon
          className="text-purple-400 size-5"
          strokeWidth={1.5}
        />

        <h2 className="font-heading text-lg font-medium tracking-wider text-white">
          {title}
        </h2>
      </div>

      <div className="flex items-center gap-x-2 p-6 py-10 min-h-[140px]">
        {children}
      </div>

      <div className="border-t border-white/10 p-4 bg-white/[0.01]">
        <p className="text-slate-400 text-sm">
          {description}
        </p>
      </div>
    </div>
  );
}

type CopyButtonProps = ButtonProps & {
  test: string;
};

function CopyButton({
  className,
  variant = 'ghost',
  size = 'icon',
  test,
  ...props
}: CopyButtonProps) {
  const [copied, setCopied] = React.useState<boolean>(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(test);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={cn('disabled:opacity-100 relative', className)}
      onClick={handleCopy}
      aria-label={copied ? 'Copied' : 'Copy to clipboard'}
      disabled={copied || props.disabled}
      {...props}
    >
      <div
        className={cn(
          'transition-all',
          copied ? 'scale-100 opacity-100' : 'scale-0 opacity-0',
        )}
      >
        <Check
          className="size-4 stroke-emerald-400"
          aria-hidden="true"
        />
      </div>

      <div
        className={cn(
          'absolute transition-all',
          copied ? 'scale-0 opacity-0' : 'scale-100 opacity-100',
        )}
      >
        <Copy aria-hidden="true" className="size-4" />
      </div>
    </Button>
  );
}
