'use client'

import { React } from 'react';
import {
  Button,
  Skeleton,
} from '@nextui-org/react';
import { useModal } from '/contexts/ModalContext';
import { useList } from '/contexts/ListContext';

export function ResolutionModalFooter()
{
  const {
    selectedId,
    setResModalIsOpen,
    resOpenType,
    setResOpenType,
    modalIsLoaded,
    setModalIsLoaded,
    title,
    setTitle,
    desc,
    setDesc,
    groupsSelected,
    setGroupsSelected,
    taskItems, 
    setTaskItems,
  } = useModal();

  const {
    postResolution,
    updateResolution,
  } = useList();

  // saves resolution for adding or updating
  async function handleSaveRes(event) 
  {
    setModalIsLoaded(false);
    const updatedTaskItems = taskItems.map((task, taskIndex) => {
      const recurrence_days = new Array(7).fill(false);
      groupsSelected[taskIndex].forEach((itemSelected) => {
        recurrence_days[itemSelected] = true;
      });

      return {
        title: task.title,
        description: task.description,
        recurrence_days: recurrence_days
      }
    })

    if (resOpenType == 'add') 
    {
      await postResolution(title, desc, updatedTaskItems);
    } 
    else if (resOpenType == 'update') 
    {
      await updateResolution(selectedId, title, desc, updatedTaskItems);
    }
    setResModalIsOpen(false);
    setTitle('');
    setDesc('');
    setTaskItems([]);
    setGroupsSelected([[]]);
    setModalIsLoaded(true);
  }

  // cancels any changes and closes modal
  async function handleCancelRes(event) 
  {
    setModalIsLoaded(false);
    setResModalIsOpen(false);
    // use artificial await Promise to use setTimeout in an async function
    // this is to prevent modal content from disappearing before it fully closes
    await new Promise(resolve => setTimeout(resolve, 100));
    setTitle('');
    setDesc('');
    setResOpenType('none')
    setModalIsLoaded(true);
  }
  
  return (
    <>
      <Skeleton isLoaded={modalIsLoaded} className='rounded-lg'>
        <Button
          variant='flat'
          color='primary'
          onPress={handleSaveRes}
        >
          Submit
        </Button>
      </Skeleton>
      <Skeleton isLoaded={modalIsLoaded} className='rounded-lg'> 
        <Button
          variant='flat'
          color='danger'
          onPress={handleCancelRes}
        >
          Cancel
        </Button>
      </Skeleton>
    </>
  );
}