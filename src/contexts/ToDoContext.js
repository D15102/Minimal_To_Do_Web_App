import { createContext, useContext } from "react";

export const ToDoContext = createContext({
    todos: [
        {
            id: 1,
            todoTitle: "",
            completed: false
        }
    ],
    addToDo: (todo) => { },
    updateToDo: (id, todo) => { },
    deleteToDo: (id) => { },
    toggleCompleted: (id) => { },
})

export const ToDoProvider = ToDoContext.Provider

const useToDo = () => { 
    return useContext(ToDoContext)
}
export default useToDo