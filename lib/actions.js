import { signIn } from "/auth";

export async function authenticate(formData)
{
  try 
  {
    await signIn('credentials', formData);
  }
  catch (error)
  {
    return 'Invalid Credentials';
  }
}