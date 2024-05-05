// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import { getDatabase,get, onChildAdded  ,ref, push, set, onValue, remove, update } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCQETZIoRqhCdirKEzqKGSXr5i5-PC0T68",
    authDomain: "ics-kharian.firebaseapp.com",
    databaseURL: "https://ics-kharian-default-rtdb.firebaseio.com",
    projectId: "ics-kharian",
    storageBucket: "ics-kharian.appspot.com",
    messagingSenderId: "592627003269",
    appId: "1:592627003269:web:18020dd2e0a41242e0deec",
    measurementId: "G-PZZ33KBSCH"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase();
let time = new Date();
let date = time.getDate() + "-" + time.getUTCMonth() + "-" + time.getFullYear();
// Function to add a batch
function addBatch(logo, name, url) {
    const batchRef = push(ref(database, "Centre/Class/Live"));
    set(batchRef, {
        Logo: logo,
        Name: name,
        Time: date,
        URL: url
    })
    .then(() => {
        console.log("Batch added successfully");
        alert("Class Added");
        location.reload();
    })
    .catch((error) => {
        console.error("Error adding batch: ", error);
        alert("Error adding batch, please try again.");
    });
}


function addRecordClass(logo, name, url) {
    const batchRef = push(ref(database, "Centre/Class/Record"));
    set(batchRef, {
        Logo: logo,
        Name: name,
        Time: date,
        URL: url
    })
    .then(() => {
        alert("Class Added");
        location.reload();
    })
    .catch((error) => {
        console.error("Error adding batch: ", error);
        alert("Error adding batch, please try again.");
    });
}

// Function to delete a batch
async function deleteClass(docRef, key) {
    try {
        if (confirm("Are you sure you want to delete this batch?")) {
            await remove(docRef);
            alert("Batch Deleted");
            location.reload();
        } else {
            alert("Batch Not Deleted")
        }
    } catch (error) {
        console.error("Error deleting batch: ", error);
        alert("Error deleting batch, please try again.");
    }
}

// Event listener for submitting a batch
document.getElementById("SubmitBatchBtn").addEventListener('click', function() {
    const ClassLogo = document.getElementById("ClassLogo").value;
    const ClassName = document.getElementById("ClassName").value;
    const ClassURL = document.getElementById("ClassURL").value;
    addBatch(ClassLogo, ClassName, ClassURL);
});

document.getElementById("SubmitRecordClassBtn").addEventListener('click', function() {
    const RClassLogo = document.getElementById("RClassLogo").value;
    const RClassName = document.getElementById("RClassName").value;
    const RClassURL = document.getElementById("RClassURL").value;
    addRecordClass(RClassLogo, RClassName, RClassURL);
});

// Event listener for deleting a batch
document.getElementById("BatchSection").addEventListener('click', function(event) {
    if (event.target.classList.contains("ViewClass")) {
        const key = event.target.dataset.link;
      
        function getYoutubeVideoId(url) {
            var videoId = null;
            var match = url.match(/(?:live\/)([^\?]+)/);
            if (match && match[1]) {
                videoId = match[1];
            }
            return videoId;
        }
        
        var videoUrl = key;
        var videoId = getYoutubeVideoId(videoUrl);
        ClassLink.src =`https://www.youtube.com/embed/${videoId}`;
        
        // const docRef = ref(database, `/Centre/Batch/${key}`);
        // deleteBatch(docRef, key);
    }

    if (event.target.classList.contains("ViewRecordedClass")) {
        const key = event.target.dataset.link;
      
        function getYoutubeVideoId(url) {
            var videoId = null;
            var match = url.match(/(?:live\/)([^\?]+)/);
            if (match && match[1]) {
                videoId = match[1];
            }
            return videoId;
        }
        
        var videoUrl = key;
        var videoId = getYoutubeVideoId(videoUrl);
        console.log(videoId)
        ClassLink.src =`https://www.youtube.com/embed/${videoId}`;
        
        // const docRef = ref(database, `/Centre/Batch/${key}`);
        // deleteBatch(docRef, key);
    }
});

document.getElementById("RecordedClassSection").addEventListener('click', function(event) {
    if (event.target.classList.contains("ViewRecordedClass")) {
        const key = event.target.dataset.path;
      
        function getYoutubeVideoId(url) {
            var videoId = null;
            var match = url.match(/(?:live\/)([^\?]+)/);
            if (match && match[1]) {
                videoId = match[1];
            }
            return videoId;
        }
        
        var videoUrl = key;
        var videoId = getYoutubeVideoId(videoUrl);
        ClassLink.src =`https://www.youtube.com/embed/${videoId}`;
        
        // const docRef = ref(database, `/Centre/Batch/${key}`);
        // deleteBatch(docRef, key);
    }
});
// Fetch batches from the database and display them


