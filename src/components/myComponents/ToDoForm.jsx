import React, { useState } from "react";
import { toast } from "react-toastify";
import useToDo from "../../contexts/ToDoContext";

const ToDoForm = () => {
  const [todoText, settodoText] = useState("");
  const { addToDo } = useToDo();
  const add = () => {
    if (!todoText) toast.info("Alteast Give Some Task..");
    addToDo({
        todoTitle : todoText,
        completed : false
    })
    settodoText("")
  };
  return (
    <div className="flex items-center space-x-3 p-4 bg-white dark:bg-gray-900 rounded-2xl shadow-md w-full max-w-md">
      <input
        type="text"
        value={todoText}
        onChange={(e) => settodoText(e.target.value)}
        placeholder="Enter Task To Be Completed.."
        className="flex-1 px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />
      <button
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow transition"
        onClick={add}
      >
        Add
      </button>
    </div>
  );
};

export default ToDoForm;
