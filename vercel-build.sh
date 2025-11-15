#!/bin/bash

echo "▶️ Installing dependencies..."
npm install

echo "▶️ Generating Prisma Client..."
npm run prisma:generate

echo "▶️ Building Next.js..."
npm run build
