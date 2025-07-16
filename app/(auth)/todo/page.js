'use client'
import React , {useState} from 'react'

const page = () => {
  const [todos , setTodos] = useState([{title : "To eat apple"},{title : "To eat watermelon"}])
  const [todoInput , setTodoInput] = useState("")


const onTodoChangeHandler = (e)=>{
  setTodoInput(e)
  console.log("READING USING STATE :: ",todoInput);
}

const onTodoSubmitHandler =()=>{
  console.log("Submit clicked");

  let newArray = [...todos , {title : todoInput}]

  setTodos(newArray)
  
}

  return (
    <div className='bg-green-200 min-h-[100vh] flex items-center justify-center'>

      <div className='w-[80%] border border-slate-500  h-[500px] rounded-md p-10' >
        <h1 className='text-center font-bold text-3xl'> TODO LIST</h1>

        <div>
          <label className='text-red-400'>Add todo *</label> <input onChange={(e)=>{onTodoChangeHandler(e.target.value)}} className='border border-indigo-950 rounded-sm bg-white' type='text' placeholder='add a todo here' />
          <button onClick={()=>{onTodoSubmitHandler()}} className='bg-indigo-500 p-1 text-white rounded-sm ml-2'> Add todo</button>
        </div>

        {/* Mapping todos */}
        <div>
          {todos.map((todo,index)=>{
            return (
              <div key={index}>
                <p>{index+1}   {todo.title}</p>

                </div>


            )
          })}
        </div>
        

      </div>


    </div>
  )
}

export default page

// https://www.awesomescreenshot.com/video/32940386?key=576b4270986a7accba04411ad9ef9fa7


// explanation short vide
// https://www.awesomescreenshot.com/video/32943373?key=d9aabb845659a97caa68bf3e2a1c008f