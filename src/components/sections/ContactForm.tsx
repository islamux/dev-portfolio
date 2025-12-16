'use client';

import { useContactForm } from "@/hooks/useContactForm";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Alert } from "../ui/alert";

export function ContactForm() {

  const { formData, status, errorMessage, updateField, handleSubmit } = useContactForm();


  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/*Honeypoot field (hidden from humans)*/}
      <input
        type="text"
        name="website"
        value={formData.honeypot}
        onChange={(e) => updateField("honeypot", e.target.value)}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />

      {/* Name field*/}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">
          Name *
        </Label>
        <Input
          id="name"
          type="text"
          required
          value={formData.name}
          onChange={(e) => updateField("name", e.target.value)}
          placeholder="Islamux"
          className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700 focus:ring-brand-500"
        />
      </div>

      {/* Email Field*/}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
          Email *
        </Label>
        <Input
          id="email"
          type="email"
          required
          value={formData.email}
          onChange={(e) => updateField("email", e.target.value)}
          placeholder="fathi733@gmail.com"
          className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700 focus:ring-brand-500"
        />
      </div>

      {/*Message Field*/}
      <div className="space-y-2">
        <Label htmlFor="message" className="text-gray-700 dark:text-gray-300">
          Message*
        </Label>
        <Textarea
          id="message"
          required
          value={formData.message}
          onChange={(e) => updateField("message", e.target.value)}
          placeholder="Your Message ...."
          className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700 focus:ring-brand-500 min-h-[160px] resize-none"
        />
      </div>

      {/* Status Message*/}
      {status === "success" && (
        <Alert variant="success" className="border-green-200 dark:border-green-800">
          <p className="text-gray-800 dark:text-green-400">
            ✓ Message sent successfully! I&apos;ll get back to you soon.
          </p>
        </Alert>
      )}
      {status === "error" && (
        <Alert variant="destructive" className="border-red-200 dark:border-red-800">
          <p className="text-red-800 dark:text-red-400">
            {errorMessage}
          </p>
        </Alert>
      )}

      {/*Submit Button*/}
      <Button
        type="submit"
        className="bg-brand-500 hover:bg-brand-600 text-white h-10 px-6 py-2 text-base w-full"
        disabled={status === "loading"}
      >
        {status === "loading" ? "Sending" : "Send Message"}
      </Button>
    </form>

  );

}
