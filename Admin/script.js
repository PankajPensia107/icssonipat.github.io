// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import {
  getDatabase,
  ref,
  push,
  onChildAdded,
  set,
  onValue,
  off,
  query,
  orderByChild,
  equalTo,
  get,
  remove,
  update,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCQETZIoRqhCdirKEzqKGSXr5i5-PC0T68",
  authDomain: "ics-kharian.firebaseapp.com",
  databaseURL: "https://ics-kharian-default-rtdb.firebaseio.com",
  projectId: "ics-kharian",
  storageBucket: "ics-kharian.appspot.com",
  messagingSenderId: "592627003269",
  appId: "1:592627003269:web:18020dd2e0a41242e0deec",
  measurementId: "G-PZZ33KBSCH",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase();
const auth = getAuth(app);

// Add an event listener to the login button

// Add an event listener to the login button
LogInBtn.addEventListener("click", async function (e) {
  e.preventDefault(); // Prevent the default form submission behavior

  try {
    // Get the login name and password from input fields
    let LoginName = document.getElementById("TeacherName").value.toUpperCase();
    let LoginPassword = document.getElementById("password").value;

    // Sign in with email and password using Firebase auth
    const userCredential = await signInWithEmailAndPassword(
      auth,
      "Admin" + "_" + LoginName + "_@gmail.com",
      LoginPassword
    );
    const user = userCredential.user;
    localStorage.setItem("ActiveUserID", user.id);

    let userID = localStorage.getItem("ActiveUserID");
    const activeRef = ref(database, `Active`);
    const activeQuery = query(activeRef, orderByChild("ID"), equalTo(userID));
    const activeSnapshot = await get(activeQuery);

    if (activeSnapshot.exists()) {
      alert(
        "User is already logged in from another device. Please try again later."
      );
      await signOut(auth); // Sign out the current session
    } else {
      // If user is not logged in from another device, proceed with the login process
      const activeUserRef = push(ref(database, "Active"));
      await set(activeUserRef, {
        ID: userID,
      });
    }
    // Check if the user is already logged in from another device
  } catch (error) {
    // Handle authentication errors
    if (error.code == "auth/invalid-login-credentials") {
      alert("Please Check Your Mobile And Password");
    } else {
      console.error("Error during login:", error);
    }
  }
});

LogOutBtn.addEventListener("click", async function () {
  try {
    const userID = localStorage.getItem("ActiveUserID");
    if (userID) {
      const activeRef = ref(database, `Active`);
      const activeQuery = query(activeRef, orderByChild("ID"), equalTo(userID));
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
      await auth.signOut();
      localStorage.removeItem("ActiveUserID");
      location.reload(); // Reload the page after logout
    }
  } catch (error) {
    console.error("Error during logout:", error);
  }
});

// Update navbar to display username when user is logged in
auth.onAuthStateChanged((user) => {
  const mainPage = document.querySelector("#Main-Page");
  const BottomBar = document.querySelector("#BottomBar");
  const loginPage = document.querySelector("#Login-Page");
  const usernameElement = document.querySelector("#username");

  if (user) {
    mainPage.style.display = "block";
    BottomBar.style.display = window.innerWidth > 400 ? "none" : "block";
    loginPage.style.display = "none";
    usernameElement.textContent =
      localStorage.getItem("AdminName") || "ICS SONIPAT"; // Display username if available
  } else {
    mainPage.style.display = "none";
    BottomBar.style.display = "none";
    loginPage.style.display = "block";
    usernameElement.textContent = ""; // Clear username when user is logged out
  }
});

// Other parts of your code...

// let time = new Date();
// let BatchDate = time.getDate() + "-" + time.getUTCMonth() + "-" + time.getFullYear();
// Function to add a batch
function addBatch(logo, name, url) {
  let time = new Date();
  let date =
    time.getDate() + "-" + time.getUTCMonth() + "-" + time.getFullYear();

  const batchRef = push(ref(database, "Centre/Class/Live"));
  set(batchRef, {
    Logo: logo,
    Name: name,
    Time: date,
    URL: url,
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
    URL: url,
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
      alert("Batch Not Deleted");
    }
  } catch (error) {
    console.error("Error deleting batch: ", error);
    alert("Error deleting batch, please try again.");
  }
}

// Event listener for submitting a batch
document
  .getElementById("SubmitBatchBtn")
  .addEventListener("click", function () {
    const ClassLogo = document.getElementById("ClassLogo").value;
    const ClassName = document.getElementById("ClassName").value;
    const ClassURL = document.getElementById("ClassURL").value;
    addBatch(ClassLogo, ClassName, ClassURL);
  });

