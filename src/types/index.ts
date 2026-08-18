export interface Project {
  slug: string;
  index: string;
  title: string;
}

export interface ResearchEntry {
  slug: string;
  year: number;
  title: string;
}

export interface Experience {
  title: string;
  organization: string;
}

export interface CapabilityGroup {
  label: string;
  items: string[];
}

export interface NowItem {
  label: string;
  content: string;
  updatedAt: string;
}