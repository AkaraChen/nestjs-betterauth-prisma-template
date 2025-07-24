#!/bin/sh

echo "🔧 Initializing database..."
pnpm prisma db push

if [ $? -eq 0 ]; then
    echo "✅ Database initialized successfully"
else
    echo "❌ Database initialization failed"
    exit 1
fi

echo "🚀 Starting application..."
exec "$@" 