let numIndex = 0;
// Listen for a file being selected through the file picker
const inputElement = document.getElementById("iiinput");
inputElement.addEventListener("change", handlePicked, false);
var filestoupload;


//variabel on run
var onrun = true;

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
