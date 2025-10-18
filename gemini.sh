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

exit 1

curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent" \
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
              "data": "'"$(base64 --input ./camera/1.jpg)"'"
            }
          },
          {
            "text": "Transcribe the handwritten cursive text on the page in this image."
          }
        ]
      }
    ]
  }'