document
  .getElementById("SubmitRecordClassBtn")
  .addEventListener("click", function () {
    const RClassLogo = document.getElementById("RClassLogo").value;
    const RClassName = document.getElementById("RClassName").value;
    const RClassURL = document.getElementById("RClassURL").value;
    addRecordClass(RClassLogo, RClassName, RClassURL);
  });

// Event listener for deleting a batch
// Event listener for viewing live classes
document
  .getElementById("BatchSection")
  .addEventListener("click", function (event) {
    if (event.target.classList.contains("ViewClass")) {
      const videoUrl = event.target.dataset.link;
      console.log(`Live class ${videoUrl}`);
      updateIframe(videoUrl);
    }
  });

// Event listener for viewing recorded classes
document
  .getElementById("RecordedClassSection")
  .addEventListener("click", function (event) {
    if (event.target.classList.contains("ViewRecordedClass")) {
      const videoUrl = event.target.dataset.path;
      console.log(`Recorded class ${videoUrl}`);
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
                        <button class="btn btn-danger btn-sm deleteClassBtn" data-path="${key}" style="position:relative;right: 55%;bottom: -10px;">Delete Class</button>
                        <button class="btn btn-success btn-sm updateClassBtn" data-path="${key}" data-old="${URL}" data-logo="${Logo}" data-name="${Name}" data-time="${Time}" style="position:relative;right: 25%;bottom: -10px;">Update Link</button>
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
  try {
    const classRef = ref(database, `/Centre/Class/Live/${key}`);
    const updateOldLink = ref(database, `/Centre/Class/Record/${key}`);
    const liveRef = ref(database, "Centre/Class/Live");
    const recordRef = ref(database, "Centre/Class/Record");

    const [liveSnapshot, recordSnapshot] = await Promise.all([
      get(liveRef),
      get(recordRef),
    ]);
    const liveCount = liveSnapshot.val()
      ? Object.keys(liveSnapshot.val()).length
      : 0;
    const recordCount = recordSnapshot.val()
      ? Object.keys(recordSnapshot.val()).length
      : 0;

    if (recordCount >= liveCount * 2 || recordCount === liveCount) {
      // Delete the last record entry
      const lastRecordKey = Object.keys(recordSnapshot.val()).pop();
      const lastRecordedChildRef = ref(
        database,
        `Centre/Class/Record/${lastRecordKey}`
      );
      await remove(lastRecordedChildRef);
      console.log("Last recorded entry deleted");
    }

    await update(classRef, { URL: newLink });
    await set(updateOldLink, {
      Logo: Logo,
      Name: Name,
      Time: Time,
      URL: oldLink,
    });

    console.log("Class link updated successfully");
    alert("Class Link Updated");
    location.reload();
  } catch (error) {
    console.error("Error updating class link: ", error);
    alert("Error updating class link, please try again.");
  }
}

document
  .getElementById("BatchSection")
  .addEventListener("click", function (event) {
    // data-path="${key}" data-old="${URL}" data-logo="${Logo}" data-name="${Name}" data-time="${time}"

    if (event.target.classList.contains("updateClassBtn")) {
      const key = event.target.dataset.path;
      const oldLink = event.target.dataset.old;
      const Logo = event.target.dataset.logo;
      const Name = event.target.dataset.name;
      const Time = event.target.dataset.time;
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
                        <button class="btn btn-success btn-sm updateRecordedClassBtn" data-path="${key}" data-old="${URL}" data-logo="${Logo}" data-name="${Name}" data-time="${Time}" style="position:relative;right: 25%;bottom: -10px;">Update Link</button>
                       
                        <button class="btn btn-primary btn-sm ViewRecordedClass" style="position: relative; bottom: -10px; left: 6%;" data-path="${URL}" data-bs-toggle="modal" data-bs-target="#basic111Modal">View Class</button>
                    </div>
                </div>
            </div>
            <div class="sortable-handler"></div>
        </li>
    `;

  // Insert new HTML content at the top of LiveClassSection
  RecordedClassSection.insertAdjacentHTML("afterbegin", Classes);
});

// Event listener for updating class link

// Event listener for updating class link
document
  .getElementById("RecordedClassSection")
  .addEventListener("click", function (event) {
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
let Month = NewTime.getMonth() + 1;
let NewDate = NewTime.getDate() + "-" + Month + "-" + NewTime.getFullYear();

// Function to update class link in the database
async function updateRecordedClassLink(key, newLink) {
  const classRef = ref(database, `/Centre/Class/Record/${key}`);

  update(classRef, {
    URL: newLink,
    Time: NewDate,
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

document
  .getElementById("BatchSection")
  .addEventListener("click", function (event) {
    if (event.target.classList.contains("deleteClassBtn")) {
      const key = event.target.dataset.path;
      const docRef = ref(database, `/Centre/Class/Live/${key}`);
      deleteClass(docRef, key);
    }
  });

document
  .getElementById("RecordedClassSection")
  .addEventListener("click", function (event) {
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
      alert("Class Not Deleted");
    }
  } catch (error) {
    console.error("Error deleting class: ", error);
    alert("Error deleting class, please try again.");
  }
}

// Function to check and delete entries alternately
function checkAndDeleteEntries() {}

onValue(ref(database, "Centre/Class"), () => {
  checkAndDeleteEntries();
});

async function deleteRecordedLastClass(docRef, key) {
  try {
    await remove(docRef);
    location.reload();
  } catch (error) {
    console.error("Error deleting batch: ", error);
  }
}

// Listen for changes in the database
// Function to remove the last recorded class if count doubles the live class count
function removeLastRecordedClassIfNeeded() {
  const liveCount = document.getElementById("BatchSection").childElementCount;
  const recordedCount = document.getElementById(
    "RecordedClassSection"
  ).childElementCount;

  if (recordedCount >= 2 * liveCount) {
    // Remove the last recorded class
    const lastRecordedClassKey = document.querySelector(
      "#RecordedClassSection li:last-child .deleteRecordedClassBtn"
    ).dataset.path;
    const docRef = ref(
      database,
      `/Centre/Class/Record/${lastRecordedClassKey}`
    );
    deleteRecordedLastClass(docRef, lastRecordedClassKey);
  }
}

// Run the function periodically
setInterval(removeLastRecordedClassIfNeeded, 1000);

AddNewBranchBtn.addEventListener("click", async function () {
  let BranchName = document.getElementById("BranchName").value;
  let BranchOwner = document.getElementById("BranchOwner").value;
  let BranchMobile = document.getElementById("BranchMobile").value;
  // let NewTeacherClass = SelectNewTeacherClass;
  let BranchEmail = document.getElementById("BranchEmail").value;
  let BranchPassword = document.getElementById("BranchPassword").value;

  try {
    let CurrentUserID;
    //   let CurrentUserID
    const BranchData = push(ref(database, `Centre/Branch/ID`));
    // CurrentUserID = ClassData.key
    CurrentUserID = BranchData.key;
    const PersonalData = push(
      ref(
        database,
        `Centre/Branch/${BranchEmail.split("@")[0].toLowerCase()}/Personal`
      )
    );
    await set(BranchData, {
      ID: BranchEmail,
    })
      .then(() => {
        console.log("Branch Added");
      })
      .catch((error) => {
        alert("Branch Not Added. Error: " + error);
      });

    await set(PersonalData, {
      Name: BranchName,
      Owner: BranchOwner,
      Mobile: BranchMobile,
      Email: BranchEmail,
      Password: BranchPassword,
      Path: CurrentUserID,
    })
      .then(() => {
        alert("New Branch Added Successfully");
        location.reload();
      })
      .catch((error) => {
        alert("Branch Not Added. Error: " + error);
      });
  } catch (error) {
    let CurrentUserID;
    const BranchData = push(ref(database, `Centre/Branch/ID`));

    const PersonalData = push(
      ref(database, `Centre/Branch/${BranchEmail.split("@")[0]}/Personal`)
    );
    CurrentUserID = BranchData.key;

    await set(BranchData, {
      ID: BranchEmail,
    })
      .then(() => {
        console.log("Branch Added");
      })
      .catch((error) => {
        alert("Branch Not Added. Error: " + error);
      });

    await set(PersonalData, {
      Name: BranchName,
      Owner: BranchOwner,
      Mobile: BranchMobile,
      Email: BranchEmail,
      Password: BranchPassword,
      Path: CurrentUserID,
    })
      .then(() => {
        alert("New Branch Added Successfully");
        location.reload();
      })
      .catch((error) => {
        alert("Branch Not Added. Error: " + error);
      });
  }
});

let TeacherListSection = document.getElementById("BranchSection");

onValue(ref(database, "Centre/Branch/ID"), (snapshot) => {
  TeacherListSection.innerHTML = ""; // Clear previous content before updating

  snapshot.forEach((childSnapshot) => {
    let childData = childSnapshot.val();

    onValue(
      ref(database, `Centre/Branch/${childData.ID.split("@")[0]}/Personal`),
      (userDataSnapshot) => {
        userDataSnapshot.forEach((userDataSnapshot) => {
          let UserData = userDataSnapshot.val();
          if (UserData) {
            let { Name, Email, Mobile, Owner, Password, Path } = UserData;
            let DataKey = userDataSnapshot.key;
            console.log(Password);
            console.log(Name);
            TeacherListSection.innerHTML += `
                    <li>
                    <div class="item-content">
                    <a href="#" class="item-media"><img src="../images/computer.png" alt="logo" width="55" /></a>
                    
                    <div class="item-inner">
                    <div class="item-title-row">
                    <h6 class="item-title"><a href="#"  style="text-transform: uppercase;">Name:- ${Name}</a></h6>
                    <h5 class="item-title"><a href="#"  style="text-transform: uppercase;">Father:- ${Owner}</a></h5>
                    <h5 class="item-title"><a class=""  style="text-transform: uppercase;" href="#">Mobile:- ${Mobile}</a></h5>
                    <h5 class="item-title"><a class=""  style="text-transform: uppercase;" href="#">Email:- ${Email}</a></h5>
                    <h5 class="item-title"><a class=""  style="text-transform: uppercase;" href="#">Password:- ${Password}</a></h5>
                    
                    </div>
                    </div>
                    </div>
                    <div style="display: flex; justify-content: space-around; position: relative; bottom: 10px;">
                    <button class="btn btn-warning btn-sm EditBranchInfo" data-key="${DataKey}"  data-name="${Name}" data-owner="${Owner}"  data-mobile="${Mobile}" data-pass="${Password}" data-email="${
              Email.split("@")[0]
            }" data-bs-toggle="modal" data-bs-target="#EditModal">Edit</button>
                    <button class="btn btn-info btn-sm ViewPaymentRecord" data-key="${DataKey}" data-email="${
              Email.split("@")[0]
            }"  data-bs-toggle="modal" data-bs-target="#PaymentRecord">Payment</button>
                    <button class="btn btn-danger btn-sm DeleteBranchInfo" data-key="${
                      Email.split("@")[0]
                    }" data-path="${Path}" >Delete</button>
                    </div>
                     
                    <div class="sortable-handler"></div>
                    </li>
                `;
          }
        });

        const deleteButtons = document.querySelectorAll(".DeleteBranchInfo");
        console.log("Delete buttons found:", deleteButtons.length); // Check if delete buttons are found
        deleteButtons.forEach((btn) => {
          btn.addEventListener("click", (event) => {
            console.log("Delete button clicked");
            const personalKey = event.target.getAttribute("data-key");
            const brachKey = event.target.getAttribute("data-path");
            // const ClassKey = event.target.getAttribute("data-classkey");
            // console.log( `/School/TeacherList/${ClassKey}`)

            if (personalKey) {
              const documentRefToDelete = ref(
                database,
                `Centre/Branch/${personalKey}`
              );
              const DeleteFromClass = ref(
                database,
                `/Centre/Branch/ID/${brachKey}`
              );

              console.log("Document reference to delete:", documentRefToDelete);
              if (confirm("Are You Sure To Delete This Branch")) {
                DeleteBranch(documentRefToDelete);
                DeleteBranchFromList(DeleteFromClass);
              }
            }
          });
        });

        const EditButtons = document.querySelectorAll(".EditBranchInfo");
        EditButtons.forEach((btn) => {
          btn.addEventListener("click", (event) => {
            const key = event.target.getAttribute("data-key");
            const name = event.target.getAttribute("data-name");
            const owner = event.target.getAttribute("data-owner");
            const mobile = event.target.getAttribute("data-mobile");
            const pass = event.target.getAttribute("data-pass");
            const email = event.target.getAttribute("data-email");
            if (key) {
              EditBranchInfo(key, name, owner, mobile, pass, email);
              //  DeleteBranchFromList(DeleteFromClass)
            }
          });
        });

        const PaymentButtons = document.querySelectorAll(".ViewPaymentRecord");
        // Check if delete buttons are found
        PaymentButtons.forEach((btn) => {
          btn.addEventListener("click", (event) => {
            const FeeKey = event.target.getAttribute("data-key");
            const FeePath = event.target.getAttribute("data-email");

            const FeeDataPath = `Centre/Branch/${FeePath}/Record`;
            console.log(FeeDataPath);
            document
              .getElementById("PaymentSaveBtn")
              .addEventListener("click", function () {
                const NewAmount = PaymentDate.value;
                const NewAmountDate = PaymentAmount.value;
                console.log("clicked...");
                AddBranchPayment(FeeDataPath, NewAmount, NewAmountDate);
              });

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
                                        <td scope="row">Received</td>
                                        <td scope="row">
                                            <button class="btn btn-danger btn-sm deleteRecordBtn" data-path="${FeeDataPath}" data-key="${DataKey}">Delete</button>
                                        </td>
                                    </tr>`;
                  console.log(Recived, Date);
                }
              });

              const deleteButtons =
                document.querySelectorAll("#deleteRecordBtn");
              console.log("Delete buttons found:", deleteButtons.length); // Check if delete buttons are found
              deleteButtons.forEach((btn) => {
                btn.addEventListener("click", (event) => {
                  console.log("Delete button clicked");
                  const documentIdToDelete =
                    event.target.getAttribute("data-path");
                  const dataKey = event.target.getAttribute("data-key");
                  console.log("Document ID to delete:", documentIdToDelete);
                  console.log("Data Key:", dataKey);
                  if (documentIdToDelete) {
                    const documentRefToDelete = ref(
                      database,
                      `${documentIdToDelete}/${dataKey}`
                    );
                    console.log(
                      "Document reference to delete:",
                      documentRefToDelete
                    );
                    deletePreviousRecord(documentRefToDelete);
                  }
                });
              });
            });
          });
        });
      }
    );
  });
});

