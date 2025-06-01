import BoldCopy from "./components/mage-ui/text/bold-copy";
import ToDoForm from "./components/myComponents/ToDoForm";
import ToDoItems from "./components/myComponents/ToDoItems";
import { ToDoProvider } from "../src/contexts/ToDoContext";
import { useEffect, useState } from "react";
import { Flip, ToastContainer } from "react-toastify";
import ToggleSwitch from "./components/mage-ui/button/toggle-switch";
import CanvasCursor from "./components/mage-ui/cursor-effects/canvas-cursor-effect";
import { SparklesTextDemo } from "./components/mage-ui/text/sparkles-text";
import { ThemeProvider } from "./contexts/ThemeContext";
const App = () => {
  const [todos, settodos] = useState([]);

  const [themeMode, setthemeMode] = useState("dark");

  //Dark Light Theme Functionality
  const lightMode = () => {
    setthemeMode("light")
  };
  const darkMode = () => {
    setthemeMode("dark")
  };

  useEffect(() => {
    const html = document.querySelector("html")
    html.classList.remove("light","dark")
    html.classList.add(themeMode)
  }, [themeMode])
  
  // ToDo Funtions Start ...
  const addToDo = (todo) => {
    settodos((prev) => [
      ...prev,
      {
        id: Date.now(),
        ...todo,
      },
    ]);
  };
  const updateToDo = (id, todoTitle) => {
    settodos((prev) =>
      prev.map((prevTodo) =>
        prevTodo.id === id ? { ...prevTodo, todoTitle } : prevTodo
      )
    );
  };
  const deleteToDo = (id) => {
    settodos((prev) => prev.filter((prevTodo) => prevTodo.id !== id));
  };
  const toggleCompleted = (id) => {
    settodos((prev) =>
      prev.map((prevTodo) =>
        prevTodo.id === id
          ? { ...prevTodo, completed: !prevTodo.completed }
          : prevTodo
      )
    );
  };

  useEffect(() => {
    const todos = JSON.parse(localStorage.getItem("todos"));
    if (Array.isArray(todos) && todos.length > 0) {
      settodos(todos);
    }
  }, []);

  useEffect(() => {
    // console.log(todos);
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  return (
    <ThemeProvider value={{ themeMode, lightMode, darkMode }}>
    <ToDoProvider
      value={{ todos, addToDo, updateToDo, deleteToDo, toggleCompleted }}
    >
        <div className="">
          <CanvasCursor />
          <BoldCopy text="Todo List" className={`bold-copy`} />
          <div className="w-full flex flex-col justify-center items-center mt-5 gap-5 overflow-auto">
            <div className="flex gap-4">
              <SparklesTextDemo className={`text-white`} />
              {/* Dark-Light Switch Goes There */}
            </div>
            <ToDoForm />
            {todos.length > 0 &&
              todos.map((todo) => <ToDoItems todo={todo} key={todo.id} />)}
          </div>
          <ToastContainer
            position="top-right"
            autoClose={1100}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={true}
            rtl={false}
            pauseOnFocusLoss={false}
            draggable
            pauseOnHover={false}
            theme="dark"
            transition={Flip}
          />
        </div>
    </ToDoProvider>
      </ThemeProvider>
  );
};

export default App;
