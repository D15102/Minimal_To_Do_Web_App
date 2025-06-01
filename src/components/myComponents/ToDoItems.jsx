import React, { useState } from "react";
import useToDo from "../../contexts/ToDoContext";

const ToDoItems = ({ todo }) => {
  const { updateToDo, deleteToDo, toggleCompleted } = useToDo();
  const [addedTodo, setaddedTodo] = useState(todo.todoTitle);
  const [editable, setEditable] = useState(false);

  const editTodo = (e) => {
    // console.log(addedTodo)
    updateToDo(todo.id, addedTodo);
    setEditable(!editable);
  };
  const handleToggleCompleted = (e) => {
    toggleCompleted(todo.id);
  };

  return (
    <div
      className={`flex items-center justify-between gap-3 p-4 rounded-xl shadow w-full max-w-xl
    ${todo.completed ? "bg-green-700" : "bg-gray-900"}
    `}
    >
      {/* Checkbox */}
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={handleToggleCompleted}
        className={`w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300 dark:border-gray-600
            
            `}
      />

      {/* Input Field */}
      <input
        type="text"
        value={addedTodo}
        onChange={(e) => {
          setaddedTodo(e.target.value);
        }}
        placeholder="Your item..."
        className={`flex-1 px-4 py-2 rounded-lg border-gray-700 text-white transition
                    ${
                      !editable
                        ? "bg-gray-900 outline-none"
                        : "bg-gray-800 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    }
                    ${todo.completed ? 'bg-transparent transition-opacity line-through' : '' }`}
        readOnly={!editable}
      />

      {/*  Edit  and Save Button */}
      {editable ? (
        <button
          className="px-3 py-1.5 text-sm bg-green-500 hover:bg-green-600 text-white rounded-lg transition"
          onClick={editTodo}
        >
          Save
        </button>
      ) : (
        <button
          className={`px-3 py-1.5 text-sm bg-yellow-600  text-white rounded-lg transition
            ${todo.completed ? 'cursor-not-allowed hover:bg-yellow-600' : 'cursor-default hover:bg-yellow-700' }
            `}
          onClick={(e) => setEditable(!editable)}
          disabled={todo.completed}
        >
          Edit
        </button>
      )}

      {/* Delete Button */}
      <button
        className="px-3 py-1.5 text-sm bg-red-700 hover:bg-red-800 text-white rounded-lg transition"
        onClick={(e) => deleteToDo(todo.id)}
      >
        Delete
      </button>
    </div>
  );
};

export default ToDoItems;
