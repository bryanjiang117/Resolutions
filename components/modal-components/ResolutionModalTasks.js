'use client'

import {
  Input,
  CheckboxGroup, 
  Textarea, 
  Skeleton,
} from '@nextui-org/react';
import {CustomCheckbox} from '/app/CustomCheckbox';
import styles from '/app/styles.module.css';
import { useModal } from '/contexts/ModalContext';
import { useList } from '/contexts/ListContext';

export function ResolutionModalTasks() 
{
  const {
    modalIsLoaded,
    groupsSelected,
    setGroupsSelected,
    taskItems, 
    setTaskItems,
  } = useModal();

  const {
    listIsLoading,
  } = useList();

  function handleChangeTitle(event, index) {
    const updatedTaskItems = [...taskItems];
    updatedTaskItems[index].title = event;
    setTaskItems(updatedTaskItems);
  }

  function handleChangeDesc(event, index) {
    const updatedTaskItems = [...taskItems];
    updatedTaskItems[index].description = event;
    setTaskItems(updatedTaskItems);
  }

  // handles checking a day of the week in modal
  function handleCheck(event, index) 
  {
    setGroupsSelected([event]);
    if (index >= groupsSelected.length - 1) 
    {
      setGroupsSelected([...groupsSelected.slice(0, index), event]);
    }
    else 
    {
      setGroupsSelected([...groupsSelected.slice(0, index), event, ...groupsSelected.slice(index + 1)]);
    }
    console.log('groups selected in modal', groupsSelected);
  }

  // handles pressing enter key in modal
  async function handleEnter(event) 
  {
    if (!listIsLoading && modalIsLoaded && event.key == 'Enter') 
    {
      event.preventDefault();
      const id = parseInt(event.target.id[11]);
      if (event.target.id == 'modal-title-field') 
      {
        document.getElementById('modal-desc-field').focus();
      }
      // TO DO: change this to a down arrow key since people want to use enter to do nextline for description
      else if (event.target.id == 'modal-desc-field' && taskItems.length > 0) 
      {
        document.getElementById('task-input-0').focus();
      }
      else if (event.target.id.startsWith('task-input-') && id < taskItems.length - 1)
      {
        document.getElementById(`task-input-${id + 1}`).focus();
      } 
      else
      {
        handleSaveRes(event);
      }
    }
  }

  return (
    taskItems.map((item, index) => (
      <div className={styles['task-container']} key={index}>
        <Skeleton isLoaded={modalIsLoaded} className='rounded-lg'>
          <Input 
            className="focus:border-none"
            classNames={{
              mainWrapper: "h-full",
              inputWrapper: "h-7 min-h-5 bg-inherit data-[hover=true]:bg-inherit group-data-[focus=true]:bg-inherit",
              input: "text-sm mt-1",
            }}
            variant='flat'
            color='text-secondary'
            disableAnimation
            placeholder='Enter your Task Title...'
            size='sm'
            value={item.title}
            onValueChange={(event) => handleChangeTitle(event, index)}
            onKeyDown={handleEnter}
            id={`task-input-${index}`}
          />
          <Textarea
          className="focus:border-none"
              classNames={{
              mainWrapper: 'h-full',
              inputWrapper: 'min-h-5 py-0 bg-inherit data-[hover=true]:bg-inherit group-data-[focus=true]:bg-inherit',
              input: 'text-xs mt-1',
            }}
            variant='flat'
            minRows={1}
            placeholder='Enter your Task Description...'
            size='sm'
            value={item.description ?? ''}
            onValueChange={(event) => handleChangeDesc(event, index)}
            onKeyDown={handleEnter}
            id={`task-input-${index}`}
          />
        </Skeleton>
        <Skeleton isLoaded={modalIsLoaded} className='rounded-lg'>
          <CheckboxGroup
            className={styles['checkbox-group']}
            classNames={{
              wrapper: 'justify-between my-0 h-6/12',
            }}
            orientation="horizontal"
            value={groupsSelected[index]}
            onChange={(event) => handleCheck(event, index)}
          >
            <CustomCheckbox value={0}>Mon</CustomCheckbox>
            <CustomCheckbox value={1}>Tue</CustomCheckbox>
            <CustomCheckbox value={2}>Wed</CustomCheckbox>
            <CustomCheckbox value={3}>Thu</CustomCheckbox>
            <CustomCheckbox value={4}>Fri</CustomCheckbox>
            <CustomCheckbox value={5}>Sat</CustomCheckbox>
            <CustomCheckbox value={6}>Sun</CustomCheckbox>
          </CheckboxGroup>
        </Skeleton>
      </div>
    ))
  );
}