const LiveClassSection = document.getElementById("BatchSection");
onChildAdded(ref(database, "Centre/Class/Live"), (childSnapshot) => {
    const childData = childSnapshot.val();
    const Logo = childData.Logo;
    const Name = childData.Name;
    const Time = childData.Time;
    const URL = childData.URL;
    const key = childSnapshot.key;
     // Append batch to the batch list
    let Classes = `
        <li>
            <div class="item-content">
                <a href="#" class="item-media">
                    <div class="logo" style="width:80px; height:80px; background-color: blueviolet; color:white; border-radius: 50%; display:flex; justify-content: center; align-items: center; font-size: 20px;">${Logo}</div>
                </a>
                <div class="item-inner">
                    <div class="item-title-row">
                        <div class="item-subtitle">ICS KHARIAN </div>
                        <h6 class="item-title"><a href="#">${Name}</a></h6>
                    </div>
                    <div class="d-flex align-items-center mb-2">
                        <i class="fa-regular fa-clock" class="text-primary"></i>
                        <div class="item-price">${Time}</div>
                    </div>
                    <div class="d-flex">
                    <div class="btns">
                        <button class="btn btn-danger btn-sm deleteClassBtn" data-path="${key}" style="position:relative;right: 55%;bottom: -10px;">Delete Class</button>
                        <button class="btn btn-success btn-sm updateClassBtn" data-path="${key}" data-old="${URL}" data-logo="${Logo}" data-name="${Name}" data-time="${time}" style="position:relative;right: 25%;bottom: -10px;">Update Link</button>
                        <button class="btn btn-primary btn-sm ViewClass" style="position: relative; bottom: -10px;" data-link="${URL}" data-bs-toggle="modal" data-bs-target="#basic111Modal">View Class</button>
                    </div>
                    </div>
                </div>
            </div>
            <div class="sortable-handler"></div>
        </li>
    `;
    // Add new exam result HTML at the beginning of ViewPreviousSchoolResult
    LiveClassSection.innerHTML += Classes;


});


async function updateClassLink(key, newLink, oldLink, Logo, Name, Time) {
    const classRef = ref(database, `/Centre/Class/Live/${key}`);
    const recordRef = ref(database, `/Centre/Class/Record/`);
    const time = new Date();
    const date = `${time.getDate()}-${time.getMonth() + 1}-${time.getFullYear()}`;
// data-path="${key}" data-old="${URL}" data-logo="${Logo}" data-name="${Name}" data-time="${time}"
    
    await push(recordRef, {
        Logo: Logo,
        Name: Name,
        URL: oldLink,
        Time: date
    });

    await update(classRef, {
        URL: newLink,
        Time: date
    })
    .then(() => {
        console.log("Class link updated successfully");
        alert("Class Link Updated");
        location.reload();
    })
    .catch((error) => {
        console.error("Error updating class link: ", error);
        alert("Error updating class link, please try again.");
    });
}


document.getElementById("BatchSection").addEventListener('click', function(event) {
// data-path="${key}" data-old="${URL}" data-logo="${Logo}" data-name="${Name}" data-time="${time}"
    
    if (event.target.classList.contains("updateClassBtn")) {
        const key = event.target.dataset.path;
        const oldLink = event.target.dataset.old;
        const Logo = event.target.dataset.logo;
        const Name = event.target.dataset.name;
        const Time = event.target.dataset.time
        const newLink = prompt("Enter the new class link:");
        if (newLink !== null && newLink.trim() !== "") {
            updateClassLink(key, newLink, oldLink, Logo, Name, Time);
        }
    }
});


const RecordedClassSection = document.getElementById("RecordedClassSection");

onChildAdded(ref(database, "Centre/Class/Record"), (childSnapshot) => {
    const childData = childSnapshot.val();
    const Logo = childData.Logo;
    const Name = childData.Name;
    const Time = childData.Time;
    const URL = childData.URL;
    const key = childSnapshot.key;

    let Classes = `
        <li>
            <div class="item-content">
                <a href="#" class="item-media">
                    <div class="logo" style="width:80px; height:80px; background-color: blueviolet; color:white; border-radius: 50%; display:flex; justify-content: center; align-items: center; font-size: 20px;">${Logo}</div>
                </a>
                <div class="item-inner">
                    <div class="item-title-row">
                        <div class="item-subtitle">ICS KHARIAN </div>
                        <h6 class="item-title"><a href="#">${Name}</a></h6>
                    </div>
                    <div class="d-flex align-items-center mb-2">
                        <i class="fa-regular fa-clock" class="text-primary"></i>
                        <div class="item-price">${Time}</div>
                    </div>
                    <div class="d-flex">
                        <button class="btn btn-danger btn-sm deleteRecordedClassBtn" data-path="${key}" style="position:relative;right: 55%;bottom: -10px;">Delete Class</button>
                        <button class="btn btn-success btn-sm updateRecordedClassBtn" data-path="${key}" data-old="${URL}" data-logo="${Logo}" data-name="${Name}" data-time="${time}" style="position:relative;right: 25%;bottom: -10px;">Update Link</button>
                       
                        <button class="btn btn-primary btn-sm ViewRecordedClass" style="position: relative; bottom: -10px; left: 6%;" data-path="${URL}" data-bs-toggle="modal" data-bs-target="#basic111Modal">View Class</button>
                    </div>
                </div>
            </div>
            <div class="sortable-handler"></div>
        </li>
    `;

    // Insert new HTML content at the top of LiveClassSection
    RecordedClassSection.insertAdjacentHTML('afterbegin', Classes);
});


