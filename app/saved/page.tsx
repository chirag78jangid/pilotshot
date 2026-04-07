"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Trash2, Camera, ArrowRight } from "lucide-react";
import type { SavedPlan } from "@/types";

const PLANS_KEY = "shotpilot_saved_plans";

export default function SavedPage() {
  const [plans, setPlans] = useState<SavedPlan[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem(PLANS_KEY);
      setPlans(raw ? JSON.parse(raw) : []);
    } catch {
      setPlans([]);
    }
  }, []);

  const handleDelete = (id: string) => {
    const updated = plans.filter((p) => p.id !== id);
    setPlans(updated);
    localStorage.setItem(PLANS_KEY, JSON.stringify(updated));
  };

  const handleView = (plan: SavedPlan) => {
    localStorage.setItem(
      "shotpilot_result",
      JSON.stringify({
        form: {
          deviceType: plan.deviceType,
          brandModel: plan.brandModel,
          purpose: plan.purpose,
          cameraType: "",
          shootingSituation: "",
          skillLevel: "",
        },
        plan: plan.plan,
      })
    );
  };

  if (!mounted) return null;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight mb-1.5">
          Saved Plans
        </h1>
        <p className="text-sm text-muted-foreground">
          Your library of saved shot plans.
        </p>
      </div>

      {plans.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-20 border border-border rounded-xl bg-card">
          <Camera className="h-10 w-10 text-muted-foreground mb-4 opacity-40" />
          <p className="font-medium mb-1">No saved plans yet</p>
          <p className="text-sm text-muted-foreground mb-6">
            Generate a shot plan and save it to your library.
          </p>
          <Link
            href="/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Create a Plan
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="flex items-center justify-between gap-4 p-4 rounded-xl border border-border bg-card hover:bg-muted/30 transition-colors"
            >
              <div className="min-w-0">
                <p className="font-medium text-sm truncate">
                  {plan.brandModel || plan.deviceType}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {plan.purpose} &middot;{" "}
                  {new Date(plan.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Link
                  href="/results"
                  onClick={() => handleView(plan)}
                  className="px-3 py-1.5 rounded-lg border border-border text-xs font-medium hover:bg-muted transition-colors"
                >
                  View
                </Link>
                <button
                  onClick={() => handleDelete(plan.id)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                  aria-label="Delete plan"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
