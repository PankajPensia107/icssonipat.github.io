
// var Offlinetable = document.getElementById("Offlinetodo");
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword , createUserWithEmailAndPassword, deleteUser} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import { getDatabase, ref, push, set, onValue, remove, update, onChildAdded } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";
// import { getStorage } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-storage.js";
const firebaseConfig = {
    apiKey: "AIzaSyCQETZIoRqhCdirKEzqKGSXr5i5-PC0T68",
    authDomain: "ics-kharian.firebaseapp.com",
    projectId: "ics-kharian",
    storageBucket: "ics-kharian.appspot.com",
    messagingSenderId: "592627003269",
    appId: "1:592627003269:web:18020dd2e0a41242e0deec",
    measurementId: "G-PZZ33KBSCH"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase();
// Get a reference to the Firebase Storage service
LogInBtn.addEventListener("click", async function (e) {
// Display a loading message
alert("Please Wait Finding Your Data");

// Get the login name and password from input fields
let LoginName = document.getElementById("TeacherName").value.toUpperCase();
let LoginPassword = document.getElementById("password").value;

// Remove dashes from the password


// Generate a unique ID for login and store it in localStorage
localStorage.setItem("LoginID", LoginName);

// Display the generated ID in the console
// console.log(LoginName + GeneratePassword);

// Prevent the default form submission behavior
e.preventDefault();

try {
// Sign in with email and password using Firebase auth
const userCredential = await signInWithEmailAndPassword(auth, "Principal" + "_" + LoginName  + "@vjsss.com", LoginPassword);
const user = userCredential.user;

console.log("Success! Welcome back!");
// Alert user about successful login
alert("Welcome Back To VJSSS");
} catch (error) {
// Handle authentication errors
if (error.code == "auth/invalid-login-credentials") {
alert("Please Check Your Mobile And Password");
}
// Log any other errors
console.log(error);
}
});

onValue(ref(database, `/School/Principal/${localStorage.getItem("LoginID")}`), (snapshot) => {
    snapshot.forEach((childSnapshot) => {
        const childData = childSnapshot.val();
        localStorage.setItem("Name", childData.Name)
        localStorage.setItem("Destination", childData.destination)
        // localStorage.setItem("ShopID", childData.ShopID)
        
        
      
    });
});

let mainPage = document.querySelector("#Main-Page");
let BottomBar = document.querySelector("#BottomBar")
let loginPage = document.querySelector("#Login-Page")
auth.onAuthStateChanged((user) => {
	if (user) {
	
	mainPage.style.display = "none";
    BottomBar.style.display = "none"
	username.innerHTML = localStorage.getItem("Name")
	loginPage.style.display = "block";
	}
	else {
	
	mainPage.style.display = "block";
    BottomBar.style.display = "block"
	loginPage.style.display = "none";
	}
	});
	
	LogOutBtn.addEventListener("click", function() {
	auth.signOut().then(() => {
	mainPage.style.display = "none";
	loginPage.style.display = "block";
	localStorage.clear()
	}).catch((error) => {
	console.error("Error during logout:", error);
	});
	});

// Fetch user data from the database


let SelectResultStudent = document.getElementById("SelectResultStudent");
let AttendanceList = document.getElementById("AttendanceList");
let SelectPreviousAttendance = document.getElementById("SelectPreviousAttendance")
let PreviousAttendanceList = document.getElementById("PreviousAttendanceList")
let SelectPreviousResultStudent = document.getElementById("SelectPreviousResultStudent")
let SelectPreviousResultExamStudent = document.getElementById("SelectPreviousResultExamStudent")
let SelectStudent
SelectPreviousAttendance.addEventListener('change', function(){
     SelectStudent = SelectPreviousAttendance.value;
    console.log(SelectPreviousAttendance.value)
    onValue(ref(database, `/School/Student/${SelectPreviousAttendance.value}/Attendanace`), (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            const childData = childSnapshot.val();
            const key = childSnapshot.key;
    
            PreviousAttendanceList.innerHTML += `
                <li>
                    <a href="javascript:void(0);" class="item-content item-link">
                        <div class="dz-icon">
                            <img src="../Images/stopwatch.png" alt="/" />
                        </div>
                        <div class="dz-inner">
                            <span class="dz-title">${childData.Date} -- ${childData.Status} 
                                <div style="position: absolute; right: 0; top: 3px">
                                    <button class="btn btn-sm DeleteAttendanceBtn" data-path="${key}">
                                        <img src="../Images/delete.png" " style="width:30px; height:30px;">
                                    </button>
                                </div>
                            </span>
                        </div>
                    </a>
                </li>
            `;
            // console.log(childData);
            const DeleteAttendanceBtn = document.querySelectorAll(".DeleteAttendanceBtn");
            DeleteAttendanceBtn.forEach((btn) => {
            btn.addEventListener("click", (event) => {
            const documentIdToDelete = event.target.getAttribute("data-path");
            if (documentIdToDelete) {
            const documentRefToDelete = ref(database, `/School/Student/${SelectPreviousAttendance.value}/Attendanace/${documentIdToDelete}`);
            
            DeleteAttendanceFunction(documentRefToDelete);
            }
            });
            });
        });
        
    
        });
})



