'use client'

import { useEffect } from 'react';
import styles from './styles.module.css';
import { useList } from '/contexts/ListContext';
import Navbar from '/components/Navbar';
import ResolutionModal from '/components/ResolutionModal';
import ResolutionList from '/components/ResolutionList';

export default function Home() {  
  const { refreshResolutions } = useList();

  useEffect(() => {
    refreshResolutions();
  }, []);

  return (
    <>
      <Navbar />
      
      <main className={styles['main-container']}>
        <ResolutionModal />
        <ResolutionList /> 
      </main>
    </>
  )
}
