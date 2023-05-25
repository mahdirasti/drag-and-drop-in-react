import "./App.css"

import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd"

import { useState } from "react"

function generateId() {
  return "" + Math.floor(Math.random() * 10000)
}

function generateTask(text) {
  return {
    id: generateId(),
    text
  }
}

const DUMMY_DATA = {
  [generateId()]: {
    title: "Do",
    tasks: [
      generateTask("Do the well done!"),
      generateTask("Run the workshop!"),
      generateTask("To to the school!")
    ]
  },
  [generateId()]: {
    title: "Doing",
    tasks: [
      generateTask("Going to shopping center!"),
      generateTask("Go to the cinema")
    ]
  },
  [generateId()]: { title: "Check", tasks: [] },
  [generateId()]: { title: "Done", tasks: [] }
}

//Drag Drop Context
function onDragEnd(data, setData) {
  const { source, destination, draggableId } = data

  console.log("source", source)
  console.log("destination", destination)
  console.log("draggableId", draggableId)

  if (source.droppableId === destination.droppableId) {
    //We are dragging and drop in the same column
    setData((crt) => {
      const sourceColumn = crt[source.droppableId]
      let sourceColumnTasks = [...sourceColumn.tasks]
      // Remove source task from source column
      let removedSourceTask = sourceColumnTasks.splice(source.index, 1)?.[0]
      //Adding source task to destination column
      sourceColumnTasks.splice(destination.index, 0, removedSourceTask)

      return {
        ...crt,
        [source.droppableId]: {
          ...crt[source.droppableId],
          tasks: sourceColumnTasks
        }
      }
    })
  } else {
    //We are dragging and drop in other column
    setData((crt) => {
      const sourceColumn = crt[source.droppableId]
      const destinationColumn = crt[destination.droppableId]

      let sourceColumnTasks = [...sourceColumn.tasks]
      // Remove source task from source column
      let removedSourceTask = sourceColumnTasks.splice(source.index, 1)?.[0]

      let destinationColumnTasks = [...destinationColumn.tasks]
      //Adding source task to destination column
      destinationColumnTasks.splice(destination.index, 0, removedSourceTask)

      return {
        ...crt,
        //Remove item from source column
        [source.droppableId]: {
          ...crt[source.droppableId],
          tasks: sourceColumnTasks
        },
        //Add item to destination column
        [destination.droppableId]: {
          ...crt[destination.droppableId],
          tasks: destinationColumnTasks
        }
      }
    })
  }
}

function App() {
  const [data, setData] = useState(DUMMY_DATA)

  return (
    <div className="App">
      This is the place for testing react-beautifull-dnd
      <DragDropContext
        onDragEnd={(data) => onDragEnd(data, setData)}
        onDragStart={() => {
          console.log("Yeah ..., Dragging is started!")
        }}
      >
        <div className="kanban">
          {Object.entries(data).map(([key, item]) => (
            <Droppable droppableId={"" + key} key={key} type="TASK">
              {(provided, snapShot) => (
                <div
                  className="col"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    boxShadow:
                      snapShot.isDraggingOver && "0px 2px 16px rgba(0,0,0,0.12)"
                  }}
                >
                  <div className="title">{item.title}</div>
                  <div className="tasks">
                    {item.tasks.map((task, index) => (
                      <Draggable
                        draggableId={"" + task.id}
                        key={task.id}
                        index={index}
                      >
                        {(provided, snapShot) => {
                          return (
                            <div
                              className="task"
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <div
                                style={{
                                  backgroundColor: snapShot.isDragging
                                    ? "green"
                                    : "white"
                                }}
                              >
                                {task.text}
                              </div>
                            </div>
                          )
                        }}
                      </Draggable>
                    ))}
                  </div>
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  )
}

export default App