async function DeleteAttendanceFunction(docRef) {
    alert("Attendance Delete in process")
    try {
    await remove(docRef);
    alert("Attendance Deleted");
    location.reload();
    } catch (error) {
    console.error(error);
    
    }
    }

    SelectPreviousResultExamStudent.addEventListener('change', function() {
        let studentId = SelectPreviousResultExamStudent.value;
    
        let ViewPreviousSchoolResult = document.getElementById("ViewPreviousSchoolResultSection");
        ViewPreviousSchoolResult.innerHTML = ''; // Clear previous content before adding new exam results
    
        // Attach event listener to the database reference for the selected student
        onChildAdded(ref(database, `/School/Student/${studentId}/Result/SchoolExam`), (childSnapshot) => {
            const childData = childSnapshot.val();
            const key = childSnapshot.key;
    
            // If exam result data is present
            const newResultHTML = `
                <div class="row">
                    <div class="col-12">
                        <div class="card">
                            <div class="card-header border-0 pb-0">
                                <h5 class="card-title">${childData.Title}</h5>
                            </div>
                            <div class="card-body">
                                <p class="card-text">
                                    <table class="table rounded" >
                                        <thead>
                                            <tr>
                                                <th scope="col">Subject</th>
                                                <th scope="col">Total</th>
                                                <th scope="col">Obtain</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${childData.Result}      
                                        </tbody>
                                    </table>
                                </p>
                            </div>
                            <div class="card-footer border-0 pt-0">
                                <p class="card-text d-inline">${childData.Date}</p>
                                <a href="javascript:void(0);" class="card-link float-end DeleteSchoolExamResult" data-path="${key}">Delete</a>
                            </div>
                        </div>
                    </div>
                </div>
            `;
    
            // Add new exam result HTML at the beginning of ViewPreviousSchoolResult
            ViewPreviousSchoolResult.innerHTML = newResultHTML + ViewPreviousSchoolResult.innerHTML;
    

        });
    });
    
        async function DeleteSchoolExamResultFunction(docRef) {
            alert("Result Delete in process")
            try {
            await remove(docRef);
            alert("Result Deleted");
            location.reload();
            } catch (error) {
            console.error(error);
            setInterval(function() {
            location.reload();
            }, 500);
            }
            }

            let TeacherListSection = document.getElementById("TeacherListSection")

            onValue(ref(database, "School/TeacherList"), (snapshot) => {
                TeacherListSection.innerHTML = ''; // Clear previous content before updating
            
                snapshot.forEach((childSnapshot) => {
                    let childData = childSnapshot.val();
            
                    onValue(ref(database, `School/Teacher/${childData.DataRef}/Personal`), (userDataSnapshot) => {
                        userDataSnapshot.forEach((userDataSnapshot) => {
                            let UserData = userDataSnapshot.val();
                            if (UserData) {
                                let { Name, Class, DOB, FatherName, MotherName, Mobile,TotalSalery, Recived, Panding, LoginID, ClassKey } = UserData;
                                let DataKey = userDataSnapshot.key;
                                console.log(Name)
                                TeacherListSection.innerHTML += `
                                <li>
                                <div class="item-content">
                                <a href="#" class="item-media"><img src="../assets/images/images.png" alt="logo" width="55" /></a>
                                
                                <div class="item-inner">
                                <div class="item-title-row">
                                <h6 class="item-title"><a href="#">Name:- ${Name}</a></h6>
                                <h5 class="item-title"><a href="#">Father:- ${FatherName}</a></h5>
                                <h5 class="item-title"><a class="text-success" href="#">Mobile:- ${Mobile}</a></h5>
                                </div>
                                </div>
                                </div>
                                <div style="display: flex; justify-content: space-around; position: relative; bottom: 10px;">
                                <button class="btn btn-warning btn-sm EditTeacherInfo" data-key="${DataKey}" data-login="${LoginID}" data-name="${Name}" data-class="${Class}"  data-dob="${DOB}" data-father="${FatherName}" data-mother="${MotherName}" data-mobile="${Mobile}" data-total="${TotalSalery}" data-submit="${Recived}" data-pandingfee="${Panding}" data-bs-toggle="modal" data-bs-target="#example4ModalLong">Edit</button>
                                <button class="btn btn-secondary btn-sm ViewSaleryRecord" data-feekey="${DataKey}" data-feepath="${LoginID}" data-bs-toggle="modal" data-bs-target="#example5ModalLong">View Record</button>
                                <button class="btn btn-danger btn-sm DeleteTeacherRecord" data-classkey="${ClassKey}" data-class="${Class}" data data-student="${LoginID}" data-bs-toggle="modal" data-bs-target="#basic2Modal">Delete</button>
                                </div>
                                
                                <div class="sortable-handler"></div>
                                </li>
                            `;
                            }
                        });
                        const deleteButtons = document.querySelectorAll(".DeleteTeacherRecord");
                        console.log("Delete buttons found:", deleteButtons.length); // Check if delete buttons are found
                        deleteButtons.forEach((btn) => {
                            btn.addEventListener("click", (event) => {
                                console.log("Delete button clicked");
                                const documentIdToDelete = event.target.getAttribute("data-student");
                                const dataKey = event.target.getAttribute("data-key");
                                const CurrentClass = event.target.getAttribute("data-class");
                                const ClassKey = event.target.getAttribute("data-classkey");
                                console.log( `/School/TeacherList/${ClassKey}`)
                                
                                if (documentIdToDelete) {
                                    const documentRefToDelete = ref(database, `School/Teacher/${documentIdToDelete}`);
                                    const DeleteFromClass = ref(database, `/School/TeacherList/${ClassKey}`);
            
                                    console.log("Document reference to delete:", documentRefToDelete);
                                    document.querySelector("#DeleteTeacherAccountBtn").addEventListener('click', function(){
            
                                        DeleteTeacherRecord(documentRefToDelete);
                                        DeleteTeacherRecordList(DeleteFromClass)
                                    })
                                }
                            });
                        });
                              
                    });
                });
            });

            async function DeleteTeacherRecord(docRef) {
                alert("Record Delete in process");
                try {
                    await remove(docRef);
                    await remove(DeleteFromClass)
                    alert("Record Deleted");
                    location.reload();
                } catch (error) {
                    console.error(error);
                  
                }
            }
            
            async function DeleteTeacherRecordList(docRef) {
                alert("Record Delete in process");
                try {
                    await remove(docRef);
                    alert("Record Deleted");
                    location.reload();
                } catch (error) {
                    console.error(error);
                    setInterval(function() {
                        location.reload();
                    }, 500);
                }
            }
            
            // async function deletePreviousRecord(docRef) {
            //     alert("Record Delete in process");
            //     try {
            //         await remove(docRef);
            //         alert("Record Deleted");
            //         location.reload();
            //     } catch (error) {
            //         console.error(error);
            //         setInterval(function() {
            //             location.reload();
            //         }, 500);
            //     }
            // }

            function updateTeacherData(recordKey,newName, newDob, newClass, newMobile, newFather, newMother, newTotal, newSubmited, newPanding) {
                const DipsoteRef = ref(database, recordKey);
                
                update(DipsoteRef, { 
                    Name: newName,
                    DOB: newDob,
                    Class: newClass,
                    Mobile: newMobile,
                    FatherName: newFather,
                    MotherName: newMother,
                    TotalSalery: newTotal,
                    Recived: newSubmited,
                    Panding: newPanding
                 })
                    .then(() => {
                        alert("Updated successfully.");
            
                      
                    })
                    .catch((error) => {
                        console.error("Error updating data:", error);
                    });
            }

            function AddTeacherSaleryRecord(FeeDataPath, NewAmount, NewAmountDate){
                let time = new Date();
                let Day = time.getDate();
                let Month = time.getMonth() + 1; // Months start from 0, so add 1 to get the correct month
                let Year = time.getFullYear();
                let CurrentTime = Day + "/" + Month + "/" + Year;
            
                const NewFreeRecordRef = push(ref(database, FeeDataPath));
            
                set(NewFreeRecordRef, {
                    Recived: NewAmount,
                    Date: NewAmountDate
                });
            
                alert("Record Added")
                
            }

      let EditTeacherName = document.getElementById("EditTeacherName");
      let EditTeacherDOB = document.getElementById("EditTeacherDOB");
      let EditTeacherClass = document.getElementById("EditTeacherClass");
      let EditTeacherMobile = document.getElementById("EditTeacherMobile");
      let EditTeacherFather = document.getElementById("EditTeacherFather");
      let EditTeacherMother  = document.getElementById("EditTeacherMother");
      let EditTotalSalery = document.getElementById("EditTotalSalery");
      let EditRecivedSalery = document.getElementById("EditRecivedSalery");
      let EditPandingSalery = document.getElementById("EditPandingSalery");
      
      let NewSaleryRecord = document.getElementById("NewSaleryRecord");
      let NewSaleryRecordDate = document.getElementById("NewSaleryRecordDate");      
      let SaleryRecordSection = document.getElementById("SaleryRecordSection")
      // let FeeRecord = document.getElementById("FeeRecord")
            TeacherListSection.addEventListener('click', function (event) {
                if (event.target.classList.contains('EditTeacherInfo')) {
                    const key = event.target.getAttribute('data-key');
                    const dataMobile = event.target.getAttribute('data-login');
                    const name = event.target.getAttribute('data-name');
                    const editclass = event.target.getAttribute('data-class');
                    const dob = event.target.getAttribute('data-dob');
                    const mobile = event.target.getAttribute('data-mobile');
                    const fathername = event.target.getAttribute('data-father');
                    const mothername = event.target.getAttribute('data-mother');
                
                    const total = event.target.getAttribute('data-total');
                    const submited = event.target.getAttribute('data-submit');
                    const panding = event.target.getAttribute('data-pandingfee');
            
                    EditTeacherName.value = name;
                    EditTeacherDOB.value = dob;
                    EditTeacherClass.value = editclass;
                    EditTeacherMobile.value = mobile;
                    EditTeacherFather.value = fathername;
                    EditTeacherMother.value = mothername
                    EditTotalSalery.value = total;
                    EditRecivedSalery.value = submited;
                    EditPandingSalery.value = panding;
            
                    const recordKey = `School/Teacher/${dataMobile}/Personal/${key}`;
                    const FeeDataPath = `School/Teacher/${dataMobile}/Record`;
            
                    console.log(recordKey)
            
                    // Save button click event listener
                    document.getElementById('SaveEditInfo').addEventListener('click', function () {
                        const newName = EditTeacherName.value;
                        const newDob = EditTeacherDOB.value;
                        const newClass = EditTeacherClass.value;
                        const newMobile = EditTeacherMobile.value;
                        const newFather = EditTeacherFather.value;
                        const newMother = EditTeacherMother.value;
                        const newTotal = EditTotalSalery.value;
                        const newSubmited = EditRecivedSalery.value;
                        const newPanding = EditPandingSalery.value;
                        updateTeacherData(recordKey, newName, newDob, newClass, newMobile, newFather, newMother, newTotal, newSubmited, newPanding);
                    });
            
                    document.getElementById("SaveSaleryRecordBtn").addEventListener('click', function(){
                        const NewAmount = NewSaleryRecord.value;
                        const NewAmountDate = NewSaleryRecordDate.value;
            
                        AddTeacherSaleryRecord(FeeDataPath, NewAmount, NewAmountDate)
                    })
                }
            
                if(event.target.classList.contains('ViewSaleryRecord')){
                    const FeeKey = event.target.getAttribute('data-feekey');
                    const FeePath = event.target.getAttribute('data-feepath');
            
                    const FeeDataPath = `School/Teacher/${FeePath}/Record`;
                    
                            onValue(ref(database, FeeDataPath), (userDataSnapshot) => {
                                userDataSnapshot.forEach((userDataSnapshot) => {
                                    let UserData = userDataSnapshot.val();
                                    if (UserData) {
                                        let { Date, Recived } = UserData;
                                        let DataKey = userDataSnapshot.key;
                                        SaleryRecordSection.innerHTML += `
                                        <tr>
                        <td scope="row">${Recived}</td>
                        <td scope="row">${Date}</td>
                        <td scope="row">Recived</td>
                        <td scope="row">
                            <button class="btn btn-danger btn-sm" id="DeleteSaleryRecordBtn" data-path="${FeeDataPath}" data-key="${DataKey}">Delete</button>
                        </td>
                    </tr>`;
                                        console.log(Recived, Date)
                                    }
                                });
                                const deleteButtons = document.querySelectorAll("#DeleteSaleryRecordBtn");
            console.log("Delete buttons found:", deleteButtons.length); // Check if delete buttons are found
            deleteButtons.forEach((btn) => {
                btn.addEventListener("click", (event) => {
                    console.log("Delete button clicked");
                    const documentIdToDelete = event.target.getAttribute("data-path");
                    const dataKey = event.target.getAttribute("data-key");
                    console.log("Document ID to delete:", documentIdToDelete);
                    console.log("Data Key:", dataKey);
                    if (documentIdToDelete) {
                        const documentRefToDelete = ref(database, `${documentIdToDelete}/${dataKey}`);
                        console.log("Document reference to delete:", documentRefToDelete);
                        DeleteSaleryRecord(documentRefToDelete);
                    }
                });
            });
                            });
                      
                    
            
              
                }
            });
            
            async function DeleteSaleryRecord(docRef) {
                alert("Record Delete in process");
                try {
                    await remove(docRef);
                    alert("Record Deleted");
                    location.reload();
                } catch (error) {
                    console.error(error);
                    setInterval(function() {
                        location.reload();
                    }, 500);
                }
            }
            

            SelectPreviousResultTestStudent.addEventListener('change', function() {
                let studentId = SelectPreviousResultTestStudent.value;
            
                let ViewPreviousClassResult = document.getElementById("ViewPreviousClassResultSection");
                ViewPreviousClassResult.innerHTML = ''; // Clear previous content before adding new exam results
            
                // Attach event listener to the database reference for the selected student
                onChildAdded(ref(database, `/School/Student/${studentId}/Result/ClassExam`), (childSnapshot) => {
                    const childData = childSnapshot.val();
                    const key = childSnapshot.key;
            
                    // If exam result data is present
                    const newResultHTML = `
                        <div class="row">
                            <div class="col-12">
                                <div class="card">
                                    <div class="card-header border-0 pb-0">
                                        <h5 class="card-title">${childData.Title}</h5>
                                    </div>
                                    <div class="card-body">
                                        <p class="card-text">
                                            <table class="table rounded" >
                                                <thead>
                                                    <tr>
                                                        <th scope="col">Subject</th>
                                                        <th scope="col">Total</th>
                                                        <th scope="col">Obtain</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    ${childData.Result}      
                                                </tbody>
                                            </table>
                                        </p>
                                    </div>
                                    <div class="card-footer border-0 pt-0">
                                        <p class="card-text d-inline">${childData.Date}</p>
                                        <a href="javascript:void(0);" class="card-link float-end DeleteSchoolExamResult" data-path="${key}">Delete</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
            
                    // Add new exam result HTML at the beginning of ViewPreviousClassResult
                    ViewPreviousClassResult.innerHTML = newResultHTML + ViewPreviousClassResult.innerHTML;
            
                    // Attach event listener to the delete buttons for each exam result entry
                    const DeleteClassTestResultBtn = document.querySelectorAll(".DeleteSchoolExamResult");
                    DeleteClassTestResultBtn.forEach((btn) => {
                        btn.addEventListener("click", (event) => {
                            const documentIdToDelete = event.target.getAttribute("data-path");
                            if (documentIdToDelete) {
                                const documentRefToDelete = ref(database, `/School/Student/${studentId}/Result/ClassExam/${documentIdToDelete}`);
                                DeleteClassExamResultFunction(documentRefToDelete);
                            }
                        });
                    });
                });
            });

            async function DeleteClassExamResultFunction(docRef) {
                    alert("Result Delete in process")
                    try {
                    await remove(docRef);
                    alert("Result Deleted");
                    location.reload();
                    } catch (error) {
                    console.error(error);
                    setInterval(function() {
                    location.reload();
                    }, 500);
                    }
                    }

let AttendanceClass = document.getElementById('AttendanceClass')

AttendanceClass.addEventListener("change", function(){
    onValue(ref(database, `/School/Class/${AttendanceClass.value}/StudentList`), (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            const childData = childSnapshot.val();
            // SelectPreviousAttendance.innerHTML += `<option value="${childData.DataRef}">${childData.Name}</option>`;
             AttendanceList.innerHTML += `
                <li>
                    <a href="javascript:void(0);" class="item-content item-link">
                        <div class="dz-icon">
                            <img src="../Images/stopwatch.png" alt="/" />
                        </div>
                        <div class="dz-inner">
                            <span class="dz-title">${childData.Name} 
                                <div style="position: absolute; right: 0; top: 7px;">
                                    <button class="btn btn-sm btn-primary present-btn" data-path="${childData.DataRef}">Present</button>
                                    <button class="btn btn-sm btn-danger absent-btn" data-path="${childData.DataRef}">Absent</button>
                                </div>
                            </span>
                        </div>
                    </a>
                </li>
            `;
            // console.log(childData);
        });
        
        const presentButtons = document.querySelectorAll(".present-btn");
        presentButtons.forEach((btn) => {
            btn.addEventListener("click", async (event) => {
                const presentPath = event.target.getAttribute("data-path");
                const listItem = event.target.closest('li'); // Get the closest li element
                if (presentPath && listItem) {
                    const presentPaths = ref(database, `School/Student/${presentPath}/Attendanace`);
                    try {
                        await presentFunction(presentPaths, listItem);
                        alert("Present Attendance Added");
                        
                        // location.reload();
                    } catch (error) {
                        alert("Failed to mark attendance: " + error.message);
                        console.log(error)
                    }
                }
            });
        });
        const absentButtons = document.querySelectorAll(".absent-btn");
    absentButtons.forEach((btn) => {
        btn.addEventListener("click", async (event) => {
            const absentPath = event.target.getAttribute("data-path");
            const listItem = event.target.closest('li'); // Get the closest li element
            if (absentPath && listItem) {
                const absentPaths = ref(database, `School/Student/${absentPath}/Attendanace`);
                try {
                    await absentFunction(absentPaths, listItem);
                    alert("Absent Attendance Added");
                    
                    // location.reload();
                } catch (error) {
                    alert("Failed to mark attendance: " + error.message);
                    console.log(error)
                }
            }
        });
    });
    });
    
})

let PreviousAttendanceClass = document.getElementById("PreviousAttendanceClass");

PreviousAttendanceClass.addEventListener("change", function(){
    onValue(ref(database, `/School/Class/${PreviousAttendanceClass.value}/StudentList`), (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            const childData = childSnapshot.val();
            SelectPreviousAttendance.innerHTML += `<option value="${childData.DataRef}">${childData.Name}</option>`;
     
            // console.log(childData);
        });
        

    });
    
})





async function presentFunction(docRef, listItem) {
    try {
        const presentPath = push(docRef); // Assuming docRef is already a reference
        const time = new Date();
        const Day = time.getDate();
        const Month = time.getMonth() + 1; // Months start from 0, so add 1 to get the correct month
        const Year = time.getFullYear();
        const CurrentTime = Day + "/" + Month + "/" + Year;
        
        await set(presentPath, {
            Date: CurrentTime,
            Status: "Present"
        });
        listItem.parentNode.removeChild(listItem);
    } catch (error) {
        throw new Error("Failed to mark attendance: " + error.message);
    }
}

async function absentFunction(docRef, listItem) {
    try {
        const absentPath = push(docRef); // Assuming docRef is already a reference
        const time = new Date();
        const Day = time.getDate();
        const Month = time.getMonth() + 1; // Months start from 0, so add 1 to get the correct month
        const Year = time.getFullYear();
        const CurrentTime = Day + "/" + Month + "/" + Year;
        
        await set(absentPath, {
            Date: CurrentTime,
            Status: "Absent"
        });
        listItem.parentNode.removeChild(listItem);
    } catch (error) {
        throw new Error("Failed to mark attendance: " + error.message);
    }
}


    let Atttendance = document.getElementById("SelectResultStudent");
    onValue(ref(database, `/School/Class/${localStorage.getItem("Class")}/StudentList`), (snapshot) => {
        snapshot.forEach((childSnapshot) => {
          const childData = childSnapshot.val();
          Atttendance.innerHTML += `<option value="${childData.DataRef}">${childData.Name}</option>`
        console.log(childData)
    
        });
        });

// auth.onAuthStateChanged((user) => {
// if (user) {

// mainPage.style.display = "block";
// username.innerHTML = localStorage.getItem("Name")
// loginPage.style.display = "none";
// }
// else {

// mainPage.style.display = "block";

// loginPage.style.display = "none";
// }
// });


// Add Homework Section

let PreviousHomeworkPage = document.getElementById("PreviousHomeworkSection")
let PreviousHomeworkClass = document.getElementById("PreviousHomeworkClass");
PreviousHomeworkClass.addEventListener('change', function() {
    console.log(PreviousHomeworkClass.value);

    // Clear the previous content before adding new homework
    PreviousHomeworkPage.innerHTML = '';

    // Attach event listener to the database reference for the selected class
    onChildAdded(ref(database, `/School/Class/${PreviousHomeworkClass.value}/Homework`), (childSnapshot) => {
        const childData = childSnapshot.val();
        const key = childSnapshot.key;

        // If homework data is present
        const newHomeworkHTML = `
            <div class="row">
                <div class="col-12">
                    <div class="card">
                        <div class="card-header border-0 pb-0">
                            <h5 class="card-title">Daily Homework</h5>
                        </div>
                        <div class="card-body">
                            <p class="card-text">
                                <table class="table rounded" >
                                    <thead>
                                        <tr>
                                            <th scope="col">Subject</th>
                                            <th scope="col">Work</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${childData.Homework}      
                                    </tbody>
                                </table>
                            </p>
                        </div>
                        <div class="card-footer border-0 pt-0">
                            <p class="card-text d-inline">${childData.Date}</p>
                            <a href="javascript:void(0);" class="card-link float-end deleteHomework" data-path="${key}">Delete</a>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add new homework HTML at the beginning of PreviousHomeworkPage
        PreviousHomeworkPage.innerHTML = newHomeworkHTML + PreviousHomeworkPage.innerHTML;

        // Attach event listener to the delete buttons for each homework entry
        const DeleteHomeworkBtn = document.querySelectorAll(".deleteHomework");
        DeleteHomeworkBtn.forEach((btn) => {
            btn.addEventListener("click", (event) => {
                const documentIdToDelete = event.target.getAttribute("data-path");
                if (documentIdToDelete) {
                    const documentRefToDelete = ref(database, `/School/Class/${PreviousHomeworkClass.value}/Homework/${documentIdToDelete}`);
                    DeleteHomeworkFunction(documentRefToDelete);
                }
            });
        });
    });
});


    async function DeleteHomeworkFunction(docRef) {
        alert("Homework Delete in process")
        try {
        await remove(docRef);
        alert("Homework Deleted");
        location.reload();
        } catch (error) {
        console.error(error);
        setInterval(function() {
        location.reload();
        }, 500);
        }
        }


