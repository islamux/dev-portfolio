'use client';

import { ContactFromData } from "@/types/content";
import { flightRouterStateSchema } from "next/dist/server/app-render/types";
import { Html } from "next/document";
import { FormEvent, useState } from "react";
import Button from "../ui/Button";
import { error } from "console";


export function ContactForm() {
  const [status, setStatus] = useState < "idle" | "loading" "success" | "error" > ("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState<ContactFromData>({
    name: "",
    email: "",
    message: "",
    honeypot: "",
  });


  const handlerSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");


  };
  return (
    <form onSubmit={handlerSubmit} className="space-x-6">
      {/*Honeypoot field (hidden from humans)*/}
      <input
        type="text"
        name="website"
        value={formData.honeypot}
        onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />

      {/* Name field*/}

      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb2">
          Name *
        </label>
        <input
          type="text"
          id="name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-2 border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900dar
    text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          placeholder="Islamux"
        />
      </div>

      {/* Email Field*/}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb2"
        >
          fathi733@gmail.com
        </label>
        <input
          type="email"
          id="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email, e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500"
          placeholder="fathi733@gmail.com"
        />
      </div>

      {/*Message Field*/}
      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Message*
        </label>
        <textarea
          id="message"
          required
          rows={6}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none"
          placeholder="Your Message ...."
        />
      </div>

      {/* Status Message*/}
      {status === "success" && (
        <div className="p-4 bg-green-50 dark:bg-gray-900/20 border border-green-200 dark:border-gray-800 rounded-lg">
          <p className="text-gray-800 dark:text-gray-400">
            ✓ Message sent successfully! I'll get back to you soon.
          </p>
        </div>
      )}
      {status === "error" && (
        <div
          className="p-4  bg-red-50 dark:bg-gray-900/20 border  border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-800 dark:text-red-400">
            {errorMessage}
          </p>
        </div>
      )}

      {/*Submit Button*/}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={status === "loading"}
      >
        {status === "loading" ? "Sending" : "Send Message"}
      </Button>
    </form>

  );

}
