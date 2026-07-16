import { auth } from './src/lib/auth'; (async () => { const session = await auth.api.getSession(); console.log(session?.user.role) })()