let SelectClassListStudent = document.getElementById("SelectClassListStudent");
let StudentListSection = document.getElementById("StudentListSection")
SelectClassListStudent.addEventListener('change', function(){
    onValue(ref(database, `School/Class/${SelectClassListStudent.value}/StudentList`), (snapshot) => {
        StudentListSection.innerHTML = ''; // Clear previous content before updating
    
        snapshot.forEach((childSnapshot) => {
            let childData = childSnapshot.val();
    
            onValue(ref(database, `School/Student/${childData.DataRef}/Personal`), (userDataSnapshot) => {
                userDataSnapshot.forEach((userDataSnapshot) => {
                    let UserData = userDataSnapshot.val();
                    if (UserData) {
                        let { Name, Class, DOB, FatherName, MotherName, Mobile,TotalFee, Submited, Panding, LoginID, ClassKey } = UserData;
                        let DataKey = userDataSnapshot.key;
                        console.log(Name)
                        StudentListSection.innerHTML += `
                        <li>
                        <div class="item-content">
                        <a href="#" class="item-media"><img src="../assets/images/images.png" alt="logo" width="55" /></a>
                        
                        <div class="item-inner">
                        <div class="item-title-row">
                        <h6 class="item-title"><a href="#">Name:- ${Name}</a></h6>
                        <h5 class="item-title"><a href="#">Father:- ${FatherName}</a></h5>
                        <h5 class="item-title"><a class="text-success" href="#">Mobile:- ${Mobile}</a></h5>
                        </div>
                        </div>
                        </div>
                        <div style="display: flex; justify-content: space-around; position: relative; bottom: 10px;">
                        <button class="btn btn-warning btn-sm editBtn" data-key="${DataKey}" data-login="${LoginID}" data-name="${Name}" data-class="${Class}"  data-dob="${DOB}" data-father="${FatherName}" data-mother="${MotherName}" data-mobile="${Mobile}" data-total="${TotalFee}" data-submit="${Submited}" data-pandingfee="${Panding}" data-bs-toggle="modal" data-bs-target="#exampleModalLong">Edit</button>
                        <button class="btn btn-secondary btn-sm addFeeRecordBtn" data-feekey="${DataKey}" data-feepath="${LoginID}" data-bs-toggle="modal" data-bs-target="#example1ModalLong">View Record</button>
                        <button class="btn btn-danger btn-sm deleteStudentBtn" data-classkey="${ClassKey}" data-class="${Class}" data data-student="${LoginID}" data-bs-toggle="modal" data-bs-target="#basicModal">Delete</button>
                        </div>
                        
                        <div class="sortable-handler"></div>
                        </li>
                    `;
                    }
                });
                const deleteButtons = document.querySelectorAll(".deleteStudentBtn");
                console.log("Delete buttons found:", deleteButtons.length); // Check if delete buttons are found
                deleteButtons.forEach((btn) => {
                    btn.addEventListener("click", (event) => {
                        console.log("Delete button clicked");
                        const documentIdToDelete = event.target.getAttribute("data-student");
                        const dataKey = event.target.getAttribute("data-key");
                        const CurrentClass = event.target.getAttribute("data-class");
                        const ClassKey = event.target.getAttribute("data-classkey");
                        console.log( `/School/Class/${CurrentClass}/StudentList/${ClassKey}`)
                        
                        if (documentIdToDelete) {
                            const documentRefToDelete = ref(database, `School/Student/${documentIdToDelete}`);
                            const DeleteFromClass = ref(database, `/School/Class/${CurrentClass}/StudentList/${ClassKey}`);
    
                            console.log("Document reference to delete:", documentRefToDelete);
                            document.querySelector("#DeleteStudentRecordBtn").addEventListener('click', function(){
    
                                DeleteStudentRecord(documentRefToDelete);
                                DeleteFromClassFunction(DeleteFromClass)
                            })
                        }
                    });
                });
                      
            });
        });
    });
})

