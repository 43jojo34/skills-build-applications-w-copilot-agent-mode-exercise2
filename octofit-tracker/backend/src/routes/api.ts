import { Router } from 'express';
import mongoose from 'mongoose';
import Activity from '../models/Activity.js';
import Leaderboard from '../models/Leaderboard.js';
import Team from '../models/Team.js';
import User from '../models/User.js';
import Workout from '../models/Workout.js';

const router = Router();

router.use((_request, response, next) => {
  if (mongoose.connection.readyState !== 1) {
    response.status(503).json({ error: 'Database is unavailable' });
    return;
  }

  next();
});

router.use((request, response, next) => {
  if (
    request.method === 'POST' &&
    (typeof request.body !== 'object' || request.body === null || Array.isArray(request.body))
  ) {
    response.status(400).json({ error: 'Request body must be a JSON object' });
    return;
  }

  next();
});

router.get('/users', async (_request, response) => {
  const users = await User.find().sort({ createdAt: -1 });
  response.json(users);
});

router.post('/users', async (request, response) => {
  const user = await User.create({
    username: request.body.username,
    email: request.body.email,
    fullName: request.body.fullName,
    team: request.body.team,
  });
  response.status(201).json(user);
});

router.get('/teams', async (_request, response) => {
  const teams = await Team.find().populate('members', 'username fullName').sort({ name: 1 });
  response.json(teams);
});

router.post('/teams', async (request, response) => {
  const team = await Team.create({
    name: request.body.name,
    members: request.body.members,
  });
  response.status(201).json(team);
});

router.get('/activities', async (_request, response) => {
  const activities = await Activity.find()
    .populate('user', 'username fullName')
    .sort({ date: -1 });
  response.json(activities);
});

router.post('/activities', async (request, response) => {
  const activity = await Activity.create({
    user: request.body.user,
    activityType: request.body.activityType,
    durationMinutes: request.body.durationMinutes,
    distanceKm: request.body.distanceKm,
    date: request.body.date,
  });
  response.status(201).json(activity);
});

router.get('/leaderboard', async (_request, response) => {
  const leaderboard = await Leaderboard.find()
    .populate('user', 'username fullName')
    .sort({ period: 1, points: -1 });
  response.json(leaderboard);
});

router.post('/leaderboard', async (request, response) => {
  const entry = await Leaderboard.create({
    user: request.body.user,
    points: request.body.points,
    period: request.body.period,
  });
  response.status(201).json(entry);
});

router.get('/workouts', async (_request, response) => {
  const workouts = await Workout.find().sort({ createdAt: -1 });
  response.json(workouts);
});

router.post('/workouts', async (request, response) => {
  const workout = await Workout.create({
    title: request.body.title,
    description: request.body.description,
    activityType: request.body.activityType,
    durationMinutes: request.body.durationMinutes,
    difficulty: request.body.difficulty,
  });
  response.status(201).json(workout);
});

export default router;
