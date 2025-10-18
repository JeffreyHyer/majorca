#!/bin/sh

if [ -f .env]; then
  source .env
fi

if [ -f .env.local ]; then
  source .env.local
fi

if [ -z "$CLAUDE_API_KEY" ]; then
  echo "CLAUDE_API_KEY is not set. Please set it in the .env or .env.local file."
  exit 1
fi

curl https://api.anthropic.com/v1/messages \
  -H "Content-Type: application/json" \
  -H "x-api-key: $CLAUDE_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "claude-haiku-4-5-20250929",
    "max_tokens": 4096,
    "messages": [
      {
        "role": "user", 
        "content": [
          {"type": "image", "source": {"type": "base64", "media_type": "image/jpeg", "data": "'"$(base64 --input ./camera/1.jpg)"'"}},
          {"type": "text", "text": "Transcribe the handwritten cursive text on the page in this image. Provide the transcription in plain text only, no other commentary or notes."}
        ]
      }
    ]
  }'
