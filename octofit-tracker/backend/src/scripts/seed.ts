import mongoose from 'mongoose';
import Activity from '../models/Activity.js';
import Leaderboard from '../models/Leaderboard.js';
import Team from '../models/Team.js';
import User from '../models/User.js';
import Workout from '../models/Workout.js';

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

const teams = ['Trailblazers', 'Pace Setters'];

const users = [
  { username: 'alex.runner', email: 'alex.runner@example.com', fullName: 'Alex Morgan', team: teams[0] },
  { username: 'jordan.moves', email: 'jordan.moves@example.com', fullName: 'Jordan Lee', team: teams[0] },
  { username: 'sam.cyclist', email: 'sam.cyclist@example.com', fullName: 'Sam Rivera', team: teams[1] },
  { username: 'taylor.active', email: 'taylor.active@example.com', fullName: 'Taylor Kim', team: teams[1] },
];

const activities = [
  { username: 'alex.runner', activityType: 'running', durationMinutes: 32, distanceKm: 5.2, date: '2026-11-08T08:00:00.000Z' },
  { username: 'jordan.moves', activityType: 'cycling', durationMinutes: 45, distanceKm: 14, date: '2026-11-08T09:30:00.000Z' },
  { username: 'sam.cyclist', activityType: 'walking', durationMinutes: 28, distanceKm: 2.4, date: '2026-11-07T16:00:00.000Z' },
  { username: 'taylor.active', activityType: 'strength', durationMinutes: 40, distanceKm: 0, date: '2026-11-07T17:15:00.000Z' },
] as const;

const workouts = [
  { title: 'Easy 5K Run', description: 'A relaxed run to build aerobic endurance.', activityType: 'running', durationMinutes: 35, difficulty: 'beginner' },
  { title: 'Hill Climb Intervals', description: 'Short cycling climbs with recovery between efforts.', activityType: 'cycling', durationMinutes: 40, difficulty: 'intermediate' },
  { title: 'Recovery Walk', description: 'A low-impact walk at a comfortable pace.', activityType: 'walking', durationMinutes: 25, difficulty: 'beginner' },
  { title: 'Full Body Strength', description: 'A balanced strength session for the whole body.', activityType: 'strength', durationMinutes: 45, difficulty: 'intermediate' },
] as const;

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase(): Promise<void> {
  try {
    await mongoose.connect(connectionString);

    console.log('Connected to octofit_db');

    const teamIds = new Map<string, mongoose.Types.ObjectId>();
    for (const name of teams) {
      const team = (await Team.findOne({ name })) ?? (await Team.create({ name, members: [] }));
      teamIds.set(name, team._id);
    }

    const userIds = new Map<string, mongoose.Types.ObjectId>();
    for (const user of users) {
      const teamId = teamIds.get(user.team);
      if (!teamId) {
        throw new Error(`Missing seeded team: ${user.team}`);
      }

      const savedUser =
        (await User.findOne({ username: user.username })) ??
        (await User.create({
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          team: teamId,
        }));
      userIds.set(user.username, savedUser._id);
      await Team.updateOne({ _id: teamId }, { $addToSet: { members: savedUser._id } });
    }

    for (const activity of activities) {
      const userId = userIds.get(activity.username);
      if (!userId) {
        throw new Error(`Missing seeded user: ${activity.username}`);
      }

      const date = new Date(activity.date);
      const existingActivity = await Activity.findOne({
        user: userId,
        activityType: activity.activityType,
        date,
      });
      if (!existingActivity) {
        await Activity.create({
          user: userId,
          activityType: activity.activityType,
          durationMinutes: activity.durationMinutes,
          distanceKm: activity.distanceKm,
          date,
        });
      }

      const existingEntry = await Leaderboard.findOne({ user: userId, period: '2026-11' });
      if (!existingEntry) {
        await Leaderboard.create({
          user: userId,
          points: activity.durationMinutes,
          period: '2026-11',
        });
      }
    }

    for (const workout of workouts) {
      const existingWorkout = await Workout.findOne({ title: workout.title });
      if (!existingWorkout) {
        await Workout.create(workout);
      }
    }

    const [userCount, teamCount, activityCount, leaderboardCount, workoutCount] = await Promise.all([
      User.countDocuments(),
      Team.countDocuments(),
      Activity.countDocuments(),
      Leaderboard.countDocuments(),
      Workout.countDocuments(),
    ]);

    console.log(
      `Database seeding complete: ${userCount} users, ${teamCount} teams, ${activityCount} activities, ${leaderboardCount} leaderboard entries, ${workoutCount} workouts.`,
    );
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exitCode = 1;
  } finally {
    try {
      await mongoose.disconnect();
    } catch (error) {
      console.error('Error disconnecting from octofit_db:', error);
      process.exitCode = 1;
    }
  }
}

await seedDatabase();
