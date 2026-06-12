# Umami App Analytics — Swift Integration Guide

## Overview

Your Umami instance has been customised for tracking native iOS apps (jobflo and warren). This guide explains what data your Swift apps need to send and how to use each feature in the Umami dashboard.

---

## 1. How to Send Data from Swift

Every event is sent as a `POST` request to your Umami server. Add these three functions to your app — replace the two placeholder values at the top and you're ready to track.

```swift
// ─── Configuration ────────────────────────────────────────────
let UMAMI_URL    = "https://your-umami-domain.com"   // your NAS address
let WEBSITE_ID   = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" // from Umami → Settings
let APP_NAME     = "JobFlo"                           // your app name
let APP_VERSION  = Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String ?? "1.0"
// ──────────────────────────────────────────────────────────────

// Call this every time a screen appears (e.g. in onAppear or viewDidAppear)
func trackScreen(_ screenName: String) {
    let payload: [String: Any] = [
        "website": WEBSITE_ID,
        "url":     "/\(screenName.lowercased().replacingOccurrences(of: " ", with: "-"))",
        "os":      UIDevice.current.systemName + " " + UIDevice.current.systemVersion,
        "device":  UIDevice.current.model,
        "browser": "\(APP_NAME)/\(APP_VERSION)"
    ]
    sendToUmami(type: "event", payload: payload)
}

// Call this for any custom action (button tap, purchase, error, etc.)
func trackEvent(_ name: String, properties: [String: Any] = [:]) {
    let payload: [String: Any] = [
        "website": WEBSITE_ID,
        "name":    name,
        "data":    properties,
        "os":      UIDevice.current.systemName + " " + UIDevice.current.systemVersion,
        "device":  UIDevice.current.model,
        "browser": "\(APP_NAME)/\(APP_VERSION)"
    ]
    sendToUmami(type: "event", payload: payload)
}

// Identify a logged-in user (call after login or when user ID is known)
func identifyUser(_ userId: String, properties: [String: Any] = [:]) {
    var data = properties
    data["appVersion"] = APP_VERSION
    let payload: [String: Any] = [
        "website": WEBSITE_ID,
        "id":      userId,
        "data":    data
    ]
    sendToUmami(type: "identify", payload: payload)
}

// Internal sender — you do not need to call this directly
private func sendToUmami(type: String, payload: [String: Any]) {
    guard let url = URL(string: "\(UMAMI_URL)/api/send") else { return }
    var request = URLRequest(url: url)
    request.httpMethod  = "POST"
    request.setValue("application/json", forHTTPHeaderField: "Content-Type")
    request.httpBody    = try? JSONSerialization.data(withJSONObject: ["type": type, "payload": payload])
    URLSession.shared.dataTask(with: request).resume()
}
```

---

## 2. What Each Dashboard Screen Needs

### Overview (main screen)

| Metric | What it shows | What to send |
|--------|--------------|--------------|
| Visitors | Unique devices | Any event — automatic |
| Sessions | App opens / sessions | Any event — automatic |
| Events | Total interactions | Any event — automatic |
| Avg Session Duration | Time in app | Any events over time — automatic |

**Screens panel** — shows which screens users visit most.
→ Requires `url` in the payload. `trackScreen("Home")` handles this automatically.

**Events panel** — shows top event names.
→ Requires `name` in the payload. `trackEvent("button_tapped")` handles this automatically.

**Environment panel** — shows device type, iOS version, app name/version.
→ Requires `device`, `os`, and `browser` fields. Both helper functions include these automatically.

**Location panel** — shows countries and cities.
→ Automatic — derived from the IP address of the request.

---

### Events screen

Shows a detailed list and chart of all custom events. No setup needed — fires automatically whenever you call `trackEvent()`.

**Useful properties to attach:**

```swift
trackEvent("purchase_completed", properties: [
    "amount":   49.99,
    "currency": "AUD",
    "plan":     "pro"
])

trackEvent("onboarding_step", properties: [
    "step":   3,
    "name":   "add_contact"
])
```

---

### Sessions screen

Shows individual user sessions with their device, location, and activity timeline. No setup needed — sessions are created automatically.

To link a session to a known user (so you can find them by ID), call `identifyUser()` after login:

```swift
identifyUser("user_123", properties: [
    "email": "jane@example.com",
    "plan":  "pro"
])
```

---

### Goals screen

