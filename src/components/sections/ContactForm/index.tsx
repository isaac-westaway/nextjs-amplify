"use client";

import { useState, FocusEvent } from "react";
import toast from "react-hot-toast";


export default function ContactForm() {
  type FormValues = {
    name: string;
    email: string;
    booleanValue: boolean;
  };

  const initialState = {
    name: "",
    email: "",
    booleanValue: false,
  }

  const [values, setValues] = useState<FormValues>({
    name: "",
    email: "",
    booleanValue: false,
  });

  function handleChange(event: FocusEvent<HTMLInputElement>) {
    setValues((prev) => ({
        ...prev,
        [event.target.name]: event.target.value
    }))
  }

  function handleBooleanChange() {
    setValues((prev) => ({
        ...prev,
        booleanValue: !prev.booleanValue
    }))
  }

  async function sendEmail() {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const errorResponse = await res.json();
        const errorMessage =
          errorResponse.error ||
          "An unexpected error occurred. Please try again later.";
        throw new Error(errorMessage);
      }
      if (res.ok) {
        setValues(initialState);
        toast.success(`Successfully sent email!`, {
          duration: 4000,
          position: "top-center",
        });
      }
    } catch (error: any) {
      const errorMessage =
        (error as Error).message ||
        "An unexpected error occurred. Please try again later.";
        toast.error(errorMessage);
    }
  }
  return (
    <div className="flex flex-col border max-w-60 mx-10 space-y-11">
      <input className="border-b-[3px] border-black" placeholder="name" onChange={handleChange} name="name" value={values.name}/>
      <input className="border-b-[3px] border-black" placeholder="email" onChange={handleChange} name="email" value={values.email}/>
      <input type="checkbox" name="booleanValue" onChange={handleBooleanChange} checked={values.booleanValue} className="border-b-[3px] border-black" placeholder="booleanValue"/>
      <button onClick={sendEmail}>Send Email</button>
      <button onClick={() => console.log(values)}>Console Log Values</button>
    </div>
  );
}
