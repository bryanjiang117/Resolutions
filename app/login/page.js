'use client'

import { useState } from "react";
import { Button, Checkbox, Input, Link } from "@nextui-org/react";
import { MailIcon } from '/assets/MailIcon.js';
import { LockIcon } from '/assets/LockIcon.js';
import { authenticate } from '/lib/actions';

export default function Login() {
  const [ email, setEmail ] = useState("");
  const [ password, setPassword ] = useState("");
  const [ rememberMe, setRememberMe ] = useState(false);
 
  const handleSubmit = async (event) => {
    const formData = 
    {
      email: email,
      password: password,
      // rememberMe: rememberMe
    };
    try 
    {
      await authenticate(formData); 
    } 
    catch (error) 
    {
      console.error("Login error:", error);
    }
  };

  return (
    <div className='h-screen w-screen flex justify-center'>
      <div className='min-w-80 max-w-120 w-6/12 h-screen flex-col flex justify-center gap-2 items-center'>
        <Input
          autoFocus
          endContent={
            <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
          }
          label="Email"
          variant="underlined"
          value={email}
          onChange={(event) => {setEmail(event.target.value)}}
          required
          autoComplete="email"
        />

        <Input
          endContent={
            <LockIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
          }
          label="Password"
          type="password"
          variant="underlined"
          value={password}
          onChange={(event) => {setPassword(event.target.value)}}
          required
          autoComplete="current-password"
        />

        <div className="flex w-full justify-between py-1 px-1 justify-between">
          <Checkbox
            isSelected={rememberMe}
            onChange={() => setRememberMe((prevState) => !prevState)}
            classNames={{label: "text-small"}}
          >
            Remember me
          </Checkbox>
          <Link color="primary" href="#" size="sm">
            Forgot password?
          </Link>
        </div>

        <div className="flex w-full py-1 justify-start gap-2">
          <Button 
            color="primary" 
            className="w-full text-white"
            onPress={handleSubmit}
          >
            Log In
          </Button>
        </div>

        <div className="py-1 flex w-full justify-center text-sm">
          Need an account? 
          <Link href="/signup" className="ml-2 text-sm underline hover:text-primary">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
