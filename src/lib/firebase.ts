// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAxJlMVx0q4ymrrjCU1glWxVzFm-yxpUis",
  authDomain: "gitpro-1244b.firebaseapp.com",
  projectId: "gitpro-1244b",
  storageBucket: "gitpro-1244b.firebasestorage.app",
  messagingSenderId: "726287569685",
  appId: "1:726287569685:web:85bc041b2f5dc12dec4f1c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);

export async function uploadFile(
  file: File,
  setProgress?: (progress: number) => void,
) {
  return new Promise((resolve, reject) => {
    try {
      const storageRef = ref(storage, file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on("state_changed", (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
        );
        if (setProgress) setProgress(progress);

        switch (snapshot.state) {
          case "paused":
            console.log("upload is paused");
            break;
          case "running":
            console.log("upload is running");
            break;
          default:
            break;
        }
      },error=>{
        reject(error);
      },()=>{
        getDownloadURL(uploadTask.snapshot.ref).then(downloadUrl=>{
            resolve(downloadUrl);
        })
      });
    } catch (error) {
        console.error(error);
        reject(error);
        
    }
  });
}
