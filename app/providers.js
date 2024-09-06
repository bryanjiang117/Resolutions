'use client'

import { NextUIProvider } from '@nextui-org/react'
import { ListProvider } from '/contexts/ListContext';
import { ModalProvider } from '/contexts/ModalContext';
import { TodoProvider } from '@/contexts/TodoContext';

export function Providers({children}) {
  return (
    <NextUIProvider>
      <ListProvider>
        <ModalProvider>
          <TodoProvider>
            {children}
          </TodoProvider>
        </ModalProvider>
      </ListProvider>
    </NextUIProvider>
  )
}