async function DeleteStudentRecord(docRef) {
    alert("Record Delete in process");
    try {
        await remove(docRef);
        await remove(DeleteFromClass)
        alert("Record Deleted");
        location.reload();
    } catch (error) {
        console.error(error);
      
    }
}

async function DeleteFromClassFunction(docRef) {
    alert("Record Delete in process");
    try {
        await remove(docRef);
        alert("Record Deleted");
        location.reload();
    } catch (error) {
        console.error(error);
        setInterval(function() {
            location.reload();
        }, 500);
    }
}

async function deletePreviousRecord(docRef) {
    alert("Record Delete in process");
    try {
        await remove(docRef);
        alert("Record Deleted");
        location.reload();
    } catch (error) {
        console.error(error);
        setInterval(function() {
            location.reload();
        }, 500);
    }
}


function addNewRecord(FeeDataPath, NewAmount, NewAmountDate){
    let time = new Date();
    let Day = time.getDate();
    let Month = time.getMonth() + 1; // Months start from 0, so add 1 to get the correct month
    let Year = time.getFullYear();
    let CurrentTime = Day + "/" + Month + "/" + Year;

    const NewFreeRecordRef = push(ref(database, FeeDataPath));

    set(NewFreeRecordRef, {
        Submited: NewAmount,
        Date: NewAmountDate
    });

    alert("Record Added")
   
}

