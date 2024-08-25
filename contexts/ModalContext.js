import { createContext, useContext, useState } from 'react';

const ModalContext = createContext({});

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({children}) => 
{
  const [selectedId, setSelectedId] = useState(-1);
  const [resModalIsOpen, setResModalIsOpen] = useState(false);
  const [resOpenType, setResOpenType] = useState('none');
  const [title, setTitle] = useState(''); 
  const [desc, setDesc] = useState('');
  const [modalIsLoaded, setModalIsLoaded] = useState(true);
  const [groupsSelected, setGroupsSelected] = useState([[]]);
  const [taskItems, setTaskItems] = useState([]);

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

  async function fetchTasks(resolution_id) 
  {
    try 
    {
      setModalIsLoaded(false);
      const query = new URLSearchParams({resolution_id: resolution_id}).toString();
      const response = await fetch(`/api/fetch-tasks?${query}`, { revalidate: 0 });

      if (!response.ok) 
      {
        console.log('something went wrong with fetching tasks');
      }
      
      const responseData = await response.json();
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
      setModalIsLoaded(true);
    }
  }

  return <ModalContext.Provider value={{
    selectedId,
    setSelectedId,
    resModalIsOpen,
    setResModalIsOpen,
    resOpenType,
    setResOpenType,
    modalIsLoaded,
    setModalIsLoaded,
    title,
    setTitle,
    desc,
    setDesc,
    groupsSelected,
    setGroupsSelected,
    taskItems, 
    setTaskItems,
    createTaskInstance,
    createTask,
    fetchTasks,
  }} >
    {children}
  </ModalContext.Provider>
}