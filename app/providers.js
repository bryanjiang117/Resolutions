'use client'

import { NextUIProvider } from '@nextui-org/react'
import { ListProvider } from '/contexts/ListContext';
import { ModalProvider } from '/contexts/ModalContext';

export function Providers({children}) {
  return (
    <NextUIProvider>
      <ListProvider>
        <ModalProvider>
          {children}
        </ModalProvider>
      </ListProvider>
    </NextUIProvider>
  )
}