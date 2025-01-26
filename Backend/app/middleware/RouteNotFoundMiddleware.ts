import type { HttpContext } from '@adonisjs/core/http'

export default class RouteNotFoundMiddleware {
  public async handle(ctx: HttpContext, next: () => Promise<void>) {
    try {
      await next()
    } catch (error) {
      if (error.code === 'E_ROUTE_NOT_FOUND') {
        return ctx.response.redirect('/auth/login')
      }
      throw error
    }
  }
}
