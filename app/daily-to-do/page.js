'use client'

import { useState, useEffect, useRef } from 'react';
import {
  Button,
  Input,
  CheckboxGroup, 
  Textarea, 
  Card, 
  CardHeader, 
  CardBody, 
  CardFooter,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem, 
  NavbarMenuToggle, 
  NavbarMenu, 
  NavbarMenuItem, 
  MenuItem, 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter,
  CircularProgress,
  Dropdown, 
  DropdownTrigger,
  DropdownMenu, 
  DropdownItem,
  Checkbox,
} from '@nextui-org/react';
import Link from 'next/link';
import styles from './styles.module.css';

export default function Todo() {
  // navbar
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  // task list
  const [listIsLoading, setListIsLoading] = useState(false);
  const [taskItems, setTaskItems] = useState([]);
  const [tasksToday, setTasksToday] = useState([]);
  // modal 
  const [selectedId, setSelectedId] = useState(-1);
  const [resIsOpen, setResIsOpen] = useState(false);
  const [resOpenType, setResOpenType] = useState('none');
  const [title, setTitle] = useState(''); 
  const [desc, setDesc] = useState('');
  const [tasks, setTasks] = useState([]);
  const [modalIsLoading, setModalIsLoading] = useState(false);
  const [groupSelected, setGroupSelected] = useState([]);
  const [taskInstances, setTaskInstances] = useState([]);

  const navItems = [['Profile', 'profile'], ['Resolutions', '/'], ['Daily To-Do', 'daily-to-do']];

  // fetch the current resolutions from database
  async function refreshTasks() 
  {
    try 
    {
      setListIsLoading(true);
      const response = await fetch('/api/refresh-tasks');

      if (!response.ok)
      {
        console.log('something went wrong with fetching tasks');
      }
      const responseData = await response.json();
      setTaskItems(responseData.response); 
      const updatedTasksToday = responseData.response.reduce((total, item) => {
        const todaysInstance = item.instances.filter((instance) => instance.day_of_week === (new Date()).getDay());
        return (todaysInstance.length > 0 ? 
          [...total, 
          {
            task: item.task,
            instance: todaysInstance[0],
            nInstances: item.instances.length
          }
          ] :
          total
        );
      }, [])
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
      // setTitle(TaskItems[key].title);
      // setDesc(TaskItems[key].description);
      // setSelectedId(TaskItems[key].resolution_id);
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
    updatedTasksToday[index].instance.completed = !updatedTasksToday[index].instance.completed;
    setTasksToday(updatedTasksToday);
    setTaskCompletion(tasksToday[index].instance.task_instance_id, updatedTasksToday[index].instance.completed);
  }

  useEffect(() => {
    refreshTasks();
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
              tasksToday.map((item, index) => (
                    <Card 
                      className={styles['task-item']} // source of "uncontrolled to controlled" warning ?
                      isPressable isBlurred isHoverable disableRipple shadow='none' 
                      onClick={handleOpenModal}
                      key={item.instance.task_instance_id}
                      id={`task-item-${item.instance.task_instance_id}`} 
                    >
                      <CardBody className={styles['task-body']}>
                        <div className='flex flex-col w-full'>
                          <Checkbox 
                            color='success' 
                            size='md' 
                            lineThrough
                            isSelected={item.instance.completed}
                            onClick={(event) => handleCheck(event, index)}
                          >
                            {item.task.title}
                          </Checkbox>
                        </div>
                        <div className={styles['title-and-desc']}> 
                          <div className={styles['resolution-title']}>
                            
                          </div>
                          {item.task.description}
                        </div>
                        
                      </CardBody>
                      {/* TO DO make the resolution body div above not extend until freq */}
                      <div className={styles['task-freq']}>
                        {item.nInstances} times a week
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