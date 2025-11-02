const fs = require('fs')
const path = require('path')
const { execFileSync } = require('child_process')
const Database = require('better-sqlite3')

const JOURNAL = fs.readFileSync('journal.txt', 'utf8').trim().replace(' ', '_')
const IMAGE_DIR = path.join('./camera', JOURNAL, 'ocr')
const DB_FILE = 'db/ocr_results.sqlite'
const SCRIPTS = {
  'gemini-2.0-flash': ['./gemini.sh', 'gemini-2.0-flash'],
  'gemini-2.5-flash': ['./gemini.sh', 'gemini-2.5-flash'],
  'gemini-2.5-flash-lite': ['./gemini.sh', 'gemini-2.5-flash-lite'],
}
const IMAGE_EXTENSIONS = ['.jpg']

const db = new Database(DB_FILE)

const insertStmt = db.prepare('INSERT OR IGNORE INTO results (journal, image, model_name, json_response, input_tokens, output_tokens, thought_tokens, text) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')

const processImage = async (imagePath, filename) => {
  console.log(`\nProcessing image: ${imagePath}`)

  for (const modelName in SCRIPTS) {
    const [scriptPath, ...args] = SCRIPTS[modelName]
    console.log(`  - Running ${modelName}...`)

    // TODO: Check if result already exists in DB before wasting an API call. Maybe ask if we want to re-process the image or not.

    try {
      const stdout = execFileSync(scriptPath, [...args, imagePath], { encoding: 'utf8' })
      if (!stdout || stdout.trim() === '') {
        console.error(`    - Error: Received empty output from ${modelName}.`)
        continue
      }

      const data = JSON.parse(stdout.trim())
      const input_tokens = data.usageMetadata?.promptTokenCount ?? 0
      const output_tokens = data.usageMetadata?.candidatesTokenCount ?? 0
      const thought_tokens = data.usageMetadata?.thoughtsTokenCount ?? 0
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''

      const info = insertStmt.run(JOURNAL, filename, modelName, JSON.stringify(data), input_tokens, output_tokens, thought_tokens, text)

      if (info.changes > 0) {
        console.log(`    - Success: Stored result for ${modelName}.`)
      } else {
        console.log(`    - Info: Result for ${modelName} already exists in DB.`)
      }
    } catch (error) {
      console.error(`    - Error executing script for ${modelName}:`, error.message, error)
    }
  }
}

const waitForKeyPress = async (message = '') => {
  if (message) {
    console.log(message)
  }

  console.log('Press any key to continue, "s" to skip, or Ctrl+C to exit...')

  process.stdin.setRawMode(true)

  return new Promise((resolve) => {
    process.stdin.once('data', (data) => {
      const byteArray = [...data];
      if (byteArray.length > 0 && byteArray[0] === 3) {
        console.log('^C');
        process.exit(1);
      }

      if (byteArray.length > 0 && byteArray[0] === 115) {
        process.stdin.setRawMode(false)
        resolve(true)
        return
      }

      process.stdin.setRawMode(false)
      resolve(false)
    })
  })
}

// TODO: Refactor this to async/await for better readability
(async () => {
  console.log(`Starting OCR processing for directory: ${IMAGE_DIR}`)

  try {
    const files = fs.readdirSync(IMAGE_DIR)
    const imageFiles = files.filter(file => IMAGE_EXTENSIONS.includes(path.extname(file).toLowerCase()))

    if (imageFiles.length === 0) {
      console.log('No image files found in the directory.')
      return
    }

    for (const file of imageFiles) {
      const fullImagePath = path.join(IMAGE_DIR, file)

      const shouldContinue = await waitForKeyPress(`\nNext image: ${fullImagePath}`)

      if (shouldContinue) {
        console.log('Skipping image...')
        continue
      }

      await processImage(fullImagePath, file)
    }
  } catch (error) {
    console.error(`Failed to read directory ${IMAGE_DIR}:`, error.message)
    process.exit(1)
  } finally {
    db.close()
    console.log('\nProcessing complete. Database connection closed.')
    process.exit(0)
  }
})()
