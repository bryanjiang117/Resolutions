'use client'

import { Card } from '@nextui-org/react';
import styles from './styles.module.css';
import NavbarComponent from '@/components/Navbar';

export default function Profile() {

  return (
    <>
      <NavbarComponent />

      <div className={`${styles['main-container']} flex justify-center items-center p-4`}>
        <div className='flex flex-col gap-4 w-full h-full'>
        
          <div className='flex flex-[4] gap-4 w-full'>

            <div className='flex flex-col flex-[3] gap-4 h-full'>
              <div className='flex flex-1 w-full gap-4'>
                <Card className='flex-1'>
                  streak
                </Card>
                <Card className='flex-1'>
                  completed
                </Card>
                <Card className='flex-1'>
                  missed
                </Card>
                <Card className='flex-1'>
                  completion rate
                </Card>
              </div>
              <Card className='flex-[3] w-full' id="chart">
                Chart
              </Card>
            </div>

            <div className='flex flex-col gap-4 flex-1 h-full'>
              <Card className='flex-1 w-full'>
                Best / Worst Day
              </Card>
              <Card className='flex-[3] w-full'>
                Tasks Today
              </Card>
            </div>

          </div>

          <div className='flex flex-[2] gap-4 w-full'>
            {/* flex-[9] and flex[7] so the ratio is 9/16 to line up with the gap after the 3rd card at the top */}
            <Card className='flex-[9]' id='resolutions'>
              Resolutions
            </Card>
            <Card className='flex-[7]' id='milestones'>
              Milestones
            </Card>
          </div>

        </div>
      </div>
    </>
  );
}