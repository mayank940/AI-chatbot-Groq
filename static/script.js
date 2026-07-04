outputHeader = document.getElementById("outputHeader")
outputHeader.style.display = "none"

let outputText = document.getElementById("outputText")
outputText.style.display = "none"

// open file selector when clicked on documents
document.getElementsByClassName("documentsInput")[0].addEventListener("click", (e) =>{
    document.getElementById("imageFile").click()
})

// create a new input tab for url when cliked on url icon
document.getElementsByClassName("imageUrlInput")[0].addEventListener("click", (e) =>{
    document.getElementById("imageUrl").style.display = "inline-block"
})

// select documents 
let imageFileInput = document.getElementById("imageFile")
let docPreview = document.getElementById("docPreview")
let previewIcon = document.getElementById("previewIcon")

docPreview.style.display = "none"
previewIcon.style.display = "none"

imageFileInput.addEventListener("change", (e) =>{
    if(imageFileInput.files.length > 0){
        docPreview.innerHTML =`<i class=" fa-solid fa-circle-check" id="previewIcon"></i>` + imageFileInput.files[0].name 
        docPreview.style.display = "inline-block"
    }else{
        docPreview.innerText = "No files selected"
        docPreview.style.display = "inline-block"
    }
})

//show attachments div when hovered
let attachmentsDiv = document.getElementsByClassName("attachmentsDiv")[0]
let attachmentsBtn = document.getElementById("attachmentsBtn")
let attachmentIcon = document.getElementById("attachmentIcon")

attachmentsDiv.style.display = "none"

attachmentsBtn.addEventListener("click", (e) =>{
    e.preventDefault()
    if(attachmentsDiv.style.display == "flex"){
        attachmentsDiv.style.display = "none"
        attachmentIcon.style.transform = "rotate(0deg)"
    }else{
        attachmentsDiv.style.display = "flex"
        attachmentIcon.style.transform = "rotate(45deg)"
    }
})
attachmentsBtn.addEventListener("mouseover", (e) =>{
    if(attachmentsDiv.style.display == "none"){
        attachmentsDiv.style.display = "flex"
        attachmentIcon.style.transform = "rotate(45deg)"
    }
})
attachmentsBtn.addEventListener("mouseout", (e) =>{
    if(attachmentsDiv.style.display == "flex"){
        attachmentsDiv.style.display = "none"
        attachmentIcon.style.transform = "rotate(0deg)"
    }
})
attachmentsDiv.addEventListener("mouseover", (e) =>{
    if(attachmentsDiv.style.display == "none"){
        attachmentsDiv.style.display = "flex"
        attachmentIcon.style.transform = "rotate(45deg)"
    }
})
attachmentsDiv.addEventListener("mouseout", (e) =>{
    if(attachmentsDiv.style.display == "flex"){
        attachmentsDiv.style.display = "none"
        attachmentIcon.style.transform = "rotate(0deg)"
    }
})

// server side logic (when form is submitted)
document.getElementById("queryForm").addEventListener("submit", async (e) =>{
    e.preventDefault()

    let submitBtn = document.getElementById("submitButton")
    submitBtn.disabled = true

    outputHeader.style.display = "block"
    outputText.style.display = "block"
    outputText.innerText = "Processing your query..."

    let formdata = new FormData(e.target);
    
    let image_file = formdata.get("image_file")
    let image_url = formdata.get("image_url")

    let result

    if(image_file.size > 0 || image_url){
        console.log("Contains image")
        result = await fetch("/analyze_image",{
            method : "POST",
            body : formdata
        })
    }else{
        console.log("contains query only")
        result = await fetch("/ask_query", {
            method : "POST",
            body : formdata
        });
    }



    let data = await result.json();


    outputText.innerText = data.response;

    submitBtn.disabled = false;
})