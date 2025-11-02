#!/bin/bash

# TODO: Move these to a common file that is sourced by all scripts that need it.
save_progress() {
  echo "$1" > ./_camera.lock
}

read_progress() {
  if [ -f ./_camera.lock ]; then
    cat ./_camera.lock
  else
    echo "0"
  fi
}

clear_progress() {
  rm -f ./_camera.lock
}

if [ -f .env ]; then
  source .env
fi

if [ -f .env.local ]; then
  source .env.local
fi

# TODO: Check if adb, magic, and other dependencies are installed.
# TODO: Check if a device is connected via adb.

STEP=$(read_progress)

# Read the current journal name from a file and format it for use as the subdirectory name
if [ ! -f ./journal.txt ]; then
  echo -e "Please define the current journal in journal.txt\n"
  exit 1
fi
JOURNAL=$(cat ./journal.txt | tr -d '\n' | tr ' ' '_')
if [ -z "$JOURNAL" ]; then
  echo -e "Please define the current journal in journal.txt\n"
  exit 1
fi
if [ ! -d ./camera/$JOURNAL ]; then
  mkdir -p ./camera/$JOURNAL/ocr
fi

# Take a photo with the camera
# if [ "$STEP" -lt 1 ]; then
  # adb shell am start -a android.media.action.STILL_IMAGE_CAMERA
  # save_progress 1
# fi

# Wait until the user hits a key before taking the photo
# read -n 1 -s -r -p "Press any key to continue..."
# echo ""

# Focus the camera
# adb shell input keyevent 27

# Take the photo (coordinates may vary by device)
if [ "$STEP" -lt 2 ]; then
  adb shell input tap 540 1800
  # save_progress 2
fi

read -n 1 -s -r -p "Press any key to continue..."
echo ""

# Find the most recent photo taken
FILE=$(adb shell ls -t /sdcard/DCIM/Camera | grep ".jpg" | head -n 1)

# Pull the photo from the phone
if [ "$STEP" -lt 3 ]; then
  SEQUENCE=$(find ./camera/$JOURNAL -maxdepth 1 -name "*.jpg" | wc -l)
  SEQUENCE=$((SEQUENCE + 1))
  adb pull /sdcard/DCIM/Camera/$FILE ./camera/$JOURNAL/${SEQUENCE}_orig.jpg
  # save_progress 3
fi

# Wait for the file to download
read -n 1 -s -r -p "Press any key to continue..."
echo ""

# Rotate the image 90 degrees counter-clockwise, resize to 50% of original size, sharpen, convert to grayscale with a 75% threshold, split the image in half vertically, and save the two halves as separate files
if [ "$STEP" -lt 4 ]; then
  magick "./camera/$JOURNAL/${SEQUENCE}_orig.jpg" -rotate -90 -resize 50% -sharpen 0x1.0 -colorspace gray -threshold 75% -crop "50%x100%" +repage "./camera/$JOURNAL/ocr/${SEQUENCE}_%d.jpg"
  magick "./camera/$JOURNAL/${SEQUENCE}_orig.jpg" -rotate -90 -resize 50% -sharpen 0x1.0 "./camera/$JOURNAL/${SEQUENCE}_orig.jpg"
  # clear_progress
fi
