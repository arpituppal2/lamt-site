# LAMT Admin Guide

How to run the LAMT website day-to-day. No coding knowledge needed.

---

## Quick reference

| What you want to do | Where to go |
|---|---|
| Post or edit an announcement | `/admin` → Announcements tab |
| Change the schedule for tournament day | `/admin` → Schedule tab |
| Reply to a contact-form message | `/admin` → Messages tab |
| Answer live chat from students/parents | `/admin` → Live Chat tab |
| Copy the email subscriber list | `/admin` → Subscribers tab |
| Set the next tournament date (hero countdown) | `/admin` → Settings tab |
| Edit static page content (About, Rules, FAQ) | See "Editing pages" below |
| Delete a spam email from the subscriber list | `/admin` → Subscribers tab → Delete button |

---

## Accessing the admin panel

1. Go to **www.lamt.net/admin**
2. Type the admin password. Ask Arpit or another staff lead if you do not have it.
3. You will stay logged in for 12 hours.

The admin panel is hidden from Google and other search engines via `robots.txt`. It is not linked anywhere on the public site, so only people who know the URL can find it.

---

## Announcements tab

### Post a new announcement
1. Type an optional title and the body text.
2. Click **Post Update**.
3. The announcement appears on the `/live` page within 30 seconds.

### Edit an existing announcement
1. Find the announcement in the Posted Updates list.
2. Click **Edit**.
3. Change the title or body text.
4. Click **Save Changes**. The live page updates within 30 seconds.

### Delete an announcement
1. Click **Delete** next to the announcement.
2. It is removed immediately from the live page.

---

## Schedule tab

### Edit a schedule row
1. Find the row you want to change.
2. Edit the Start, End, Event, or Location fields.
3. If you change a time, you must add a **Delay Reason** (this note shows on the live page so contestants know why the schedule shifted).
4. Click **Save**.

### Add a new schedule row
1. Scroll to the bottom of the schedule list.
2. Click **Add Row**.
3. Fill in Start, End, Event, and Location.
4. Click **Create**.

### Delete a schedule row
1. Click **Delete** on the row.
2. Confirm the deletion.

The schedule syncs to the `/live` page within 30 seconds.

---

## Messages tab

Messages come from the "Message Staff" form on the live page (legacy) and are mostly superseded by the Live Chat tab. Keep an eye here for messages submitted before or after tournament day.

### Reply to a message
1. Type your reply in the text box under the message.
2. Click **Reply and Mark Resolved**. This opens your email client with the reply pre-filled and marks the message as resolved.

### Mark a message as pending or resolved
- Click **Mark Resolved** or **Mark Pending** to toggle the status.

### Delete a message (spam)
1. Click **Delete** next to the message.
2. Confirm the deletion. This is permanent.

---

## Live Chat tab

This is the real-time help desk for tournament day. Students and parents join the queue from the `/live` page, and you pick them up here.

### Help someone in the queue
1. The **Waiting Queue** section shows everyone in line, in order.
2. Click **Help This Person** to claim a chat.
3. The chat moves to the **Active Chats** section.
4. Type your reply in the text box and click **Send**.
5. The user sees your reply within a few seconds on their end.

### Close a chat
1. Click **Close Chat** on any active chat.
2. The user sees "This chat has ended." They can start a new one if needed.

### Tips
- The admin panel polls for new queue entries every 4 seconds, so you do not need to refresh.
- You can have multiple active chats at once.
- If you close the admin tab, active chats remain active. Reopen the tab and they will reappear.

---

## Subscribers tab

This is the email list for everyone who signed up via the homepage popup or the subscribe section.

### Copy the email list
1. Click **Copy N Emails**.
2. Paste into your email client's BCC field.

### Delete a subscriber (spam)
1. Find the email in the table.
2. Click **Delete**.
3. Confirm the deletion. The email is permanently removed from the list.

---

## Settings tab

This is where you configure the next tournament. Everything here updates the homepage automatically.

### Tournament Name
The display name shown on the homepage (e.g., "LAMT 2027"). Optional — if blank, the site uses the default.

### Tournament Date and Time
Set the exact date and time the tournament starts. This drives:
- The homepage hero countdown (counts down to zero)
- The "Tournament is Live" message that replaces the countdown when the time passes

