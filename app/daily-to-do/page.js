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
} from '@nextui-org/react';
import Link from 'next/link';
import styles from './styles.module.css';

export default function Todo() {
  // navbar
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  // resolutions list
  const [listIsLoading, setListIsLoading] = useState(false);
  const [taskItems, setTaskItems] = useState([]);
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

  const navItems = [['Profile', 'profile'], ['Resolutions', '/'], ['Daily To-Do', 'daily-to-do'], 
                    ['Tasks', 'tasks'], ['Settings', 'settings']];

  // fetch the current resolutions from database
  async function refreshResolutions() 
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
      console.log(responseData.response);
      console.log("task title: ", responseData.response[0].task.title);
      setTaskItems(responseData.response); 
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

  // handles closing the modal with built-in methods (ex: clicking outside)
  async function handleCloseModal(event) 
  {
    setModalIsLoading(true);
    await setTitle('');
    await setDesc('');
    await setTaskInstances([]);
    await setGroupSelected([]);
    setResIsOpen(false);
    setModalIsLoading(false);
  }

  // open modal for adding or updating a resolution
  async function handleOpenModal(event) 
  {
    const idPrefix = 'resolution-item-';
    const regex = new RegExp(`^${idPrefix}\\d+$`);
    if (regex.test(event.target.id)) 
    {
      // console.log('updating a resolution');
      const key = parseInt(event.target.id.substring(idPrefix.length));
      // console.log('the key: ', key);
      // setTitle(TaskItems[key].title);
      // setDesc(TaskItems[key].description);
      // setSelectedId(TaskItems[key].resolution_id);
      setResOpenType('update');
    } else if (event.target.id == 'add-resolution-button')
    {
      // console.log('adding a resolution');
      setSelectedId(-1);
      setResOpenType('add');
    }
    setResIsOpen(true);
  }

  useEffect(() => {
    refreshResolutions();
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
      
      <main>

        <div className={styles['list-horizontal-container']}>
          <div className={styles['list-vertical-container']}>
            {listIsLoading ? 
              <CircularProgress size='md' aria-label='loading...' /> :
              taskItems.map((item) => (
                item.instances.map((instance) => (
                  instance.day_of_week === (new Date()).getDay() ? 
                    <Card 
                      className={styles['task-item']} // source of "uncontrolled to controlled" warning
                      isPressable isBlurred isHoverable disableRipple shadow='none' 
                      onPress={handleOpenModal}
                      key={instance.task_instance_id}
                      id={`task-item-${instance.task_instance_id}`} 
                    >
                      <CardBody className={styles['task-body']}>
                        <div className={styles['title-and-desc']}> 
                          <div className={styles['resolution-title']}>
                            {item.task.title}
                          </div>
                          {item.task.description}
                        </div>
                        
                      </CardBody>
                      {/* TO DO make the resolution body div above not extend until freq */}
                      <div className={styles['task-freq']}>
                        {item.instances.length} times a week
                      </div>
                    </Card> :
                    null
                ))
              ))
            }
          </div>
        </div>

      </main>      
    </>
  );
}