import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Seed Preloaded USNs (Whitelist)
  const preloadedList = [
    { usn: '1MS21CS001', college_email: 'alex.student@college.edu', student_name: 'Alex Johnson' },
    { usn: '1MS21CS002', college_email: 'prior.student@college.edu', student_name: 'Prior Smith' },
    { usn: '1MS21CS003', college_email: 'carol.student@college.edu', student_name: 'Carol Davis' },
    { usn: '1MS21CS004', college_email: 'david.student@college.edu', student_name: 'David Wilson' },
    { usn: '1MS21CS005', college_email: 'emma.student@college.edu', student_name: 'Emma Brown' },
    { usn: '1MS21CS006', college_email: 'frank.student@college.edu', student_name: 'Frank Miller' },
    { usn: '1MS21CS007', college_email: 'grace.student@college.edu', student_name: 'Grace Taylor' },
    { usn: '1MS21CS008', college_email: 'hannah.student@college.edu', student_name: 'Hannah Anderson' },
    { usn: '1MS21CS009', college_email: 'ian.student@college.edu', student_name: 'Ian Thomas' },
    { usn: '1MS21CS010', college_email: 'julia.student@college.edu', student_name: 'Julia Jackson' },
  ];

  for (const item of preloadedList) {
    await prisma.preloadedUSN.upsert({
      where: { usn: item.usn },
      update: { college_email: item.college_email, student_name: item.student_name },
      create: item,
    });
  }
  console.log('✅ Preloaded 10 USNs into whitelist.');

  // 2. Seed 7 Fixed Founder Accounts
  const founderPasswordHash = await bcrypt.hash('founderpass123', 10);
  const founders = [
    { name: 'Founder One', email: 'founder1@club.edu' },
    { name: 'Founder Two', email: 'founder2@club.edu' },
    { name: 'Founder Three', email: 'founder3@club.edu' },
    { name: 'Founder Four', email: 'founder4@club.edu' },
    { name: 'Founder Five', email: 'founder5@club.edu' },
    { name: 'Founder Six', email: 'founder6@club.edu' },
    { name: 'Founder Seven', email: 'founder7@club.edu' },
  ];

  const createdFounders = [];
  for (const f of founders) {
    const founder = await prisma.user.upsert({
      where: { college_email: f.email },
      update: { role: 'FOUNDER' },
      create: {
        name: f.name,
        role: 'FOUNDER',
        college_email: f.email,
        password_hash: founderPasswordHash,
        is_preloaded: true,
      },
    });
    createdFounders.push(founder);
  }
  console.log('✅ Seeded 7 Fixed Founder accounts.');

  // 3. Seed Students (Alex and Prior)
  const alex = await prisma.user.upsert({
    where: { college_email: 'alex.student@college.edu' },
    update: {},
    create: {
      name: 'Alex Johnson',
      role: 'STUDENT',
      usn: '1MS21CS001',
      college_email: 'alex.student@college.edu',
      is_preloaded: true,
    },
  });

  const prior = await prisma.user.upsert({
    where: { college_email: 'prior.student@college.edu' },
    update: {},
    create: {
      name: 'Prior Smith',
      role: 'STUDENT',
      usn: '1MS21CS002',
      college_email: 'prior.student@college.edu',
      is_preloaded: true,
    },
  });

  // Mark USNs as used
  await prisma.preloadedUSN.update({ where: { usn: '1MS21CS001' }, data: { used: true } });
  await prisma.preloadedUSN.update({ where: { usn: '1MS21CS002' }, data: { used: true } });

  // Initialize Student Credits
  await prisma.studentCredit.upsert({
    where: { student_id: alex.id },
    update: {},
    create: { student_id: alex.id, domain_1: 25, domain_2: 10, domain_3: 15, domain_4: 5 },
  });

  await prisma.studentCredit.upsert({
    where: { student_id: prior.id },
    update: {},
    create: { student_id: prior.id, domain_1: 18, domain_2: 12, domain_3: 8, domain_4: 20 },
  });

  // Initialize Mentor Profiles
  await prisma.mentorProfile.upsert({
    where: { student_id: alex.id },
    update: {},
    create: {
      student_id: alex.id,
      domain: 'DOMAIN_1',
      credits: 25,
      topics_taught: JSON.stringify(['Python Basics', 'Algorithms', 'Data Structures']),
    },
  });

  await prisma.mentorProfile.upsert({
    where: { student_id: prior.id },
    update: {},
    create: {
      student_id: prior.id,
      domain: 'DOMAIN_4',
      credits: 20,
      topics_taught: JSON.stringify(['Web Development', 'React', 'CSS Flexbox']),
    },
  });
  console.log('✅ Seeded student accounts & initial credit balances.');

  // 4. Seed Volunteer, Visual Architect & Mentor Accounts
  const volunteerPasswordHash = await bcrypt.hash('volunteerpass123', 10);
  await prisma.user.upsert({
    where: { college_email: 'volunteer1@club.edu' },
    update: {},
    create: {
      name: 'John Volunteer',
      role: 'VOLUNTEER',
      college_email: 'volunteer1@club.edu',
      password_hash: volunteerPasswordHash,
    },
  });

  await prisma.user.upsert({
    where: { college_email: 'architect@club.edu' },
    update: {},
    create: {
      name: 'Visual Architect',
      role: 'VOLUNTEER',
      college_email: 'architect@club.edu',
      password_hash: volunteerPasswordHash,
    },
  });

  await prisma.user.upsert({
    where: { college_email: 'mentor@club.edu' },
    update: {},
    create: {
      name: 'Club Mentor',
      role: 'VOLUNTEER',
      college_email: 'mentor@club.edu',
      password_hash: volunteerPasswordHash,
    },
  });
  console.log('✅ Seeded Volunteer, Architect & Mentor accounts.');

  // 5. Seed Private Idea Channels for Students
  const alexChannel = await prisma.ideaChannel.upsert({
    where: { student_id: alex.id },
    update: {},
    create: { student_id: alex.id },
  });

  await prisma.ideaChannel.upsert({
    where: { student_id: prior.id },
    update: {},
    create: { student_id: prior.id },
  });

  // Sample Idea Message
  await prisma.ideaMessage.create({
    data: {
      channel_id: alexChannel.id,
      sender_id: alex.id,
      text: 'Hello Founders, I have an idea for a dynamic soft-skill debate competition with instant peer feedback.',
    },
  });

  // 6. Seed Sample Ideas
  const sampleIdea = await prisma.idea.create({
    data: {
      student_id: alex.id,
      title: 'AI Code Review Hackathon',
      description: 'A contest where students build dynamic prompts and agents to perform automated security audits.',
      category: 'Skill League',
      lecture_id: 'CS-Lec-4',
      status: 'APPROVED',
    },
  });

  // Single Founder Approval for Sample Idea
  await prisma.ideaApproval.create({
    data: {
      idea_id: sampleIdea.id,
      founder_id: createdFounders[0].id,
      decision: 'APPROVE',
      reason: 'Great idea with high student engagement potential.',
    },
  });

  console.log('✅ Seeded Idea Hub & private channels.');

  // 7. Seed Sample Competitions
  const comp1 = await prisma.competition.create({
    data: {
      name: 'AI Prompt Engineering Arena',
      description: 'Test your generative AI skills in a timed prompt battle.',
      domain: 'DOMAIN_1',
      credit_value: 10,
      type: 'SCORED',
      volunteer_access: 'OPEN',
      source: 'IDEA_HUB',
      origin_idea_id: sampleIdea.id,
      event_date: new Date(Date.now() + 86400000 * 3), // 3 days in future
      status: 'ACTIVE',
    },
  });

  const comp2 = await prisma.competition.create({
    data: {
      name: 'Weekly Tech Showcase & Demo',
      description: 'Display-only exhibition of student projects.',
      domain: 'DOMAIN_2',
      credit_value: 0,
      type: 'DISPLAY_ONLY',
      volunteer_access: 'CLOSED',
      source: 'FOUNDERS',
      event_date: new Date(Date.now() + 86400000 * 5),
      status: 'UPCOMING',
    },
  });

  // Register Students for Competition 1
  await prisma.registration.create({
    data: { student_id: alex.id, competition_id: comp1.id },
  });

  await prisma.registration.create({
    data: { student_id: prior.id, competition_id: comp1.id },
  });

  // Seed Tasks under Competition 1
  await prisma.task.createMany({
    data: [
      { competition_id: comp1.id, description: 'Post buggy code snippet 1 for Round A', status: 'OPEN' },
      { competition_id: comp1.id, description: 'Prepare leaderboard screen before final round', status: 'OPEN' },
      { competition_id: comp1.id, description: 'Verify participant registration badges at entrance', status: 'OPEN' },
    ],
  });

  console.log('✅ Seeded Competitions, Registrations, and Tasks.');
  console.log('🚀 Database seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
