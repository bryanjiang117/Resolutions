  // USE CONTEXT FOR LISTISLOADING AND MODALISLOADED ETC
  
import { useCallback } from "react";

export function useKeyboardNav(handleSubmit, handleCancel, moveFocus)


  const handleKeyDown = useCallback((event) => 
  {
    switch (event.key)
    {
      case 'Enter' 
      {
        if (!listIsLoading && modalIsLoaded) 
        {
          event.preventDefault();
          const id = parseInt(event.target.id[11]);
          if (event.target.id == 'modal-title-field') 
          {
            document.getElementById('modal-desc-field').focus();
          }
          // TO DO: change this to a down arrow key since people want to use enter to do nextline for description
          else if (event.target.id == 'modal-desc-field' && taskItems.length > 0) 
          {
            document.getElementById('task-input-0').focus();
          }
          else if (event.target.id.startsWith('task-input-') && id < taskItems.length - 1)
          {
            document.getElementById(`task-input-${id + 1}`).focus();
          } 
          else
          {
            handleSaveRes(event);
          }
        }
      }
    }
  });

}