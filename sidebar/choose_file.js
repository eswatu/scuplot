/*
Listens for a file being selected, creates a ObjectURL for the chosen file, injects a
content script into the active tab then passes the image URL through a message to the
active tab ID.
*/
let numIndex = 0;
// Listen for a file being selected through the file picker
const inputElement = document.getElementById("iiinput");
inputElement.addEventListener("change", handlePicked, false);
let filestoupload;
// Listen for a file being dropped into the drop zone
const dropbox = document.getElementById("drop_zone");
dropbox.addEventListener("dragenter", dragenter, false);
dropbox.addEventListener("dragover", dragover, false);
dropbox.addEventListener("drop", drop, false);

// Get the image file if it was chosen from the pick list
function handlePicked() {
  let tablediv = document.getElementById("rowTable");
  while (tablediv.firstChild) {
    tablediv.removeChild(tablediv.lastElementChild);
  }
  filestoupload = inputElement.files;
  console.log(filestoupload);
  for (let index = 0; index < filestoupload.length; index++) {
    const row = crow(filestoupload[index], index);
    //masukkan ke tabel
    tablediv.appendChild(row);
  }
}

function crow(file, i){
  const row = document.createElement("tr");
  //buat element td
  const detail0 = document.createElement("td");
  const detail1 = document.createElement("td");
  const detail2 = document.createElement("td");
  const detail3 = document.createElement("td");
  //isi element td
  detail0.innerHTML = i + 1;
  detail1.innerHTML = file.name;
  detail2.innerHTML = Math.round(file.size / 1000) + " kb";
  detail3.innerHTML = file.size > 198000 ? "Invalid" : "Valid";
  detail3.id = "status" + i;
  //masukkan ke tabel element tr
  row.appendChild(detail0);
  row.appendChild(detail1);
  row.appendChild(detail2);
  row.appendChild(detail3);
  //masukkan ke tabel
  return row;
}

function clickId(name) {
  document.getElementById(name).click();
}
function runUpload(){
  for (let index = 0; index < filestoupload.length; index++) {
    clickId("satu");
    clickId("dua");
    const ip = document.getElementById("input");
    ip.value = filestoupload[index].value;
    const fileName = document.getElementById("fileName");
    fileName.innerText = filestoupload.item(index);
    clickId("tiga");
  }
}

function clearInput(){
  let tablediv = document.getElementById("rowTable");
  while (tablediv.firstChild) {
    tablediv.removeChild(tablediv.lastElementChild);
  }
  inputElement.value = null;
}

// Get the image file if it was dragged into the sidebar drop zone
function drop(e) {
  e.stopPropagation();
  e.preventDefault();
  displayFile(e.dataTransfer.files);
}

/* 
Insert the content script and send the image file ObjectURL to the content script using a 
message.
*/ 
function displayFile(fileList) {
  const imageURL = window.URL.createObjectURL(fileList[0]);

  browser.tabs.executeScript({
    file: "/content_scripts/content.js"
    }).then(messageContent)
      .catch(reportError);

  function messageContent() {
    const gettingActiveTab = browser.tabs.query({active: true, currentWindow: true});
    gettingActiveTab.then((tabs) => {
      browser.tabs.sendMessage(tabs[0].id, {imageURL});
    });
  }

  function reportError(error) {
    console.error(`Could not inject content script: ${error}`);
  }
}

// Ignore the drag enter event - not used in this extension
function dragenter(e) {
  e.stopPropagation();
  e.preventDefault();
}

// Ignore the drag over event - not used in this extension
function dragover(e) {
  e.stopPropagation();
  e.preventDefault();
}