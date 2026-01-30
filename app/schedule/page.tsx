"use client";
import { useState, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

interface Schedule {
  id: string;
  date: string;
  description: string;
  createdAt: string;
}

interface Notification {
  id: number;
  message: string;
  type: "success" | "error" | "warning" | "confirm";
  onConfirm?: () => void;
}

export default function Calendar() {
  const [selected, setSelected] = useState<Date | undefined>();
  const [description, setDescription] = useState("");
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  // Fetch scheduled dates on mount
  useEffect(() => {
    fetchSchedules();
  }, []);

  const showNotification = (
    message: string,
    type: Notification["type"] = "success"
  ) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  };

  const showConfirm = (message: string, onConfirm: () => void) => {
    const id = Date.now();
    setNotifications((prev) => [
      ...prev,
      { id, message, type: "confirm", onConfirm },
    ]);
  };

  const closeNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const fetchSchedules = async () => {
    try {
      const res = await fetch("/api/schedules");
      const data = await res.json();
      setSchedules(data);
    } catch (error) {
      console.error("Failed to fetch schedules:", error);
    }
  };

  const handleSchedule = async () => {
    if (!selected) return;

    if (!description.trim()) {
      showNotification("Please enter a description", "warning");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/schedules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: selected.toISOString(), description }),
      });

      if (res.status === 409) {
        showNotification("This date is already scheduled!", "error");
        return;
      }

      if (res.status === 400) {
        const data = await res.json();
        showNotification(data.error || "Invalid request", "warning");
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to schedule");
      }

      await fetchSchedules();
      setSelected(undefined);
      setDescription("");
      showNotification("Appointment scheduled successfully!", "success");
    } catch (error) {
      console.error("Failed to schedule:", error);
      showNotification("Failed to schedule appointment", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id: string) => {
    showConfirm("Remove this appointment?", async () => {
      try {
        const res = await fetch(`/api/schedules/${id}`, {
          method: "DELETE",
        });

        if (!res.ok) {
          throw new Error("Failed to remove");
        }

        await fetchSchedules();
        showNotification("Appointment removed!", "success");
      } catch (error) {
        console.error("Failed to remove schedule:", error);
        showNotification("Failed to remove appointment", "error");
      }
    });
  };

  // Convert scheduled dates to Date objects for disabling
  const scheduledDates = schedules.map((s) => new Date(s.date));

  return (
    <div
      className="min-h-screen relative"
      style={{ fontFamily: "'Crimson Text', serif" }}
    >
      {/* Background with subtle literary theme */}
      <div className="fixed inset-0 bg-gradient-to-br from-stone-900 via-neutral-900 to-zinc-900 -z-10"></div>

      {/* Subtle decorative background elements */}
      <div className="fixed inset-0 opacity-[0.03] -z-10">
        <div className="absolute top-10 left-10 text-9xl">📖</div>
        <div className="absolute top-40 right-20 text-8xl">🕯️</div>
        <div className="absolute bottom-20 left-20 text-7xl">🖋️</div>
        <div className="absolute top-1/2 right-10 text-9xl transform -translate-y-1/2">
          📜
        </div>
        <div className="absolute bottom-40 right-40 text-8xl">🎭</div>
        <div className="absolute top-20 left-1/3 text-6xl">⚜️</div>
        <div className="absolute bottom-10 right-1/4 text-7xl">🏛️</div>
      </div>

      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`
              ${notification.type === "confirm" ? "w-80" : "w-72"}
              ${
                notification.type === "success"
                  ? "bg-gradient-to-r from-stone-800 to-stone-700 border-stone-600"
                  : ""
              }
              ${
                notification.type === "error"
                  ? "bg-gradient-to-r from-neutral-900 to-neutral-800 border-red-900"
                  : ""
              }
              ${
                notification.type === "warning"
                  ? "bg-gradient-to-r from-stone-800 to-stone-700 border-stone-600"
                  : ""
              }
              ${
                notification.type === "confirm"
                  ? "bg-gradient-to-r from-stone-900 to-stone-800 border-stone-600"
                  : ""
              }
              border rounded-lg shadow-2xl p-4 text-stone-200 animate-slide-in
            `}
            style={{ fontFamily: "'EB Garamond', serif" }}
          >
            {notification.type === "confirm" ? (
              <div>
                <p className="text-base mb-3">{notification.message}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      notification.onConfirm?.();
                      closeNotification(notification.id);
                    }}
                    className="flex-1 bg-stone-700 hover:bg-stone-600 px-4 py-2 rounded font-medium transition"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => closeNotification(notification.id)}
                    className="flex-1 bg-stone-800 hover:bg-stone-700 px-4 py-2 rounded font-medium transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <p className="text-sm">{notification.message}</p>
                <button
                  onClick={() => closeNotification(notification.id)}
                  className="ml-4 text-stone-400 hover:text-stone-200"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="relative z-10 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1
              className="text-6xl font-semibold text-stone-300 mb-3 tracking-wide"
              style={{ fontFamily: "'EB Garamond', serif" }}
            >
              Appointments
            </h1>
            <p className="text-stone-400 text-lg italic leading-relaxed max-w-md mx-auto">
              "Time is the most valuable thing a man can spend."
            </p>
            <p className="text-stone-500 text-sm mt-1">— Theophrastus</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Calendar Section */}
            <div className="bg-stone-900/60 backdrop-blur-sm rounded-lg shadow-2xl p-8 border border-stone-700/50">
              <h2
                className="text-2xl font-medium text-stone-300 mb-6 text-center tracking-wide"
                style={{ fontFamily: "'EB Garamond', serif" }}
              >
                Select Date
              </h2>
              <div className="flex justify-center [&_.rdp]:text-white [&_.rdp-button]:text-white [&_.rdp-button:hover]:bg-stone-700/30 [&_.rdp-day_selected]:bg-stone-600 [&_.rdp-day_selected]:text-white">
                <DayPicker
                  mode="single"
                  selected={selected}
                  onSelect={setSelected}
                  disabled={scheduledDates}
                  modifiers={{ scheduled: scheduledDates }}
                  modifiersStyles={{
                    scheduled: {
                      backgroundColor: "#292524",
                      textDecoration: "line-through",
                      color: "#57534e",
                    },
                  }}
                  className="border-0"
                />
              </div>

              {selected && (
                <div className="mt-8 pt-8 border-t border-stone-700/50">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-stone-400 mb-2 tracking-wide">
                      Purpose
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter the reason for this appointment..."
                      className="w-full bg-stone-950/50 border border-stone-700/50 rounded-lg p-4 text-stone-200 placeholder-stone-600 focus:outline-none focus:ring-1 focus:ring-stone-600 focus:border-transparent transition"
                      style={{ fontFamily: "'Crimson Text', serif" }}
                      rows={3}
                    />
                  </div>
                  <button
                    onClick={handleSchedule}
                    disabled={loading}
                    className="w-full bg-stone-700 text-stone-200 px-6 py-3 rounded-lg font-medium hover:bg-stone-600 disabled:bg-stone-800 disabled:text-stone-500 transition shadow-lg tracking-wide"
                    style={{ fontFamily: "'EB Garamond', serif" }}
                  >
                    {loading ? "Scheduling..." : "Schedule Appointment"}
                  </button>
                  <p className="text-sm text-stone-500 mt-4 text-center">
                    {selected.toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              )}
            </div>

            {/* Scheduled Appointments Section */}
            <div className="bg-stone-900/60 backdrop-blur-sm rounded-lg shadow-2xl p-8 border border-stone-700/50">
              <h2
                className="text-2xl font-medium text-stone-300 mb-6 tracking-wide"
                style={{ fontFamily: "'EB Garamond', serif" }}
              >
                Scheduled
              </h2>
              {schedules.length > 0 ? (
                <ul className="space-y-3 max-h-[500px] overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-stone-700/50 [&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-track]:bg-stone-900/50">
                  {schedules.map((schedule) => (
                    <li
                      key={schedule.id}
                      className="bg-stone-950/50 p-5 rounded-lg border border-stone-700/30 hover:border-stone-600/50 hover:shadow-lg transition"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="mb-2">
                            <span
                              className="font-medium text-stone-300 text-base"
                              style={{ fontFamily: "'EB Garamond', serif" }}
                            >
                              {new Date(schedule.date).toLocaleDateString(
                                "en-US",
                                {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </span>
                          </div>
                          <p className="text-sm text-stone-400 leading-relaxed italic">
                            {schedule.description}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemove(schedule.id)}
                          className="bg-stone-800 text-stone-400 px-3 py-1 rounded text-xs font-medium hover:bg-stone-700 hover:text-stone-300 ml-4 transition"
                        >
                          Remove
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-16">
                  <p className="text-stone-500 italic text-base">
                    No appointments scheduled
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
