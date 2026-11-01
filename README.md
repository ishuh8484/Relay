# Relay — AI-assisted service booking

Relay is an AI-assisted missed-call appointment booking concept that helps home-service businesses turn missed customer calls into scheduled jobs. This repository contains a responsive MVP dashboard for home-service professionals. Its booking assistant can classify a customer's plain-language description as plumbing, electrical, heating/cooling, or a general home-service request, offer demo time slots, collect customer and service-address details, and save confirmed requests in the browser's local storage.

The dashboard includes a 30-day free trial followed by a $10/month plan preview, a mobile-friendly bottom navigation, and configurable appointment reminder preferences. The pricing and reminder controls are currently presentation/demo features; billing and email delivery are not connected.

## Run locally

Requirements: Node.js 20.9 or newer and npm.

1. Install dependencies with `npm install`.
2. Start the development server with `npm run dev`.
3. Open `http://localhost:3000` in a browser.
4. Check production compilation with `npm run build`; check lint with `npm run lint`.

## Try the booking flow

In the Booking assistant, enter a request such as “My kitchen tap is leaking” or “The power outlet is sparking.” Select one of the proposed times, enter the customer's name, phone number, email, and service address, and confirm. The request appears in the dashboard and remains saved in that browser.

## MVP boundaries and next steps

- This is a demo, not a connected phone system. It does not answer calls, contact customers, or send messages.
- Issue classification is deterministic demo logic, not an external AI/LLM. Replace `classifyIssue` with a server-side AI integration when configured, and treat its output as an untrusted suggestion.
- Sample appointments, rates, urgency labels, and available time slots are illustrative. Real availability must be checked against a provider calendar on the server before confirmation; prevent double-booking and validate category, pricing, address, and customer details before persisting.
- Bookings currently use browser local storage. Use an authenticated backend/database for multi-user, cross-device, production persistence.
- Customers provide an email during booking. Reminder cadence is stored in this browser and upcoming jobs are listed as a reminder preview; no email is sent. Production reminders need a persistent database, a scheduled server job (for example, Vercel Cron), and a configured email provider. Never send reminders from a browser timer; it cannot run reliably when the page is closed.
- The $10/month offer is a UI plan preview only. Subscription checkout, trial start/end dates, cancellation, and payment processing need a billing integration (for example, Stripe) and server-side account state before charging customers.
- No API keys or secrets are required or included.

## Deploy to Vercel

1. Commit and push this project to a GitHub repository.
2. Sign in to Vercel, choose **Add New → Project**, and import the repository.
3. Keep the detected **Next.js** framework and default build settings. No environment variables are required for this demo.
4. Choose **Deploy**. Vercel builds the app and provides a preview/production URL; future pushes to the connected production branch trigger deployments.
5. Test the deployed booking flow on desktop and a phone-sized viewport. Browser local storage is per device/browser and is not shared across visitors or devices.

The mobile layout is a responsive web app with a phone-style bottom tab bar, not a native iOS/Android app. It can be opened in a mobile browser; native distribution or installable PWA support would be a separate follow-up.
