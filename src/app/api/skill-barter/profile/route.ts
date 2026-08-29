import { NextResponse } from 'next/server';
import { GLOBAL_PROFILE_SKILLS, StudentProfileSkills } from '@/lib/profileSkillsStore';

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
      isPublishedInDiscover: false,
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
      isPublishedInDiscover,
    } = body;

    const existing = GLOBAL_PROFILE_SKILLS[userId] || {
      name: '',
      yearBranch: '',
      bio: '',
      canTeach: [],
      wantsToLearn: [],
      specialProjects: [],
      isPublishedInDiscover: false,
    };

    const targetCanTeach = Array.isArray(canTeach)
      ? canTeach.filter((s: string) => s && s.trim().length > 0)
      : existing.canTeach;

    const targetWantsToLearn = Array.isArray(wantsToLearn)
      ? wantsToLearn.filter((s: string) => s && s.trim().length > 0)
      : existing.wantsToLearn;

    const targetSpecialProjects = Array.isArray(specialProjects)
      ? specialProjects
      : existing.specialProjects;

    // Strict validation when publishing to Discover Peers
    if (isPublishedInDiscover === true) {
      const missing: string[] = [];
      if (!targetCanTeach || targetCanTeach.length === 0) missing.push('Can Guide (Expertise)');
      if (!targetWantsToLearn || targetWantsToLearn.length === 0) missing.push('Eager to Learn (Goals)');
      if (!targetSpecialProjects || targetSpecialProjects.length === 0) missing.push('Special Skills & Projects');

      if (missing.length > 0) {
        return NextResponse.json(
          {
            error: `Compulsory requirement: Please fill in ${missing.join(', ')} before publishing to Discover Peers.`,
            missing,
          },
          { status: 400 }
        );
      }
    }

    GLOBAL_PROFILE_SKILLS[userId] = {
      name: name !== undefined ? name.trim() : existing.name,
      yearBranch: yearBranch !== undefined ? yearBranch.trim() : existing.yearBranch,
      bio: bio !== undefined ? bio.trim() : existing.bio,
      canTeach: targetCanTeach,
      wantsToLearn: targetWantsToLearn,
      specialProjects: targetSpecialProjects,
      isPublishedInDiscover: isPublishedInDiscover !== undefined
        ? Boolean(isPublishedInDiscover)
        : existing.isPublishedInDiscover,
      publishedAt: isPublishedInDiscover
        ? (existing.publishedAt || new Date().toISOString())
        : existing.publishedAt,
    };

    const isPublished = GLOBAL_PROFILE_SKILLS[userId].isPublishedInDiscover;

    return NextResponse.json({
      success: true,
      profile: GLOBAL_PROFILE_SKILLS[userId],
      message: isPublished !== existing.isPublishedInDiscover
        ? (isPublished ? '✓ Profile published to Discover Peers directory! Visible to all students in Skillora.' : '✓ Profile removed from Discover Peers directory.')
        : '✓ Profile details, skills and projects updated successfully!',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update profile' }, { status: 500 });
  }
}
