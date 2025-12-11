import { useState, FormEvent } from "react";
import { ContactFormData } from "@/types/content";

type Status = "idle" | "loading" | "success" | "error";

export function useContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    message: "",
    honeypot: "",
  });

  // updateField 
  const updateField = (field: keyof ContactFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  // handleSubmit
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Spam check
    if (formData.honeypot) {
      setStatus("error");
      setErrorMessage("Spam detected");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Contact-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to send message");
      setStatus("success");
      setFormData({ name: "", email: "", message: "", honeypot: "" });

    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Somthing went wrong");

    }
  };

  const reset = () => {
    setFormData({ name: "", email: "", message: "", honeypot: "" });
    setStatus("idle");
    setErrorMessage("");
  };

  return {
    formData,
    status,
    errorMessage,
    updateField,
    handleSubmit,
    reset,
  };

}
