'use client';
 
import { Button } from '@nextui-org/react';
import { useFormState, useFormStatus } from 'react-dom';
import { authenticate } from '/lib/actions';
 
export default function LoginForm() {
  const [errorMsg, dispatch] = useFormState(authenticate, undefined);
 
  const handleSubmit = async (event) => {
    event.preventDefault(); 
    const formData = {
      email: event.target.email.value,
      password: event.target.password.value,
    };
    try {
      await dispatch(formData); 
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className={`mb-3 text-2xl`}>
          Please log in to continue.
        </h1>
        <div className="w-full">
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="email"
            >
              Email
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email address"
                // required
              />
            </div>
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="password"
                type="password"
                name="password"
                placeholder="Enter password"
                // required
                minLength={1}
              />
            </div>
          </div>
        </div>
        <LoginButton />
        <div
          className="flex h-8 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        >
          {errorMsg && (
            <>
              <p className="text-sm text-red-500">{errorMsg}</p>
            </>
          )}
        </div>
      </div>
    </form>
  );
}
 
function LoginButton() {
  const { pending } = useFormStatus();
 
  return (
    <Button type="submit" className="mt-4 w-full" aria-disabled={pending}>
      Log in 
    </Button>
  );
}


// 'use client'

// import React from "react";
// import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Checkbox, Input, Link} from "@nextui-org/react";
// import {MailIcon} from './MailIcon.js';
// import {LockIcon} from './LockIcon.js';
// import { useFormState, useFormStatus } from 'react-dom';
// import { authenticate } from '/lib/actions';

// export default function Login() {
//   const {isOpen, onOpen, onOpenChange} = useDisclosure();
//   const [errorMsg, dispatch] = useFormState(authenticate,)

//   return (
//     <div className='h-full flex justify-center items-center'>
//       <Button onPress={onOpen} color="black">Open Modal</Button>
//       <Modal 
//         isOpen={isOpen} 
//         onOpenChange={onOpenChange}
//         placement="top-center"
//       >
//         <ModalContent>
//           {(onClose) => (
//             <>
//               <ModalHeader className="flex flex-col gap-1">Log in</ModalHeader>
//               <ModalBody>
//                 <Input
//                   autoFocus
//                   endContent={
//                     <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
//                   }
//                   label="Email"
//                   placeholder="Enter your email"
//                   variant="bordered"
//                 />
//                 <Input
//                   endContent={
//                     <LockIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
//                   }
//                   label="Password"
//                   placeholder="Enter your password"
//                   type="password"
//                   variant="bordered"
//                 />
//                 <div className="flex py-2 px-1 justify-between">
//                   <Checkbox
//                     classNames={{
//                       label: "text-small",
//                     }}
//                   >
//                     Remember me
//                   </Checkbox>
//                   <Link color="primary" href="#" size="sm">
//                     Forgot password?
//                   </Link>
//                 </div>
//               </ModalBody>
//               <ModalFooter>
//                 <Button color="danger" variant="flat" onPress={onClose}>
//                   Close
//                 </Button>
//                 <Button color="primary" onPress={onClose}>
//                   Sign in
//                 </Button>
//               </ModalFooter>
//             </>
//           )}
//         </ModalContent>
//       </Modal>
//     </div>
//   );
// }
