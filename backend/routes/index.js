import { getAuthors, getAuthor, postAuthor, putAuthor, deleteAuthor } from './authors.js'
import { getPages, getPage, postPage, patchPage, getPreviousPage, getNextPage } from './pages.js'

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
  // router.delete('/author/:id', deleteAuthor)

  // router.get('/journals', getJournals)
  // router.get('/journals/:id', getJournal)
  // router.post('/journals', postJournal)
  // router.patch('/journals/:id', patchJournal)

  router.get('/journals/:journal_id/pages', getPages)
  router.get('/journals/:journal_id/pages/:id', getPage)
  router.post('/journals/:journal_id/pages', postPage)
  router.patch('/journals/:journal_id/pages/:id', patchPage)
  router.get('/journals/:journal_id/pages/:id/previous', getPreviousPage)
  router.get('/journals/:journal_id/pages/:id/next', getNextPage)
}
