'use client'

import {
  Button,
  Card, 
  CardBody, 
  CircularProgress,

} from '@nextui-org/react';

import { IoAddOutline } from "react-icons/io5";
import styles from '/app/styles.module.css';
import { useList } from '/contexts/ListContext';
import { useModal } from '/contexts/ModalContext';

const ResolutionList = () => {
  
  const {
    listIsLoading,
    resolutionItems,
  } = useList();

  const { 
    fetchTasks,
    setTitle, 
    setDesc, 
    setSelectedId, 
    setResOpenType, 
    setResModalIsOpen 
  } = useModal();

  // open modal for adding or updating a resolution
  async function handleOpenModal(event) 
  {
    const idPrefix = 'resolution-item-';
    const regex = new RegExp(`^${idPrefix}\\d+$`);
    if (regex.test(event.target.id)) 
    {
      const key = parseInt(event.target.id.substring(idPrefix.length));
      setTitle(resolutionItems[key].title);
      setDesc(resolutionItems[key].description);
      setSelectedId(resolutionItems[key].resolution_id);
      setResOpenType('update');
      fetchTasks(resolutionItems[key].resolution_id);
    } else if (event.target.id == 'add-resolution-button')
    {
      setSelectedId(-1);
      setResOpenType('add');
    }
    setResModalIsOpen(true);
  }
  return (
    <div className={styles['list-horizontal-container']}>
      <div className={styles['list-vertical-container']}>
        {listIsLoading ? 
          <div className={styles.loading}>
            <CircularProgress size='md' aria-label='loading...' />
          </div> :
          <>
            {resolutionItems.map((item, index) => (
              <Card 
                className={styles['resolution-item']} // source of "uncontrolled to controlled" warning
                isPressable isBlurred isHoverable disableRipple shadow='none' 
                onPress={handleOpenModal}
                key={index}
                id={`resolution-item-${index}`} 
              >
                <CardBody className={styles['resolution-body']}>
                  <div className={styles['title-and-desc']}> 
                    <div className={styles['resolution-title']}>
                      {item.title}
                    </div>
                    {item.description}
                  </div>
                  
                </CardBody>
              </Card>
            ))}

            <Button
              className={styles['add-button']}
              variant='flat'
              startContent={<IoAddOutline />}
              onClick={handleOpenModal}
              id='add-resolution-button'
            >
              Add Resolution
            </Button>
          </>
        }
      </div>
    </div>
  );
}

export default ResolutionList;