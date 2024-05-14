import { signIn } from "/auth";
import { AuthError } from "next-auth";

export async function authenticate(prevState, formData)
{
  try 
  {
    console.log(formData);
    await signIn('credentials', formData);
  }
  catch (error)
  {
    if (error instanceof AuthError)
    {
      if (error.type == 'CredentialsSignin')
      {
        return 'Invalid credentials';
      }
      else 
      {
        return 'Something went wrong';
      }
    }
    throw error;
  }
}