// Event listener for updating class link

// Event listener for updating class link
document.getElementById("RecordedClassSection").addEventListener('click', function(event) {
    if (event.target.classList.contains("updateRecordedClassBtn")) {
    
       
        const key = event.target.dataset.path;
        const oldLink = event.target.dataset.old;
        const newLink = prompt("Enter the new class link:");
        if (newLink !== null && newLink.trim() !== "") {
            // Update class link in the database
            updateRecordedClassLink(key, newLink);
        }
    }
});

let NewTime = new Date();
let Month = NewTime.getMonth() + 1
let NewDate = NewTime.getDate() + "-" + Month + "-" + NewTime.getFullYear();


// Function to update class link in the database
async function updateRecordedClassLink(key, newLink) {
    const classRef = ref(database, `/Centre/Class/Record/${key}`);
   

   update(classRef, {
        URL: newLink,
        Time: NewDate
    }).then(() => {
        console.log("Class link updated successfully");
        alert("Class Link Updated");
        location.reload();
    })
    .catch((error) => {
        console.error("Error updating class link: ", error);
        alert("Error updating class link, please try again.");
    });
}


document.getElementById("BatchSection").addEventListener('click', function(event) {
    if (event.target.classList.contains("deleteClassBtn")) {
        const key = event.target.dataset.path;
        const docRef = ref(database, `/Centre/Class/Live/${key}`);
        deleteClass(docRef, key);
    }
});

document.getElementById("RecordedClassSection").addEventListener('click', function(event) {
    if (event.target.classList.contains("deleteRecordedClassBtn")) {
        const key = event.target.dataset.path;
        const docRef = ref(database, `/Centre/Class/Record/${key}`);
        deleteRecordedClass(docRef, key);
    }
});

async function deleteRecordedClass(docRef, key) {
    try {
        if (confirm("Are you sure you want to delete this class?")) {
            await remove(docRef);
            alert("Class Deleted");
            location.reload();
        } else {
            alert("Class Not Deleted")
        }
    } catch (error) {
        console.error("Error deleting class: ", error);
        alert("Error deleting class, please try again.");
    }
}


// Function to check and delete entries alternately
function checkAndDeleteEntries() {
    const liveRef = ref(database, "Centre/Class/Live");
    const recordRef = ref(database, "Centre/Class/Record");

    // Get snapshots of both databases
    get(liveRef).then((liveSnapshot) => {
        const liveCount = liveSnapshot.numChildren();
        
        get(recordRef).then((recordSnapshot) => {
            const recordCount = recordSnapshot.numChildren();
            
            // If Record count is double the Live count, start deleting
            if (recordCount >= liveCount * 2) {
                // Delete one live and one recorded entry alternately
                let deleteLive = true;
                let deleteRecorded = true;
                
                recordSnapshot.forEach((recordChild) => {
                    if (deleteLive && deleteRecorded) {
                        const recordKey = recordChild.key;
                        const liveChild = liveSnapshot.child(recordKey);
                        if (liveChild.exists()) {
                            // Delete one live entry
                            const liveChildRef = ref(database, `Centre/Class/Live/${recordKey}`);
                            remove(liveChildRef).then(() => {
                                console.log("Live entry deleted");
                            }).catch((error) => {
                                console.error("Error deleting live entry: ", error);
                            });
                            deleteLive = false;
                        } else {
                            // Delete one recorded entry
                            const recordedChildRef = ref(database, `Centre/Class/Record/${recordKey}`);
                            remove(recordedChildRef).then(() => {
                                console.log("Recorded entry deleted");
                            }).catch((error) => {
                                console.error("Error deleting recorded entry: ", error);
                            });
                            deleteRecorded = false;
                        }
                    }
                });
            }
        });
    });
}

// Listen for changes in the database
onValue(ref(database, "Centre/Class"), (snapshot) => {
    // Call the function to check and delete entries
    checkAndDeleteEntries();
});

