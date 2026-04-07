export interface ShotPlanSettings {
  fps: string;
  iso: string;
  aperture: string;
  lighting: string;
}

export interface ShotPlan {
  cameraAngles: string[];
  shotList: string[];
  settings: ShotPlanSettings;
  movementTips: string[];
  editingSuggestions: string[];
}

export interface FormData {
  deviceType: string;
  brandModel: string;
  cameraType: string;
  shootingSituation: string;
  purpose: string;
  skillLevel: string;
}

export interface SavedPlan {
  id: string;
  createdAt: string;
  deviceType: string;
  brandModel: string;
  purpose: string;
  plan: ShotPlan;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}
