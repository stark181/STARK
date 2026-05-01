export type Category =
  | "営業・提案"
  | "人事・採用"
  | "マーケ・SNS"
  | "経営企画"
  | "総務・法務"
  | "その他";

export type Difficulty = "初級" | "中級" | "上級";

export type AiTool = "ChatGPT" | "Claude" | "Gemini" | "共通";

export type Badge = "編集部ピック" | "実績バッジ" | "人気バッジ";

export interface Variable {
  name: string;
  description: string;
  example: string;
}

export interface Review {
  id: string;
  promptId: string;
  authorRole: string;
  authorIndustry: string;
  aiTool: AiTool;
  outcome: string;
  customization: string;
  rating: number;
  helpfulCount: number;
  createdAt: string;
}

export interface Fork {
  id: string;
  parentId: string;
  title: string;
  body: string;
  diffSummary: string;
  authorRole: string;
  usageCount: number;
  createdAt: string;
}

export interface Prompt {
  id: string;
  title: string;
  category: Category;
  difficulty: Difficulty;
  aiTools: AiTool[];
  badges: Badge[];
  description: string;
  body: string;
  variables: Variable[];
  tips: string[];
  usageCount: number;
  reviews: Review[];
  forks: Fork[];
  createdAt: string;
}
