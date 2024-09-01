'use server'

import NextAuth from "next-auth";
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { sql } from "@vercel/postgres";
import { z } from 'zod';
import bcrypt from 'bcrypt';

async function getUser(email)
{
  try 
  {
    const response = await sql`
    SELECT * FROM users WHERE email=${email}`;
    const user = response.rows[0];
    return user;
  }
  catch (error)
  {
    console.log('Error fetching user: ', error);
    throw new Error('Failed to fetch user.');
  }
}

export const { auth, signIn, signOut } = NextAuth(
{
  ...authConfig,
  providers: [
    Credentials(
    {
      async authorize(credentials)
      {
        // checking if email and password are valid
        const parsedCredentials = z
          .object(
          {
            email: z.string().email(),
            password: z.string().min(1),
          })
          .safeParse(credentials);

        // finding user and matching password
        if (parsedCredentials.success)
        {
          const { email, password } = parsedCredentials.data;

          const user = await getUser(email);
          if (!user) return null; // returning null prevents user from logging in
        
          const isPasswordValid = await bcrypt.compare(password, user.password);
          if (isPasswordValid) 
          {
            return {
              user_id: user.user_id,
              email: user.email,
            };
          }
        }
        
        // not able to validate
        console.log('Invalid Credentials. Failed to login');
        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token, user }) {
      // Include user_id in the session object
      session.user.user_id = token.user_id;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        // Store user_id in the token
        token.user_id = user.user_id;
      }
      return token;
    },
  },
});