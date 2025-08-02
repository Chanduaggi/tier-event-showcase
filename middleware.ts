import { authMiddleware } from '@clerk/nextjs'

export default authMiddleware({
  publicRoutes: ['/', '/about'], // routes that don't require auth
})

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)'],
}


