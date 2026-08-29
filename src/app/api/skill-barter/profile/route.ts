import { NextResponse } from 'next/server';

export interface StudentProfileSkills {
  name: string;
  yearBranch: string;
  bio: string;
  canTeach: string[];
  wantsToLearn: string[];
  specialProjects: Array<{
    id: string;
    title: string;
    description: string;
  }>;
}

// Clean baseline store (starts empty for newly created accounts)
const GLOBAL_PROFILE_SKILLS: Record<string, StudentProfileSkills> = {
  default: {
    name: '',
    yearBranch: '',
    bio: '',
    canTeach: [],
    wantsToLearn: [],
    specialProjects: [],
  },
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || 'default';
    const profile = GLOBAL_PROFILE_SKILLS[userId] || {
      name: '',
      yearBranch: '',
      bio: '',
      canTeach: [],
      wantsToLearn: [],
      specialProjects: [],
    };

    return NextResponse.json({
      success: true,
      profile,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch profile skills' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      userId = 'default',
      name,
      yearBranch,
      bio,
      canTeach,
      wantsToLearn,
      specialProjects,
    } = body;

    const existing = GLOBAL_PROFILE_SKILLS[userId] || {
      name: '',
      yearBranch: '',
      bio: '',
      canTeach: [],
      wantsToLearn: [],
      specialProjects: [],
    };

    GLOBAL_PROFILE_SKILLS[userId] = {
      name: name !== undefined ? name.trim() : existing.name,
      yearBranch: yearBranch !== undefined ? yearBranch.trim() : existing.yearBranch,
      bio: bio !== undefined ? bio.trim() : existing.bio,
      canTeach: Array.isArray(canTeach)
        ? canTeach.filter((s: string) => s && s.trim().length > 0)
        : existing.canTeach,
      wantsToLearn: Array.isArray(wantsToLearn)
        ? wantsToLearn.filter((s: string) => s && s.trim().length > 0)
        : existing.wantsToLearn,
      specialProjects: Array.isArray(specialProjects)
        ? specialProjects
        : existing.specialProjects,
    };

    return NextResponse.json({
      success: true,
      profile: GLOBAL_PROFILE_SKILLS[userId],
      message: '✓ Profile details, skills and projects updated successfully!',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update profile' }, { status: 500 });
  }
}
