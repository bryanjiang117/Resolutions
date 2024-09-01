'use client'

import {
  Button,
  Dropdown, 
  DropdownTrigger,
  DropdownMenu, 
  DropdownItem,
  Skeleton,
} from '@nextui-org/react';
import styles from '/app/styles.module.css';
import { useModal } from '/contexts/ModalContext';
import { useList } from '/contexts/ListContext';
import { useRouter } from 'next/navigation';

export function ResolutionModalHeader()
{
  const {
    selectedId,
    setResModalIsOpen,
    modalIsLoaded,
    setModalIsLoaded,
    setTitle,
    setDesc,
    setGroupsSelected,
    setTaskItems,
  } = useModal();

  const {
    deleteResolution,
    fetchResolutions,
  } = useList();

  const router = useRouter();

  // handles closing the modal with built-in methods (ex: clicking outside)
  function handleCloseModal(event) 
  {
    setModalIsLoaded(false);
    setTitle('');
    setDesc('');
    setGroupsSelected([[]]);
    setTaskItems([]);
    setResModalIsOpen(false);
    setModalIsLoaded(true);
  }

  // deletes modal
  async function handleDelete(event) 
  {
    await deleteResolution(selectedId);
    window.location.reload();
    handleCloseModal();
  }

  return (
    <>
      <Skeleton isLoaded={modalIsLoaded} className='rounded-lg'>
        <h2>
          Resolution
        </h2>
      </Skeleton>
      <div className={styles['options-container']}>
        <Dropdown>
          <Skeleton isLoaded={modalIsLoaded} className='rounded-lg'>  
            <DropdownTrigger>
              <Button
                variant='bordered'
                isIconOnly
                disableRipple
              >
                <img className={styles['options-icon']} src='kebab.svg' alt='options icon' />
              </Button>
            </DropdownTrigger>
          </Skeleton>
          <DropdownMenu aria-label='options'>
            <DropdownItem key='export'>Export</DropdownItem>
            {selectedId == -1 ? 
              <DropdownItem isDisabled key='delete' onClick={handleDelete}>Delete</DropdownItem> :
              <DropdownItem key='delete' onClick={handleDelete}>Delete</DropdownItem>                                
            }
          </DropdownMenu>
        </Dropdown>
      </div>
    </>
  );
}