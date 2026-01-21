import React, { useEffect } from "react";
import { apiUrl } from "../../configs/app";
import { ReactSession } from "react-client-session";

export default function Chat(props) {
  const user = ReactSession.get("user");

  useEffect(() => {
    // 1. Set User Identity if available
    if (user && user.id) {
      localStorage.setItem("synz_user_id", user.id);
    }

    // 2. Inject Widget Script
    // Check if script already exists to prevent duplicate injection
    const existingScript = document.querySelector(
      `script[src="${apiUrl}/synz-chat-widget.js"]`,
    );

    if (!existingScript) {
      const script = document.createElement("script");
      script.src = `${apiUrl}/synz-chat-widget.js`;
      script.dataset.baseUrl = apiUrl; // data-base-url
      script.async = true;
      document.body.appendChild(script); // Usually body is safer for widgets
    }
  }, [user]);

  return null; // Widget renders itself via script
}
