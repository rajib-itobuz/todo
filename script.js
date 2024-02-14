const colors = ["#ccd5ae", "#faedcd", "#f5cac3", "#bde0fe", "#fcf6bd"];
const priorityColors = ["#ccd5ae", "#faedcd", "#f5cac3", "#bde0fe"];
const priorityData = ["High", "Medium", "Low", "No-priority"];

const todoContainer = document.getElementById("todo-container");
const todoTitleInput = document.getElementById("todo-title");
const subtaskInput = document.getElementById("subtask");
const priorityStatus = document.getElementById("priority");
const todoSubmitbtn = document.getElementById("todo-submit");
const toaster = document.getElementById("toaster");


let todoArr = [];
const todoData = localStorage.getItem("todoList");
todoArr = !todoData ? [] : JSON.parse(todoData);

let filterStatus = 1;
const filterItems=(e)=>{
  const targetId=e.target.id;
  filterStatus=parseInt(targetId.substring(7));
}

const completed=(e)=>{
  console.dir(e.offsetParent);
}

const refreshToDoList=()=>{
  todoContainer.innerHTML="";
  todoArr.forEach((e) => createToDoCard(e));
}

const createToDoCard = ({
  uid,
  title,
  subtask,
  priority,
  dateObject,
  backgroundColor,
}) => {
  const cardDiv = document.createElement("div");
  cardDiv.setAttribute("class", "card flex-shrink-0 border border-0 card-mw");
  cardDiv.style.backgroundColor = backgroundColor;
  cardDiv.dataset.uid=uid;

  const cardBody = document.createElement("div");
  cardBody.setAttribute("class", "card-body position-relative");

  const titleText = document.createElement("h4");
  titleText.setAttribute("class", "w-75");
  titleText.innerText = title;

  const subTitleText = document.createElement("h6");
  subTitleText.setAttribute("class", "mb-3 w-75 fw-light");
  subTitleText.innerText = subtask;

  const statusDiv = document.createElement("div");
  statusDiv.setAttribute("class", "d-flex gap-2");

  const priorityStatus = document.createElement("div");
  priorityStatus.setAttribute(
    "class",
    "active flex-shrink-0 fit-content rounded-pill px-4 font-sm py-2 d-flex justify-content-between align-items-center"
  );
  priorityStatus.innerText = priorityData[priority];
  priorityStatus.style.backgroundColor = priorityColors[priority];

  const dateStatus = document.createElement("div");
  dateStatus.setAttribute(
    "class",
    "active flex-shrink-0 fit-content rounded-pill px-3 py-2 font-sm d-flex gap-1"
  );

  const dateLogo = document.createElement("img");
  dateLogo.src = "images/calendar.svg";
  dateLogo.alt = "calendar-logo";
  dateLogo.style.height = "20px";
  dateLogo.style.width = "20px";

  dateStatus.append(dateLogo, dateObject.substring(4, 15));


  const tickImage = document.createElement("img");
  tickImage.src = "images/tick.svg";
  tickImage.alt = "tick-button";
  tickImage.style.height = "20px";
  tickImage.style.width = "20px";

  const completedButton=document.createElement("button");
  completedButton.append(tickImage);
  completedButton.setAttribute("class","border border-1 border-success rounded rounded-circle position-absolute top-10 right-10 p-2");


  statusDiv.append(priorityStatus, dateStatus);
  cardBody.append(titleText, subTitleText, statusDiv,completedButton);
  cardDiv.append(cardBody);



  todoContainer.append(cardDiv);
};

const saveUpdate = () => {
  console.log(todoArr);
  localStorage.setItem("todoList", JSON.stringify(todoArr));
};



todoSubmitbtn.addEventListener("click", () => {
  const todoTitle = todoTitleInput.value;
  const subtask = subtaskInput.value;
  const dateObject = new Date();
  const priority = priorityStatus.value;
  const randomIndex = Math.floor(Math.random() * colors.length);
  const backgroundColor = colors[randomIndex];

  const newtodoItem = {
    uid: dateObject.getTime(),
    title: todoTitle,
    subtask: subtask,
    dateObject: dateObject.toDateString(),
    priority,
    status:"incomplete",
    backgroundColor,
  };

  const existingItemIndex = todoArr.findIndex(
    (item) => item.title === newtodoItem.title
  );

  if (existingItemIndex === -1) {
    todoArr.push(newtodoItem);
    saveUpdate();
    refreshToDoList();
  } else {
    const newToastDiv = document.createElement("div");
    newToastDiv.setAttribute("class", "d-flex bg-danger rounded rounded-2");

    const toastBody = document.createElement("div");
    toastBody.classList.add("toast-body");
    toastBody.innerText = "To-Do Already Exists";

    const closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.setAttribute("class", "btn-close btn-close-white me-2 m-auto");
    closeBtn.setAttribute("data-bs-dismiss", "toast");

    newToastDiv.append(toastBody, closeBtn);
    toaster.classList.add("show");
    toaster.append(newToastDiv);
    setTimeout(() => toaster.removeChild(newToastDiv), 2000);
  }
});

todoContainer.addEventListener("click", (e) => {
  e.stopPropagation();
  console.dir(e.currentTarget);
});


refreshToDoList();