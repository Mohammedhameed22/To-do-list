const formElement =document.querySelector('form');
const inputElement =document.querySelector('input');
const apiKey = "6758909b60a208ee1fdddd49";
const loadingScreen =document.querySelector(".loading")
let allTodos=[];
getAllTodo();






formElement.addEventListener('submit',(e)=>{
    e.preventDefault();
    if(inputElement.value.trim().length>0){
        addTodo()

    }
   
   
    

})
async function addTodo(){
    showLoading();
    const todo={
        title:inputElement.value,
       apiKey:apiKey,
    }
    const obj ={
        method :"post",
        body:JSON.stringify(todo),
        headers:{
            "content-type":"application/json",
        }

    }

    

const response =await fetch("https://todos.routemisr.com/api/v1/todos",obj)
if(response.ok){
    const data =await response.json();



if(data.message ==="success"){
    toastr.success("Add Successfully")
    //get all data
    await getAllTodo()
    formElement.reset();
    
    
} 
hideLoading()
}



}
async function getAllTodo(){
    const response = await fetch(`https://todos.routemisr.com/api/v1/todos/${apiKey}`)
    if(response.ok){
        const data = await response.json();
        if(data.message==="success"){
             allTodos= data.todos;
             displayData();
            console.log(allTodos);
            


        }
        
    }
}
function displayData(){
    let cartoona ="";
    for(const todo of allTodos){
        cartoona+=`
          <li class="d-flex align-items-center justify-content-between border-bottom pb-2 my-2">
            <span onclick="markCompleted('${todo._id}')" style="${todo.completed?`text-decoration: line-through;`:""}" class="task-name">${todo.title}</span>
            <div class="d-flex align-items-center gap-4">
                ${todo.completed?`<span><i class="fa-regular fa-circle-check" style="color: #63E6BE;"></i></span>`:""}
                <span onclick="deleteTodo('${todo._id}')" class="icon"> <i class="fa-solid fa-trash-can"></i></span>
            </div>
        </li>
        
        
        `
    }
    document.querySelector(".task-container").innerHTML=cartoona;
    changeProgress();
}
async function deleteTodo(idTodo){

    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: "btn btn-success",
          cancelButton: "btn btn-danger"
        },
        buttonsStyling: false
      });
      swalWithBootstrapButtons.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true
      }).then(async(result) => {
        if (result.isConfirmed) {
            showLoading();

            const todoData={
                todoId:idTodo,
            }
            const response=await fetch("https://todos.routemisr.com/api/v1/todos",{
                method:"DELETE",
                body:JSON.stringify(todoData),
                headers:{
                    "content-type":"application/json"
                }
            })
            if(response.ok){
                const data = await response.json();
                if(data.message==="success"){
                    swalWithBootstrapButtons.fire({
                        title: "Deleted!",
                        text: "Your todo has been deleted.",
                        icon: "success"
                      });
                    await getAllTodo();
                  
        
                }
                hideLoading();
                console.log(data);
        
                
        
            }

          
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire({
            title: "Cancelled",
            text: "Your imaginary file is safe :)",
            icon: "error"
          });
        }
      });




    
    
}
async function markCompleted(idTodo){
    showLoading()
    const todoData={
        todoId:idTodo,
    }
    const response =await fetch("https://todos.routemisr.com/api/v1/todos",{
        method:"PUT",
        body:JSON.stringify(todoData),
        headers:{
            "content-type":"application/json"
        }


    })
    if(response.ok){
        const data =await response.json();
       if(data.message==="success"){
        getAllTodo();
       }
        

    }
    hideLoading();
}
function showLoading(){
    loadingScreen.classList.remove("d-none");
}
function hideLoading(){
    loadingScreen.classList.add("d-none");
}
function changeProgress(){
    const completeTask=allTodos.filter((todo)=>todo.completed).length;
    const totalTask=allTodos.length;
    document.getElementById("progress").style.width=`${(completeTask/totalTask)*100}%`
    const statusNumber=document.querySelectorAll(".status-number span");
    statusNumber[0].innerHTML=completeTask;
    statusNumber[1].innerHTML=totalTask;
}