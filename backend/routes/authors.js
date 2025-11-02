export const getAuthors = async (ctx) => {
  const stmt = ctx.db.prepare('SELECT * FROM authors')
  const authors = stmt.all()

  ctx.body = authors
}

export const getAuthor = async (ctx) => {
  const authorId = ctx.params.id
  const stmt = ctx.db.prepare('SELECT * FROM authors WHERE id = ?')
  const author = stmt.get(authorId)

  if (author) {
    ctx.body = author
  } else {
    ctx.status = 404
    ctx.body = { error: 'Author not found' }
  }
}

export const postAuthor = async (ctx) => {
  const { name, birthDate = null, deathDate = null } = ctx.request.body

  if (!name) {
    ctx.status = 400
    ctx.body = { error: 'Name is required' }
    return
  }

  // TODO: Validate date formats, name security, etc.

  try {
    const stmt = ctx.db.prepare('INSERT INTO authors (name, birth_date, death_date) VALUES (?, ?, ?)')
    const info = stmt.run(name, birthDate, deathDate)
    ctx.status = 201
    ctx.body = { id: info.lastInsertRowid, name, birthDate, deathDate, status: 'success' }
  } catch (error) {
    ctx.status = 500
    ctx.body = { status: 'error', error: error.message }
    return
  }
}

export const putAuthor = async (ctx) => {
  const authorId = ctx.params.id
  const { name, birthDate = null, deathDate = null } = ctx.request.body

  if (!name) {
    ctx.status = 400
    ctx.body = { error: 'Name is required' }
    return
  }

  // TODO: Validation

  try {
    const stmt = ctx.db.prepare('UPDATE authors SET name = ?, birth_date = ?, death_date = ? WHERE id = ?')
    const info = stmt.run(name, birthDate, deathDate, authorId)

    if (info.changes === 0) {
      ctx.status = 404
      ctx.body = { error: 'Author not found' }
      return
    }

    ctx.body = { id: authorId, name, birthDate, deathDate, status: 'success' }
    return
  } catch (error) {
    ctx.status = 500
    ctx.body = { status: 'error', error: error.message }
    return
  }
}

// TODO: patchAuthor for partial updates of individual fields

export const deleteAuthor = async (ctx) => {
  const authorId = ctx.params.id

  try {
    const stmt = ctx.db.prepare('DELETE FROM authors WHERE id = ?')
    const info = stmt.run(authorId)

    if (info.changes === 0) {
      ctx.status = 404
      ctx.body = { error: 'Author not found' }
      return
    }

    ctx.body = { id: authorId, status: 'success' }
    return
  } catch (error) {
    ctx.status = 500
    ctx.body = { status: 'error', error: error.message }
    return
  }
}