// Function to update user data in the database
function updateUserData(recordKey,newName, newDob, newClass, newMobile, newFather, newMother, newTotal, newSubmited, newPanding) {
    const DipsoteRef = ref(database, recordKey);
    
    update(DipsoteRef, { 
        Name: newName,
        DOB: newDob,
        Class: newClass,
        Mobile: newMobile,
        FatherName: newFather,
        MotherName: newMother,
        TotalFee: newTotal,
        Submited: newSubmited,
        Panding: newPanding
     })
        .then(() => {
            alert("Updated successfully.");

            
        })
        .catch((error) => {
            console.error("Error updating data:", error);
        });
}

let FeeRecord = document.getElementById("FeeRecord")
StudentListSection.addEventListener('click', function (event) {
    if (event.target.classList.contains('editBtn')) {
        const key = event.target.getAttribute('data-key');
        const dataMobile = event.target.getAttribute('data-login');
        const name = event.target.getAttribute('data-name');
        const editclass = event.target.getAttribute('data-class');
        const dob = event.target.getAttribute('data-dob');
        const mobile = event.target.getAttribute('data-mobile');
        const fathername = event.target.getAttribute('data-father');
        const mothername = event.target.getAttribute('data-mother');
    
        const total = event.target.getAttribute('data-total');
        const submited = event.target.getAttribute('data-submit');
        const panding = event.target.getAttribute('data-pandingfee');

        EditStudentName.value = name;
        EditDOB.value = dob;
        EditClass.value = editclass;
        EditMobile.value = mobile;
        EditFather.value = fathername;
        EditMother.value = mothername
        ModiftyTotal.value = total;
        ModifySubmited.value = submited;
        ModifyPanding.value = panding;

        const recordKey = `School/Student/${dataMobile}/Personal/${key}`;
        const FeeDataPath = `School/Student/${dataMobile}/Record`;

        console.log(recordKey)

        // Save button click event listener
        document.getElementById('SaveChangesBtn').addEventListener('click', function () {
            const newName = EditStudentName.value;
            const newDob = EditDOB.value;
            const newClass = EditClass.value;
            const newMobile = EditMobile.value;
            const newFather = EditFather.value;
            const newMother = EditMother.value;
            const newTotal = ModiftyTotal.value;
            const newSubmited = ModifySubmited.value;
            const newPanding = ModifyPanding.value;
            updateUserData(recordKey, newName, newDob, newClass, newMobile, newFather, newMother, newTotal, newSubmited, newPanding);
        });

        document.getElementById("SaveFeeRecordBtn").addEventListener('click', function(){
            const NewAmount = NewFeeAmount.value;
            const NewAmountDate = NewFeeDate.value;

            addNewRecord(FeeDataPath, NewAmount, NewAmountDate)
        })
    }

    if(event.target.classList.contains('addFeeRecordBtn')){
        const FeeKey = event.target.getAttribute('data-feekey');
        const FeePath = event.target.getAttribute('data-feepath');

        const FeeDataPath = `School/Student/${FeePath}/Record`;
        
                onValue(ref(database, FeeDataPath), (userDataSnapshot) => {
                    userDataSnapshot.forEach((userDataSnapshot) => {
                        let UserData = userDataSnapshot.val();
                        if (UserData) {
                            let { Date, Submited } = UserData;
                            let DataKey = userDataSnapshot.key;
                            FeeRecord.innerHTML += `
                            <tr>
            <td scope="row">${Submited}</td>
            <td scope="row">${Date}</td>
            <td scope="row">Submited</td>
            <td scope="row">
                <button class="btn btn-danger btn-sm" id="deleteRecordBtn" data-path="${FeeDataPath}" data-key="${DataKey}">Delete</button>
            </td>
        </tr>`;
                            console.log(Submited, Date)
                        }
                    });
                    const deleteButtons = document.querySelectorAll("#deleteRecordBtn");
console.log("Delete buttons found:", deleteButtons.length); // Check if delete buttons are found
deleteButtons.forEach((btn) => {
    btn.addEventListener("click", (event) => {
        console.log("Delete button clicked");
        const documentIdToDelete = event.target.getAttribute("data-path");
        const dataKey = event.target.getAttribute("data-key");
        console.log("Document ID to delete:", documentIdToDelete);
        console.log("Data Key:", dataKey);
        if (documentIdToDelete) {
            const documentRefToDelete = ref(database, `${documentIdToDelete}/${dataKey}`);
            console.log("Document reference to delete:", documentRefToDelete);
            deletePreviousRecord(documentRefToDelete);
        }
    });
});
                });
          
        

  
    }
});

