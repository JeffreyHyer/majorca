export const getPages = async (ctx) => {
  const stmt = ctx.db.prepare('SELECT * FROM pages LIMIT 25')
  const pages = stmt.all()

  ctx.body = pages
}

export const getPage = async (ctx) => {
  let stmt = ctx.db.prepare('SELECT * FROM pages WHERE journal_id = ? AND id = ?')
  const page = stmt.get(ctx.params.journal_id, ctx.params.id)

  if (page) {
    stmt = ctx.db.prepare('SELECT id, image, model_name, text, created_at FROM results WHERE journal_id = ? AND image = ?')
    const results = stmt.all(ctx.params.journal_id, `${ctx.params.id}.jpg`)
    page.ocr_results = results ?? []

    ctx.body = page
  } else {
    ctx.status = 404
    ctx.body = { status: 'error', error: 'Page not found' }
  }
}

export const postPage = async (ctx) => {
  const { journal_id } = ctx.params
  const { id } = ctx.request.body

  if (!id) {
    ctx.status = 400
    ctx.body = { status: 'error', error: 'Page ID is required' }
    return
  }
  
  if (!journal_id) {
    ctx.status = 400
    ctx.body = { status: 'error', error: 'Journal ID is required' }
    return
  }

  try {
    const stmt = ctx.db.prepare('INSERT INTO pages (id, journal_id) VALUES (?, ?)')
    const info = stmt.run(id, journal_id)
    if (info.changes > 0) {
      ctx.status = 201
      ctx.body = { id, journal_id, status: 'success' }
    } else {
      ctx.status = 400
      ctx.body = { status: 'error', error: 'Failed to create page' }
    }
  } catch (error) {
    ctx.status = 500
    ctx.body = { status: 'error', error: error.message }
    return
  }
}

export const patchPage = async (ctx) => {
  const { journal_id, id } = ctx.params
  const { text = null, start_date = null, end_date = null, locked = null, completed = null } = ctx.request.body

  if (!id) {
    ctx.status = 400
    ctx.body = { status: 'error', error: 'Page ID is required' }
    return
  }
  
  if (!journal_id) {
    ctx.status = 400
    ctx.body = { status: 'error', error: 'Journal ID is required' }
    return
  }

  const fields = []
  const values = []

  if (text !== null) {
    fields.push('text')
    values.push(text)
  }

  if (start_date !== null) {
    fields.push('start_date')
    values.push(start_date)
  }

  if (end_date !== null) {
    fields.push('end_date')
    values.push(end_date)
  }

  if (locked !== null) {
    fields.push('locked')
    values.push(locked ? 1 : 0)
  }

  if (completed !== null) {
    fields.push('completed')
    values.push(completed ? 1 : 0)
  }

  try {
    const stmt = ctx.db.prepare(`UPDATE pages SET ${fields.map(field => `${field} = ?`).join(', ')} WHERE id = ? AND journal_id = ?`)
    const info = stmt.run(...values, id, journal_id)
    if (info.changes > 0) {
      ctx.status = 201
      ctx.body = { id, journal_id, status: 'success' }
    } else {
      ctx.status = 400
      ctx.body = { status: 'error', error: 'Failed to update page' }
    }
  } catch (error) {
    ctx.status = 500
    ctx.body = { status: 'error', error: error.message }
    return
  }
}

export const getPreviousPage = async (ctx) => {
  const { journal_id, id } = ctx.params
  
  let stmt = ctx.db.prepare('SELECT * FROM pages WHERE journal_id = ? AND id < ? ORDER BY id DESC LIMIT 1')
  const page = stmt.get(journal_id, id)

  if (page) {
    stmt = ctx.db.prepare('SELECT id, image, model_name, text, created_at FROM results WHERE journal_id = ? AND image = ?')
    const results = stmt.all(page.journal_id, `${page.id}.jpg`)
    page.ocr_results = results ?? []

    ctx.body = page
  } else {
    ctx.status = 404
    ctx.body = { status: 'error', error: 'Page not found' }
  }
}

export const getNextPage = async (ctx) => {
  const { journal_id, id } = ctx.params
  
  let stmt = ctx.db.prepare('SELECT * FROM pages WHERE journal_id = ? AND id > ? ORDER BY id ASC LIMIT 1')
  const page = stmt.get(journal_id, id)

  if (page) {
    stmt = ctx.db.prepare('SELECT id, image, model_name, text, created_at FROM results WHERE journal_id = ? AND image = ?')
    const results = stmt.all(page.journal_id, `${page.id}.jpg`)
    page.ocr_results = results ?? []

    ctx.body = page
  } else {
    ctx.status = 404
    ctx.body = { status: 'error', error: 'Page not found' }
  }
}
