const OwnerList = document.getElementById("OwnerList");
let OwnerNum = 1;
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import { getDatabase, ref,set, push, onValue, remove } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";

const firebaseConfig = {
apiKey: "AIzaSyAbG3_c1cSimLBJDXIpUbeEO5dlkE4gYtA",
   authDomain: "hisab-kitab-59285.firebaseapp.com",
   projectId: "hisab-kitab-59285",
   storageBucket: "hisab-kitab-59285.appspot.com",
   messagingSenderId: "468481811490",
   appId: "1:468481811490:web:a9f7298401d0d65f9c567b",
   measurementId: "G-6KLG5W02T7"
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const database = getDatabase();

const registerForm = document.getElementById('register-form');

registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const firstName = document.getElementById('firstname');
  const lastName = document.getElementById('lastname');
  const email = document.getElementById('email');
  const password = document.getElementById('password');

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.value + "@gmail.com", password.value);

    setTimeout(() => {
      const FirstNameVal = firstName.value;
      const LastNameVal = lastName.value;
      const EmailVal = email.value;
      const PasswordVal = password.value;

      if (EmailVal && PasswordVal) {
        const usersRef = push(ref(database, "Owner/"));
        set(usersRef, {
          FirstName: FirstNameVal,
          LastName: LastNameVal,
          Mobile: EmailVal,
          Password: PasswordVal
        })
          .then(() => {
            alert("New Owner Registered Successfully");
          })
          .catch((error) => {
            console.error("Account Not Created 😥", error);
          });
      } else {
        alert("Please Enter All Details");
      }
    }, 500);

  } catch (error) {
    alert(error.message);
  }
});

onValue(ref(database, "Owner/"), (snapshot) => {
  OwnerList.innerHTML = ''; // Clear previous content

  snapshot.forEach((childSnapshot) => {
    const childData = childSnapshot.val();
    const Name = childData.FirstName;
    const Last = childData.LastName; // It seems like you're missing 'LastPrice' in your data structure
    const Mobile = childData.Mobile;
    const Password = childData.Password;
        const documentId = childSnapshot.key;
    OwnerList.innerHTML += `
      <div class="accordion-item">
        <div class="accordion-header collapsed" id="accord-2${OwnerNum}One" data-bs-toggle="collapse" data-bs-target="#collapse2${OwnerNum}One" aria-controls="collapse2${OwnerNum}One" aria-expanded="false" role="button">
          <span class="accordion-header-text">${Name} - ${Last}</span>
          <span style="position: absolute; right: 15px;">
            <i class="fa-solid fa-trash" data-document-id="${documentId}" id="delBtn"></i>
          </span>
        </div>

        <div id="collapse2${OwnerNum}One" class="accordion__body collapse" aria-labelledby="accord-2${OwnerNum}One" data-bs-parent="#accordion-two">
          <div class="accordion-body-text">
            <table>
              <tr>
                <td>Name:-</td>
                <td>&nbsp;${Name} - ${Last}</td>
              </tr>
              <tr>
                <td>Mobile:-</td>
                <td>${Mobile}</td>
              </tr>
              <tr>
                <td>Password:-</td>
                <td>${Password}</td>
              </tr>
            </table>
          </div>
        </div>
      </div>`;
      
      OwnerNum++;
  });
  const deleteButtons = document.querySelectorAll("#delBtn");
  deleteButtons.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      const documentIdToDelete = event.target.getAttribute("data-document-id");
      if (documentIdToDelete) {
        const documentRefToDelete = ref(database, `Owner/${documentIdToDelete}`);
        deleteDoc(documentRefToDelete);
      }
    });
  });
      });
  	
  	  async function deleteDoc(docRef) {
    try {
      await remove(docRef);
      alert("Document successfully deleted!");
      location.reload();
    } catch (error) {
      console.error("Document deletion unsuccessful. Please try again!");
      setInterval(function() {
  location.reload();
      }, 500);
    }
  }
