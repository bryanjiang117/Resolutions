'use client'

import { useState, useEffect, useRef } from 'react';
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import {Textarea} from "@nextui-org/react";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/react";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, MenuItem } from "@nextui-org/react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure} from "@nextui-org/react";
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const [resolutionItems, setResolutionItems] = useState([]);
  const [resTitleInput, setResTitleInput] = useState(''); 
  const [resDescInput, setResDescInput] = useState('');
  const [resFreqInput, setResFreqInput] = useState(0);
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  
  const navItems = ['Profile', 'Resolutions', 'Daily To Do', 'Tasks', 'Settings'];

  // add a resolution to the database
  async function postResolution(title, desc, freq) {
    const submitData = {name: title, freq: freq, desc: desc};
    try 
    {
      const response = await fetch('/api/post-resolution', 
      {
        method: 'POST',
        body: JSON.stringify(submitData),
        headers: 
        {
          'Content-Type': 'application/json',
        }
      });
      
      if (response.ok) 
      {
        console.log('successfully posted resolution');
      } 
      else 
      {
        console.log('something went wrong with posting resolution');
      }
    }
    catch (error)
    {
      console.log(error);
    }
    updateResolutions();
  }

  // fetch the current resolutions from database
  async function updateResolutions() {
    try 
    {
      const response = await fetch('/api/view-table');
      if (response.ok) 
      {
        console.log('successfully fetched table');
      } 
      else 
      {
        console.log('something went wrong with fetching table');
      }
      const responseData = await response.json();
      setResolutionItems(responseData.response.rows); 
    } 
    catch (error)
    {
      console.log(error);
    }
  }

  async function handleOpenModal() {
    await onOpen();
    document.getElementById('modal-title-field').focus();
  }

  const handleEnter = (event, closeModal) => {
    if (event.key == 'Enter') 
    {
      console.log("handled enter");
      if (event.target.id == 'modal-title-field') 
      {
        document.getElementById('modal-desc-field').focus();
      }
      else if (event.target.id == 'modal-desc-field') 
      {
        saveResolution(event);
        setResDescInput('');
        setResTitleInput('');
        setResFreqInput(0);
        closeModal()
      }
    }
  }

  const saveResolution = (event) => {
    postResolution(resTitleInput, resDescInput, resFreqInput);
  }

  useEffect(() => {
    updateResolutions();
  }, []);

  return (
    <>
      <Navbar className='navbar' onMenuOpenChange={setMenuIsOpen}>

        <NavbarMenuToggle
          aria-label={menuIsOpen ? 'Close Menu' : 'Open Menu'}
          className='lg:hidden'
        />

        <NavbarContent className='nav-content hidden lg:flex'>
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
      
      <main className='column-container'>

        <div className='row-container' id='add-resolution'>
          <Button
            className='add-resolution'
            color="success"
            type='shadow'
            onPress={handleOpenModal}
          >
            +
          </Button>
          <Modal size='lg' isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className='modal-header'>
                    <h2>
                      Resolution
                    </h2>
                  </ModalHeader>
                  <ModalBody className='modal-body'>
                    <Input
                      variant='bordered'
                      placeholder='Enter your title...'
                      className='add-resolution'
                      value={resTitleInput}
                      onValueChange={setResTitleInput}
                      onKeyDown={(event) => handleEnter(event, onClose)}
                      id='modal-title-field'
                    />
                    <Textarea
                      variant='bordered'
                      placeholder='Enter your description...'
                      maxRows={3}
                      value={resDescInput}
                      onValueChange={setResDescInput}
                      onKeyDown={(event) => handleEnter(event, onClose)}
                      id='modal-desc-field'
                    />
                  </ModalBody>
                  <ModalFooter className='modal-footer'>
                    <Button
                      color='primary'
                      onPress={saveResolution}
                    >
                      Submit
                    </Button>
                    <Button
                      variant='light'
                      color='danger'
                      onPress={onClose}
                    >
                      Cancel
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        </div>

        <div className='row-container' id='resolution-list'>
          <div className='column-container' id='resolution-list'>
            {resolutionItems.map((item, index) => (
              <Card className='resolution-item' isPressable isBlurred isHoverable disableRipple shadow='none' key={index}>
                <CardBody className='resolution-body'>
                  <h3>
                    {item.name}
                  </h3>
                  {item.description}
                </CardBody>
                <div className='resolution-freq'>
                  {item.freq} times a week
                </div>
              </Card>
            ))}
          </div>
        </div>

      </main>
    </>
  )
}
