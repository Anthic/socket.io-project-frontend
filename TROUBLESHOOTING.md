# 🔧 Troubleshooting Guide - Registration 404 Error

## সমস্যা

Registration করতে গেলে এই error আসছে:

```json
{
  "success": false,
  "message": "API NOT FOUND!",
  "error": {
    "path": "/api/v1/auth/register",
    "message": "Your requested path is not found!"
  }
}
```

## কারণ

Frontend code ঠিক আছে এবং সঠিক endpoint (`/user/create-user`) use করছে। কিন্তু পুরনো JavaScript bundle browser cache-এ আটকে থাকতে পারে।

## ✅ সমাধান (ধাপে ধাপে করুন)

### Step 1: Development Server Restart করুন

```bash
# Frontend terminal বন্ধ করুন (Ctrl+C) এবং আবার চালু করুন
cd socket.io-frontend
npm run dev
```

### Step 2: Browser Hard Refresh করুন

- **Windows/Linux:** `Ctrl + Shift + R` বা `Ctrl + F5`
- **Mac:** `Cmd + Shift + R`

### Step 3: Browser Cache & Storage Clear করুন

1. Chrome/Edge DevTools খুলুন: `F12`
2. **Application** tab এ যান
3. **Storage** section এ:
   - ✅ Clear site data
   - ✅ Unregister service workers (যদি থাকে)
4. **Network** tab এ:
   - ✅ "Disable cache" চেক করুন

### Step 4: Incognito/Private Mode এ Test করুন

- **Chrome:** `Ctrl + Shift + N`
- **Firefox:** `Ctrl + Shift + P`
- নতুন Private window এ `http://localhost:3000/auth/register` open করুন

### Step 5: Console Check করুন

Registration form submit করার আগে:

1. Browser Console খুলুন (`F12` → Console tab)
2. Submit button এ click করুন
3. এই messages দেখুন:
   ```
   🔵 Calling API endpoint: /user/create-user
   🔵 Full URL: http://localhost:8000/api/v1/user/create-user
   ```
4. যদি ভুল endpoint দেখান তাহলে screenshot নিন

### Step 6: Backend Running আছে কিনা Check করুন

```bash
# Backend terminal এ
cd starter-pack
npm run dev

# এই message দেখা উচিত:
# Server running on port 8000
```

Backend health check:

```
http://localhost:8000/api/v1/health
```

## 🔍 Debug Information

যদি এখনও কাজ না করে, নিচের information collect করুন:

1. **Browser Console Log:**
   - Registration submit করার সময় কী messages আসে?
   - কোন endpoint এ request যাচ্ছে?

2. **Network Tab:**
   - DevTools → Network tab
   - Registration submit করুন
   - যে request fail হচ্ছে সেটায় click করুন
   - Request URL কী দেখাচ্ছে?

3. **Backend Terminal:**
   - Registration attempt এর সময় কোন log আসছে?

## 📝 Expected Behavior

✅ **Correct Flow:**

```
Frontend → POST /api/v1/user/create-user → Backend
Backend → Create User → Send OTP Email → Response
Frontend → Show "Check your email" message → Redirect to /auth/login
```

❌ **Incorrect Flow (Old Code):**

```
Frontend → POST /api/v1/auth/register → Backend
Backend → 404 Not Found (এই route নেই)
```

## 🎯 Quick Fix Script

যদি সব কিছু fail করে, এই commands run করুন:

```bash
# Frontend cleanup
cd socket.io-frontend
rm -rf .next
rm -rf node_modules/.cache
npm run dev

# অথবা Windows PowerShell এ:
cd socket.io-frontend
Remove-Item -Recurse -Force .next
Remove-Item -Recurse -Force node_modules\.cache -ErrorAction SilentlyContinue
npm run dev
```

## ✨ এখনও সমস্যা?

যদি উপরের সব step করার পরও কাজ না করে:

1. Screenshot নিন registration form এর
2. Browser Console এর screenshot নিন
3. Network tab এর failed request এর screenshot নিন
4. আমাকে জানান - আমি আরও investigate করব!
