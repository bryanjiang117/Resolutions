'use client'

import { 
  React,
  useState,
  useEffect,
  useRef 
} from 'react';

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
import Image from 'next/image';
import {CustomCheckbox} from './CustomCheckbox';
import styles from './styles.module.css';

export default function Home() {  
  // navbar
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  // resolutions list
  const [listIsLoading, setListIsLoading] = useState(false);
  const [resolutionItems, setResolutionItems] = useState(['']);
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
  
  const navItems = ['Profile', 'Resolutions', 'Daily To Do', 'Tasks', 'Settings'];
  const days_of_week = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // creates a task instance object
  function createTaskInstance(day_of_week, start_time, end_time, complete) 
  {
    return {
      day_of_week: day_of_week,
      start_time: start_time,
      end_time: end_time,
      complete: complete
    }
  }
  
  // creates a task object
  function createTask(title, desc, instances) 
  {
    return {
      title: title,
      desc: desc,
      instances: instances
    };
  }

  // add a resolution to the database
  async function postResolution(title, desc, tasks) 
  {
    const submitData = 
    {
      title: title, 
      desc: desc,
      tasks: tasks
    };

    try 
    {
      setListIsLoading(true);
      const response = await fetch('/api/post-resolution', 
      {
        method: 'POST',
        body: JSON.stringify(submitData),
        headers: 
        {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok)
      {
        console.log('something went wrong with posting resolution');
      }
    }
    catch (error)
    {
      console.log(error);
    }
    finally 
    {
      refreshResolutions();
    }
  }

  // update a resolution with new values
  async function updateResolution(id, title, desc, tasks) 
  {
    try
    {
      setListIsLoading(true);
      const response = await fetch(`/api/update-resolution`, {
        method: 'POST',
        body: JSON.stringify({resolution_id: id, title: title, desc: desc, tasks: tasks}),
        headers: 
        {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        console.log('something went wrong with updating resolution');
      }
    }
    catch (error) 
    {
      console.log(error);
    }
    refreshResolutions();
  }

  // delete all resolutions from table (for now)
  async function deleteResolution(id) 
  {
    // console.log('delete resolution');
    try
    {
      setListIsLoading(true);
      const response = await fetch('/api/delete-resolution',
      {
        method: 'POST',
        body: JSON.stringify({resolution_id: id}),
        headers: 
        {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) 
      {
        console.log('something went wrong with deleting resolutions');  
      }
    }
    catch (error) 
    {
      console.log(error);
    }
    refreshResolutions();
  }

  // fetch the current resolutions from database
  async function refreshResolutions() 
  {
    try 
    {
      setListIsLoading(true);
      const response = await fetch('/api/refresh-resolutions');

      if (!response.ok)
      {
        console.log('something went wrong with fetching resolutions');
      }
      const responseData = await response.json();
      setResolutionItems(responseData.response.rows); 
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

  // cancels any changes and closes modal
  async function handleCancelRes(event) 
  {
    setModalIsLoading(true);
    await setTitle('');
    await setDesc('');
    await setResOpenType('none');
    setResIsOpen(false);
    setModalIsLoading(false);
  }

  // saves resolution for adding or updating
  function handleSaveRes(event) 
  {
    setModalIsLoading(true);
    if (resOpenType == 'add') 
    {
      const updatedTasks = [...tasks, createTask('task title', 'task desc', taskInstances)];
      setTasks(updatedTasks);
      postResolution(title, desc, updatedTasks);
    } 
    else if (resOpenType == 'update') 
    {
      const updatedTasks = [...tasks, createTask('updated task title', 'updated task desc', taskInstances)];
      setTasks(updatedTasks);
      updateResolution(selectedId, title, desc, updatedTasks);
    }
    setTitle('');
    setDesc('');
    setTasks([]);
    setTaskInstances([]);
    setGroupSelected([]);
    // await setResOpenType('none');
    setResIsOpen(false);
    setModalIsLoading(false);
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
      setTitle(resolutionItems[key].title);
      setDesc(resolutionItems[key].description);
      setSelectedId(resolutionItems[key].resolution_id);
      setResOpenType('update');
    } else if (event.target.id == 'add-resolution-button')
    {
      // console.log('adding a resolution');
      setSelectedId(-1);
      setResOpenType('add');
    }
    setResIsOpen(true);
  }

  // handles pressing enter key in modal
  async function handleEnter(event) 
  {
    if (!listIsLoading && !modalIsLoading && event.key == 'Enter') 
    {
      event.preventDefault();
      if (event.target.id == 'modal-title-field') 
      {
        document.getElementById('modal-desc-field').focus();
      }
      else if (event.target.id == 'modal-desc-field') 
      {
        handleSaveRes(event);
      }
    }
  }

  // deletes modal
  function handleDelete(event) 
  {
    deleteResolution(selectedId);
    handleCloseModal();
    refreshResolutions();
  }

  // handles checking a day of the week in modal
  function handleCheck(event) 
  {
    setGroupSelected(event);
    setTaskInstances((prevInstances) => [...prevInstances, createTaskInstance
    (
      event[event.length - 1], 
      new Date().toISOString().slice(11,19), 
      new Date().toISOString().slice(11,19), 
      false
    )]);
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
              <Link href='#'>
                {item}
              </Link>
            </NavbarItem>
          ))}
        </NavbarContent>

        <NavbarMenu>
          {navItems.map((item, index) => (
            <NavbarMenuItem key={index}>
              <Link href='#'>
                {item}
              </Link>
            </NavbarMenuItem>
          ))}
        </NavbarMenu>

      </Navbar>
      
      <main>

        <div className={styles['add-container']}>
          <Button
            color="success"
            onPress={handleOpenModal}
            id='add-resolution-button'
          >
            Add a resolution
          </Button>
            <Modal size='lg' isOpen={resIsOpen} onOpenChange={handleCloseModal}>
              <ModalContent>
                {modalIsLoading ? 
                  <CircularProgress size='sm' aria-label='Loading...' /> :
                  (onClose) => (
                    <>
                      <ModalHeader className={styles['modal-header']}>
                        <h2>
                          Resolution
                        </h2>
                        <div className={styles['options-container']}>
                          <Dropdown>
                            <DropdownTrigger>
                              <Button
                                variant='bordered'
                                isIconOnly
                                disableRipple
                              >
                                <img className={styles['options-icon']} src='kebab.svg' alt='options icon' />
                              </Button>
                            </DropdownTrigger>
                            <DropdownMenu aria-label='options'>
                              <DropdownItem key='export'>Export</DropdownItem>
                              {selectedId == -1 ? 
                                <DropdownItem isDisabled key='delete' onClick={handleDelete}>Delete</DropdownItem> :
                                <DropdownItem key='delete' onClick={handleDelete}>Delete</DropdownItem>                                
                              }
                            </DropdownMenu>
                          </Dropdown>
                        </div>
                      </ModalHeader>
                      <ModalBody>
                        <Input
                          variant='bordered'
                          label='Title'
                          placeholder='Enter your title...'
                          autoFocus
                          value={title}
                          onValueChange={setTitle}
                          onKeyDown={(event) => handleEnter(event, onClose)}
                          id='modal-title-field'
                        />
                        <Textarea
                          variant='bordered'
                          label='Description'
                          placeholder='Enter your description...'
                          maxRows={3}
                          value={desc}
                          onValueChange={setDesc}
                          onKeyDown={(event) => handleEnter(event, onClose)}
                          id='modal-desc-field'
                        />
                        <CheckboxGroup
                          className={styles['checkbox-group']}
                          label="Select times"
                          orientation="horizontal"
                          value={groupSelected}
                          onChange={handleCheck}
                        >
                          <CustomCheckbox value={1}>Mon</CustomCheckbox>
                          <CustomCheckbox value={2}>Tue</CustomCheckbox>
                          <CustomCheckbox value={3}>Wed</CustomCheckbox>
                          <CustomCheckbox value={4}>Thu</CustomCheckbox>
                          <CustomCheckbox value={5}>Fri</CustomCheckbox>
                          <CustomCheckbox value={6}>Sat</CustomCheckbox>
                          <CustomCheckbox value={0}>Sun</CustomCheckbox>
                        </CheckboxGroup>
                      </ModalBody>
                      <ModalFooter className={styles['modal-footer']}>
                        <Button
                          variant='flat'
                          color='primary'
                          onPress={handleSaveRes}
                        >
                          Submit
                        </Button>
                        <Button
                          variant='flat'
                          color='danger'
                          onPress={handleCancelRes}
                        >
                          Cancel
                        </Button>
                      </ModalFooter>
                    </>
                  )
                }
              </ModalContent>
            </Modal>
        </div>

        <div className={styles['list-horizontal-container']}>
          <div className={styles['list-vertical-container']}>
            {listIsLoading ? 
              <CircularProgress size='md' aria-label='loading...' /> :
              resolutionItems.map((item, index) => (
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
                  {/* TO DO make the resolution body div above not extend until freq */}
                  <div className={styles['resolution-freq']}>
                    0 times a week
                  </div>
                </Card>
              ))
            }
          </div>
        </div>

      </main>
    </>
  )
}
