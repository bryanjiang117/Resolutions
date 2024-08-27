'use client'

import { useState } from 'react';
import { Card, CardHeader, CardBody, CardFooter, Divider, Checkbox } from '@nextui-org/react';
import styles from './styles.module.css';
import NavbarComponent from '@/components/Navbar';
import ListIcon from '@/app/assets/list-icon.svg';

export default function Profile() {
  const [tasks, setTasks] = useState([
    {
      title: 'Go to the gym',
      completed: false,
    },
    {
      title: 'Do one leetcode question fdsfdsfdsfdsfsdf',
      completed: false,
    },
    {
      title: 'Go for a run',
      completed: false,
    }
  ]);
  const cardInfo = [
    {
      header: 'Streak',
      value: 14,
      desc: 'At least 1 completed'
    },
    {
      header: 'Completed',
      value: 11,
      desc: 'Completed this week'
    },
    {
      header: 'Missed',
      value: 2,
      desc: 'Missed yesterday'
    }, 
    {
      header: 'Completion Rate',
      value: '86.3%',
      desc: 'Consistency so far'
    }
  ];

  function handleCheck(index) {
    const updatedTasks = tasks.map((task, i) => 
      i === index ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  }

  return (
    <>
      <NavbarComponent />

      <div className={`${styles['main-container']} flex justify-center items-center p-4`}>
        <div className='flex flex-col gap-4 w-full h-full'>
        
          <div className='flex flex-[4] gap-4 w-full'>

            <div className='flex flex-col flex-[3] gap-4 h-full'>
              <div className='flex flex-1 w-full gap-4'>
                {cardInfo.map((card, i) => (
                  <Card className='flex-1 p-2 self-stretch min-h-32 max-h-32 min-w-32' key={i}>
                    <CardHeader className='flex items-center justify-center w-full text-center text-gray-200 text-xs'>
                      {card.header}
                    </CardHeader>
                    <CardBody className='flex flex-col justify-center h-full pt-0'>
                      <div className='text-center'>
                        <div className='mb-1 font-bold text-xl'>
                          {card.value}
                        </div>
                        <p className='text-gray-500 text-xs truncate'>
                          {card.desc}
                        </p>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
              <Card className='flex-[3] w-full p-2' id="chart">
                <CardHeader className='text-sm text-gray-200'>
                  Task Completion Overtime
                </CardHeader>
              </Card>
            </div>

            <div className='flex flex-col gap-4 flex-1 h-full min-w-48'>

              <Card className='flex-1 p-2 min-h-32 max-h-32'>
                <div className='flex flex-1 w-full'>
                  <div className='flex flex-col flex-1 justify-center items-center h-100'>
                    <div className='text-sm'>
                      Best
                    </div>
                    <div className='text-lg text-green-400'>
                      Mon
                    </div>
                  </div>
                  <Divider orientation='vertical'/>
                  <div className='flex flex-col flex-1 justify-center items-center h-100'>
                    <div className='text-sm'>
                      Worst
                    </div>
                    <div className='text-lg text-red-400'>
                      Fri
                    </div>
                  </div>
                </div>
              </Card>

              <Card className='flex-[3] p-2'>
                <CardHeader className='text-white'>
                  <ListIcon className='fill-current h-5 w-5'/>
                  <span className='text-sm ml-2 text-gray-200'>
                    Tasks Today
                  </span>
                </CardHeader>
                <CardBody className='flex'>
                  {tasks.map((task, i) => {
                    return (
                      <div key={i} className={`flex items-center w-full ${task.completed ? 'line-through text-gray-400' : ''}`}>
                        {/* empty checkbox because truncate requires display block on the checkbox but that messes with the formatting */}
                        <Checkbox 
                          lineThrough
                          className='w-full block flex-shrink-0' 
                          onChange={() => handleCheck(i)}
                        />
                        <span className='truncate w-full block'>
                          {task.title}
                        </span>
                      </div>
                    );
                  })} 
                </CardBody>
              </Card>

            </div>

          </div>

          <div className='flex flex-[2] gap-4 w-full'>
            {/* flex-[9] and flex[7] so the ratio is 9/16 to line up with the gap after the 3rd card at the top */}
            <Card className='flex-[9] p-2 text-gray-200' id='resolutions'>
              <CardHeader>
                Resolutions
              </CardHeader>
            </Card>
            <Card className='flex-[7] p-2 text-gray-200' id='milestones'>
              <CardHeader>
                Milestones
              </CardHeader>
            </Card>
          </div>

        </div>
      </div>
    </>
  );
}