import { useState, FormEvent } from "react";
import { ContactFormData } from "@/types/content";

type Status = "idle" | "loading" | "success" | "error";

const EMPTY_CONTACT_FORM: ContactFormData = {
  name: "",
  email: "",
  message: "",
  honeypot: "",
};

export function useContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState<ContactFormData>(EMPTY_CONTACT_FORM);

  const updateField = (field: keyof ContactFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || "Failed to send message");
      }
      setStatus("success");
      setFormData(EMPTY_CONTACT_FORM);

    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong");
    }
  };

  return {
    formData,
    status,
    errorMessage,
    updateField,
    handleSubmit,
  };
}
