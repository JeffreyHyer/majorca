#!/bin/sh

if [ -f .env ]; then
  source .env
fi

if [ -f .env.local ]; then
  source .env.local
fi

if [ -z "$OPENAI_API_KEY" ]; then
  echo "OPENAI_API_KEY is not set. Please set it in the .env or .env.local file."
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

curl --silent "https://api.openai.com/v1/chat/completions" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -X POST \
  -d '{
    "model": "'"$MODEL_NAME"'",
    "messages": [
      {
        "role": "user",
        "content": [
          {
            "type": "text",
            "text": "Transcribe the handwritten cursive text on the page in this image. Provide only the transcribed text without any additional commentary."
          },
          {
            "type": "image_url",
            "image_url": {
              "url": "data:image/jpeg;base64,'"$(base64 --input "$IMAGE_FILE")"'",
              "detail": "high"
            }
          }
        ]
      }
    ]
  }'
