'use client'

import { useState } from 'react';
import { Card, CardHeader, CardBody, CardFooter, Divider, Checkbox } from '@nextui-org/react';
import styles from './styles.module.css';
import NavbarComponent from '@/components/Navbar';
import ListIcon from '@/assets/list-icon.svg';
import LineGraph from '@/components/LineGraph';
import ProgressCircle from '@/components/ProgressCircle';

const statsInfo = [
  {
    header: 'Streak',
    value: 14,
    description: 'At least 1 completed'
  },
  {
    header: 'Completed',
    value: 11,
    description: 'Completed this week'
  },
  {
    header: 'Missed',
    value: 2,
    description: 'Missed yesterday'
  }, 
  {
    header: 'Completion Rate',
    value: '86.3%',
    description: 'Consistency so far'
  }
];

const resolutionsInfo = [
  {
    label: "Fitness",
    progress: 46,
    value: 212,
    color: "#4CAF50",
  },
  {
    label: "Career",
    progress: 62,
    value: 382,
    color: "#00BCD4",
  },
  {
    label: "Social",
    progress: 46,
    value: 900,
    color: "#FF9800",
  }
];

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
      completed:false,
    }
  ]);

  function handleCheck(index) {
    const updatedTasks = tasks.map((task, i) => 
      i === index ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  }

  return (
    <>
      <NavbarComponent />

      <div className={`${styles['main-container']} flex justify-center items-center overflow-hidden p-4`}>
        <div className='flex flex-col gap-4 w-full h-full'>
        
          <div className='flex flex-[4] gap-4 w-full'>

            <div className='flex flex-col flex-[3] basis-[1px] min-w-0 gap-4 h-full'>
              <div className='flex flex-1 w-full gap-4'>
                {statsInfo.map((card, i) => (  
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
                          {card.description}
                        </p>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
              {/* min-w-[560px] because 4 cards and their gaps is 560px */}
              <Card className='flex-[3] basis-[1px] w-full min-w-[560px] p-2 overflow-hidden' id="chart">
                <CardHeader className='text-sm font-bold'>
                  Task Completion
                </CardHeader>
                <CardBody className='pr-8 overflow-hidden '>
                  <LineGraph />
                </CardBody>
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
                  <span className='text-sm ml-2'>
                    Tasks Today
                  </span>
                </CardHeader>
                <CardBody className='pt-1'>
                  {tasks.map((task, i) => {
                    return (
                      <div key={i} className={`flex items-center w-full mb-1 ${task.completed ? 'line-through text-gray-400' : ''}`}>
                        {/* empty checkbox because truncate requires display block on the checkbox but that messes with the formatting */}
                        <Checkbox 
                          size='sm'
                          lineThrough
                          className='w-full block flex-shrink-0' 
                          onChange={() => handleCheck(i)}
                        />
                        <span className='truncate w-full block text-sm'>
                          {task.title}
                        </span>
                      </div>
                    );
                  })} 
                </CardBody>
              </Card>

            </div>

          </div>

          <div className="flex flex-[2] gap-4 w-full overflow-hidden">
            {/* min-w-[416px] because 3 top cards and their gaps is 416px */}
            <Card className="flex-[9] p-2 min-w-[416px]" id="resolutions">
              <CardHeader className="text-sm font-bold">
                Resolutions
              </CardHeader>
              <CardBody className="flex items-center pt-0 pb-8">
                <div className="flex justify-around h-full w-full min-w-0 overflow-hidden p-4">
                  {resolutionsInfo.map((info, i) => {
                    return (
                      <div className="flex justify-center flex-1 basis-[0] min-w-0" key={i}>
                        <ProgressCircle progress={info.progress} value={info.value} label={info.label} color={info.color} />
                      </div>
                    );
                  })}
                </div>
              </CardBody>
            </Card>

            <Card className="flex-[7] p-2" id="milestones">
              <CardHeader className="text-sm font-bold">
                Milestones
              </CardHeader>
            </Card>
          </div>


        </div>
      </div>
    </>
  );
}