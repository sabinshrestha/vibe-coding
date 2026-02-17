import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create roles
  const adminRole = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: { name: 'ADMIN' },
  });

  const coachRole = await prisma.role.upsert({
    where: { name: 'COACH' },
    update: {},
    create: { name: 'COACH' },
  });

  const athleteRole = await prisma.role.upsert({
    where: { name: 'ATHLETE' },
    update: {},
    create: { name: 'ATHLETE' },
  });

  console.log('✓ Roles created');

  // Create demo users
  const hashedPassword = await argon2.hash('password123');

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@workout.com' },
    update: {},
    create: {
      email: 'admin@workout.com',
      password: hashedPassword,
      name: 'Admin User',
      roles: {
        create: [{ roleId: adminRole.id }],
      },
      profile: {
        create: {
          units: 'IMPERIAL',
          experienceLevel: 'ADVANCED',
          height: 72,
          weight: 185,
          goals: 'Build strength and muscle mass',
        },
      },
    },
  });

  const athleteUser = await prisma.user.upsert({
    where: { email: 'athlete@workout.com' },
    update: {},
    create: {
      email: 'athlete@workout.com',
      password: hashedPassword,
      name: 'John Athlete',
      roles: {
        create: [{ roleId: athleteRole.id }],
      },
      profile: {
        create: {
          units: 'IMPERIAL',
          experienceLevel: 'INTERMEDIATE',
          height: 70,
          weight: 175,
          goals: 'Progressive overload for muscle hypertrophy',
        },
      },
    },
  });

  console.log('✓ Demo users created (admin@workout.com / athlete@workout.com, password: password123)');

  // Create exercises
  const exercises = [
    // Push exercises
    {
      name: 'Barbell Bench Press',
      description: 'Classic compound chest exercise',
      instructions: '1. Lie flat on bench\n2. Grip bar slightly wider than shoulders\n3. Lower to chest\n4. Press up explosively',
      muscleGroups: ['CHEST', 'TRICEPS', 'SHOULDERS'],
      equipment: ['BARBELL'],
      isGlobal: true,
      isApproved: true,
    },
    {
      name: 'Overhead Press',
      description: 'Primary shoulder developer',
      instructions: '1. Stand with barbell at shoulders\n2. Press overhead\n3. Lock out arms\n4. Lower with control',
      muscleGroups: ['SHOULDERS', 'TRICEPS'],
      equipment: ['BARBELL'],
      isGlobal: true,
      isApproved: true,
    },
    {
      name: 'Incline Dumbbell Press',
      description: 'Upper chest focus',
      muscleGroups: ['CHEST', 'SHOULDERS', 'TRICEPS'],
      equipment: ['DUMBBELL'],
      isGlobal: true,
      isApproved: true,
    },
    {
      name: 'Lateral Raise',
      description: 'Shoulder isolation',
      muscleGroups: ['SHOULDERS'],
      equipment: ['DUMBBELL'],
      isGlobal: true,
      isApproved: true,
    },
    {
      name: 'Tricep Dips',
      description: 'Tricep mass builder',
      muscleGroups: ['TRICEPS', 'CHEST'],
      equipment: ['BODYWEIGHT'],
      isGlobal: true,
      isApproved: true,
    },
    // Pull exercises
    {
      name: 'Deadlift',
      description: 'King of back exercises',
      instructions: '1. Stand with bar over mid-foot\n2. Grip bar\n3. Brace core\n4. Pull bar up legs\n5. Lock out at top',
      muscleGroups: ['BACK', 'HAMSTRINGS', 'GLUTES'],
      equipment: ['BARBELL'],
      isGlobal: true,
      isApproved: true,
    },
    {
      name: 'Pull-ups',
      description: 'Essential back developer',
      muscleGroups: ['BACK', 'BICEPS'],
      equipment: ['BODYWEIGHT'],
      isGlobal: true,
      isApproved: true,
    },
    {
      name: 'Barbell Row',
      description: 'Back thickness',
      muscleGroups: ['BACK', 'BICEPS'],
      equipment: ['BARBELL'],
      isGlobal: true,
      isApproved: true,
    },
    {
      name: 'Face Pulls',
      description: 'Rear delt and upper back',
      muscleGroups: ['SHOULDERS', 'BACK'],
      equipment: ['CABLE'],
      isGlobal: true,
      isApproved: true,
    },
    {
      name: 'Barbell Curl',
      description: 'Bicep mass builder',
      muscleGroups: ['BICEPS'],
      equipment: ['BARBELL'],
      isGlobal: true,
      isApproved: true,
    },
    // Leg exercises
    {
      name: 'Squat',
      description: 'King of leg exercises',
      instructions: '1. Bar on upper back\n2. Feet shoulder width\n3. Descend to parallel\n4. Drive through heels',
      muscleGroups: ['QUADS', 'GLUTES', 'HAMSTRINGS'],
      equipment: ['BARBELL'],
      isGlobal: true,
      isApproved: true,
    },
    {
      name: 'Romanian Deadlift',
      description: 'Hamstring developer',
      muscleGroups: ['HAMSTRINGS', 'GLUTES', 'BACK'],
      equipment: ['BARBELL'],
      isGlobal: true,
      isApproved: true,
    },
    {
      name: 'Leg Press',
      description: 'Quad mass builder',
      muscleGroups: ['QUADS', 'GLUTES'],
      equipment: ['MACHINE'],
      isGlobal: true,
      isApproved: true,
    },
    {
      name: 'Leg Curl',
      description: 'Hamstring isolation',
      muscleGroups: ['HAMSTRINGS'],
      equipment: ['MACHINE'],
      isGlobal: true,
      isApproved: true,
    },
    {
      name: 'Calf Raise',
      description: 'Calf developer',
      muscleGroups: ['CALVES'],
      equipment: ['MACHINE'],
      isGlobal: true,
      isApproved: true,
    },
  ];

  const createdExercises = await Promise.all(
    exercises.map((ex) =>
      prisma.exercise.upsert({
        where: { id: ex.name.toLowerCase().replace(/\s+/g, '-') },
        update: {},
        create: {
          id: ex.name.toLowerCase().replace(/\s+/g, '-'),
          ...ex,
          createdById: adminUser.id,
        },
      })
    )
  );

  console.log(`✓ ${createdExercises.length} exercises created`);

  // Create workout templates
  const pushTemplate = await prisma.workoutTemplate.create({
    data: {
      name: 'Push Workout',
      description: 'Chest, shoulders, and triceps',
      createdById: athleteUser.id,
      exercises: {
        create: [
          {
            exerciseId: 'barbell-bench-press',
            order: 0,
            sets: {
              create: [
                { setNumber: 1, targetReps: 5, targetWeight: 185, restTime: 180 },
                { setNumber: 2, targetReps: 5, targetWeight: 185, restTime: 180 },
                { setNumber: 3, targetReps: 5, targetWeight: 185, restTime: 180 },
                { setNumber: 4, targetReps: 5, targetWeight: 185, restTime: 180 },
              ],
            },
          },
          {
            exerciseId: 'overhead-press',
            order: 1,
            sets: {
              create: [
                { setNumber: 1, targetReps: 8, targetWeight: 115, restTime: 120 },
                { setNumber: 2, targetReps: 8, targetWeight: 115, restTime: 120 },
                { setNumber: 3, targetReps: 8, targetWeight: 115, restTime: 120 },
              ],
            },
          },
          {
            exerciseId: 'incline-dumbbell-press',
            order: 2,
            sets: {
              create: [
                { setNumber: 1, targetReps: 10, targetWeight: 65, restTime: 90 },
                { setNumber: 2, targetReps: 10, targetWeight: 65, restTime: 90 },
                { setNumber: 3, targetReps: 10, targetWeight: 65, restTime: 90 },
              ],
            },
          },
          {
            exerciseId: 'lateral-raise',
            order: 3,
            sets: {
              create: [
                { setNumber: 1, targetReps: 12, targetWeight: 25, restTime: 60, groupId: 'superset-1' },
                { setNumber: 2, targetReps: 12, targetWeight: 25, restTime: 60, groupId: 'superset-1' },
                { setNumber: 3, targetReps: 12, targetWeight: 25, restTime: 60, groupId: 'superset-1' },
              ],
            },
          },
          {
            exerciseId: 'tricep-dips',
            order: 4,
            sets: {
              create: [
                { setNumber: 1, targetReps: 12, restTime: 60, groupId: 'superset-1' },
                { setNumber: 2, targetReps: 12, restTime: 60, groupId: 'superset-1' },
                { setNumber: 3, targetReps: 12, restTime: 60, groupId: 'superset-1' },
              ],
            },
          },
        ],
      },
    },
  });

  const pullTemplate = await prisma.workoutTemplate.create({
    data: {
      name: 'Pull Workout',
      description: 'Back and biceps',
      createdById: athleteUser.id,
      exercises: {
        create: [
          {
            exerciseId: 'deadlift',
            order: 0,
            sets: {
              create: [
                { setNumber: 1, targetReps: 5, targetWeight: 275, restTime: 240 },
                { setNumber: 2, targetReps: 5, targetWeight: 275, restTime: 240 },
                { setNumber: 3, targetReps: 5, targetWeight: 275, restTime: 240 },
              ],
            },
          },
          {
            exerciseId: 'pull-ups',
            order: 1,
            sets: {
              create: [
                { setNumber: 1, targetReps: 8, restTime: 120 },
                { setNumber: 2, targetReps: 8, restTime: 120 },
                { setNumber: 3, targetReps: 8, restTime: 120 },
                { setNumber: 4, targetReps: 8, restTime: 120 },
              ],
            },
          },
          {
            exerciseId: 'barbell-row',
            order: 2,
            sets: {
              create: [
                { setNumber: 1, targetReps: 10, targetWeight: 155, restTime: 90 },
                { setNumber: 2, targetReps: 10, targetWeight: 155, restTime: 90 },
                { setNumber: 3, targetReps: 10, targetWeight: 155, restTime: 90 },
              ],
            },
          },
          {
            exerciseId: 'face-pulls',
            order: 3,
            sets: {
              create: [
                { setNumber: 1, targetReps: 15, targetWeight: 50, restTime: 60, groupId: 'superset-2' },
                { setNumber: 2, targetReps: 15, targetWeight: 50, restTime: 60, groupId: 'superset-2' },
                { setNumber: 3, targetReps: 15, targetWeight: 50, restTime: 60, groupId: 'superset-2' },
              ],
            },
          },
          {
            exerciseId: 'barbell-curl',
            order: 4,
            sets: {
              create: [
                { setNumber: 1, targetReps: 12, targetWeight: 75, restTime: 60, groupId: 'superset-2' },
                { setNumber: 2, targetReps: 12, targetWeight: 75, restTime: 60, groupId: 'superset-2' },
                { setNumber: 3, targetReps: 12, targetWeight: 75, restTime: 60, groupId: 'superset-2' },
              ],
            },
          },
        ],
      },
    },
  });

  const legTemplate = await prisma.workoutTemplate.create({
    data: {
      name: 'Leg Workout',
      description: 'Quads, hamstrings, and calves',
      createdById: athleteUser.id,
      exercises: {
        create: [
          {
            exerciseId: 'squat',
            order: 0,
            sets: {
              create: [
                { setNumber: 1, targetReps: 5, targetWeight: 225, restTime: 240 },
                { setNumber: 2, targetReps: 5, targetWeight: 225, restTime: 240 },
                { setNumber: 3, targetReps: 5, targetWeight: 225, restTime: 240 },
                { setNumber: 4, targetReps: 5, targetWeight: 225, restTime: 240 },
              ],
            },
          },
          {
            exerciseId: 'romanian-deadlift',
            order: 1,
            sets: {
              create: [
                { setNumber: 1, targetReps: 10, targetWeight: 185, restTime: 120 },
                { setNumber: 2, targetReps: 10, targetWeight: 185, restTime: 120 },
                { setNumber: 3, targetReps: 10, targetWeight: 185, restTime: 120 },
              ],
            },
          },
          {
            exerciseId: 'leg-press',
            order: 2,
            sets: {
              create: [
                { setNumber: 1, targetReps: 12, targetWeight: 360, restTime: 90 },
                { setNumber: 2, targetReps: 12, targetWeight: 360, restTime: 90 },
                { setNumber: 3, targetReps: 12, targetWeight: 360, restTime: 90 },
              ],
            },
          },
          {
            exerciseId: 'leg-curl',
            order: 3,
            sets: {
              create: [
                { setNumber: 1, targetReps: 12, targetWeight: 90, restTime: 60 },
                { setNumber: 2, targetReps: 12, targetWeight: 90, restTime: 60 },
                { setNumber: 3, targetReps: 12, targetWeight: 90, restTime: 60 },
              ],
            },
          },
          {
            exerciseId: 'calf-raise',
            order: 4,
            sets: {
              create: [
                { setNumber: 1, targetReps: 15, targetWeight: 135, restTime: 60 },
                { setNumber: 2, targetReps: 15, targetWeight: 135, restTime: 60 },
                { setNumber: 3, targetReps: 15, targetWeight: 135, restTime: 60 },
              ],
            },
          },
        ],
      },
    },
  });

  console.log('✓ Workout templates created (Push, Pull, Legs)');

  // Create calendar entries for the next 4 weeks (Wed/Thu/Fri workouts, Mon/Tue cardio)
  const today = new Date();
  const calendarEntries = [];

  for (let week = 0; week < 4; week++) {
    // Monday - Light cardio
    const monday = new Date(today);
    monday.setDate(today.getDate() + week * 7 + (1 - today.getDay()));
    calendarEntries.push({
      userId: athleteUser.id,
      date: monday,
      type: 'cardio',
      title: 'Light Cardio',
      notes: '20-30 min easy pace',
    });

    // Tuesday - Light cardio
    const tuesday = new Date(monday);
    tuesday.setDate(monday.getDate() + 1);
    calendarEntries.push({
      userId: athleteUser.id,
      date: tuesday,
      type: 'cardio',
      title: 'Light Cardio',
      notes: '20-30 min easy pace',
    });

    // Wednesday - Push
    const wednesday = new Date(monday);
    wednesday.setDate(monday.getDate() + 2);
    calendarEntries.push({
      userId: athleteUser.id,
      date: wednesday,
      type: 'workout',
      templateId: pushTemplate.id,
    });

    // Thursday - Pull
    const thursday = new Date(monday);
    thursday.setDate(monday.getDate() + 3);
    calendarEntries.push({
      userId: athleteUser.id,
      date: thursday,
      type: 'workout',
      templateId: pullTemplate.id,
    });

    // Friday - Legs
    const friday = new Date(monday);
    friday.setDate(monday.getDate() + 4);
    calendarEntries.push({
      userId: athleteUser.id,
      date: friday,
      type: 'workout',
      templateId: legTemplate.id,
    });

    // Sunday - Rest
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    calendarEntries.push({
      userId: athleteUser.id,
      date: sunday,
      type: 'rest',
      title: 'Rest Day',
      notes: 'Recovery and mobility work',
    });
  }

  await prisma.calendarEntry.createMany({
    data: calendarEntries,
  });

  console.log(`✓ ${calendarEntries.length} calendar entries created for next 4 weeks`);

  // Create a sample completed session
  const completedSession = await prisma.workoutSession.create({
    data: {
      userId: athleteUser.id,
      templateId: pushTemplate.id,
      startedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 3600 * 1000),
      duration: 3600,
      isCompleted: true,
      notes: 'Great session, felt strong!',
      exercises: {
        create: [
          {
            exerciseId: 'barbell-bench-press',
            order: 0,
            sets: {
              create: [
                {
                  setNumber: 1,
                  actualReps: 5,
                  actualWeight: 185,
                  volume: 925,
                  estimated1RM: 216,
                  isPR: false,
                },
                {
                  setNumber: 2,
                  actualReps: 5,
                  actualWeight: 185,
                  volume: 925,
                  estimated1RM: 216,
                  isPR: false,
                },
                {
                  setNumber: 3,
                  actualReps: 6,
                  actualWeight: 185,
                  volume: 1110,
                  estimated1RM: 222,
                  isPR: true,
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log('✓ Sample completed session created');

  // Create body metrics
  const bodyMetrics = [];
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (30 - i));
    bodyMetrics.push({
      userId: athleteUser.id,
      date,
      weight: 175 + Math.random() * 2 - 1, // Weight fluctuation
    });
  }

  await prisma.bodyMetric.createMany({
    data: bodyMetrics,
  });

  console.log('✓ Body metrics created');

  console.log('\n🎉 Seed completed successfully!');
  console.log('\n📝 Test credentials:');
  console.log('   Admin: admin@workout.com / password123');
  console.log('   Athlete: athlete@workout.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
