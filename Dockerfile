# ==========================================
# 1. BUILD STAGE
# ==========================================
FROM node:22-alpine AS builder
WORKDIR /app

# Copy package configurations and lockfiles
COPY backend/package*.json ./backend/
COPY frontend/package*.json frontend/package-lock.json* frontend/pnpm-lock.yaml* ./frontend/

# Install dependencies
RUN cd backend && npm install
RUN cd frontend && npm install

# Copy full source
COPY . .

# Build Backend
RUN cd backend && npm run build

# Build Frontend
# We inject build-time environment variables for Next.js build
ARG NEXT_PUBLIC_SUPABASE_URL=https://omwilfpelaqzglrkialx.supabase.co
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_AgroW2Qh5yXu62AgU-GpVA_SgUm6FA2
ARG NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCfwavZqb3U053hszTcjqfbxmfB8ADwDJE
ARG NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=cure-sync.firebaseapp.com
ARG NEXT_PUBLIC_FIREBASE_PROJECT_ID=cure-sync
ARG NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=cure-sync.firebasestorage.app
ARG NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1050302981057
ARG NEXT_PUBLIC_FIREBASE_APP_ID=1:1050302981057:web:e3dc364da4747e1a988540

ENV NEXT_PUBLIC_API_URL=/api/v1 \
    NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL \
    NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY \
    NEXT_PUBLIC_FIREBASE_API_KEY=$NEXT_PUBLIC_FIREBASE_API_KEY \
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=$NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN \
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=$NEXT_PUBLIC_FIREBASE_PROJECT_ID \
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=$NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET \
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=$NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID \
    NEXT_PUBLIC_FIREBASE_APP_ID=$NEXT_PUBLIC_FIREBASE_APP_ID

RUN cd frontend && npm run build

# ==========================================
# 2. RUNTIME STAGE
# ==========================================
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy built backend files and dependencies
COPY --from=builder /app/backend/package*.json ./backend/
COPY --from=builder /app/backend/dist ./backend/dist
RUN cd backend && npm install --omit=dev

# Copy built frontend files and dependencies
COPY --from=builder /app/frontend/package*.json ./frontend/
COPY --from=builder /app/frontend/.next ./frontend/.next
COPY --from=builder /app/frontend/public ./frontend/public
RUN cd frontend && npm install --omit=dev

# Copy and setup entrypoint script
COPY entrypoint.sh ./
RUN chmod +x entrypoint.sh

# Expose default Cloud Run port
EXPOSE 8080

ENTRYPOINT ["./entrypoint.sh"]
