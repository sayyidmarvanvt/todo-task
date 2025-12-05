import React, { useState, useEffect } from "react";
import { Trash2, Edit2, Plus, Check, X } from "lucide-react";


const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [newTask, setNewTask] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [loading, setLoading] = useState(false);

 
useEffect(() => {
  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API_URL}/tasks`);
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };
  fetchTasks();
}, []);


  const addTask = async () => {
    if (!newTask.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newTask }),
      });
      const data = await res.json();
      setTasks([...tasks, data]);
      setNewTask("");
    } catch (err) {
      console.error("Error adding task:", err);
    }
    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addTask();
    }
  };

  const updateTask = async (id, updates) => {
    try {
      const res = await fetch(`${API_URL}/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      setTasks(tasks.map((t) => (t._id === id ? data : t)));
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await fetch(`${API_URL}/tasks/${id}`, { method: "DELETE" });
      setTasks(tasks.filter((t) => t._id !== id));
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  const toggleComplete = (task) => {
    updateTask(task._id, { completed: !task.completed });
  };

  const startEdit = (task) => {
    setEditId(task._id);
    setEditText(task.name);
  };

  const saveEdit = () => {
    if (!editText.trim()) return;
    updateTask(editId, { name: editText });
    setEditId(null);
    setEditText("");
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditText("");
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed;
    return true;
  });

  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.completed).length,
    pending: tasks.filter((t) => !t.completed).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-white">
            <h1 className="text-3xl font-bold mb-2">Todo List App</h1>
            <p className="text-blue-100">Organize your tasks efficiently</p>
          </div>

          <div className="p-6">
            <div className="mb-6">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Add a new task..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={addTask}
                  disabled={loading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50"
                >
                  <Plus size={20} />
                  Add
                </button>
              </div>
            </div>

            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-lg transition ${
                  filter === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                All ({stats.total})
              </button>
              <button
                onClick={() => setFilter("pending")}
                className={`px-4 py-2 rounded-lg transition ${
                  filter === "pending"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Pending ({stats.pending})
              </button>
              <button
                onClick={() => setFilter("completed")}
                className={`px-4 py-2 rounded-lg transition ${
                  filter === "completed"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Completed ({stats.completed})
              </button>
            </div>

            <div className="space-y-2">
              {filteredTasks.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-lg">No tasks found</p>
                  <p className="text-sm">Add a new task to get started</p>
                </div>
              ) : (
                filteredTasks.map((task) => (
                  <div
                    key={task._id}
                    className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                  >
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleComplete(task)}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />

                    {editId === task._id ? (
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                      />
                    ) : (
                      <span
                        className={`flex-1 ${
                          task.completed
                            ? "line-through text-gray-500"
                            : "text-gray-800"
                        }`}
                      >
                        {task.name}
                      </span>
                    )}

                    <div className="flex gap-2">
                      {editId === task._id ? (
                        <>
                          <button
                            onClick={saveEdit}
                            className="p-2 text-green-600 hover:bg-green-100 rounded transition"
                          >
                            <Check size={18} />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="p-2 text-red-600 hover:bg-red-100 rounded transition"
                          >
                            <X size={18} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEdit(task)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded transition"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => deleteTask(task._id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded transition"
                          >
                            <Trash2 size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
