import Koa from 'koa'
import KoaRouter from '@koa/router'
import koaBody from 'koa-body'
import database from './middleware/database.js'
import registerRoutes from './routes/index.js'

const app = new Koa()
const router = new KoaRouter()

registerRoutes(router)

app.use(database)
   .use(koaBody())
   .use(router.routes())

if (app.env === 'production') {
  app.listen(443)
  console.log('Listening on port 443.')
} else {
  app.listen(3000)
  console.log('Listening on port 3000.')
}
