export interface ProjectItem {
  id: string;
  title: string;
  description: string;
}

export interface StudentProfileSkills {
  name: string;
  yearBranch: string;
  bio: string;
  canTeach: string[];
  wantsToLearn: string[];
  specialProjects: ProjectItem[];
  isPublishedInDiscover?: boolean;
  publishedAt?: string;
}

// Clean baseline store (starts empty for newly created accounts)
export const GLOBAL_PROFILE_SKILLS: Record<string, StudentProfileSkills> = {
  default: {
    name: '',
    yearBranch: '',
    bio: '',
    canTeach: [],
    wantsToLearn: [],
    specialProjects: [],
    isPublishedInDiscover: false,
  },
};
