const colors = ["#ccd5ae", "#faedcd", "#f5cac3", "#bde0fe", "#fcf6bd"];
const priorityColors = ["#ccd5ae", "#faedcd", "#f5cac3", "#bde0fe"];
const priorityData = ["High", "Medium", "Low", "No-priority"];
const priorityStatus = document.getElementById("priority");

const todoContainer = document.getElementById("todoContainer");
const addtodoForm = document.getElementById("myForm");
const todoTitleInput = document.getElementById("todoTitle");
const toaster = document.getElementById("toaster");

const modalSheet = document.getElementById("staticBackdrop");
const modalTitle = modalSheet.querySelector(".modalTitle");
const modalCancel = document.getElementById("modalCancel");
const modalSubmit = document.getElementById("modalSubmit");

let todoArr = [];
const todoData = localStorage.getItem("todoList");
todoArr = !todoData ? [] : JSON.parse(todoData);

let filterStatus = 0;
const filterList = ["all", "incomplete", "complete"];
const filterElements = document.querySelectorAll(".filter");

const filterItems = (e) => {
  filterElements[filterStatus].classList.remove("active");

  const targetId = e.target.id;
  filterStatus = parseInt(targetId.substring(7));

  filterElements[filterStatus].classList.add("active");
  refreshToDoList();
};

const clearCompleted = (e) => {
  todoArr = todoArr.filter(todo => todo.status !== 'complete')
  localStorage.setItem("todoList", JSON.stringify(todoArr));
  filterItems(e);
};

const completed = (e) => {
  const itemUid = e.target.id.substring(9);
  const itemIndex = todoArr.findIndex((e) => e.uid === parseInt(itemUid));

  if (todoArr[itemIndex].status === "complete")
    todoArr[itemIndex].status = "incomplete";
  else todoArr[itemIndex].status = "complete";

  saveUpdate();
};

const refreshToDoList = () => {
  todoContainer.innerHTML = "";
  const filterCriteria = filterList[filterStatus];
  todoArr
    .filter((e) => {
      if (filterCriteria === "all") return true;
      return e.status === filterCriteria;
    })
    .forEach((e) => createToDoCard(e));
};

const shareUidtoModal = (e) => {
  const uid = e.target.dataset.uid;
  modalSheet.dataset.uid = uid;
};

const createToDoCard = ({
  uid,
  title,
  priority,
  dateObject,
  status,
  backgroundColor,
}) => {
  const cardDiv = document.createElement("div");
  cardDiv.setAttribute("class", "card flex-shrink-0 border border-0 card-mw");
  cardDiv.style.backgroundColor = backgroundColor;
  cardDiv.dataset.uid = uid;

  const cardBody = document.createElement("div");
  cardBody.setAttribute(
    "class",
    "card-body d-flex flex-column justify-content-between position-relative"
  );

  const titleText = document.createElement("h4");
  titleText.setAttribute(
    "class",
    "w-75 text-nowrap overflow-x-scroll scrollbar-hidden"
  );
  titleText.innerText = title;

  const statusDiv = document.createElement("div");
  statusDiv.setAttribute("class", "d-block gap-2");

  const priorityStatus = document.createElement("div");
  priorityStatus.setAttribute(
    "class",
    "active flex-shrink-0 me-1 fit-content rounded-pill px-4 font-sm py-2 d-inline-block justify-content-between align-items-center"
  );
  priorityStatus.innerText = priorityData[priority];
  priorityStatus.style.backgroundColor = priorityColors[priority];

  const dateStatus = document.createElement("div");
  dateStatus.setAttribute(
    "class",
    "active flex-shrink-0 fit-content rounded-pill px-3 py-2 font-sm d-inline-block mt-2"
  );

  const dateLogo = document.createElement("img");
  dateLogo.src = "images/calendar.svg";
  dateLogo.alt = "calendar-logo";
  dateLogo.style.height = "20px";
  dateLogo.style.width = "20px";
  dateLogo.style.marginRight = "5px";

  dateStatus.append(dateLogo, dateObject.substring(4, 15));

  const actionDiv = document.createElement("div");

  const completedButton = document.createElement("button");
  completedButton.setAttribute("id", `complete-${uid}`);
  completedButton.innerHTML = "-- Pending";
  completedButton.setAttribute(
    "class",
    "border border-0 rounded d-inline-block rounded-1 fit-content mt-3 me-1 px-2 py-1"
  );
  completedButton.classList.add("text-danger");
  completedButton.setAttribute("onclick", "completed(event)");

  const editButton = document.createElement("button");
  editButton.setAttribute("id", `edit-${uid}`);
  editButton.innerHTML = "Edit";
  editButton.setAttribute(
    "class",
    " border border-0 rounded rounded-1 d-inline-block fit-content mt-3 px-2 py-1"
  );
  editButton.setAttribute("onclick", "shareUidtoModal(event)");
  editButton.setAttribute("data-bs-toggle", "modal");
  editButton.setAttribute("data-bs-target", "#staticBackdrop");
  editButton.setAttribute("data-uid", uid.toString());
  editButton.setAttribute("data-bs-whatever", "Modify To-Do");

  if (status === "complete") {
    completedButton.classList.replace("text-danger", "text-success");
    completedButton.innerHTML = "&#x2713; Completed";
    titleText.style.textDecoration = "line-through";
  }

  statusDiv.append(priorityStatus, dateStatus);
  actionDiv.append(statusDiv, completedButton, editButton);
  cardBody.append(titleText, actionDiv);
  cardDiv.append(cardBody);

  todoContainer.append(cardDiv);
};

