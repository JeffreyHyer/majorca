# Evaluating model accuracy on OCR tasks

From `accuracy.sh`:
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

Divide those two numbers to get the accuracy as a percentage.

## Results

| Model                       | Accuracy |
| :-------------------------- | -------: |
| Opus 4.5                    |   84.85% |
| Sonnet 4.5                  |   53.87% |
| Sonnet 4                    |   55.28% |
| Sonnet 3.7                  |   71.12% |
| Haiku 4.5                   |   54.92% |
| Haiku 3.5                   |   55.63% |
| Haiku 3                     |   33.45% |
| Gemini 3 Pro (Low Thinking) |   89.43% |
| Gemini 3 Pro                |   85.21% |
| Gemini 2.5 Flash            |   77.11% |
| Gemini 2.5 Flash-Lite       |   75.35% |
| Gemini 2.0 Flash            |   72.88% |
| GPT-5.2                     |   64.78% |
| GPT-5.1                     |   63.73% |
| GPT-5                       |   61.61% |
| GPT-5 mini                  |   77.81% |
| GPT-4.1                     |   66.19% |
| GPT-4.1 mini                |   78.87% |
| GPT-4.1 nano                |   57.75% |
| GPT-4o                      |   59.15% |
| GPT-4o mini                 |   50.00% |
| Grok 4.1 Fast               |    9.15% |
| Grok 4.1 Fast NR            |    7.74% |
| Grok 4 Fast                 |    7.39% |
| Grok 4 Fast NR              |    9.50% |
| Grok 4 0709                 |   15.14% |
| Grok 2 Vision 1212          |   15.49% |