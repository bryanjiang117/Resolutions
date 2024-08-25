'use client'

import { useState, useRef, useEffect } from 'react';
import styles from './styles.module.css';
import NavbarComponent from '@/components/Navbar';

export default function Profile() {
  // navbar
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const navItems = [['Profile', 'profile'], ['Resolutions', '/'], ['Daily To-Do', 'daily-to-do']];

  return (
    <>
      <NavbarComponent />

      <div className={`${styles['main-container']} flex flex-col justify-center items-center`}>
        <h1>Under construction</h1>
      </div>
    </>
  );
}