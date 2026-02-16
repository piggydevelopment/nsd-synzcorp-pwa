import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useRef,
} from "react";
import { ReactSession } from "react-client-session";
import api from "../utils/api";

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [appointments, setAppointments] = useState({});
  const [unreadChatCount, setUnreadChatCount] = useState(0);

  const audioUrl =
    "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3";
  const audioRef = useRef(new Audio(audioUrl));
  const user = ReactSession.get("user");
  const appointmentsRef = useRef({});
  const lastChatIdRef = useRef(null);

  const addNotification = (message, severity = "info") => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, severity }]);
    playAudio();

    // Show system notification if supported and granted
    showSystemNotification("Synz Corporate", message);

    setTimeout(() => {
      removeNotification(id);
    }, 6000);
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const playAudio = () => {
    try {
      audioRef.current.volume = 0.5;
      audioRef.current.currentTime = 0;
      audioRef.current
        .play()
        .catch((e) => console.log("Audio play failed:", e));
    } catch (e) {
      console.error("Error playing sound:", e);
    }
  };

  const clearUnreadChat = () => {
    setUnreadChatCount(0);
  };

  const showSystemNotification = (title, body) => {
    if (!("Notification" in window)) return;

    if (Notification.permission === "granted") {
      try {
        new Notification(title, {
          body: body,
          icon: "/logo192.png",
        });
      } catch (e) {
        console.error("System notification error:", e);
      }
    }
  };

  // Keep ref in sync
  useEffect(() => {
    appointmentsRef.current = appointments;
  }, [appointments]);

  // Request Notification Permission
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Poll for appointments
  useEffect(() => {
    if (!user?.id) return;

    const poll = async () => {
      try {
        const response = await api.get(`/api/appointment/${user.id}`);
        const data = response.data?.data || [];

        const currentAppts = appointmentsRef.current;
        const newAppts = { ...currentAppts };
        let stateChanged = false;

        data.forEach((appt) => {
          const prevStatus = currentAppts[appt.id];
          const newStatus = appt.appointment_status_id;

          if (prevStatus !== undefined && prevStatus !== newStatus) {
            const statusMap = {
              1: "รอการยืนยัน",
              2: "ยืนยันแล้ว",
              3: "เสร็จสิ้น",
              4: "ยกเลิก",
              5: "ใช้บริการแล้ว",
            };
            const statusText = statusMap[newStatus] || "ไม่ระบุ";

            let message = `นัดหมาย #${appt.number} เปลี่ยนสถานะเป็น: ${statusText}`;
            let severity = "info";

            if (newStatus === 2) {
              severity = "success";
              message = `นัดหมาย #${appt.number} ได้รับการยืนยันแล้ว`;
            } else if (newStatus === 4) {
              severity = "error";
              message = `นัดหมาย #${appt.number} ถูกยกเลิก`;
            }

            addNotification(message, severity);
          }

          if (prevStatus !== newStatus) {
            newAppts[appt.id] = newStatus;
            stateChanged = true;
          }
        });

        if (Object.keys(currentAppts).length === 0 && data.length > 0) {
          const initialMap = {};
          data.forEach((a) => (initialMap[a.id] = a.appointment_status_id));
          setAppointments(initialMap);
        } else if (stateChanged) {
          setAppointments(newAppts);
        }
      } catch (error) {
        console.error("Polling error:", error);
      }
    };

    poll();
    const id = setInterval(poll, 10000);
    return () => clearInterval(id);
  }, [user?.id]);

  // Chat listener (Window Message)
  useEffect(() => {
    const handleMessage = (event) => {
      let data = event.data;
      if (typeof data === "string") {
        try {
          data = JSON.parse(data);
        } catch (e) {}
      }

      if (data && data.type === "synz_chat_message") {
        addNotification(data.text || "มีข้อความใหม่จากแชท", "info");
        setUnreadChatCount((prev) => prev + 1);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // Poll for Chat Messages (API)
  useEffect(() => {
    if (!user?.id) return;

    const pollChat = async () => {
      const sessionId = localStorage.getItem("synz_session_id");
      if (!sessionId) return;

      try {
        const response = await api.get(`/api/chat/message`, {
          params: { sessionId },
        });

        const messages = response.data?.data || response.data || [];
        if (!Array.isArray(messages) || messages.length === 0) return;

        const sortedMsgs = [...messages].sort(
          (a, b) => parseInt(a.id) - parseInt(b.id),
        );
        const lastMsg = sortedMsgs[sortedMsgs.length - 1];

        if (!lastMsg) return;

        const lastId = lastChatIdRef.current;
        const currentMaxId = parseInt(lastMsg.id);

        console.log("Chat Poll:", {
          lastId,
          currentMaxId,
          msgs: sortedMsgs.length,
        });

        if (lastId === null) {
          lastChatIdRef.current = currentMaxId;
          return;
        }

        if (currentMaxId > lastId) {
          const newMessages = sortedMsgs.filter((m) => parseInt(m.id) > lastId);
          newMessages.forEach((msg) => {
            if (msg.sender !== "user") {
              addNotification(
                msg.message_text || "มีข้อความใหม่จากแชท",
                "info",
              );
              setUnreadChatCount((prev) => prev + 1);
            }
          });
          lastChatIdRef.current = currentMaxId;
        }
      } catch (error) {
        // console.error("Chat polling error:", error);
      }
    };

    pollChat();
    const id = setInterval(pollChat, 10000);
    return () => clearInterval(id);
  }, [user?.id]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadChatCount,
        removeNotification,
        addNotification,
        clearUnreadChat,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
