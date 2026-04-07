"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  BookmarkCheck,
  Camera,
  Clapperboard,
  Settings,
  Move,
  Scissors,
} from "lucide-react";
import type { ShotPlan, FormData, SavedPlan } from "@/types";

const STORAGE_KEY = "shotpilot_result";
const PLANS_KEY = "shotpilot_saved_plans";

interface ResultData {
  form: FormData;
  plan: ShotPlan;
}

export default function ResultsPage() {
  const router = useRouter();
  const [data, setData] = useState<ResultData | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      router.push("/create");
      return;
    }
    try {
      setData(JSON.parse(raw));
    } catch {
      router.push("/create");
    }
  }, [router]);

  if (!data) return null;

  const handleSave = () => {
    const existing: SavedPlan[] = JSON.parse(
      localStorage.getItem(PLANS_KEY) || "[]"
    );
    const newPlan: SavedPlan = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      deviceType: data.form.deviceType,
      brandModel: data.form.brandModel,
      purpose: data.form.purpose,
      plan: data.plan,
    };
    localStorage.setItem(PLANS_KEY, JSON.stringify([newPlan, ...existing]));
    setSaved(true);
  };

  const sections = [
    {
      icon: Camera,
      title: "Camera Angles",
      items: data.plan.cameraAngles,
    },
    {
      icon: Clapperboard,
      title: "Shot List",
      items: data.plan.shotList,
    },
    {
      icon: Move,
      title: "Movement Tips",
      items: data.plan.movementTips,
    },
    {
      icon: Scissors,
      title: "Editing Suggestions",
      items: data.plan.editingSuggestions,
    },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link
            href="/create"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight">
            Your Shot Plan
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {data.form.brandModel} &middot; {data.form.purpose} &middot;{" "}
            {data.form.skillLevel}
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saved}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm hover:bg-muted transition-colors disabled:opacity-60 disabled:cursor-default"
        >
          <BookmarkCheck className="h-4 w-4" />
          {saved ? "Saved" : "Save to Library"}
        </button>
      </div>

      {/* Settings Card */}
      <div className="rounded-xl border border-border bg-card p-5 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="h-4 w-4 text-primary" />
          <h2 className="font-medium">Camera Settings</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Frame Rate", value: data.plan.settings.fps },
            { label: "ISO", value: data.plan.settings.iso },
            { label: "Aperture", value: data.plan.settings.aperture },
            { label: "Lighting", value: data.plan.settings.lighting },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
              <p className="text-sm font-medium">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Other Sections */}
      <div className="space-y-4">
        {sections.map(({ icon: Icon, title, items }) => (
          <div
            key={title}
            className="rounded-xl border border-border bg-card p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <Icon className="h-4 w-4 text-primary" />
              <h2 className="font-medium">{title}</h2>
            </div>
            <ul className="space-y-2">
              {items.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm">
                  <span className="mt-0.5 h-5 w-5 flex-shrink-0 rounded-full bg-muted flex items-center justify-center text-xs text-muted-foreground font-medium">
                    {i + 1}
                  </span>
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-8 flex gap-3">
        <Link
          href="/create"
          className="flex-1 py-3 rounded-lg border border-border text-sm font-medium text-center hover:bg-muted transition-colors"
        >
          Generate New Plan
        </Link>
        <Link
          href="/saved"
          className="flex-1 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-medium text-center hover:opacity-90 transition-opacity"
        >
          View Library
        </Link>
      </div>
    </div>
  );
}
