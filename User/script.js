// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getAuth,createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, deleteUser } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import { getDatabase, ref, push, onChildAdded , set, onValue, off, query, orderByChild, equalTo, get, remove, update } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";

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
const auth = getAuth(app);

// Add an event listener to the login button
const mainPage = document.querySelector("#Main-Page");
const loginPage = document.querySelector("#Login-Page");
const usernameElement = document.querySelector("#username");
// Add an event listener to the login button

// Add event listener to the login button
document.getElementById("LogInBtn").addEventListener("click", async function (e) {
    e.preventDefault(); // Prevent the default form submission behavior
    try {
        let LoginID = document.getElementById("LoginID").value
        let Pass = document.getElementById("LoginPass").value;
        localStorage.getItem("UserEmail", LoginID);
        localStorage.setItem("LoginPass", Pass);
        console.log(`/Centre/Branch/${LoginID.split('@')[0]}/Personal/`);
        
        // Listen for changes in the database reference
        onValue(ref(database, `/Centre/Branch/${LoginID.split('@')[0]}/Personal`), (snapshot) => {
            if (snapshot.exists()) {
                snapshot.forEach(async(childSnapshot) => {
                    let UserDetails = childSnapshot.val();
                    let password = UserDetails?.Password; // Safely access LoginPass
                    console.log(password);
                    let Pass = document.getElementById("LoginPass").value;
                    localStorage.getItem("UserEmail", LoginID);
                    localStorage.setItem("LoginPass", Pass);

                    if (Pass == UserDetails.Password) {
                        let userID = childSnapshot.key;
                        localStorage.setItem("ActiveUserID", userID);
                        const activeRef = ref(database, "Active");
                        const activeQuery = query(activeRef, orderByChild('ID'), equalTo(userID));
                        const activeSnapshot = await get(activeQuery);

                        console.log("checking active snapshot")
                        if (activeSnapshot.exists()) {
                            alert("User is already logged in from another device. Please try again later.");
                        } else {
                            // Proceed with login process if user is not logged in from another device
                            let userID = childSnapshot.key;

                            // Set active user in Active database
                            const activeUserRef = push(ref(database, "Active"));
                            await set(activeUserRef, { ID: userID });
                            
                            localStorage.setItem("UserEmail", LoginID.split('@')[0]);
                            alert("Welcome to ICS");

                            const mainPage = document.querySelector("#Main-Page");
                            const loginPage = document.querySelector("#Login-Page");
                            const usernameElement = document.querySelector("#username");

                            mainPage.style.display = "block";
                            loginPage.style.display = "none";
                            usernameElement.textContent = localStorage.getItem("Name");
                        }
                    } else {
                        alert("Please Check Your Email And Password");
                    }
                });
            } else {
                alert("User not found");
            }
        });
    } catch (error) {
        console.log(error);
    }
});


// /Centre/Branch/Pankajpensia22/Personal/-NwsrcfTyHOya21r5F4p/Name
onValue(ref(database, `/Centre/Branch/${localStorage.getItem("UserEmail")}/Personal/`), (snapshot) => {
    snapshot.forEach((childSnapshot) => {
        const childData = childSnapshot.val();
        localStorage.setItem("Name", childData.Name)
        console.log(childData.Name)
        // localStorage.setItem("ShopID", childData.ShopID)
        username.innerHTML = childData.Name.toUpperCase()
        console.log(childData)
      
    });
});


onValue(ref(database, `/Centre/Branch/${localStorage.getItem("UserEmail")}/Personal/`), (snapshot) => {
    snapshot.forEach((childSnapshot) => {
                
    const mainPage = document.querySelector("#Main-Page");
    // const BottomBar = document.querySelector("#BottomBar");
    const loginPage = document.querySelector("#Login-Page");
    const usernameElement = document.querySelector("#username");
        const childData = childSnapshot.val();
        if(localStorage.getItem("LoginPass") == childData.Password){
            mainPage.style.display = "block";
      
            loginPage.style.display = "none";
            usernameElement.textContent = localStorage.getItem("Name");
        }else{
            mainPage.style.display = "none";
      
            loginPage.style.display = "block";
            usernameElement.textContent = "";
        }
      
    });
});


