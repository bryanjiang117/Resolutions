'use client'

import {
  Button,
  Input,
  Divider,
  Textarea, 
  Skeleton,
} from '@nextui-org/react';
import styles from '/app/styles.module.css';
import { useModal } from '/contexts/ModalContext';
import { useList } from '/contexts/ListContext';
import { ResolutionModalTasks } from './ResolutionModalTasks';
import { useRouter } from 'next/navigation';

export function ResolutionModalBody({ onClose }) 
{
  const {
    resOpenType,
    modalIsLoaded,
    title,
    setTitle,
    desc,
    setDesc,
    taskItems, 
    setTaskItems,
    createTask,
  } = useModal();

  const {
    listIsLoading,
    postResolution,
    updateResolution,
  } = useList();

  const router = useRouter();

  function handleAddTask(event) 
  {
    taskItems ? setTaskItems([...taskItems, createTask('', '', [])]) : setTaskItems([createTask('', '', [])]);
  }

  // saves resolution for adding or updating
  async function handleSaveRes(event) 
  {
    setModalIsLoaded(false);
    const updatedTaskItems = taskItems.map((task, taskIndex) => {
      let updatedInstances = [];
      if (groupsSelected[taskIndex]) 
      {
        updatedInstances = groupsSelected[taskIndex].reduce((instances, day_of_week) => {
          return [...instances, (createTaskInstance
            (
              day_of_week,
              new Date().toISOString().slice(11,19), 
              new Date().toISOString().slice(11,19), 
              false
            ))]
        }, []);
      } 

      return {
        title: task.title,
        description: task.description,
        instances: updatedInstances 
      }
    })

    if (resOpenType == 'add') 
    {
      await postResolution(title, desc, updatedTaskItems);
      window.location.reload();
    } 
    else if (resOpenType == 'update') 
    {
      await updateResolution(selectedId, title, desc, updatedTaskItems);
      window.location.reload();
    }
    setTitle('');
    setDesc('');
    setTaskItems([]);
    setGroupsSelected([[]]);
    setResModalIsOpen(false);
    setModalIsLoaded(true);
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
    <>
      <Skeleton isLoaded={modalIsLoaded} className='rounded-lg'>
        <Input
          variant='bordered'
          label='Title'
          placeholder='Enter your Resolution title...'
          {...(resOpenType == 'add' ? {autoFocus : true} : {})}
          value={title}
          onValueChange={setTitle}
          onKeyDown={(event) => handleEnter(event, onClose)}
          id='modal-title-field'
        />
      </Skeleton>
      <Skeleton isLoaded={modalIsLoaded} className='rounded-lg'>
        <Textarea
          variant='bordered'
          label='Description'
          placeholder='Enter your Resolution description...'
          maxRows={3}
          value={desc}
          onValueChange={setDesc}
          id='modal-desc-field'
        />
      </Skeleton>
      <Divider className='mb-2 mt-2' />
        <ResolutionModalTasks />
      <Skeleton isLoaded={modalIsLoaded} className='rounded-lg'>
        <Button
          className={styles['add-task']}
          variant='flat'
          size='sm'
          disableRipple
          onClick={handleAddTask}
        >
          Add Task
        </Button>
      </Skeleton>
    </>
  );
}