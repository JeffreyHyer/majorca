export const getPages = async (ctx) => {
  const stmt = ctx.db.prepare('SELECT * FROM pages LIMIT 25')
  const pages = stmt.all()

  ctx.body = pages
}

export const getPage = async (ctx) => {
  let stmt = ctx.db.prepare('SELECT * FROM pages WHERE journal_id = ? AND id = ?')
  const page = stmt.get(ctx.params.journal_id, ctx.params.page_id)

  if (page) {
    stmt = ctx.db.prepare('SELECT id, image, model_name, text, created_at FROM results WHERE journal_id = ? AND image LIKE ?')
    const results = stmt.all(ctx.params.journal_id, `${ctx.params.page_id}.jpg%`)
    page.ocr_results = results ?? []

    ctx.body = page
  } else {
    ctx.status = 404
    ctx.body = { error: 'Page not found' }
  }
}

export const postPage = async (ctx) => {}
