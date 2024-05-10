import { createContext, useContext, useState } from 'react';

const ListContext = createContext({});

export const useList = () => useContext(ListContext);

export const ListProvider = ({children}) => 
{ 
  const [listIsLoading, setListIsLoading] = useState(false);
  const [resolutionItems, setResolutionItems] = useState(['']);

  // add a resolution to the database
  async function postResolution(title, desc, taskItems) 
  {
    try 
    {
      setListIsLoading(true);
      const response = await fetch('/api/post-resolution', 
      {
        method: 'POST',
        body: JSON.stringify(
          {
            title: title,
            desc: desc,
            taskItems: taskItems
          }
        ),
        headers: 
        {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok)
      {
        console.log('something went wrong with posting resolution');
      }
    }
    catch (error)
    {
      console.log(error);
    }
    finally 
    {
      refreshResolutions();
    }
  }

    // update a resolution with new values
  async function updateResolution(id, title, desc, taskItems) 
  {
    try
    {
      setListIsLoading(true);
      console.log(taskItems);
      const response = await fetch(`/api/update-resolution`, 
      {
        method: 'POST',
        body: JSON.stringify(
          {
            resolution_id: id, 
            title: title, 
            desc: desc, 
            taskItems: taskItems
          }),
        headers: 
        {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        console.log('something went wrong with updating resolution');
      }
      console.log(response);
    }
    catch (error) 
    {
      console.log(error);
    }
    refreshResolutions();
  }

  // delete all resolutions from table (for now)
  async function deleteResolution(id) 
  {
    // console.log('delete resolution');
    try
    {
      setListIsLoading(true);
      const response = await fetch('/api/delete-resolution',
      {
        method: 'POST',
        body: JSON.stringify({resolution_id: id}),
        headers: 
        {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) 
      {
        console.log('something went wrong with deleting resolutions');  
      }
    }
    catch (error) 
    {
      console.log(error);
    }
    refreshResolutions();
  }

  // fetch the current resolutions from database
  async function refreshResolutions() 
  {
    try 
    {
      setListIsLoading(true);
      const response = await fetch('/api/fetch-resolutions', {
        headers: {
          'Cache-Control': 'no-cache', // This tells the browser to fetch the data from the server without using the cache
          'Pragma': 'no-cache', // Ensures compatibility with HTTP/1.0 caches (older caches)
        }
      });

      if (!response.ok)
      {
        console.log('something went wrong with fetching resolutions');
      }
      const responseData = await response.json();
      setResolutionItems(responseData.response.rows); 
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
  
  return <ListContext.Provider value={{
    listIsLoading,
    setListIsLoading,
    resolutionItems,
    setResolutionItems,
    postResolution,
    updateResolution,
    deleteResolution,
    refreshResolutions,
  }} >
    {children}
  </ListContext.Provider>
}