function AddBranchPayment(FeeDataPath, NewAmount, NewAmountDate) {
  let time = new Date();
  let Day = time.getDate();
  let Month = time.getMonth() + 1; // Months start from 0, so add 1 to get the correct month
  let Year = time.getFullYear();
  let CurrentTime = Day + "/" + Month + "/" + Year;

  const NewFreeRecordRef = push(ref(database, FeeDataPath));

  set(NewFreeRecordRef, {
    Recived: NewAmount,
    Date: NewAmountDate,
  });

  alert("Record Added");
  location.reload();
}

async function deletePreviousRecord(docRef) {
  try {
    if (confirm("Are you sure you want to delete")) {
      await remove(docRef);
    }
    alert("Record Deleted");
    location.reload();
  } catch (error) {
    console.error(error);
    setInterval(function () {
      location.reload();
    }, 500);
  }
}

let SubmitEditBranchBtn = document.querySelector("#SubmitEditBranchBtn");
async function EditBranchInfo(key, name, owner, mobile, pass, email) {
  document.getElementById("EditBranchName").value = name;
  document.getElementById("EditBranchOwner").value = owner;
  document.getElementById("EditBranchMobile").value = mobile;
  document.getElementById("EditBranchEmail").value = email + "@gmail.com";
  document.getElementById("EditBranchPass").value = pass;
  const classRef = ref(database, `Centre/Branch/${email}/Personal/${key}`);

  console.log(`Centre/Branch/${email}/Personal/${key}`);
  SubmitEditBranchBtn.addEventListener("click", async function () {
    let BranchName = document.getElementById("EditBranchName");
    let BranchOwner = document.getElementById("EditBranchOwner");
    let BranchMobile = document.getElementById("EditBranchMobile");
    let BranchEmail = document.getElementById("EditBranchEmail");
    let BranchPassword = document.getElementById("EditBranchPass");
    console.log(BranchPassword.value);
    const classRef = ref(database, `Centre/Branch/${email}/Personal/${key}`);

    await update(ref(database, `Centre/Branch/${email}/Personal/${key}`), {
      Email: BranchEmail.value,
      Mobile: BranchMobile.value,
      Name: BranchName.value,
      Owner: BranchOwner.value,
      Password: BranchPassword.value,
    })
      .then(() => {
        console.log("Branch details updated successfully");
        alert("Branch details updated");
        location.reload();
      })
      .catch((error) => {
        console.error("Error updating branch details: ", error);
        alert("Error updating branch details, please try again.");
      });
  });
}

async function DeleteBranch(docRef) {
  try {
    await remove(docRef);
    location.reload();
  } catch (error) {
    console.error(error);
  }
}

async function DeleteBranchFromList(docRef) {
  try {
    await remove(docRef);
    alert("Branch Deleted");
    location.reload();
  } catch (error) {
    console.error(error);
    setInterval(function () {
      location.reload();
    }, 500);
  }
}

let LiveCountText = document.getElementById("LiveCountText");
let RecordClassCount = document.getElementById("RecordClassCount");
let Recorded = document.getElementById("RecordClassCount");
let R = document.getElementById("RecordedClassSection");

setInterval(() => {
  LiveCountText.innerHTML = `Live Classes (${BatchSection.childElementCount})`;
  Recorded.innerHTML = `Recorded Class (${R.childElementCount})`;
  // console.clear();
}, 1000);