LogOutBtn.addEventListener("click", async function() {
    try {
        const userID = localStorage.getItem("ActiveUserID");
       
            if (userID) {
                if(confirm("Are you sure you want to log out")){

                
                const activeRef = ref(database, "Active");
                const activeQuery = query(activeRef, orderByChild('ID'), equalTo(userID));
                const activeSnapshot = await get(activeQuery);
                if (activeSnapshot.exists()) {
                    activeSnapshot.forEach((childSnapshot) => {
                        // Remove the active user entry from the database
                        const key = childSnapshot.key;
                        if (key) {
                            const userRef = ref(database, `Active/${key}`);
                            set(userRef, null); // Set to null to remove the entry
                            
                        }
                    });
                }
            }
                
            }
            localStorage.clear();
            location.reload(); // Reload the page after logout
            // localStorage.clear();
            const mainPage = document.querySelector("#Main-Page");
            // const BottomBar = document.querySelector("#BottomBar");
            const loginPage = document.querySelector("#Login-Page");
            const usernameElement = document.querySelector("#username");
        
            mainPage.style.display = "none";
            
            loginPage.style.display = "block";
            usernameElement.textContent = localStorage.getItem("AdminName") || ""; // Display username if available
            
        } catch (error) {
            console.error("Error during logout:", error);
        }     
});




// Other parts of your code...

// Event listener for deleting a batch
// Event listener for viewing live classes
document.getElementById("BatchSection").addEventListener('click', function(event) {
    if (event.target.classList.contains("ViewClassUser")) {
        const videoUrl = event.target.dataset.link;
        updateIframe(videoUrl);
    }
});

// Event listener for viewing recorded classes
document.getElementById("RecordedClassSection").addEventListener('click', function(event) {
    if (event.target.classList.contains("ViewClassRecordedUser")) {
        const videoUrl = event.target.dataset.path;
        updateIframe(videoUrl);
    }
});

// Function to update the iframe with the video URL
function updateIframe(videoUrl) {
    const videoId = getYoutubeVideoId(videoUrl);
    if (videoId) {
        const embedUrl = `https://www.youtube.com/embed/${videoId}`;
        document.getElementById("ClassLink").src = embedUrl;
    } else {
        console.error("Invalid video URL");
    }
}

// Function to extract video ID from YouTube URL
function getYoutubeVideoId(url) {
    const match = url.match(/(?:live\/)([^\?]+)/);
    return match && match[1];
}

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
                    
                         <button class="btn btn-success btn-sm ViewClassUser" style="position: relative; bottom: -10px;" data-link="${URL}" data-bs-toggle="modal" data-bs-target="#basic111Modal">View Class</button>
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
                       <div class="btns">
                        <button class="btn btn-primary btn-sm ViewClassRecordedUser" style="position: relative; bottom: -10px; " data-path="${URL}" data-bs-toggle="modal" data-bs-target="#basic111Modal">View Class</button>
                        </div>
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

let RecordClassCount = document.getElementById("RecordClassCount");
let LiveCountText = document.getElementById("LiveCountText");

let GetEmail = localStorage.getItem("UserEmail");
let FeeDataPath = `Centre/Branch/${GetEmail}/Record`;
onValue(ref(database, FeeDataPath), (childSnapshot) => {
    childSnapshot.forEach((userDataSnapshot) => {
      let UserData = userDataSnapshot.val();
      if (UserData) {
        let { Date, Recived } = UserData;
        let DataKey = userDataSnapshot.key;
        let PaymentRecord = document.getElementById("FeeRecord");
        PaymentRecord.innerHTML += `
                          <tr>
                              <td scope="row">${Recived}</td>
                              <td scope="row">${Date}</td>
                              <td scope="row">Sended</td>
                              
                          </tr>`;
        console.log(Recived, Date);
      }
    });
});
setInterval(()=>{
    let LiveCount = BatchSection.childElementCount
    LiveCountText.innerHTML = `Live Classes (${LiveCount})`;

    let RecordCount = RecordedClassSection.childElementCount;
    RecordClassCount.innerHTML = `Recorded Classes (${RecordCount})`;
},1000)