Goals track how many users complete a specific action, shown as a conversion rate with a progress bar.

**To create a goal:**

1. Open your website in Umami
2. Click **Goals** in the left sidebar
3. Click **Add goal**
4. Fill in:
   - **Name** — e.g. "Completed Onboarding"
   - **Type** — choose one:
     - *Viewed screen* — matches a URL path (e.g. `/onboarding-complete`)
     - *Triggered event* — matches an event name (e.g. `onboarding_completed`)
   - **Value** — the exact path or event name to match
5. Click **Save**

**Viewed Screen goal example:**
Track how many users reach the home screen after launch.
→ Type: *Viewed screen* | Value: `/home`
→ Requires: `trackScreen("Home")` called when screen appears

**Triggered Event goal example:**
Track how many users complete a purchase.
→ Type: *Triggered event* | Value: `purchase_completed`
→ Requires: `trackEvent("purchase_completed")` called on success

---

### Funnels screen

Funnels show how many users progress through a sequence of steps and where they drop off.

**Example — Onboarding funnel:**

1. Open **Funnels** → **Add funnel**
2. Add steps in order:
   - Step 1: Type *Event*, Value: `onboarding_started`
   - Step 2: Type *Event*, Value: `profile_created`
   - Step 3: Type *Event*, Value: `first_action_completed`
3. Set a **window** (e.g. 24 hours — user must complete all steps within this time)

**What to send from Swift:**

```swift
// At start of onboarding
trackEvent("onboarding_started")

// After profile is saved
trackEvent("profile_created", properties: ["method": "email"])

// After first meaningful action
trackEvent("first_action_completed")
```

---

### Journeys screen

Journeys show the actual paths users take through your app — not a predefined funnel, but the real navigation sequences.

- No setup needed — automatically built from screen view and event data
- Use the **Views** toggle to see screen navigation paths
- Use the **Events** toggle to see custom event sequences
- Set **Steps** (2–7) to control how many steps to show

Requires: `trackScreen()` called on every screen for the Views mode to be useful.

---

### Retention screen

Shows how many users return to the app after their first visit, broken down by day (Day 1, Day 2, Day 7, Day 14, Day 28).

No setup needed — calculated automatically from session data. You need at least 2–4 weeks of data for this to be meaningful.

---

### Revenue screen

Tracks monetary transactions if your app processes payments.

**To log a revenue event, use this exact structure:**

```swift
trackEvent("revenue", properties: [
    "revenue":  49.99,
    "currency": "AUD"
])
```

Then in Umami → Revenue, select **AUD** as the currency to see totals, average order value, and trends.

---

### Breakdown screen

A flexible report — pick any combination of fields and see how they intersect. For example:

- Events broken down by OS version
- Screen views broken down by device type

No setup needed — uses your existing event data.

---

### Segments

Segments let you filter all dashboard data to a specific group of users. For example:

- Users on iOS 17+
- Users who triggered `purchase_completed`
- Users on iPad

Create a segment once (Segments page → Add segment), then select it from the filter bar on any screen.

---

## 3. Features Not Applicable to Apps

These screens are designed for web browsers and will not show data for native apps:

| Screen | Why it's empty |
|--------|---------------|
| **UTM** | Requires UTM parameters in URLs (web marketing links) |
| **Performance** | Requires Web Vitals measured by a browser (LCP, CLS, etc.) |
| **Attribution** | Requires click ID parameters from ad networks |
| **Replays** | Requires DOM recording from a web page |

---

## 4. Quick Reference — What to Call and When

| When | Call |
|------|------|
| Every screen appears | `trackScreen("ScreenName")` |
| User taps a button | `trackEvent("button_name")` |
| User completes a purchase | `trackEvent("purchase_completed", properties: ["amount": 9.99])` |
| User logs in | `identifyUser(userId)` |
| Onboarding step completed | `trackEvent("onboarding_step_N")` |
| Error occurs | `trackEvent("error", properties: ["code": "404", "screen": "home"])` |
| Feature used | `trackEvent("feature_used", properties: ["feature": "export"])` |

---

## 5. Finding Your Website ID

1. Log in to Umami
2. Go to **Settings → Websites**
3. Click your app (jobflo or warren)
4. Copy the **Website ID** shown on that page

Each app (jobflo, warren) has its own Website ID — use the correct one in each app's `WEBSITE_ID` constant.
