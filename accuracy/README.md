# Evaluating model accuracy at OCR tasks

```sh
git diff --no-index --word-diff=plain ./claude-haiku-3-5.txt ./truth.txt \
| tail -n +6 \
| sed -E 's/\[-[^-]+-\]//g' \
| sed -E 's/\{\+[^\+]+\+\}//g' \
| wc -w
```

Explanation:

- Get the word diff between the models transcription and the ground truth.
- Strip out the first 5 lines of the diff (the patch header).
- Remove all the `[-word-]` and `{+word+}` groups from the diff, leaving only the "correct" words.
- Count the words.

Compare that to the word count of the ground truth:

```sh
wc -w < truth.txt
```

Divide those two numbers to get an accuracy percentage.