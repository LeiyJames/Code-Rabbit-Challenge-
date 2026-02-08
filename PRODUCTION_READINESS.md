# QA Test Flow – Production Readiness Review

## ✅ Ready for Production

| Area | Status | Notes |
|------|--------|------|
| **Auth** | ✅ | Supabase auth with sign in/sign up, session persistence |
| **RLS** | ✅ | Row-level security on `qa_projects` (select, insert, update, delete) |
| **Data isolation** | ✅ | All queries filter by `user_id` |
| **Project CRUD** | ✅ | Create, rename, delete, switch projects |
| **Error handling** | ✅ | Modal errors, sync error banner, console logging |
| **Logout** | ✅ | Saves before sign out, clears local state |

## ⚠️ Recommended Before Production

### 1. Add `.env` to `.gitignore`
Ensure `.env` is never committed (Supabase URL and anon key).

### 2. Remove/ignore debug scripts
- `check_data.js`, `diagnose.js`, `diagnose.ts`, `diagnose_query.js` – contain hardcoded Supabase credentials
- Add to `.gitignore` or delete before deploying

### 3. Supabase setup required
- Run the SQL in `SUPABASE_SETUP.md` in your Supabase project
- Add the `updated_at` trigger for correct behavior
- Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in production env

### 4. Signup email confirmation
- Supabase can require email confirmation on signup
- Consider showing a clear message: "Check your email to confirm"

## 📝 Optional Improvements

| Item | Priority | Effort |
|------|----------|--------|
| **Debounce persist** | Medium | Low – avoid many saves on rapid edits |
| **beforeunload** | Low | Only block when there are unsaved changes |
| **onBeforeRouteLeave** | Low | Allow navigation, or add "Save & leave" flow |
| **Replace `alert()`** | Low | Use toast/modal for import success/error |
| **Loading states** | Low | Skeleton/spinner for initial load |

## 🔒 Security Checklist

- [ ] `.env` in `.gitignore`
- [ ] No secrets in client code (anon key is public by design)
- [ ] RLS policies applied in Supabase
- [ ] Auth required for all data access

## 🚀 Deployment

1. Set production env vars for your hosting (Vercel, Netlify, etc.)
2. Ensure Supabase project is configured with RLS
3. Remove or exclude debug scripts from the build
