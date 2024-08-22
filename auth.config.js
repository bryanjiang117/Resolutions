export const authConfig = 
{
  pages: 
  {
    signIn: '/login',
    signOut: '/login',
    signUp: '/signup',
    // error: '',
  },  
  callbacks: 
  {
    authorized({auth, request})
    {
      const { nextUrl } = request;
      const isLoggedIn = !!auth?.user;
      const needsLogin = !(nextUrl.pathname.startsWith('/login') || nextUrl.pathname.startsWith('/signup'));
      console.log(nextUrl.pathname);
      if (needsLogin)
      {
        return isLoggedIn;
      }
      if (isLoggedIn)
      {
        return Response.redirect(new URL('/', nextUrl));
      }
      return true;
    }
  },
  providers: [],
} 