const saveUpdate = () => {
  localStorage.setItem("todoList", JSON.stringify(todoArr));
  refreshToDoList();
};

refreshToDoList();

const createToast = (message) => {
  const newToastDiv = document.createElement("div");
  newToastDiv.setAttribute("class", "d-flex bg-danger rounded rounded-2");

  const toastBody = document.createElement("div");
  toastBody.classList.add("toast-body");
  toastBody.innerText = message;

  const closeBtn = document.createElement("button");
  closeBtn.type = "button";
  closeBtn.setAttribute("class", "btn-close btn-close-white me-2 m-auto");
  closeBtn.setAttribute("data-bs-dismiss", "toast");

  newToastDiv.append(toastBody, closeBtn);
  toaster.classList.add("show");
  toaster.append(newToastDiv);
  setTimeout(() => toaster.removeChild(newToastDiv), 2000);
};

addtodoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const todoTitle = todoTitleInput.value.trim();
  const dateObject = new Date();
  const priority = priorityStatus.value;
  const randomIndex = Math.floor(Math.random() * colors.length);
  const backgroundColor = colors[randomIndex];
  if (modalTitle.innerHTML === "Add To-Do") {
    let existingItemIndex = todoArr.findIndex(
      (item) => item.title === todoTitle
    );

    if (todoTitle === "") {
      existingItemIndex = 0;
    }

    if (existingItemIndex === -1) {
      const newtodoItem = {
        uid: dateObject.getTime(),
        title: todoTitle,
        priority,
        dateObject: dateObject.toDateString(),
        status: "incomplete",
        backgroundColor,
      };
      todoArr.push(newtodoItem);
      saveUpdate();
    } else if (!existingItemIndex && !todoTitle) {
      createToast("Cant create blank todo");
    } else {
      createToast("To Do already exists");
    }
  } else {
    const itemUid = modalSheet.dataset.uid;
    const itemIndex = todoArr.findIndex((e) => e.uid === parseInt(itemUid));
    todoArr[itemIndex].title = todoTitleInput.value;
    todoArr[itemIndex].priority = priorityStatus.value;
    saveUpdate();
  }

  e.target.reset();
});

modalCancel.addEventListener("click", () => {
  if (modalTitle.innerHTML === "Modify To-Do") {
    const itemUid = modalSheet.dataset.uid;
    const itemIndex = todoArr.findIndex((e) => e.uid === parseInt(itemUid));
    todoArr.splice(itemIndex, 1);
    saveUpdate();
  }
});

if (modalSheet) {
  modalSheet.addEventListener("show.bs.modal", (event) => {
    addtodoForm.reset();
    const button = event.relatedTarget;
    const newtitle = button.getAttribute("data-bs-whatever");


    modalTitle.textContent = newtitle;
    if (newtitle === "Add To-Do") {
      modalCancel.textContent = "Cancel";
      modalCancel.style.backgroundColor = "gray";
      modalSubmit.textContent = "Submit";
    } else {
      modalCancel.textContent = "Delete";
      modalCancel.style.backgroundColor = "#e63946";
      modalSubmit.textContent = "Modify";
      const itemUid = button.getAttribute("data-uid");
      const itemIndex = todoArr.findIndex((e) => e.uid === parseInt(itemUid));
      todoTitleInput.value = todoArr[itemIndex].title;
      priorityStatus.value = todoArr[itemIndex].priority;
    }
  });
}
