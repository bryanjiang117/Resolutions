'use client'

import {
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter,
} from '@nextui-org/react';
import styles from '/app/styles.module.css';
import { useModal } from '/contexts/ModalContext';
import { ResolutionModalHeader } from './modal-components/ResolutionModalHeader';
import { ResolutionModalBody } from './modal-components/ResolutionModalBody';
import { ResolutionModalFooter } from './modal-components/ResolutionModalFooter';

export function ResolutionModal() 
{
  const { 
    resModalIsOpen,
    setResModalIsOpen,
    setModalIsLoaded,
    setTitle,
    setDesc,
    setGroupsSelected,
    setTaskItems,
  } = useModal();

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

  return (
    <div>
      <Modal size='lg' backdrop='blur' scrollBehavior='outside' isOpen={resModalIsOpen} onOpenChange={handleCloseModal}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className={styles['modal-header']}>
                <ResolutionModalHeader />
              </ModalHeader>
              <ModalBody>
                <ResolutionModalBody onClose={onClose}/>
              </ModalBody>
              <ModalFooter className={styles['modal-footer']}>
                <ResolutionModalFooter />
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}

export default ResolutionModal;
