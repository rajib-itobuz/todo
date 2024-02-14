const colors = ["#ccd5ae", "#faedcd", "#f5cac3", "#bde0fe", "#fcf6bd"];
const priorityColors = ["#ccd5ae", "#faedcd", "#f5cac3", "#bde0fe"];
const priorityData = ["High", "Medium", "Low", "No-priority"];

const todoContainer = document.getElementById("todo-container");
const addtodoForm = document.getElementById("myForm");
const todoTitleInput = document.getElementById("todo-title");
const subtaskInput = document.getElementById("subtask");
const priorityStatus = document.getElementById("priority");
const toaster = document.getElementById("toaster");

const modalSheet = document.getElementById("staticBackdrop");
const modalTitle = modalSheet.querySelector(".modal-title");
const modalCancel = document.getElementById("modal-cancel");
const modalSubmit = document.getElementById("modal-submit");

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
  subtask,
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

  const actionDiv = document.createElement("div");
  actionDiv.setAttribute("class", "d-flex gap-3");
  const completedButton = document.createElement("button");
  completedButton.setAttribute("id", `complete-${uid}`);
  completedButton.innerHTML = "&#x2713; Completed";
  completedButton.setAttribute(
    "class",
    "border border-0 rounded d-inline-block rounded-1 fit-content mt-3 px-2 py-1"
  );
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
    completedButton.innerHTML = "&#10060; Incomplete";
    titleText.style.textDecoration = "line-through";
  }

  actionDiv.append(completedButton, editButton);
  statusDiv.append(priorityStatus, dateStatus);
  cardBody.append(titleText, subTitleText, statusDiv, actionDiv);
  cardDiv.append(cardBody);

  todoContainer.append(cardDiv);
};

const saveUpdate = () => {
  localStorage.setItem("todoList", JSON.stringify(todoArr));
  refreshToDoList();
};

refreshToDoList();

addtodoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const todoTitle = todoTitleInput.value.trim();
  const subtask = subtaskInput.value.trim();
  const dateObject = new Date();
  const priority = priorityStatus.value;
  const randomIndex = Math.floor(Math.random() * colors.length);
  const backgroundColor = colors[randomIndex];
  if (modalTitle.innerHTML === "Add to-do") {
    const existingItemIndex = todoArr.findIndex(
      (item) => item.title === todoTitle
    );

    if (todoTitle !== "" && subtask !== "") {
      existingItemIndex = 0;
    }

    if (existingItemIndex === -1) {
      const newtodoItem = {
        uid: dateObject.getTime(),
        title: todoTitle,
        subtask: subtask,
        dateObject: dateObject.toDateString(),
        priority,
        status: "incomplete",
        backgroundColor,
      };
      todoArr.push(newtodoItem);
      saveUpdate();
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
  } else {
    const itemUid = modalSheet.dataset.uid;
    const itemIndex = todoArr.findIndex((e) => e.uid === parseInt(itemUid));
    todoArr[itemIndex].title = todoTitleInput.value;
    todoArr[itemIndex].subtask = subtaskInput.value;
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

    if (newtitle === "Add to-do") {
      modalCancel.textContent = "Cancel";
      modalCancel.style.backgroundColor = "gray";
      modalSubmit.textContent = "Submit";
    } else {
      modalCancel.textContent = "Delete";
      modalCancel.style.backgroundColor = "#e63946";
      modalSubmit.textContent = "Modify";

      console.log();
      const itemUid = button.getAttribute("data-uid");
      const itemIndex = todoArr.findIndex((e) => e.uid === parseInt(itemUid));
      todoTitleInput.value = todoArr[itemIndex].title;
      subtaskInput.value = todoArr[itemIndex].subtask;
      priorityStatus.value = todoArr[itemIndex].priority;
    }
  });
}
