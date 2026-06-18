export interface Team {
  sport: string;
  name: string;
  winProb: string;
  nextMatch: string;
}

export interface Prediction {
  id: string;
  matchup: string;
  sport: string;
  teamA: string;
  teamB: string;
  probA: number;
  probB: number;
  score: string;
  edgeLevel: string;
  edgeDesc: string;
  markdownAnalysis: string;
  findings: string[];
  sources?: Array<{ title: string; url: string }>;
  notes?: string;
  offensiveWeight?: number;
  defensiveWeight?: number;
  homeFieldWeight?: number;
  weatherWeight?: number;
  status?: string;
  actualScore?: string;
  actualOutcome?: string;
  review?: string;
  createdAt: string;
}

export interface Friend {
  uid?: string;
  username: string;
  status: "pending" | "accepted";
  incoming: boolean;
  level?: number;
  streak?: number;
  tier?: string;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  tier: "free" | "plus" | "pro" | "syndicate";
  xp: number;
  level: number;
  streak: number;
  initialized: boolean;
  teams: Team[];
  friends?: Friend[];
}
