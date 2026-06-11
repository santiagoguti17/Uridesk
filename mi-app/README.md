This is a [Next.js](https://nextjs.org) project for Uridesk.

## Project Structure

The app is organized to keep the landing page, modal logic, and global styles separated:

```txt
app/
	components/
		auth-modal.tsx
		home-page.tsx
	globals.css
	layout.tsx
	page.tsx
```

## Current Home

The home page now shows the Uridesk brand, placeholder informational content, and entry actions for registration and login. Both actions open a modal with:

- email and password fields
- password visibility toggle with an eye button
- confirm password field for registration
- a simple validation message when the passwords do not match

## Firebase Auth

The app now uses Firebase Authentication with Firestore profile writes after registration and login.

Create a `.env.local` file in `mi-app/` based on `.env.local.example` and fill in your Firebase web app values.

If Firebase gives you an `analytics` snippet with `getAnalytics`, you can ignore it for now. This app only needs Auth and Firestore. The `measurementId` is optional unless you also want Analytics.

Required Firebase Console steps:

1. Create or open your Firebase project.
2. Go to Authentication and enable the Email/Password provider.
3. Create a Web App in Project Settings and copy the config values into `.env.local`.
4. Make sure your Firestore database exists and use a single `users` collection for profile documents.
5. If you use Firestore rules, allow authenticated users to read/write only their own profile document.

Important: do not store passwords in Firestore. Firebase Authentication already handles password storage and verification securely.

The app writes a document to `users/{uid}` on register and updates the same document on login.

## Firestore Rules

Add rules like these in Firebase Console and publish them:

```txt
rules_version = '2';

service cloud.firestore {
	match /databases/{database}/documents {
		match /users/{userId} {
			allow create: if request.auth != null && request.auth.uid == userId;
			allow read, update, delete: if request.auth != null && request.auth.uid == userId;
		}
	}
}
```

These rules keep each user isolated to their own profile document.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
