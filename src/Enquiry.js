import { initializeApp } from "firebase/app";
import { getAuth, signInWithPhoneNumber } from "firebase/auth";
import { useState, useRef } from "react";
import { getDatabase, ref, set } from "firebase/database";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDlb6JxyyjkN5lDhlbYeO1dbzDl1TC8Zqc",
  authDomain: "smsauth-6ab18.firebaseapp.com",
  databaseURL: "https://smsauth-6ab18-default-rtdb.firebaseio.com",
  projectId: "smsauth-6ab18",
  storageBucket: "smsauth-6ab18.appspot.com",
  messagingSenderId: "185537522757",
  appId: "1:185537522757:web:e3ef4d6eae09306e50472c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

function Enquiry() {
  const rName = useRef();
  const rQuery = useRef();
  const rPhone = useRef();
  const rOtp = useRef();

  const [name, setName] = useState("");
  const [query, setQuery] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [final, setFinal] = useState(null);

  // Handle input changes
  const hName = (event) => setName(event.target.value);
  const hQuery = (event) => setQuery(event.target.value);
  const hPhone = (event) => setPhone(event.target.value);
  const hOtp = (event) => setOtp(event.target.value);


  const sendOtp = (event) => {
    event.preventDefault();
    const phoneNumber = "+1" + phone;
    const appVerifier = window.recaptchaVerifier;

    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
      .then((confirmationResult) => {
        setFinal(confirmationResult);
        console.log("OTP sent");
        alert("OTP sent");
      })
      .catch((error) => {
        console.error("Error during signInWithPhoneNumber", error);
      });
  };

  const submitOtp = (event) => {
    event.preventDefault();
    if (final) {
      final.confirm(otp)
        .then(() => {
          const d = new Date().toString();
          const n = name + "-->" + d;
          const data = { name, phone, query, d };
          set(ref(db, "visitors/" + n), data)
            .then(() => {
              console.log("Data saved successfully");
              alert("We will get back to you");
              window.location.reload();
            })
            .catch((error) => console.error("Error saving data", error));
        })
        .catch((error) => {
          console.error("Invalid OTP", error);
          alert("Invalid OTP");
          window.location.reload();
        });
    } else {
      alert("Please request OTP first");
    }
  };

  return (
    <div className="container">
      <h1>Fill the Enquiry Form</h1>
      <form onSubmit={sendOtp}>
        <div id="sign-in-button"></div>
        <input type="text" placeholder="Enter Name" onChange={hName} ref={rName} value={name} required/>
        <textarea placeholder="Enter Query" rows={3} onChange={hQuery} ref={rQuery} value={query} required></textarea>
        <input type="tel" placeholder="Enter Phone Number" onChange={hPhone} ref={rPhone} value={phone} required/>
        <input type="submit" value="Generate OTP" />
      </form>
      <form onSubmit={submitOtp}>
        <input type="text" placeholder="Enter OTP" onChange={hOtp} ref={rOtp} value={otp} required/>
        <input type="submit" value="Submit OTP" />
      </form>
    </div>
  );
}

export default Enquiry;