let PreviousExamNewClass;  
let PreviousExamClass = document.getElementById("PreviousSelectExamClass");
PreviousExamClass.addEventListener('change', function() {
    let PreviousExamNewClass = PreviousExamClass.value;

    let PreviousExamPage = document.getElementById("PreviousExamSection");
    PreviousExamPage.innerHTML = ''; // Clear previous content before adding new exam entries

    // Attach event listener to the database reference for the selected class
    onChildAdded(ref(database, `/School/Class/${PreviousExamNewClass}/Exam`), (childSnapshot) => {
        const childData = childSnapshot.val();
        const key = childSnapshot.key;

        // If exam data is present
        const newExamHTML = `
            <div class="row">
                <div class="col-12">
                    <div class="card">
                        <div class="card-header border-0 pb-0">
                            <h5 class="card-title">${childData.Title}</h5>
                        </div>
                        <div class="card-body">
                            <p class="card-text">
                                <table class="table rounded" >
                                    <thead>
                                        <tr>
                                            <th scope="col">Subject</th>
                                            <th scope="col">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${childData.Exam}      
                                    </tbody>
                                </table>
                            </p>
                        </div>
                        <div class="card-footer border-0 pt-0">
                            <p class="card-text d-inline">${childData.Date}</p>
                            <a href="javascript:void(0);" class="card-link float-end DeleteExam" data-path="${key}">Delete</a>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add new exam HTML at the beginning of PreviousExamPage
        PreviousExamPage.innerHTML = newExamHTML + PreviousExamPage.innerHTML;

        // Attach event listener to the delete buttons for each exam entry
        const DeleteExam = document.querySelectorAll(".DeleteExam");
        DeleteExam.forEach((btn) => {
            btn.addEventListener("click", (event) => {
                const documentIdToDelete = event.target.getAttribute("data-path");
                if (documentIdToDelete) {
                    const documentRefToDelete = ref(database, `/School/Class/${PreviousExamNewClass}/Exam/${documentIdToDelete}`);
                    DeleteExamFunction(documentRefToDelete);
                }
            });
        });
    });
});
    async function DeleteExamFunction(docRef) {
        alert("Exam Delete in process")
        try {
        await remove(docRef);
        alert("Exam Deleted");
        location.reload();
        } catch (error) {
        console.error(error);
        setInterval(function() {
        location.reload();
        }, 500);
        }
        }
let PreviousRoutineClass = document.getElementById("PreviousRoutineClass");
let PreviousRoutineSection = document.getElementById("PreviousRoutineSection")
PreviousRoutineClass.addEventListener('change', function(){
    onValue(ref(database, `/School/Class/${PreviousRoutineClass.value}/Routine`), (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            const childData = childSnapshot.val();
    const key = childSnapshot.key;
    
    
        // If homework data is present
        PreviousRoutineSection.innerHTML += `
            <div class="row">
                <div class="col-12">
                    <div class="card">
                        <div class="card-header border-0 pb-0">
                            <h5 class="card-title">${childData.Title}</h5>
                        </div>
                        <div class="card-body">
                            <p class="card-text">
                                <table class="table rounded" >
                                    <thead>
                                        <tr>
                                            <th scope="col">Subject</th>
                                            <th scope="col">Start</th>
                                            <th scope="col">End</th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${childData.Exam}      
                                    </tbody>
                                </table>
                            </p>
                        </div>
                        <div class="card-footer border-0 pt-0">
                            <p class="card-text d-inline">${childData.Date}</p>
                            <a href="javascript:void(0);"  class="card-link float-end DeleteRoutineBtn" data-path="${key}">Delete</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    
    
            // console.log(childData);
            const DeleteRoutineBtn = document.querySelectorAll(".DeleteRoutineBtn");
            DeleteRoutineBtn.forEach((btn) => {
            btn.addEventListener("click", (event) => {
            const documentIdToDelete = event.target.getAttribute("data-path");
            if (documentIdToDelete) {
            const documentRefToDelete = ref(database, `/School/Class/${PreviousRoutineClass.value}/Routine/${documentIdToDelete}`);
            
            DeleteRoutineFunction(documentRefToDelete);
            }
            });
            });
        });
    })  
})


