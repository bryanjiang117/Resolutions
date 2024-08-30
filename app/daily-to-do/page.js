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

const daysOfTheWeek = ['M', 'T', 'W', 'Th', 'F', 'Sa', 'Su'];

export default function Todo() {
  // task list
  const [listIsLoading, setListIsLoading] = useState(false);
  const [tasksToday, setTasksToday] = useState([]);
  
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
      const updatedTasksToday = (await response.json()).response;
      setTasksToday(updatedTasksToday);
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