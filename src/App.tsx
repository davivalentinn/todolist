import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import './app.css';


export default function App() {
  const inputRef = useRef<HTMLInputElement>(null);
  const firstRender = useRef(true)
  const [input, setInput] = useState("");
  const [tasks, setTasks] = useState<string[]>([])

  const [editTask, setEditTask] = useState({
    enabled: false,
    task: ''
  })

  useEffect(() => {
    const tasksSave = localStorage.getItem("@todolist")
    if (tasksSave) {
      setTasks(JSON.parse(tasksSave))
    }
  }, [])

  useEffect(() => {

    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    localStorage.setItem("@todolist", JSON.stringify(tasks))
    console.log("useEffect")
  }, [tasks])


  const handleRegister = useCallback(() => {
    if (!input) {
      alert("Preencha o nome da sua tarefa!")
      return;
    }

    if (editTask.enabled) {
      handleSaveEdit();
      return;
    }

    setTasks(tarefas => [...tarefas, input])
    setInput("")
  }, [input, tasks])


  function handleSaveEdit() {
    const findIndexTask = tasks.findIndex(task => task === editTask.task)
    const allTasks = [...tasks]

    allTasks[findIndexTask] = input
    setTasks(allTasks)
    setEditTask({
      enabled: false,
      task: ''
    })

    setInput("");

  }

  function handleDelete(item: string) {
    const removeTask = tasks.filter(task => task !== item)
    setTasks(removeTask)
  }

  function handleEdit(item: string) {
    inputRef.current?.focus();


    setInput(item)
    setEditTask({
      enabled: true,
      task: item
    })
  }

  // Evitar perca de perfomace na renderização
  const totalTasks = useMemo(() => {
    return tasks.length
  }, [tasks])
  return (
    <div>
      <h1>Lista de Tarefas</h1>
      <input type="text"
        placeholder='Digite o nome da tarefa'
        value={input}
        onChange={(e) => setInput(e.target.value)}
        ref={inputRef}
      />

      <button onClick={handleRegister}>

        {editTask.enabled ? 'Atualizar tarefa' : 'Adicionar tarefa'}
      </button>
      <hr />

      <strong>Você possui {totalTasks} tarefas.</strong>
      <br />
      <br />

      {tasks.map((item, index) => (

        <section key={item}>
          <span>{item}</span>

          <div className="icons">
            <i
              onClick={() => handleEdit(item)}
              className="ri-edit-box-line edit"></i>
            <i
              onClick={() => handleDelete(item)}
              className="ri-delete-bin-line"></i>
          </div>

        </section>
      ))}
    </div>


  )
}