'use client'

import { useState } from 'react';
import {
  Navbar,
  NavbarContent,
  NavbarItem, 
  NavbarMenuToggle, 
  NavbarMenu, 
  NavbarMenuItem, 
} from '@nextui-org/react';
import Link from 'next/link';
import styles from '/app/styles.module.css';
import { signOut } from '/auth';

function NavbarComponent() {  
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const navItems = [['Profile', 'profile'], ['Resolutions', '/'],  ['Daily To-Do', 'daily-to-do']];

  return (
    <Navbar className={styles.navbar} onMenuOpenChange={setMenuIsOpen}>
      
      <NavbarMenuToggle
        aria-label={menuIsOpen ? 'Close Menu' : 'Open Menu'}
      />
{/* 
      <NavbarContent className={`${styles['nav-content']} hidden`}>
        {navItems.map((item, index) => (
          <NavbarItem key={index}>
            <Link href={item[1]}>
              {item[0]}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent> */}

      <NavbarMenu>
        {navItems.map((item, index) => (
          <NavbarMenuItem key={index}>
            <Link href={item[1]}>
              {item[0]}
            </Link>
          </NavbarMenuItem>
        ))}
        <form
          action={async() => 
          {
            await signOut();
            location.reload; // reloads document since nothing happens sometimes when signOut() is called
          }}
        >
          <button className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
            Sign Out
          </button>
        </form>
      </NavbarMenu>

    </Navbar>
  );
}

export default NavbarComponent;