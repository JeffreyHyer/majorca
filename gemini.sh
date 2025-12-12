#!/bin/sh

if [ -f .env ]; then
  source .env
fi

if [ -f .env.local ]; then
  source .env.local
fi

if [ -z "$GEMINI_API_KEY" ]; then
  echo "GEMINI_API_KEY is not set. Please set it in the .env or .env.local file."
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
EXTRA=''

if [[ "$MODEL_NAME" == "gemini-3-pro-preview" ]]; then
  EXTRA=',
    "generationConfig": {
      "thinkingConfig": {
        "thinkingLevel": "low"
      }
    }'
fi

curl --silent "https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent" \
  -H "Content-Type: application/json" \
  -H "X-goog-api-key: $GEMINI_API_KEY" \
  -X POST \
  -d '{
    "contents": [
      {
        "parts": [
          {
            "inline_data": {
              "mime_type": "image/jpeg",
              "data": "'"$(base64 --input "$IMAGE_FILE")"'"
            }
          },
          {
            "text": "Transcribe the handwritten cursive text on the page in this image. Provide only the transcribed text without any additional commentary."
          }
        ]
      }
    ]'"$EXTRA"'
  }'
