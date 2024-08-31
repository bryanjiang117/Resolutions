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
      
      const fetchedTaskItems = (await response.json()).data;
      setTaskItems(fetchedTaskItems);
      setGroupsSelected(
        fetchedTaskItems.map(item => {
          return item.recurrence_days.reduce((selectedDays, isDaySelected, index) => {
            if (isDaySelected) {
              selectedDays.push(index);
            }
            return selectedDays;
          }, []);
        })
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
    fetchTasks,
  }} >
    {children}
  </ModalContext.Provider>
}