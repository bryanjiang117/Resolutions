'use client'

import { useState, useRef, useEffect } from 'react';
import {
  Button,
  Input,
  CheckboxGroup, 
  Textarea, 
  Card, 
  CardHeader, 
  CardBody, 
  CardFooter,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem, 
  NavbarMenuToggle, 
  NavbarMenu, 
  NavbarMenuItem, 
  MenuItem, 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter,
  CircularProgress,
  Dropdown, 
  DropdownTrigger,
  DropdownMenu, 
  DropdownItem,
} from '@nextui-org/react';
import Link from 'next/link';
import styles from './styles.module.css';

export default function Profile() {
  // navbar
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const navItems = [['Profile', 'profile'], ['Resolutions', '/'], ['Daily To-Do', 'daily-to-do'], 
                  ['Tasks', 'tasks'], ['Settings', 'settings']];

  return (
    <>
      <Navbar className={styles.navbar} onMenuOpenChange={setMenuIsOpen}>

        <NavbarMenuToggle
        aria-label={menuIsOpen ? 'Close Menu' : 'Open Menu'}
        className='lg:hidden'
        />


        <NavbarContent className={`${styles['nav-content']} hidden lg:flex`}>
          {navItems.map((item, index) => (
            <NavbarItem key={index}>
              <Link href={item[1]}>
                {item[0]}
              </Link>
            </NavbarItem>
          ))}
        </NavbarContent>

        <NavbarMenu>
        {navItems.map((item, index) => (
          <NavbarMenuItem key={index}>
            <Link href={item[1]}>
              {item[0]}
            </Link>
          </NavbarMenuItem>
        ))}
        </NavbarMenu>

      </Navbar>

      <div className={`${styles['main-container']} flex flex-col justify-center items-center`}>
        <h1>Under construction</h1>
      </div>
    </>
  );
}