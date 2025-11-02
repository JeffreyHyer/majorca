import Database from'better-sqlite3'

const database = async (ctx, next) => {
  try {
    const db = new Database('../db/ocr_results.sqlite', { fileMustExist: true })
    ctx.db = db
    await next()
  } catch (error) {
    console.error('Database error:', error)
    ctx.status = 500
    ctx.body = JSON.stringify({ error: 'Internal Server Error' })
  } finally {
    ctx.db?.close()
    ctx.db = null
  }
}

export default database
