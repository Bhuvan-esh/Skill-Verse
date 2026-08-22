"use client";

import { useState } from "react";
import type { ReactNode } from "react";

const formFields = [
  { label: "First Name", value: "Harshit", type: "text" },
  { label: "Last Name", value: "Sharma", type: "text" },
];

const termsText = (
  <>
    By creating an account, you agree to our{" "}
    <a
      href="/terms"
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium text-black/45 underline underline-offset-2 dark:text-white/45 hover:text-purple-300 transition-colors"
    >
      Terms and Services
    </a>{" "}
    and{" "}
    <a
      href="/privacy"
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium text-black/45 underline underline-offset-2 dark:text-white/45 hover:text-purple-300 transition-colors"
    >
      Privacy Policy
    </a>
  </>
);

export default function AuthSectionOne() {
  return (
    <section className="min-h-[580px] bg-[#040406] text-white p-6 sm:p-10 antialiased [font-synthesis:none] rounded-3xl overflow-hidden shadow-2xl border border-white/10 relative flex flex-col items-center justify-between">
      {/* EXACT DARK DOT MATRIX GRID BACKGROUND FROM ATTACHED SCREENSHOT */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* White Dot Matrix Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.22)_1px,transparent_1px)] [background-size:16px_16px]" />
        
        {/* Top Center Radial Spotlight Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.12)_0%,rgba(139,92,246,0.08)_40%,transparent_75%)] pointer-events-none" />
        
        {/* Vignette Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(4,4,6,0.85)_90%)]" />
      </div>

      <div className="relative z-10 w-full max-w-2xl mx-auto my-auto flex flex-col items-center">
        {/* Form Container Card */}
        <div className="w-full bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl">
          <div className="w-full">
            <div className="text-center">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-[42px] font-heading">
                Welcome Developer
              </h1>
              <p className="mt-2 text-sm text-slate-400 font-sans">
                Brainstorm in chat, build in cowork
              </p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <SocialButton icon={<GoogleIcon />} label="Sign up with Google" />
              <SocialButton icon={<AppleIcon />} label="Sign up with Apple" />
            </div>

            <div className="my-6 text-center text-xs font-mono-code text-slate-500">
              or
            </div>

            <form className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                {formFields.map((field) => (
                  <FieldBox
                    key={field.label}
                    label={field.label}
                    value={field.value}
                  />
                ))}
              </div>

              <FieldBox
                label="Email"
                value="harshitlog@gmail.com"
                type="email"
              />
              <FieldBox
                label="Password"
                value="*************"
                type="password"
              />

              <div className="space-y-3 pt-2 text-xs leading-5 text-slate-400">
                <CheckboxLine>
                  I don&apos;t want to receive emails about solaceui feature updates
                </CheckboxLine>
                <CheckboxLine>{termsText}</CheckboxLine>
              </div>

              <button
                type="button"
                className="mt-6 flex h-12 w-full items-center justify-center rounded-full border border-white/40 bg-white text-base font-semibold text-black transition-all hover:bg-white/90 shadow-lg shadow-white/10"
              >
                Submit
              </button>
            </form>
          </div>
        </div>

        {/* Screenshot Legal Notice at Bottom */}
        <p className="mt-8 text-[11px] text-slate-500 text-center max-w-lg leading-relaxed font-sans">
          By signing up, you agree to the{" "}
          <a href="#" className="underline text-slate-400 hover:text-white">MSA</a>,{" "}
          <a href="#" className="underline text-slate-400 hover:text-white">Product Terms</a>,{" "}
          <a href="#" className="underline text-slate-400 hover:text-white">Policies</a>,{" "}
          <a href="#" className="underline text-slate-400 hover:text-white">Privacy Notice</a>, and{" "}
          <a href="#" className="underline text-slate-400 hover:text-white">Cookie Notice</a>.
        </p>
      </div>
    </section>
  );
}

function SocialButton({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <button
      type="button"
      className="flex h-11 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 text-xs leading-none text-white transition-all hover:bg-white/10"
    >
      <span className="shrink-0">{icon}</span>
      <span className="whitespace-nowrap font-medium">{label}</span>
    </button>
  );
}

function FieldBox({
  label,
  value,
  type = "text",
}: {
  label: string;
  value: string;
  type?: string;
}) {
  const [inputValue, setInputValue] = useState(value);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <label className="flex h-12 items-center justify-between gap-4 rounded-full border border-white/15 bg-white/5 px-5 text-sm leading-none">
      <input
        type={type}
        value={inputValue}
        aria-label={label}
        onFocus={() => {
          if (!isEditing) {
            setInputValue("");
            setIsEditing(true);
          }
        }}
        onChange={(event) => {
          setInputValue(event.target.value);
          setIsEditing(true);
        }}
        className="min-w-0 flex-1 truncate bg-transparent text-white outline-none placeholder:text-slate-500 font-sans"
      />
      {!isEditing && (
        <span className="shrink-0 text-xs font-mono-code text-slate-400 uppercase tracking-wider">{label}</span>
      )}
    </label>
  );
}

function CheckboxLine({ children }: { children: ReactNode }) {
  return (
    <label className="flex items-start gap-3 cursor-pointer">
      <span className="relative mt-0.5 size-4 shrink-0">
        <input
          type="checkbox"
          className="peer size-full appearance-none rounded-[3px] border border-white/30 bg-white/5 checked:border-white checked:bg-white"
        />
        <svg
          viewBox="0 0 12 12"
          className="pointer-events-none absolute inset-0 hidden size-full p-0.5 text-black peer-checked:block"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M3 6.2 5 8.1 9 3.9"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span>{children}</span>
    </label>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84Z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z"
        fill="#EB4335"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17.05 12.54c-.03-3.02 2.47-4.47 2.58-4.54-1.41-2.06-3.6-2.34-4.38-2.37-1.86-.19-3.64 1.1-4.58 1.1-.95 0-2.42-1.07-3.98-1.04-2.05.03-3.94 1.19-4.99 3.02-2.13 3.69-.54 9.16 1.53 12.15 1.01 1.46 2.22 3.1 3.81 3.04 1.53-.06 2.11-.99 3.96-.99s2.37.99 3.99.96c1.65-.03 2.69-1.49 3.69-2.96 1.16-1.69 1.64-3.33 1.66-3.41-.04-.02-3.2-1.23-3.24-4.87ZM14.03 3.66c.84-1.02 1.41-2.43 1.25-3.84-1.21.05-2.68.81-3.55 1.83-.78.9-1.46 2.34-1.28 3.72 1.35.1 2.73-.69 3.58-1.71Z" />
    </svg>
  );
}
