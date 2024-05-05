import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";

import { getStorage, ref, uploadBytes, getDownloadURL, listAll, deleteObject } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-storage.js";
const firebaseConfig = {
    apiKey: "AIzaSyAII1zQekiC8bYN4GlBd4PC9Ct7JQtj5Gw",
    authDomain: "vjsss-jalalana.firebaseapp.com",
    projectId: "vjsss-jalalana",
    storageBucket: "vjsss-jalalana.appspot.com",
    messagingSenderId: "394037265122",
    appId: "1:394037265122:web:d4d1de19273badbf6b94bb",
    measurementId: "G-6LTX167GNV"
  };

const app = initializeApp(firebaseConfig);
// Get a reference to the Firebase Storage service
// const app = initializeApp(firebaseConfig);

// Initialize Firebase
// const app = initializeApp(firebaseConfig);

// Get a reference to the Firebase Storage service
const ImageStorage = getStorage(app);

// Add event listener to the upload button
let UploadImageBtn = document.querySelector("#UploadImageBtn");
UploadImageBtn.addEventListener("click", function(){
    const file = document.getElementById('UploadImageInput').files[0];
    const storageRef = ref(ImageStorage, `images/${file.name}`);
    
    // Upload the file to Firebase Storage
    uploadBytes(storageRef, file).then((snapshot) => {
        alert("Image Uploded")
        location.reload();        
    }).catch(error => {
        console.error('Error uploading image: ', error);
    });
});

window.onload = function() {
    // Get a reference to the 'images' directory
    const imagesRef = ref(ImageStorage, 'images');

    // List all images in the 'images' directory
    listAll(imagesRef).then((result) => {
        // Iterate over each item (image) in the 'images' directory
        result.items.forEach((imageRef) => {
            // Get the download URL of the image
            getDownloadURL(imageRef).then((downloadURL) => {
                // Create an img element and set its src attribute to the download URL
                const img = document.createElement('img');
                img.src = downloadURL;
                img.alt = 'image';

                // Create a delete button
                const deleteBtn = document.createElement('button');
                deleteBtn.type = 'button';
                deleteBtn.innerHTML = '<img src="../Images/delete.png" alt="Delete Button" srcset="" style="width: 20px;">';

                // Add click event listener to delete button
                deleteBtn.addEventListener('click', function() {
                    // Delete the image from Firebase Storage
                    deleteObject(imageRef).then(() => {
                        // Remove the image and the delete button from the DOM
                        img.remove();
                        deleteBtn.remove();
                        console.log('Image deleted successfully!');
                        alert("Image Deleted")
                    }).catch(error => {
                        console.error('Error deleting image: ', error);
                    });
                });

                // Create a container to hold the image and delete button
                const container = document.createElement('div');
                container.appendChild(img);
                container.appendChild(deleteBtn);

                // Append the container to the 'lightgallery' container
                document.getElementById('lightgallery').appendChild(container);
            }).catch(error => {
                console.error('Error getting download URL for image: ', error);
            });
        });
    }).catch(error => {
        console.error('Error listing images in directory: ', error);
    });
};