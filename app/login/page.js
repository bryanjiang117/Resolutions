'use client'

import { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Checkbox, Input, Link } from "@nextui-org/react";
import { MailIcon } from './MailIcon.js';
import { LockIcon } from './LockIcon.js';
import { authenticate } from '/lib/actions';

export default function Login() {
  const [ email, setEmail ] = useState();
  const [ password, setPassword ] = useState();
 
  const handleSubmit = async (event) => {
    const formData = 
    {
      email: email,
      password: password
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
      <div className='min-w-80 max-w-120 w-6/12 h-screen flex-col flex justify-center items-center'>
        <Input
          autoFocus
          endContent={
            <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
          }
          label="Email"
          placeholder="Enter your email"
          variant="bordered"
          value={email}
          onChange={(event) => {setEmail(event.target.value)}}
        />

        <Input
          endContent={
            <LockIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
          }
          label="Password"
          placeholder="Enter your password"
          type="password"
          variant="bordered"
          value={password}
          onChange={(event) => {setPassword(event.target.value)}}
        />

        <div className="flex py-2 px-1 justify-between">
          <Checkbox
            classNames={{
              label: "text-small",
            }}
          >
            Remember me
          </Checkbox>
          <Link color="primary" href="#" size="sm">
            Forgot password?
          </Link>
        </div>

        <Button color="danger" variant="flat" onPress={(event)=>{}}>
          Close
        </Button>
        <Button color="primary" onPress={handleSubmit}>
          Sign in
        </Button>
      </div>
    </div>
  );
}
