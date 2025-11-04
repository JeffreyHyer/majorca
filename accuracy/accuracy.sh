#!/bin/sh

if [ -z $1 ]; then
  echo "Usage: $0 <model_name>"
  exit 1
fi

MODEL_NAME=$1

WORDS_CORRECT=$(\
  git diff --no-index --word-diff=plain ./$MODEL_NAME.txt ./truth.txt | tail -n +6 \
  | sed -E 's/\[-[^-]+-\]//g' \
  | sed -E 's/\{\+[^\+]+\+\}//g' \
  | wc -w\
)

TOTAL_WORDS=$(wc -w < ./truth.txt)

ACCURACY=$(echo "$WORDS_CORRECT / $TOTAL_WORDS * 100" | bc --scale 4)

echo "Model: $MODEL_NAME"
echo "Words Correct: $WORDS_CORRECT"
echo "Total Words: $TOTAL_WORDS"
echo "Accuracy: $ACCURACY%"