async function DeleteRoutineFunction(docRef) {
    alert("Routine Delete in process")
    try {
    await remove(docRef);
    alert("Routine Deleted");
    location.reload();
    } catch (error) {
    console.error(error);
    setInterval(function() {
    location.reload();
    }, 500);
    }
    }

        // let PreviousResultPage = document.getElementById("PreviousResultPage")
        // onValue(ref(database, `/School/Student/PANKAJ20040805/Result`), (snapshot) => {
        //     snapshot.forEach((childSnapshot) => {
        //         const childData = childSnapshot.val();
        // const key = childSnapshot.key;
        
        
        //     // If homework data is present
        //     PreviousHomeworkPage.innerHTML += `
        //         <div class="row">
        //             <div class="col-12">
        //                 <div class="card">
        //                     <div class="card-header border-0 pb-0">
        //                         <h5 class="card-title">Daily Homework</h5>
        //                     </div>
        //                     <div class="card-body">
        //                         <p class="card-text">
        //                             <table class="table rounded" >
        //                                 <thead>
        //                                     <tr>
        //                                         <th scope="col">Subject</th>
        //                                         <th scope="col">Work</th>
        //                                     </tr>
        //                                 </thead>
        //                                 <tbody>
        //                                     ${childData.Homework}      
        //                                 </tbody>
        //                             </table>
        //                         </p>
        //                     </div>
        //                     <div class="card-footer border-0 pt-0">
        //                         <p class="card-text d-inline">${childData.Date}</p>
        //                         <a href="javascript:void(0);"  class="card-link float-end deleteHomework" data-path="${key}">Delete</a>
        //                     </div>
        //                 </div>
        //             </div>
        //         </div>
        //     `;
        
        
        //         // console.log(childData);
        //         const DeleteHomeworkBtn = document.querySelectorAll(".deleteHomework");
        //         DeleteHomeworkBtn.forEach((btn) => {
        //         btn.addEventListener("click", (event) => {
        //         const documentIdToDelete = event.target.getAttribute("data-path");
        //         if (documentIdToDelete) {
        //         const documentRefToDelete = ref(database, `/School/Class/${localStorage.getItem("Class")}/Homework/${documentIdToDelete}`);
                
        //         DeleteHomeworkFunction(documentRefToDelete);
        //         }
        //         });
        //         });
        //     });
            
        
        //     });
        
        //     async function DeleteHomeworkFunction(docRef) {
        //         alert("Homework Delete in process")
        //         try {
        //         await remove(docRef);
        //         alert("Homework Deleted");
        //         location.reload();
        //         } catch (error) {
        //         console.error(error);
        //         setInterval(function() {
        //         location.reload();
        //         }, 500);
        //         }
        //         }


        let NotificationSection = document.getElementById("NotificationSection")
        onValue(ref(database, "School/Message"), (snapshot) => {
            snapshot.forEach((childSnapshot) => {
                const childData = childSnapshot.val();
                const Title = childData.Title;
                const Disc = childData.Disc;
        const key = childSnapshot.key;
        
        
            // If homework data is present
            NotificationSection.innerHTML += `
            <a href="#">
                <div class="notification active">
                <h6>${Title}</h6>
                <p>${Disc}</p>
                <div class="notification-footer">
                <span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 11C8.76142 11 11 8.76142 11 6C11 3.23858 8.76142 1 6 1C3.23858 1 1 3.23858 1 6C1 8.76142 3.23858 11 6 11Z" stroke="#787878" stroke-linecap="round" stroke-linejoin="round"></path>
                <path d="M6 3V6L8 7" stroke="#787878" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
                ${childData.Date}
                </span>
                <button class="mb-0 deleteMessageBtn btn btn-warning btn-sm"  data-key="${key}" >
                  <img style="width: 20px;" src="../Images/delete.png" alt="">
                </button>
                </div>
                </div>
                </a>
            `;
        
        
                // console.log(childData);
              
            });
            
        
            });
            const deleteMessageBtn = document.querySelectorAll(".deleteMessageBtn");
            NotificationSection.addEventListener("click", (event) => {
                if (event.target.classList.contains("deleteMessageBtn")) {
                    const documentIdToDelete = event.target.getAttribute("data-key");
                    if (documentIdToDelete) {
                        const documentRefToDelete = ref(database, `/School/Message/${documentIdToDelete}`);
                        DeleteMessageFunction(documentRefToDelete);
                    }
                }
            });
            async function DeleteMessageFunction(docRef) {
                alert("Message Delete in process")
                try {
                await remove(docRef);
                alert("Message Deleted");
                location.reload();
                } catch (error) {
                console.error(error);
                setInterval(function() {
                location.reload();
                }, 500);
                }
                }

            
let NewHomeworkClass
let HomworkClass = document.getElementById("HomworkClass")

HomworkClass.addEventListener('change', function(){
    NewHomeworkClass = HomworkClass.value
    console.log(NewHomeworkClass)
})

function AddHomework() {

    let HomeworkTable = document.getElementById("HomeworkTable")
    // Get values from input fields
    let HomeworkSubject = document.getElementById("HomeworSubject").value;
    let HomeworkDetails = document.getElementById("HomeworkDetails").value;

 
    // Append the new row to the table
    HomeworkTable.innerHTML += `<tr>
    <th scope="row">${HomeworkSubject}</th>

    <td class="amountcal">${HomeworkDetails}</td>
</tr>`;
}

AddHomeworkBtn.addEventListener('click', function(){
    AddHomework();
})

function SubmitHomework() {
    alert("Please wait...");
    // e.preventDefault();

    let time = new Date();
    let Day = time.getDate();
    let Month = time.getMonth() + 1; // Months start from 0, so add 1 to get the correct month
    let Year = time.getFullYear();
    let CurrentTime = Day + "/" + Month + "/" + Year;

    const HomeworkRef = push(ref(database, `School/Class/${NewHomeworkClass}/Homework`));

    set(HomeworkRef, {
        Homework: document.getElementById("HomeworkTable").innerHTML,
        Date: CurrentTime
    });

    alert("Homework Added")
    location.reload();
}
let SubmitHomeworkBtn = document.querySelector("#SubmitHomeworkBtn")
SubmitHomeworkBtn.addEventListener("click", function(){
    SubmitHomework();
});


// Add Exam Section
let SelectNewExamClass
let SelectExamClass = document.getElementById("SelectExamClass")

SelectExamClass.addEventListener("change", function(){
    SelectNewExamClass = SelectExamClass.value;
})

function AddExam() {

    let ExamTable = document.getElementById("ExamTable")
    // Get values from input fields
    let ExamTitle = document.getElementById("ExamTitle").value;
    let ExamSubject = document.getElementById("ExamSubject").value;
    let ExamDate = document.getElementById("ExamDate").value;

 
    // Append the new row to the table
    ExamTable.innerHTML += `<tr>
    <th scope="row">${ExamSubject}</th>

    <td class="amountcal">${ExamDate}</td>
</tr>`;
}

let AddExamBtn = document.querySelector("#AddExamBtn")
AddExamBtn.addEventListener('click', function(){
    AddExam();
})

function SubmitExam() {
    alert("Please wait...");
    
    let time = new Date();
    let Day = time.getDate();
    let Month = time.getMonth() + 1; // Months start from 0, so add 1 to get the correct month
    let Year = time.getFullYear();
    let CurrentTime = Day + "/" + Month + "/" + Year;

    const ExamRef = push(ref(database, `School/Class/${SelectNewExamClass}/Exam`));

    set(ExamRef, {
        Exam: document.getElementById("ExamTable").innerHTML,
        Date: CurrentTime,
        Title: document.getElementById("ExamTitle").value
    });

    alert("Exam Added")
    location.reload();
}

