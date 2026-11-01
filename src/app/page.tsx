"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  Activity, ArrowRight, Bell, CalendarDays, Check, ChevronDown,
  Headphones, Home, Mail, MessageSquareText, Plus, Search, Send, Settings,
  ShieldCheck, Sparkles, TrendingUp, Users, Wrench, Clock3,
} from "lucide-react";

type Booking = {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  service: string;
  issue: string;
  date: string;
  time: string;
  address: string;
  status: "Confirmed" | "New";
};

type ServiceMatch = { service: string; urgency: string; duration: string; rate: string };

const starterBookings: Booking[] = [
  { id: "b1", name: "Olivia Chen", email: "olivia@example.com", service: "Kitchen tap repair", issue: "Dripping tap", date: "Today", time: "9:30 AM", address: "12 Oak Street", status: "Confirmed" },
  { id: "b2", name: "Marcus Reid", email: "marcus@example.com", service: "Electrical inspection", issue: "Flickering lights", date: "Today", time: "11:00 AM", address: "48 River Road", status: "Confirmed" },
  { id: "b3", name: "Sofia Patel", email: "sofia@example.com", service: "Pipe leak repair", issue: "Leaking under sink", date: "Tomorrow", time: "9:00 AM", address: "6 Willow Lane", status: "New" },
];

const timeSlots = ["Today · 2:30 PM", "Today · 4:00 PM", "Tomorrow · 9:00 AM"];

function classifyIssue(text: string): ServiceMatch {
  const query = text.toLowerCase();
  if (/electric|power|socket|outlet|breaker|wire|light|flicker|fuse/.test(query)) {
    return { service: "Electrical repair", urgency: /smell|smoke|spark|shock/.test(query) ? "Urgent · safety check" : "Standard", duration: "60–90 min", rate: "From $85" };
  }
  if (/heat|boiler|furnace|radiator|ac |air condition|cooling/.test(query)) {
    return { service: "Heating & cooling", urgency: "Standard", duration: "90 min", rate: "From $110" };
  }
  if (/drain|toilet|tap|faucet|leak|pipe|plumb|water|sink|shower/.test(query)) {
    return { service: "Plumbing repair", urgency: /flood|burst|major leak/.test(query) ? "Urgent" : "Standard", duration: "60 min", rate: "From $75" };
  }
  return { service: "Home service visit", urgency: "Needs a quick review", duration: "To be confirmed", rate: "Quote on visit" };
}

function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("");
}

