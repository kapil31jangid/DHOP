#!/bin/sh

# Start backend NestJS server on internal port 3001
echo "Starting NestJS backend on port 3001..."
PORT=3001 node backend/dist/main.js &
BACKEND_PID=$!

# Start frontend Next.js server on Cloud Run port (defaults to 8080)
export PORT=${PORT:-8080}
export BACKEND_URL=http://localhost:3001
echo "Starting Next.js frontend on port $PORT..."
npm --prefix frontend start &
FRONTEND_PID=$!

# Monitor background processes. Exit container if either fails
while kill -0 $BACKEND_PID 2>/dev/null && kill -0 $FRONTEND_PID 2>/dev/null; do
  sleep 2
done

echo "One of the processes terminated. Exiting container."
exit 1
