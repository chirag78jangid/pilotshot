import Link from "next/link";
import { Camera, Layers, Settings, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ShotPilot | Turn Your Camera Into a Pro Tool",
  description:
    "AI-powered video guidance based on your device. Get professional camera angles, shot lists, and settings in seconds.",
};

export default function HomePage() {
  return (
    <div className="flex flex-col items-center py-12 md:py-20">
      <div className="text-center space-y-6 mb-20 max-w-2xl">
        <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-foreground leading-tight">
          Turn Your Camera Into a Pro Tool
        </h1>
        <p className="text-lg text-muted-foreground">
          AI-powered video guidance based on your device. Stop guessing
          settings and start capturing cinematic shots in seconds.
        </p>
        <div className="pt-2">
          <Link
            href="/create"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-7 py-3 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity group"
          >
            Start Creating
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        {[
          {
            icon: Camera,
            title: "Device Specific",
            desc: "Guidance tailored exactly to your camera, lens, and skill level.",
          },
          {
            icon: Layers,
            title: "Structured Plans",
            desc: "Complete shot lists, angles, and movement tips to tell your story.",
          },
          {
            icon: Settings,
            title: "Exact Settings",
            desc: "Optimal frame rates, ISO, and aperture for your specific situation.",
          },
        ].map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="flex flex-col items-center text-center gap-3 p-6 rounded-xl bg-card border border-border"
          >
            <div className="h-11 w-11 rounded-full bg-muted flex items-center justify-center text-primary">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="font-medium">{title}</h3>
            <p className="text-sm text-muted-foreground">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