export default function Dashboard() {
  const [bookings, setBookings] = useState<Booking[]>(starterBookings);
  const [issue, setIssue] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [matchedIssue, setMatchedIssue] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [reminderCadence, setReminderCadence] = useState("24 hours and 2 hours before");
  const [toast, setToast] = useState("");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("relay-bookings-v1");
      if (saved) setBookings(JSON.parse(saved) as Booking[]);
      const savedReminderSettings = window.localStorage.getItem("relay-reminders-v1");
      if (savedReminderSettings) {
        const settings = JSON.parse(savedReminderSettings) as { enabled?: boolean; cadence?: string };
        if (typeof settings.enabled === "boolean") setRemindersEnabled(settings.enabled);
        if (settings.cadence) setReminderCadence(settings.cadence);
      }
    } catch {
      window.localStorage.removeItem("relay-bookings-v1");
    }
  }, []);

  const match = useMemo(() => matchedIssue ? classifyIssue(matchedIssue) : null, [matchedIssue]);

  function saveBookings(next: Booking[]) {
    setBookings(next);
    window.localStorage.setItem("relay-bookings-v1", JSON.stringify(next));
  }

  function handleIssueSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!issue.trim()) return;
    setMatchedIssue(issue.trim());
    setIssue("");
    setShowDetails(true);
    setSelectedSlot("");
  }

  function confirmBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!customerName.trim() || !phone.trim() || !email.trim() || !address.trim() || !matchedIssue || !selectedSlot || !match) return;
    const [date, time] = selectedSlot.split(" · ");
    const booking: Booking = {
      id: crypto.randomUUID(), name: customerName.trim(), phone: phone.trim(), email: email.trim(), service: match.service,
      issue: matchedIssue, date, time, address: address.trim(), status: "New",
    };
    saveBookings([booking, ...bookings]);
    setMatchedIssue("");
    setSelectedSlot("");
    setCustomerName("");
    setPhone("");
    setEmail("");
    setAddress("");
    setShowDetails(false);
    setToast(`Appointment requested for ${booking.name}`);
    window.setTimeout(() => setToast(""), 3500);
  }

  const todayCount = bookings.filter((booking) => booking.date === "Today").length;
  const upcomingBookings = bookings.filter((booking) => booking.date !== "Today");

  function updateReminderSettings(enabled: boolean, cadence: string) {
    setRemindersEnabled(enabled);
    setReminderCadence(cadence);
    window.localStorage.setItem("relay-reminders-v1", JSON.stringify({ enabled, cadence }));
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><div className="brand-mark"><Activity size={17} strokeWidth={2.5} /></div>relay</div>
        <div className="workspace-label">WORKSPACE</div>
        <nav aria-label="Main navigation">
          <div className="nav-item active"><Home size={16} /> Overview</div>
          <div className="nav-item"><CalendarDays size={16} /> Appointments</div>
          <div className="nav-item"><Users size={16} /> Customers</div>
          <div className="nav-item"><MessageSquareText size={16} /> Conversations</div>
          <div className="nav-item"><Settings size={16} /> Settings</div>
        </nav>
        <div className="side-bottom">
          <div className="plan-card"><strong>Your assistant is on</strong><p>Relay can take new booking requests while you&apos;re on the job.</p><span className="plan-link">Manage assistant <ArrowRight size={11} /></span></div>
          <div className="profile"><div className="avatar">JM</div><div><strong>Jordan Miller</strong><small>Brightside Home Services</small></div><ChevronDown size={14} color="#89938d" /></div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="top-actions"><button className="icon-button mobile-menu" aria-label="Open menu"><Home size={17} /></button><div className="breadcrumb">Workspace <span style={{ margin: "0 8px", color: "#c2c9c4" }}>/</span> <strong>Overview</strong></div></div>
          <div className="top-actions"><span className="live-pill"><span className="live-dot" /> AI assistant active</span><button className="icon-button" aria-label="Search"><Search size={17} /></button><button className="icon-button" aria-label="Notifications"><Bell size={17} /></button><div className="avatar" style={{ width: 29, height: 29 }}>JM</div></div>
        </header>

        <div className="page-content">
          <div className="heading-row">
            <div><div className="eyebrow">Sunday, November 1, 2026</div><h1>Good morning, Jordan <span aria-hidden="true">☀️</span></h1><p>Here&apos;s what&apos;s happening with your business today.</p></div>
            <button className="date-button"><CalendarDays size={14} /> Today, Nov 1 <ChevronDown size={13} /></button>
          </div>

          <section className="trial-banner" aria-label="Subscription plan preview"><div className="trial-icon"><Sparkles size={16} /></div><div className="trial-copy"><strong>30-day free trial, then $10/month</strong><span>Plan preview: appointments, booking assistant, and reminder scheduling.</span></div><div className="trial-progress"><span>30 DAYS FREE</span><div className="trial-track"><i /></div></div><button className="trial-action" type="button">Plan details <ArrowRight size={13} /></button></section>

          <section className="metrics" aria-label="Business metrics">
            <Metric icon={<CalendarDays size={15} />} label="Appointments today" value={String(todayCount).padStart(2, "0")} note={<><span className="up">+2</span> from yesterday</>} />
            <Metric icon={<Users size={15} />} label="New customers" value="08" note={<><span className="up">+14%</span> this month</>} />
            <Metric icon={<MessageSquareText size={15} />} label="Calls handled by AI" value="24" note="Since your assistant went live" />
            <Metric icon={<TrendingUp size={15} />} label="Estimated revenue" value="$1,240" note={<><span className="up">+8.2%</span> this week</>} />
          </section>

          <section className="content-grid">
            <div className="panel">
              <div className="panel-header"><div><div className="panel-title">Today&apos;s appointments</div><div className="panel-subtitle">Your schedule at a glance</div></div><button className="link-button">View calendar <ArrowRight size={12} /></button></div>
              <div className="bookings">
                {bookings.filter((booking) => booking.date === "Today").length === 0 ? <div className="empty-state"><CalendarDays size={21} />No appointments scheduled for today.</div> : bookings.filter((booking) => booking.date === "Today").map((booking) => (
                  <div className="booking-row" key={booking.id}>
                    <div className="booking-time">{booking.time}<small>{booking.date}</small></div>
                    <div className="customer-avatar">{initials(booking.name)}</div>
                    <div><div className="booking-name">{booking.name}</div><div className="booking-service">{booking.service} · {booking.address}</div></div>
                    <span className={`status ${booking.status === "New" ? "new" : ""}`}>{booking.status}</span>
                  </div>
                ))}
              </div>
              <div className="panel-header" style={{ borderTop: "1px solid #f0f1ee", borderBottom: 0, paddingTop: 16, paddingBottom: 14 }}><div><div className="panel-title">Upcoming</div><div className="panel-subtitle">Next appointments on your schedule</div></div><button className="icon-button" aria-label="Add appointment"><Plus size={16} /></button></div>
              <div className="bookings">
                {upcomingBookings.slice(0, 2).map((booking) => <div className="booking-row" key={booking.id}><div className="booking-time">{booking.time}<small>{booking.date}</small></div><div className="customer-avatar">{initials(booking.name)}</div><div><div className="booking-name">{booking.name}</div><div className="booking-service">{booking.service}</div></div><span className="status">{booking.status}</span></div>)}
                {upcomingBookings.length === 0 && <div className="empty-state" style={{ padding: "12px 0 17px" }}>No upcoming appointments yet.</div>}
              </div>
            </div>

            <div className="panel assistant-panel">
              <div className="panel-header"><div><div className="panel-title">Booking assistant</div><div className="panel-subtitle">Preview how Relay handles a missed call</div></div><span className="live-pill"><span className="live-dot" /> Live</span></div>
              <div className="assistant-banner"><div className="assistant-icon"><Sparkles size={16} /></div><div><strong>Your AI receptionist</strong><span>Ready to turn calls into booked jobs</span></div></div>
              <div className="chat-body" aria-live="polite">
                <div className="chat-message">Hi! Sorry we missed your call. What can we help you with today?</div>
                {matchedIssue && <>
                  <div className="chat-message user">{matchedIssue}</div>
                  <div className="chat-message">Got it — I can help arrange that. Here&apos;s what I understood:</div>
                  {match && <div className="intent-card"><div className="intent-top"><strong>Request summary</strong><span className="confidence">Matched to service</span></div><div className="intent-detail"><span>Service</span><strong>{match.service}</strong></div><div className="intent-detail"><span>Priority</span><strong>{match.urgency}</strong></div><div className="intent-detail"><span>Visit length</span><strong>{match.duration}</strong></div><div className="intent-detail"><span>Estimated price</span><strong>{match.rate}</strong></div><div className="suggestion-label">AVAILABLE TIMES · LOCAL TIME</div><div className="slot-list">{timeSlots.map((slot) => <button key={slot} type="button" className={`slot-button ${selectedSlot === slot ? "selected" : ""}`} onClick={() => { setSelectedSlot(slot); setShowDetails(true); }}>{selectedSlot === slot && <Check size={10} />} {slot}</button>)}</div></div>}
                </>}
                {showDetails && matchedIssue && selectedSlot && <form onSubmit={confirmBooking} className="intent-card"><div className="intent-top"><strong>Complete this booking</strong><span className="confidence">{selectedSlot}</span></div><input required aria-label="Customer name" value={customerName} onChange={(event) => setCustomerName(event.target.value)} placeholder="Customer name" style={fieldStyle} /><input required type="tel" aria-label="Customer phone number" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="Customer phone number" style={fieldStyle} /><input required type="email" aria-label="Customer email address" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Customer email address" style={fieldStyle} /><input required aria-label="Service address" value={address} onChange={(event) => setAddress(event.target.value)} placeholder="Service address" style={fieldStyle} /><p className="email-consent"><Mail size={12} /> We&apos;ll send appointment reminders to this address.</p><button type="submit" className="confirm-button">Confirm appointment <ArrowRight size={13} /></button></form>}
              </div>
              {!matchedIssue && <form className="chat-input-wrap" onSubmit={handleIssueSubmit}><div className="chat-input"><input value={issue} onChange={(event) => setIssue(event.target.value)} placeholder="e.g. My kitchen tap is leaking..." aria-label="Describe the customer's service issue" /><button className="send-button" type="submit" aria-label="Analyze request"><Send size={14} /></button></div><div className="chat-hint">Describe the customer&apos;s issue to suggest the right service.</div></form>}
              {matchedIssue && !showDetails && <div className="chat-input-wrap"><button className="link-button" onClick={() => { setMatchedIssue(""); setSelectedSlot(""); }}>Start another request</button></div>}
              {matchedIssue && <div className="chat-input-wrap" style={{ paddingTop: 7 }}><button className="link-button" onClick={() => { setMatchedIssue(""); setSelectedSlot(""); setShowDetails(false); }}>Reset conversation</button></div>}
            </div>
          </section>

          <section className="feature-strip" aria-label="Assistant capabilities">
            <Feature icon={<Headphones size={15} />} title="Never miss a lead" detail="Answers every call, even after hours" />
            <Feature icon={<Wrench size={15} />} title="Understands the job" detail="Routes requests to the right service" />
            <Feature icon={<ShieldCheck size={15} />} title="You stay in control" detail="Review every appointment request" />
          </section>

          <section className="reminders-panel panel" aria-labelledby="reminders-title">
            <div className="panel-header"><div><div className="panel-title" id="reminders-title">Email reminders</div><div className="panel-subtitle">Keep customers informed before their visit</div></div><span className={`reminder-toggle-label ${remindersEnabled ? "enabled" : ""}`}><span className="live-dot" /> {remindersEnabled ? "Enabled" : "Paused"}</span></div>
            <div className="reminders-content"><div className="reminder-settings"><div className="reminder-copy"><div className="reminder-icon"><Mail size={16} /></div><div><strong>Automatic appointment reminders</strong><p>Choose when customers should receive a reminder email.</p></div></div><label className="toggle-control"><input type="checkbox" checked={remindersEnabled} onChange={(event) => updateReminderSettings(event.target.checked, reminderCadence)} /><span className="toggle-track" /><span className="sr-only">Enable email reminders</span></label><label className="cadence-control"><span>Reminder schedule</span><select value={reminderCadence} onChange={(event) => updateReminderSettings(remindersEnabled, event.target.value)} disabled={!remindersEnabled}><option>24 hours and 2 hours before</option><option>24 hours before</option><option>1 week and 24 hours before</option></select></label><p className="delivery-note"><Clock3 size={13} /> Reminder schedule preview only. Connect an email provider and server scheduler to send emails reliably.</p></div><div className="reminder-queue"><div className="queue-heading"><strong>Coming up</strong><span>{upcomingBookings.length} appointments</span></div>{upcomingBookings.length ? upcomingBookings.slice(0, 3).map((booking) => <div className="queue-row" key={booking.id}><div className="queue-date"><CalendarDays size={14} /><span>{booking.date}</span></div><div className="queue-customer"><strong>{booking.name}</strong><span>{booking.email ?? "No email added"}</span></div><span className={`queue-status ${remindersEnabled && booking.email ? "queued" : "not-queued"}`}>{remindersEnabled && booking.email ? "Ready to schedule" : "Needs setup"}</span></div>) : <div className="queue-empty">Upcoming bookings with an email address will appear here.</div>}</div></div>
          </section>
        </div>
      </main>
      <nav className="mobile-tabbar" aria-label="Mobile navigation"><button className="mobile-tab active" aria-current="page"><Home size={18} /><span>Home</span></button><button className="mobile-tab"><CalendarDays size={18} /><span>Schedule</span></button><button className="mobile-tab"><Users size={18} /><span>Customers</span></button><button className="mobile-tab"><Settings size={18} /><span>Settings</span></button></nav>
      {toast && <div role="status" className="toast"><Check size={15} style={{ verticalAlign: "middle", marginRight: 7 }} />{toast}</div>}
    </div>
  );
}

const fieldStyle = { width: "100%", padding: "9px 10px", border: "1px solid #e4e9e4", borderRadius: 7, marginBottom: 7, fontSize: 10, outlineColor: "#147d58" };

function Metric({ icon, label, value, note }: { icon: React.ReactNode; label: string; value: string; note: React.ReactNode }) {
  return <div className="metric-card"><div className="metric-top"><span>{label}</span><span className="metric-icon">{icon}</span></div><div className="metric-value">{value}</div><div className="metric-note">{note}</div></div>;
}

function Feature({ icon, title, detail }: { icon: React.ReactNode; title: string; detail: string }) {
  return <div className="feature-card"><div className="feature-icon">{icon}</div><div><strong>{title}</strong><span>{detail}</span></div></div>;
}
