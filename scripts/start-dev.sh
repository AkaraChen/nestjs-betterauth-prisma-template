#!/bin/sh

echo "🔧 Initializing database for development..."
pnpm prisma db push

if [ $? -eq 0 ]; then
    echo "✅ Database initialized successfully"
else
    echo "❌ Database initialization failed"
    exit 1
fi

echo "🚀 Starting development server..."
exec pnpm start:dev 