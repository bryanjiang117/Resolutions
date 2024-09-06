'use client'

import { useState, useEffect } from 'react';
import {
  Card, 
  CardBody, 
  CircularProgress,
  Checkbox,
} from '@nextui-org/react';
import styles from './styles.module.css';
import NavbarComponent from '@/components/Navbar';
import { useTodo } from '@/contexts/TodoContext';

export default function Todo() {
  const { 
    daysOfTheWeek, 
    listIsLoading, 
    tasksToday, 
    fetchTaskInstances, 
    handleCheck 
  } = useTodo();
  
  useEffect(() => {
    fetchTaskInstances();
  }, []);

  return (
    <>
      <NavbarComponent />
      
      <main className={styles['vertical-container']}>

        <div className={styles['list-horizontal-container']}>
          <div className={styles['list-vertical-container']}>
            {listIsLoading ? 
              <div className={styles.loading}>
                <CircularProgress size='md' aria-label='loading...' />
              </div> :
              <>
                {tasksToday.map((task, index) => (
                  <Card 
                    className={styles['task-item']} // source of "uncontrolled to controlled" warning ?
                    isPressable isBlurred isHoverable disableRipple shadow='none' 
                    onClick={(event) => handleCheck(event, index)}
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
                  
                    <div className={styles['task-days-of-week']}>
                      {daysOfTheWeek.map((day, index) => (
                        <span 
                          key={index} 
                          className={task.recurrence_days[index] ? 'text-primary' : 'text-gray-500'}
                        >
                          {day + ' '}
                        </span>
                      ))}
                    </div>

                  </Card>
                ))}
              </>
            }
          </div>
        </div>

      </main>      
    </>
  );
}