### Registration Deadline
The date and time registration closes. After this time:
- The "Register on ContestDojo" button disappears
- The homepage shows "Registration is closed"

### Saving
Click **Save Settings**. The homepage updates within 30 seconds. You do not need to rebuild or redeploy the site.

---

## Editing static page content

Some content lives in code files, not the admin panel. To edit these, you need a GitHub account with access to the repo (`arpituppal2/lamt-site`).

### About page (staff list, mission, privacy policy)
- File: `app/about/page.tsx`
- Edit the `staffGroups` array to add or remove staff names.
- The privacy policy text is further down in the same file.

### FAQ page
- File: `app/faq/page.tsx`
- Edit the questions and answers directly in the JSX.

### Rules page
- File: `app/rules/page.tsx`
- Edit the rules text directly.

### Tournament page
- File: `app/tournament/page.tsx`
- Edit the tournament description, format, and prize info.

### Live page venues and help items
- File: `app/live/page.tsx`
- Edit the `VENUES` array (campus map links) and `HELP_ITEMS` array (Wi-Fi info, emergency contacts, accessibility notes).

### Default schedule (fallback)
- File: `app/live/types.ts`
- Edit `DEFAULT_SCHEDULE` for the schedule that shows before the database schedule loads. The admin-panel schedule overrides this at runtime.

### Homepage buttons
- File: `app/components/HomeClient.tsx`
- Edit the `registerUrl` and `discordUrl` props passed to `HomeClient` in `app/page.tsx`.

---

## Security notes

- **Rate limiting**: All public endpoints (subscribe, contact form, live chat, login) are rate-limited. Someone trying to spam or brute-force the password will be blocked automatically.
- **Admin password**: Stored as an environment variable on Railway. Change it by updating the `ADMIN_PASSWORD` variable in the Railway dashboard.
- **Crawlers**: `/admin` and `/live` are disallowed in `robots.txt` so they do not appear in Google search results.
- **Database**: All data is stored in a PostgreSQL database hosted on Railway with TLS encryption in transit. Backups are managed by Railway.

---

## Troubleshooting

### The admin panel shows "Sync issue" at the top
The backend is temporarily unreachable. It will retry automatically every 30 seconds. If it persists for more than 5 minutes, check the Railway dashboard for deployment status.

### Announcements or schedule not appearing on the live page
The live page polls every 30 seconds. Wait 30 seconds and refresh. If still missing, check the admin panel to confirm the data was saved.

### Live chat not updating
The admin polls every 4 seconds. If a new chat does not appear, refresh the page. If the problem persists, the backend may have restarted — it will recover on its own.

### I forgot the admin password
Contact Arpit Uppal. The password is stored in the Railway environment variables under `ADMIN_PASSWORD`.

---

## Architecture (for developers)

```
User browser  →  Vercel edge (www.lamt.net)  →  Railway app (Express + Next.js static)
                                                    ↓
                                               PostgreSQL (Railway)
```

- **Frontend**: Next.js 14 (App Router), compiled to static HTML and served by Express.
- **Backend**: Express.js server in `backend/src/index.js`, same process as frontend serving.
- **Database**: PostgreSQL on Railway. Schema auto-migrates on startup (`backend/schema.sql`, each statement run individually so one failure does not wipe others).
- **Deployment**: GitHub push triggers Railway Docker build (`Dockerfile`). Vercel serves the edge domain with rewrites to Railway (`vercel.json`).
- **Rate limiting**: In-memory sliding window in `backend/src/auth.js`. Keys per IP and email.
- **Sessions**: HMAC-signed cookies, 12-hour TTL. No server-side session store needed.

### Key files
| File | Purpose |
|---|---|
| `backend/src/index.js` | All API routes |
| `backend/src/auth.js` | Sessions, rate limiters, cookies |
| `backend/src/db.js` | PostgreSQL connection pool |
| `backend/schema.sql` | Database schema (auto-migrates) |
| `app/lib/api.ts` | Frontend API client |
| `app/admin/page.tsx` | Admin panel UI |
| `app/live/page.tsx` | Live tournament-day page |
| `app/components/HomeClient.tsx` | Homepage hero + countdown |
| `vercel.json` | Edge rewrites to Railway |
| `Dockerfile` | Railway build config |
