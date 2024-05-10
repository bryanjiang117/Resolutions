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

function NavbarComponent() {  
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const navItems = [['Profile', 'profile'], ['Resolutions', '/'], ['Daily To-Do', 'daily-to-do']];

  return (
    <Navbar className={styles.navbar} onMenuOpenChange={setMenuIsOpen}>
      
      <NavbarMenuToggle
        aria-label={menuIsOpen ? 'Close Menu' : 'Open Menu'}
      />

      <NavbarContent className={`${styles['nav-content']} hidden`}>
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
  );
}

export default NavbarComponent;