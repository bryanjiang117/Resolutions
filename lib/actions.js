import { signIn } from "/auth";
import { AuthError, CredentialsSignin, } from "next-auth";

export async function authenticate(formData)
{
  try 
  {
    console.log(formData);
    await signIn('credentials', formData);
  }
  catch (error)
  {
    return 'Invalid Credentials';
  }
}