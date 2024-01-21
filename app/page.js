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
  Divider,
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
// import { ReactComponent as PlusIcon } from '../public/add.svg';

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
  const [taskItems, setTaskItems] = useState([]);
  const [modalIsLoading, setModalIsLoading] = useState(false);
  const [groupsSelected, setGroupsSelected] = useState([[]]);
  
  const navItems = [['Profile', 'profile'], ['Resolutions', '/'], ['Daily To-Do', 'daily-to-do'], 
                    ['Tasks', 'tasks'], ['Settings', 'settings']];

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
  async function postResolution(title, desc, taskItems) 
  {
    const submitData = 
    {
      title: title, 
      desc: desc,
      taskItems: taskItems
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
  async function updateResolution(id, title, desc, taskItems) 
  {
    try
    {
      setListIsLoading(true);
      const response = await fetch(`/api/update-resolution`, 
      {
        method: 'POST',
        body: JSON.stringify({resolution_id: id, title: title, desc: desc, taskItems: taskItems}),
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

  async function fetchTasks(resolution_id) 
  {
    try 
    {
      setModalIsLoading(true);
      const query = new URLSearchParams({resolution_id: resolution_id}).toString();
      const response = await fetch(`/api/fetch-tasks?${query}`);

      if (!response.ok) 
      {
        console.log('something went wrong with fetching tasks');
      }
      
      const responseData = await response.json();
      console.log('taskItems ', responseData.taskItems);
      setTaskItems(responseData.taskItems);

      setGroupsSelected( 
        responseData.taskItems.reduce((groupsSelected, task) => 
        {
          return [...groupsSelected, task.instances.length > 0
            ? task.instances.reduce((groupSelected, instance) => 
            {
              return [...groupSelected, instance.day_of_week];
            }, [])
            : []
          ]
        }, [])
      );
    }
    catch (error)
    {
      console.log(error); 
    }
    finally
    {
      setModalIsLoading(false);
    }
  }

  function handleAddTask(event) 
  {
    setTaskItems([...taskItems, createTask('', '', [])]);
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
      postResolution(title, desc, updatedTaskItems);
    } 
    else if (resOpenType == 'update') 
    {
      updateResolution(selectedId, title, desc, updatedTaskItems);
    }
    setTitle('');
    setDesc('');
    setTaskItems([]);
    setGroupsSelected([[]]);
    setResIsOpen(false);
    setModalIsLoading(false);
  }

  // handles closing the modal with built-in methods (ex: clicking outside)
  function handleCloseModal(event) 
  {
    setModalIsLoading(true);
    setTitle('');
    setDesc('');
    setGroupsSelected([[]]);
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
    setResIsOpen(true);
  }

  // handles pressing enter key in modal
  async function handleEnter(event) 
  {
    if (!listIsLoading && !modalIsLoading && event.key == 'Enter') 
    {
      event.preventDefault();
      const id = event.target.id[11];
      if (event.target.id == 'modal-title-field') 
      {
        document.getElementById('modal-desc-field').focus();
      }
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

  // deletes modal
  function handleDelete(event) 
  {
    deleteResolution(selectedId);
    handleCloseModal();
    refreshResolutions();
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
  }

  function handleChangeTitle(event, task) {
    const updatedTaskItems = [...taskItems];
    updatedTaskItems[task].title = event;
    setTaskItems(updatedTaskItems);
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
      
      <main className={styles['main-container']}>

        <Button
          className={styles['add-button']}
          color="success"
          isIconOnly
          onPress={handleOpenModal}
          id='add-resolution-button'
        >
          {/* <PlusIcon className={styles['add-icon']} />   */}
        </Button>

        <Modal size='lg' backdrop='blur' scrollBehavior='outside' isOpen={resIsOpen} onOpenChange={handleCloseModal}>
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
                      placeholder='Enter your Resolution title...'
                      autoFocus
                      value={title}
                      onValueChange={setTitle}
                      onKeyDown={(event) => handleEnter(event, onClose)}
                      id='modal-title-field'
                    />
                    <Textarea
                      variant='bordered'
                      label='Description'
                      placeholder='Enter your Resolution description...'
                      maxRows={3}
                      value={desc}
                      onValueChange={setDesc}
                      onKeyDown={(event) => handleEnter(event, onClose)}
                      id='modal-desc-field'
                    />
                    <Divider className='mb-2 mt-2' />
                    {taskItems.map((item, index) => (
                      <div key={index}>
                        <Input 
                          variant='flat'
                          isHoverable='false'
                          placeholder='Enter your Task Title...'
                          size='sm'
                          autoFocus
                          value={item.title}
                          onValueChange={(event) => handleChangeTitle(event, index)}
                          onKeyDown={handleEnter}
                          id={`task-input-${index}`}
                        />
                        <CheckboxGroup
                          className={styles['checkbox-group']}
                          orientation="horizontal"
                          value={groupsSelected[index]}
                          onChange={(event) => handleCheck(event, index)}
                        >
                          <CustomCheckbox value={1}>Mon</CustomCheckbox>
                          <CustomCheckbox value={2}>Tue</CustomCheckbox>
                          <CustomCheckbox value={3}>Wed</CustomCheckbox>
                          <CustomCheckbox value={4}>Thu</CustomCheckbox>
                          <CustomCheckbox value={5}>Fri</CustomCheckbox>
                          <CustomCheckbox value={6}>Sat</CustomCheckbox>
                          <CustomCheckbox value={0}>Sun</CustomCheckbox>
                        </CheckboxGroup>
                        {/* <Divider className='mb-1'/> */}
                      </div>
                    ))}
                    <Button
                      className={styles['add-task']}
                      variant='flat'
                      size='sm'
                      disableRipple
                      onClick={handleAddTask}
                    >
                      Add Task
                    </Button>
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

        <div className={styles['list-horizontal-container']}>
          <div className={styles['list-vertical-container']}>
            {listIsLoading ? 
              <div className={styles.loading}>
                <CircularProgress size='md' aria-label='loading...' />
              </div> :
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
                </Card>
              ))
            }
          </div>
        </div>

      </main>
    </>
  )
}
