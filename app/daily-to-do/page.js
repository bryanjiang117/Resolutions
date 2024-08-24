'use client'

import { useState, useEffect } from 'react';
import {
  Card, 
  CardBody, 
  Navbar,
  NavbarContent,
  NavbarItem, 
  NavbarMenuToggle, 
  NavbarMenu, 
  NavbarMenuItem, 
  CircularProgress,
  Checkbox,
} from '@nextui-org/react';
import Link from 'next/link';
import styles from './styles.module.css';

export default function Todo() {
  // navbar
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  // task list
  const [listIsLoading, setListIsLoading] = useState(false);
  const [tasksToday, setTasksToday] = useState([]);

  const navItems = [['Profile', 'profile'], ['Resolutions', '/'], ['Daily To-Do', 'daily-to-do']];

  // fetch the current resolutions from database
  async function fetchTasks() 
  {
    try 
    {
      setListIsLoading(true);
      const response = await fetch('/api/fetch-task-instances');

      if (!response.ok)
      {
        console.log('something went wrong with fetching tasks');
      }
      const responseData = await response.json();
      const updatedTasksToday = responseData.response.filter((task) => task.day_of_week === (new Date()).getDay());
      setTasksToday(updatedTasksToday);
      console.log(updatedTasksToday);
    } 
    catch (error)
    {
      console.log(error);
    }
    finally 
    {
      setListIsLoading(false);
    }
  }

  // set a task to be completed / uncompleted
  async function setTaskCompletion(task_instance_id, completed)
  {
    try 
    {
      const response = await fetch('/api/set-task-completion', 
      {
        method: 'POST',
        body: JSON.stringify(
        {
          task_instance_id: task_instance_id,
          completed: completed
        }),
        headers:
        {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) 
      {
        console.log('something went wrong with setting the task completion');
      }
    } 
    catch (error) 
    {
      console.log(error);
    }
  }

  // handles closing the modal with built-in methods (ex: clicking outside)
  async function handleCloseModal(event) 
  {
    setModalIsLoading(true);
    setTitle('');
    setDesc('');
    setTaskInstances([]);
    setGroupSelected([]);
    setResIsOpen(false);
    setModalIsLoading(false);
  }

  // open modal for adding or updating a resolution
  function handleOpenModal(event) 
  {
    const idPrefix = 'resolution-item-';
    const regex = new RegExp(`^${idPrefix}\\d+$`);
    if (regex.test(event.target.id)) 
    {
      const key = parseInt(event.target.id.substring(idPrefix.length));
      setResOpenType('update');
    } else if (event.target.id == 'add-resolution-button')
    {
      setSelectedId(-1);
      setResOpenType('add');
    }
    setResIsOpen(true);
  }

  function handleCheck(event, index) {
    const updatedTasksToday = [...tasksToday];
    updatedTasksToday[index].completed = !updatedTasksToday[index].completed;
    setTasksToday(updatedTasksToday);
    setTaskCompletion(tasksToday[index].task_instance_id, updatedTasksToday[index].completed);
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <>
      <Navbar className={styles.navbar} onMenuOpenChange={setMenuIsOpen}>

        <NavbarMenuToggle
          aria-label={menuIsOpen ? 'Close Menu' : 'Open Menu'}
          className='lg:hidden'
        />


        <NavbarContent className={`${styles['nav-content']} hidden lg:flex`}>
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
      
      <main className={styles['vertical-container']}>

        <div className={styles['list-horizontal-container']}>
          <div className={styles['list-vertical-container']}>
            {listIsLoading ? 
              <div className={styles.loading}>
                <CircularProgress size='md' aria-label='loading...' />
              </div> :
              tasksToday.map((task, index) => (
                <Card 
                  className={styles['task-item']} // source of "uncontrolled to controlled" warning ?
                  isPressable isBlurred isHoverable disableRipple shadow='none' 
                  onClick={handleOpenModal}
                  key={task.task_instance_id}
                  id={`task-item-${task.task_instance_id}`} 
                >
                  <CardBody className={styles['task-body']}>
                    <div className='flex flex-col w-full'>
                      <Checkbox 
                        color='success' 
                        size='md' 
                        lineThrough
                        isSelected={task.completed}
                        onClick={(event) => handleCheck(event, index)}
                      >
                        {task.title}
                      </Checkbox>
                    </div>
                    <div className={styles['title-and-desc']}> 
                      <div className={styles['resolution-title']}>
                        
                      </div>
                      {task.description}
                    </div>
                    
                  </CardBody>
                  {/* TO DO make the resolution body div above not extend until freq */}
                  <div className={styles['task-freq']}>
                    {task.instance_count} times a week
                  </div>
                </Card>
              ))
            }
          </div>
        </div>

      </main>      
    </>
  );
}