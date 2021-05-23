// Creates a function that validates the form

function validateTaskForm() { 

    let yourName = document.getElementById("inputName").value;
    let assignTo = document.getElementById("inputAssign").value;
    let dueDate = document.getElementById("inputDate").value;
    let status = document.getElementById("inputState").value;
    let description = document.getElementById("inputDescription").value;


    if (yourName == "") {
        document.getElementById("nameError").innerHTML = "Please enter a valid name";
        return false;
    } else if (yourName.length > 20) {
        document.getElementById("nameError").innerHTML = "Name must be less than 20 characters ";
        return false;
    }

    if (assignTo == "") {
        document.getElementById("assignError").innerHTML = "Please enter a valid name";
        return false;
    } else if (assignTo.length > 20) {
        document.getElementById("assignError").innerHTML = "Name must be less than 20 characters ";
        return false;
    }

    if (description == "") {
        document.getElementById("descriptionError").innerHTML = "Please enter description";
        return false;
    } else if (description.length > 20) {
        document.getElementById("descriptionError").innerHTML = "Description must be less than 20 characters";
        return false;
    }

    if (dueDate == "") {
        document.getElementById("dateError").innerHTML = "Select a due date";
        return false;
    }

    if (status == "") {
        document.getElementById("statusError").innerHTML = "Select a status";
        return false;
    }
    return true;
}


//class that contains all main functions
class TaskManager {
    constructor() {
        this.tasks = [];
        this.nextTaskID = 1
    }

    getTasks() { 
        return this.tasks
    }

    addTask(task) { 
        this.tasks.push(task); 
        this.updateLocalStorage();
    }

    deleteTask() { 

        let event = window.event.target 
        console.log(event) 

        let removedTaskID = event.parentNode.attributes.id.value; 
        console.log(event.parentNode) 

        console.log(removedTaskID); 

        for (let item in this.tasks) { 
            if (this.tasks[item].ID == removedTaskID) { 
                this.tasks.splice(item, 1) 
                console.log(this.tasks) 
            } else {
              console.log("Failed to find Task") 
            }
        }
        this.updateLocalStorage() 
    }

    updateLocalStorage() {  
        localStorage.setItem("MyTaskList", JSON.stringify(this.tasks)); 
        location.reload() 
    }

    loadFromLocalStorage() { 

      let storedTasks = JSON.parse(localStorage.getItem("MyTaskList")) 

      if (storedTasks){ 
        this.tasks = storedTasks 
      }
      for (let item in this.tasks){ 
        displayTasks() 
      }

    }

    updateTask() { 

      let updatedTask = {} 
      let event = window.event.target 
      let updatedTaskID = event.parentNode.attributes.id.value 
      
      for (let item in this.tasks){ 
        if (this.tasks[item].ID == updatedTaskID){
          updatedTask = this.tasks[item] 
        }
      }
    
      document.getElementById("inputName").value = updatedTask.Name 
      document.getElementById("inputAssign").value = updatedTask.AssignTo
      document.getElementById("inputDate").value = updatedTask.DueDate 
      document.getElementById("inputState").value = updatedTask.Status
      document.getElementById("inputDescription").value = updatedTask.Description

      document.getElementById("addTask").outerHTML = `<button type="button"  class="btn btn-success" id="saveTask">Save</button>` 

      document.getElementById("saveTask").addEventListener('click', function(){ 
        let yourName = document.getElementById("inputName").value; 
        let assignTo = document.getElementById("inputAssign").value;
        let dueDate = document.getElementById("inputDate").value;
        let status = document.getElementById("inputState").value;
        let description = document.getElementById("inputDescription").value;

        if (validateTaskForm() == true){ 
          updatedTask.Name = yourName 
          updatedTask.AssignTo = assignTo
          updatedTask.DueDate = dueDate
          updatedTask.Status = status
          updatedTask.Description = description
          
          taskManager.updateLocalStorage() 
        }
      })
    }

}
let taskManager = new TaskManager(); 
taskManager.loadFromLocalStorage() 

document.querySelector("#addTask").addEventListener("click", function () { 

    if (validateTaskForm() == true) { 

        let yourName = document.getElementById("inputName").value; 
        let assignTo = document.getElementById("inputAssign").value;
        let dueDate = document.getElementById("inputDate").value;
        let status = document.getElementById("inputState").value;
        let description = document.getElementById("inputDescription").value;

        let newTask = createTask(yourName, assignTo, dueDate, status, description) 

        taskManager.addTask(newTask) 

        displayTasks()
    }
})

function createTask(yourName, assignTo, dueDate, status, description) { // this function creates the object (newTask) as well as an ID for that specific object and returns it

    let id = 0

    if (taskManager.tasks.length == 0) { 
        id = 1
    } else {
        let lastID = taskManager.tasks[taskManager.tasks.length - 1].ID 
        id = lastID + 1 
    }

    let newTask = { // creates the object newTask that stores all there info about the task
        "ID": id,
        "Name": yourName,
        "Description": description,
        "AssignTo": assignTo,
        "DueDate": dueDate,
        "Status": status
    }
    console.log(newTask) 
    return newTask 
    
}

function displayTasks() { // creates a function that displays all the tasks on the screen

    let taskListHTML = document.getElementById('task-list'); 
    taskListHTML.innerHTML = "" 

    for (item in taskManager.tasks) { 

        let taskInnerHTML = `<ul class="list-group list-group-flush" id="${
            taskManager.tasks[item]["ID"]
        }">
    <li class="list-group-item">Assigned To: ${
            taskManager.tasks[item]["AssignTo"] 
        }</li>
    <li class="list-group-item">Assigned by:${
            taskManager.tasks[item]["Name"]
        }</li>
    <li class="list-group-item">Due Date:${
            taskManager.tasks[item]["DueDate"]
        }</li>
    <li class="list-group-item">Status:${
            taskManager.tasks[item]["Status"]
        }</li>
    <li class="list-group-item">Description:${
            taskManager.tasks[item]["Description"]
        }</li>
    <button type="button" class="btn btn-danger" onclick = "taskManager.deleteTask()">Delete Card</button>
    <button type="button" class="btn btn-primary" onclick = "taskManager.updateTask()">Update Card</button>
  </ul>`

        taskListHTML.innerHTML += taskInnerHTML; 
    }
}