function AddMessage() {
    let MessageTitle = document.getElementById("MessageTitle").value;
    let MessageDisc = document.getElementById("MessageDisc").value;
    alert("Please wait...");
    
    let time = new Date();
    let Day = time.getDate();
    let Month = time.getMonth() + 1; // Months start from 0, so add 1 to get the correct month
    let Year = time.getFullYear();
    let CurrentTime = Day + "/" + Month + "/" + Year;

    const ExamRef = push(ref(database, "School/Message"));

    set(ExamRef, {
        Title: MessageTitle,
        Date: CurrentTime,
        Disc: MessageDisc
    });

    alert("Message Added")
    location.reload();
}


function AddRoutine() {

    let RoutineTable = document.getElementById("RoutineTable")
    // Get values from input fields
    let RoutineSubject = document.getElementById("RoutineSubject").value;
    let RoutineStartTime = document.getElementById("RoutineStartTime").value;
    let RoutineEndTime = document.getElementById("RoutineEndTime").value;

 
    // Append the new row to the table
    RoutineTable.innerHTML += `<tr>
    <th scope="row">${RoutineSubject}</th>
    <td class="amountcal">${RoutineStartTime}</td>
    <td class="amountcal">${RoutineEndTime}</td>
</tr>`;
}

let AddRoutineBtn = document.querySelector("#AddRoutineBtn")
AddRoutineBtn.addEventListener('click', function(){
    AddRoutine();
})

let RoutineClass = document.getElementById('RoutineClass');
let NewRoutineClass
RoutineClass.addEventListener('change', function(){
    NewRoutineClass = RoutineClass.value;
})

function SubmitRoutine() {
    alert("Please wait...");
    
    let time = new Date();
    let Day = time.getDate();
    let Month = time.getMonth() + 1; // Months start from 0, so add 1 to get the correct month
    let Year = time.getFullYear();
    let CurrentTime = Day + "/" + Month + "/" + Year;

    const RoutineRef = push(ref(database, `School/Class/${NewRoutineClass}/Routine`));

    set(RoutineRef, {
        Exam: document.getElementById("RoutineTable").innerHTML,
        Date: CurrentTime,
        Title: "Class Routine"
    });

    alert("Routine Added")
    location.reload();
}

SubmitRoutineBtn.addEventListener("click", function(){
    SubmitRoutine();
})


document.getElementById("AddMessageBtn").addEventListener("click", function(){
    AddMessage();
})

let SubmitExamBtn = document.querySelector("#SubmitExamBtn")
SubmitExamBtn.addEventListener("click", function(){
    SubmitExam();
});


SelectResultStudent.addEventListener('change', function(){
    console.log(SelectResultStudent.value)
})
let SelectResultExam = document.querySelector("#SelectResultExam")
SelectResultExam.addEventListener('change', function(){
    console.log(SelectResultExam.value)
})

let ResultClass = document.getElementById("ResultClass")

ResultClass.addEventListener('change', function(){
    onValue(ref(database, `/School/Class/${ResultClass.value}/StudentList`), (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            const childData = childSnapshot.val();
            SelectResultStudent.innerHTML += `<option value="${childData.DataRef}">${childData.Name}</option>`;
                    // console.log(childData);
        });
        
    

    });
    
})

let SchoolResultClass = document.getElementById("SchoolResultClass")

SchoolResultClass.addEventListener('change', function(){
    onValue(ref(database, `/School/Class/${SchoolResultClass.value}/StudentList`), (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            const childData = childSnapshot.val();
            SelectPreviousResultExamStudent.innerHTML += `<option value="${childData.DataRef}">${childData.Name}</option>`;
                    // console.log(childData);
        });
        
    

    });
    
})

let ClassResultClass = document.getElementById("ClassResultClass")

ClassResultClass.addEventListener('change', function(){
    onValue(ref(database, `/School/Class/${ClassResultClass.value}/StudentList`), (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            const childData = childSnapshot.val();
            SelectPreviousResultTestStudent.innerHTML += `<option value="${childData.DataRef}">${childData.Name}</option>`;
                    // console.log(childData);
        });
        
    

    });
    
})

function AddResult() {

    let ResultTable = document.getElementById("ResultTable")
    // Get values from input fields
    let ResultSubject = document.getElementById("ResultSubject").value;
    let TotalMarks = document.getElementById("ExamTotalMarks").value;
    let ObtainMarks = document.getElementById("ExamObtainMarks").value;

 
    // Append the new row to the table
    ResultTable.innerHTML += `<tr>
    <th scope="row">${ResultSubject}</th>
    <td class="amountcal">${TotalMarks}</td>
    <td class="amountcal">${ObtainMarks}</td>
</tr>`;
}

AddResultBtn.addEventListener('click', function(){
    AddResult();
})

function SubmitResult(e) {
    alert("Please wait...");
    // e.preventDefault();
   
    let time = new Date();
    let Day = time.getDate();
    let Month = time.getMonth() + 1; // Months start from 0, so add 1 to get the correct month
    let Year = time.getFullYear();
    let CurrentTime = Day + "/" + Month + "/" + Year;

    const ResultRef = push(ref(database, `School/Student/${SelectResultStudent.value}/Result/${SelectResultExam.value}/`));

    set(ResultRef, {
        Result: document.getElementById("ResultTable").innerHTML,
        Date: CurrentTime,
        Title: document.getElementById("ResultTitle").value
    });

    alert("Result Added")
    location.reload();
}
let SubmitResultBtn = document.querySelector("#SubmitResultBtn")
SubmitResultBtn.addEventListener("click", function(){
    SubmitResult();
});





const LiveClassSection = document.getElementById("BatchSection");

onChildAdded(ref(database, "Centre/Class/Live"), (childSnapshot) => {
    const childData = childSnapshot.val();
    const Logo = childData.Logo;
    const Name = childData.Name;
    const Time = childData.Time;
    const URL = childData.URL;
    const key = childSnapshot.key;

    SelectingBatch.innerHTML += ` <option value="${Logo}">${Name}</option>`;

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
                        <button class="btn btn-danger btn-sm deleteClassBtn" data-path="${key}" style="position:relative;right: 55%;bottom: -10px;">Delete Class</button>
                        <button class="btn btn-success btn-sm updateClassBtn" data-path="${key}" data-old="${URL}" data-logo="${Logo}" data-name="${Name}" data-time="${time}" style="position:relative;right: 25%;bottom: -10px;">Update Link</button>
                       
                        <button class="btn btn-primary btn-sm ViewClass" style="position: relative; bottom: -10px; left: 6%;" data-link="${URL}" data-bs-toggle="modal" data-bs-target="#basic111Modal">View Class</button>
                    </div>
                </div>
            </div>
            <div class="sortable-handler"></div>
        </li>
    `;

    // Insert new HTML content at the top of LiveClassSection
    LiveClassSection.insertAdjacentHTML('afterbegin', Classes);
});
