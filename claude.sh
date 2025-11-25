#!/bin/sh

if [ -f .env ]; then
  source .env
fi

if [ -f .env.local ]; then
  source .env.local
fi

if [ -z "$CLAUDE_API_KEY" ]; then
  echo "CLAUDE_API_KEY is not set. Please set it in the .env or .env.local file."
  exit 1
fi

if [ -z "$1" ]; then
  echo "Usage: $0 <model_name> <image_file_path>"
  exit 1
fi

if [ -z "$2" ]; then
  echo "Usage: $0 <model_name> <image_file_path>"
  exit 1
fi

MODEL_NAME=$1
IMAGE_FILE=$2

curl https://api.anthropic.com/v1/messages \
  -H "Content-Type: application/json" \
  -H "x-api-key: $CLAUDE_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "'"$MODEL_NAME"'",
    "max_tokens": 4096,
    "messages": [
      {
        "role": "user", 
        "content": [
          {"type": "image", "source": {"type": "base64", "media_type": "image/jpeg", "data": "'"$(base64 --input "$IMAGE_FILE")"'"}},
          {"type": "text", "text": "Transcribe the handwritten cursive text on the page in this image. Provide the transcription in plain text only, no other commentary or notes."}
        ]
      }
    ]
  }'
