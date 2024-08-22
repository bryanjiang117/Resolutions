'use client'

import { useCallback, useState } from 'react';
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

  const handleToggleMenu = () => {
    setMenuIsOpen((prevState) => !prevState);
  };

  return (
    <Navbar className={styles.navbar} isMenuOpen={menuIsOpen} onMenuOpenChange={setMenuIsOpen}>
      
      <NavbarMenuToggle
        aria-label={menuIsOpen ? 'Close Menu' : 'Open Menu'}
        onClick={handleToggleMenu}
      />

      <NavbarMenu>
        {navItems.map((item, index) => (
          <NavbarMenuItem key={index}>
            <Link href={item[1]}>
              {item[0]}
            </Link>
          </NavbarMenuItem>
        ))}
        <NavbarMenuItem>
          <form
            action={async() => 
            {
              await signOut();
              location.reload; // reloads document since nothing happens sometimes when signOut() is called
            }}
          >
            <div
              className='cursor-pointer'
              onClick={() => {signOut({ callBackUrl: '/'})}}  
            >
              Sign Out
            </div>
          </form>
        </NavbarMenuItem>
      </NavbarMenu>

    </Navbar>
  );
}

export default NavbarComponent;