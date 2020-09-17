const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');
// Item Lists
const listColumns = document.querySelectorAll('.drag-item-list');
const openList = document.getElementById('open-list');
const inProgressList = document.getElementById('in-progress-list');
const pendingList = document.getElementById('pending-list');
const resolvedList = document.getElementById('resolved-list');

// Items
let updatedOnLoad = false;

// Initialize Arrays
let openListArray = [];
let inProgressListArray = [];
let pendingListArray = [];
let resolvedListArray = [];
let listArray = [];
// Drag Functionality
let draggedItem;
let dragging = false;
let currentColumn;
// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem('openItems')) {
    openListArray = JSON.parse(localStorage.openItems);
    inProgressListArray = JSON.parse(localStorage.inProgressItems);
    pendingListArray = JSON.parse(localStorage.pendingItems);
    resolvedListArray = JSON.parse(localStorage.resolvedItems);
  } else {
    openListArray = ['Tenet', 'RRR','KGF Chapter 2'];
    inProgressListArray = ['Dark', 'Mind Hunter','Peaky Blinders'];
    pendingListArray = ['Stranger Things', 'Friends'];
    resolvedListArray = ['Grave of the Fireflies','Chernobyl'];
  }
}
// getSavedColumns();
// updateSavedColumns();
// Set localStorage Arrays
function updateSavedColumns() {
  listArray = [openListArray,inProgressListArray,pendingListArray,resolvedListArray];
  const arrayNames = ['open','inProgress','pending','resolved'];
  arrayNames.forEach((arrayName,index) => {
    localStorage.setItem(`${arrayName}Items`, JSON.stringify(listArray[index]));
  })
  // localStorage.setItem('openItems', JSON.stringify(openListArray));
  // localStorage.setItem('inProgressItems', JSON.stringify(inProgressListArray));
  // localStorage.setItem('pendingItems', JSON.stringify(pendingListArray));
  // localStorage.setItem('resolvedItems', JSON.stringify(resolvedListArray));
}
// Filter Array to remove Items
function filterArray(array){
  console.log(array);
  const filteredArray = array.filter((item) => item !== null);
  console.log(filteredArray);
  return filteredArray;
}

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
  // console.log('columnEl:', columnEl);
  // console.log('column:', column);
  // console.log('item:', item);
  // console.log('index:', index);
  // List Item
  const listEl = document.createElement('li');
  listEl.classList.add('drag-item');
  listEl.textContent = item;
  listEl.draggable = true;
  listEl.setAttribute("ondragstart","drag(event)");
  listEl.contentEditable = true;
  listEl.id = index;
  listEl.setAttribute('onfocusout', `updateItem(${index}, ${column})`);
  // Append
  columnEl.appendChild(listEl)
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once
  if(!updatedOnLoad){
    getSavedColumns();
  }
  // Open Column
  openList.textContent = "";
  openListArray.forEach((openItem,index) =>{
    createItemEl(openList,0, openItem,index);
  });
  openListArray = filterArray(openListArray);
  // Progress Column
  inProgressList.textContent = "";
  inProgressListArray.forEach((inProgressItem,index) =>{
    createItemEl(inProgressList,1, inProgressItem,index);
  });
  inProgressListArray = filterArray(inProgressListArray);
  // Pending Column
  pendingList.textContent = "";
  pendingListArray.forEach((pendingItem,index) =>{
    createItemEl(pendingList,2, pendingItem,index);
  });
  pendingListArray = filterArray(pendingListArray);
  // Resolved Column
  resolvedList.textContent = "";
  resolvedListArray.forEach((resolvedItem,index) =>{
    createItemEl(resolvedList,3, resolvedItem,index);
  });
  resolvedListArray = filterArray(resolvedListArray);
  // Run getSavedColumns only once, Update Local Storage
  updatedOnLoad = true;
  updateSavedColumns();
}

// Add To Column List
function addToColumn(column){
  const itemText = addItems[column].textContent;
  const selectedArray = listArray[column];
  selectedArray.push(itemText);
  addItems[column].textContent = "";
  updateDOM();
}

// Update Item - Delete if necessary, or update Array value
function updateItem(id, column) {
  const selectedArray = listArray[column];
  const selectedColumnEl = listColumns[column].children;
  if(!dragging){
    if(!selectedColumnEl[id].textContent) {
      delete selectedArray[id];
    }
    else{
      selectedArray[id] = selectedColumnEl[id].textContent;
    }
    console.log(selectedArray);
    updateDOM();
  }
}
// Show Add Item Input Box
function showInputBox(column){
  addBtns[column].style.visibility = "hidden";
  saveItemBtns[column].style.display = "flex";
  addItemContainers[column].style.display = "flex";
}  
// Hide Item Input Box
function hideInputBox(column){
  addBtns[column].style.visibility = "visible";
  saveItemBtns[column].style.display = "none";
  addItemContainers[column].style.display = "none";
  addToColumn(column);
}
// Allows Array to Reflect Drag and Drop items
function rebuildArray(){
  openListArray = Array.from(openList.children).map(item => item.textContent);
  // openListArray = [];
  // for(let i = 0; i < openList.children.length; i++) {
  //   openListArray.push(openList.children[i].textContent);
  // }
  inProgressListArray = Array.from(inProgressList.children).map(item => item.textContent);
  // inProgressListArray = [];
  // for(let i = 0; i < inProgressList.children.length; i++) {
  //   inProgressListArray.push(inProgressList.children[i].textContent);
  // }
  pendingListArray = Array.from(pendingList.children).map(item => item.textContent);
  // pendingListArray = [];
  // for(let i = 0; i < pendingList.children.length; i++) {
  //   pendingListArray.push(pendingList.children[i].textContent);
  // }
  resolvedListArray = Array.from(resolvedList.children).map(item => item.textContent);
  // resolvedListArray = [];
  // for(let i = 0; i < resolvedList.children.length; i++) {
  //   resolvedListArray.push(resolvedList.children[i].textContent);
  // }
  updateDOM();
}

// When Item Dragged
function drag(event){
  draggedItem = event.target;
  dragging = true;
}

// Column Allows For Item To Drop
function allowDrop(event){
  event.preventDefault();
}
// When Item Enter into the Column Area
function dragEnter(column){
  listColumns[column].classList.add("over");
  currentColumn = column;
}
// Dropping Item in Column
function drop(event){
  event.preventDefault();
  // Remove Background Color and Padding
  listColumns.forEach((column) => {
    column.classList.remove("over");
  });
  // Add Item To Column
  const parent = listColumns[currentColumn];
  parent.appendChild(draggedItem);
  // Dragging complete
  dragging = false;
  rebuildArray();
}
// On Load
updateDOM();

