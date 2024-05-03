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
  Skeleton,
} from '@nextui-org/react';

const ResolutionModal = () => {

  const [resIsOpen, setResIsOpen] = useState(false);

  return (
    <div>
      <Modal size='lg' backdrop='blur' scrollBehavior='outside' isOpen={resIsOpen} onOpenChange={handleCloseModal}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className={styles['modal-header']}>
                <Skeleton isLoaded={modalIsLoaded} className='rounded-lg'>
                  <h2>
                    Resolution
                  </h2>
                </Skeleton>
                <div className={styles['options-container']}>
                  <Dropdown>
                    <Skeleton isLoaded={modalIsLoaded} className='rounded-lg'>  
                      <DropdownTrigger>
                        <Button
                          variant='bordered'
                          isIconOnly
                          disableRipple
                        >
                          <img className={styles['options-icon']} src='kebab.svg' alt='options icon' />
                        </Button>
                      </DropdownTrigger>
                    </Skeleton>
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
                {taskItems ? taskItems.map((item, index) => (
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
                        value={item.description}
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
                        <CustomCheckbox value={0}>Sun</CustomCheckbox>
                        <CustomCheckbox value={1}>Mon</CustomCheckbox>
                        <CustomCheckbox value={2}>Tue</CustomCheckbox>
                        <CustomCheckbox value={3}>Wed</CustomCheckbox>
                        <CustomCheckbox value={4}>Thu</CustomCheckbox>
                        <CustomCheckbox value={5}>Fri</CustomCheckbox>
                        <CustomCheckbox value={6}>Sat</CustomCheckbox>
                      </CheckboxGroup>
                    </Skeleton>
                  </div>
                )) :
                null}
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
              </ModalBody>
              <ModalFooter className={styles['modal-footer']}>
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
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

    </div>
  )
}

export default ResolutionModal;
