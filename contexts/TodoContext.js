import { createContext, useContext, useState } from 'react';

const TodoContext = createContext({});

export const useTodo = () => useContext(TodoContext);

export const TodoProvider = ({ children }) => 
{
  const daysOfTheWeek = ['M', 'T', 'W', 'Th', 'F', 'Sa', 'Su'];
  const [listIsLoading, setListIsLoading] = useState(false);
  const [tasksToday, setTasksToday] = useState([]);

  // fetch the current resolutions from database
  async function fetchTaskInstances() 
  {
    try 
    {
      setListIsLoading(true);
      const response = await fetch('/api/fetch-task-instances');

      if (!response.ok)
      {
        console.log('something went wrong with fetching tasks');
      }
      const updatedTasksToday = (await response.json()).data;
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
  
  return <TodoContext.Provider value={{
    daysOfTheWeek,
    listIsLoading,
    tasksToday,
    fetchTaskInstances,
    setTaskCompletion,
    handleCheck
  }}>
    {children}
  </TodoContext.Provider>
}