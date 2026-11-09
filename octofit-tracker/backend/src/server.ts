import express from 'express';
import mongoose from 'mongoose';
import database from './config/database.js';
import apiRouter from './routes/api.js';

const app = express();
const port = Number(process.env.PORT) || 8000;
const codespaceName = process.env.CODESPACE_NAME;
const baseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : `http://localhost:${port}`;

app.use(express.json());

app.get('/api/health', (_request, response) => {
  response.json({
    status: 'ok',
    database: database.readyState === 1 ? 'connected' : 'disconnected',
  });
});

app.use('/api', apiRouter);

app.use((_request, response) => {
  response.status(404).json({ error: 'Not found' });
});

app.use(
  (
    error: unknown,
    _request: express.Request,
    response: express.Response,
    _next: express.NextFunction,
  ) => {
    if (error instanceof Error) {
      console.error('API request failed:', error.message);
    } else {
      console.error('API request failed:', error);
    }

    if (error instanceof mongoose.Error.ValidationError || error instanceof mongoose.Error.CastError) {
      response.status(400).json({ error: error.message });
      return;
    }

    if (
      error instanceof SyntaxError &&
      'status' in error &&
      error.status === 400
    ) {
      response.status(400).json({ error: 'Invalid JSON request body' });
      return;
    }

    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 11000
    ) {
      response.status(409).json({ error: 'A record with that unique value already exists' });
      return;
    }

    response.status(500).json({ error: 'Internal server error' });
  },
);

app.listen(port, () => {
  console.log(`OctoFit API listening at ${baseUrl}`);
});