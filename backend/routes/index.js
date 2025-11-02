import { getAuthors, getAuthor, postAuthor, putAuthor, deleteAuthor } from './authors.js'
import { getPages, getPage } from './pages.js'

export default function (router) {
  router.get('/', async (ctx) => {
    ctx.body = {
      status: 'online',
      timestamp: new Date().getTime()
    }
  })

  router.get('/authors', getAuthors)
  router.get('/authors/:id', getAuthor)
  router.post('/author', postAuthor)
  router.put('/author/:id', putAuthor)
  router.delete('/author/:id', deleteAuthor)

  router.get('/journal/:journal_id/pages', getPages)
  router.get('/journal/:journal_id/pages/:page_id', getPage)
}
