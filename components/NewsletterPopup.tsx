"use client";

import { useState, useEffect } from "react";
import NewsletterForm from "./forms/NewsletterForm";
import Modal from "./ui/Modal";

export default function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user has already dismissed popup
    const dismissed = localStorage.getItem("newsletter_popup_dismissed");
    if (dismissed === "true") return;

    // Show popup after 6 seconds delay to allow reading first
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    localStorage.setItem("newsletter_popup_dismissed", "true");
    setIsOpen(false);
  };

  /* ponytail: wrapped newsletter popup inside design system Modal primitives */
  return (
    <Modal isOpen={isOpen} onClose={handleDismiss}>
      <NewsletterForm
        heading="Join the AI Chronicle"
        description="Get weekly blueprints, recruiting reports, and system guides delivered to your mailbox free."
        buttonText="Subscribe Free"
        layout="card"
      />
    </Modal>
  );
}
