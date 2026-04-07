"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import type { FormData, ShotPlan } from "@/types";
import { sanitize } from "@/lib/utils";

const deviceTypes = ["Mobile", "DSLR", "Mirrorless"];
const purposes = ["Reel", "YouTube", "Cinematic"];
const skillLevels = ["Beginner", "Intermediate", "Advanced"];

const STORAGE_KEY = "shotpilot_result";
const PLANS_KEY = "shotpilot_saved_plans";

export default function CreatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<FormData>({
    deviceType: "",
    brandModel: "",
    cameraType: "",
    shootingSituation: "",
    purpose: "",
    skillLevel: "",
  });

  const set = (key: keyof FormData, val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const missing = Object.entries(form).find(([, v]) => !v.trim());
    if (missing) {
      setError("Please fill in all fields before generating.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deviceType: sanitize(form.deviceType),
          brandModel: sanitize(form.brandModel),
          cameraType: sanitize(form.cameraType),
          shootingSituation: sanitize(form.shootingSituation, 1000),
          purpose: sanitize(form.purpose),
          skillLevel: sanitize(form.skillLevel),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to generate shot plan.");
      }

      const plan: ShotPlan = await res.json();
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ form, plan })
      );
      router.push("/results");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight mb-1.5">
          Set Up Your Shot
        </h1>
        <p className="text-muted-foreground text-sm">
          Tell us about your camera and what you are shooting.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Device Type */}
        <div>
          <label className="block text-sm font-medium mb-2">Device Type</label>
          <div className="flex gap-2 flex-wrap">
            {deviceTypes.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => set("deviceType", d)}
                className={`px-4 py-2 rounded-lg border text-sm transition-colors ${
                  form.deviceType === d
                    ? "border-primary bg-primary/10 text-primary font-medium"
                    : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Brand & Model */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Brand &amp; Model
          </label>
          <input
            type="text"
            value={form.brandModel}
            onChange={(e) => set("brandModel", e.target.value)}
            placeholder="e.g. Sony A7IV, iPhone 15 Pro, Canon R6"
            maxLength={100}
            className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors placeholder:text-muted-foreground"
          />
        </div>

        {/* Camera Type */}
        <div>
          <label className="block text-sm font-medium mb-2">Camera Type</label>
          <input
            type="text"
            value={form.cameraType}
            onChange={(e) => set("cameraType", e.target.value)}
            placeholder="e.g. Full-frame, APS-C, Smartphone"
            maxLength={100}
            className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors placeholder:text-muted-foreground"
          />
        </div>

        {/* Shooting Situation */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Shooting Situation
          </label>
          <textarea
            value={form.shootingSituation}
            onChange={(e) => set("shootingSituation", e.target.value)}
            placeholder="Describe what you are filming — e.g. outdoor street interview, indoor product shoot, golden hour portrait"
            rows={3}
            maxLength={500}
            className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors placeholder:text-muted-foreground resize-none"
          />
        </div>

        {/* Purpose */}
        <div>
          <label className="block text-sm font-medium mb-2">Purpose</label>
          <div className="flex gap-2 flex-wrap">
            {purposes.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => set("purpose", p)}
                className={`px-4 py-2 rounded-lg border text-sm transition-colors ${
                  form.purpose === p
                    ? "border-primary bg-primary/10 text-primary font-medium"
                    : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Skill Level */}
        <div>
          <label className="block text-sm font-medium mb-2">Skill Level</label>
          <div className="flex gap-2 flex-wrap">
            {skillLevels.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => set("skillLevel", s)}
                className={`px-4 py-2 rounded-lg border text-sm transition-colors ${
                  form.skillLevel === s
                    ? "border-primary bg-primary/10 text-primary font-medium"
                    : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating your shot plan...
            </>
          ) : (
            "Generate Shot Plan"
          )}
        </button>
      </form>
    </div>
  );
}
