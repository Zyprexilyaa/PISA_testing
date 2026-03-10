# Firestore Rules Deployment Guide

## Issue: Teacher Registration Not Working

Teachers couldn't register because Firestore security rules were either missing or set too restrictively. This prevented the app from writing user documents to the `users` collection.

## Solution: Apply Firestore Rules

### Step 1: Deploy Firestore Rules to Firebase

Run this command in your project root:

```bash
firebase deploy --only firestore:rules
```

**What this does:**
- Uploads the new `firestore.rules` file to your Firebase project
- Enables read/write access for authenticated users to their own data
- Allows teachers to create classrooms
- Allows students to access classrooms they've joined
- Allows classroom submissions to be tracked

### Step 2: Verify Rules Were Applied

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to Firestore Database → Rules tab
4. You should see the new rules displayed

### Step 3: Test Teacher Registration

Now teachers should be able to:
1. Click "Sign Up" button
2. Select "👩‍🏫 Teacher" role
3. Enter email and password
4. Successfully create their account

## Firestore Rules Overview

The new rules allow:

| Collection | Action | Allowed For |
|---|---|---|
| `users/{userId}` | Create/Read/Update | Account owner only |
| `classrooms/{id}` | Create | Teachers |
| `classrooms/{id}` | Read | Teacher (owner) OR Student (member) |
| `classrooms/{id}` | Update/Delete | Teacher (owner only) |
| `classroomSubmissions/{id}` | Create | Students |
| `classroomSubmissions/{id}` | Read | Student (owner) OR Teacher (owns classroom) |
| `propositions/{id}` | Read | Any authenticated user |
| `propositions/{id}` | Create/Update | Teachers |

## Troubleshooting

### Issue: "Permission denied" when creating classroom
- Verify that your user has `role: 'teacher'` in the `users` collection
- Check that you're logged in as a teacher account

### Issue: Teacher can't see student submissions
- Make sure student IDs are properly added to the `classrooms.students` array
- Verify that the `classroomSubmissions` documents have the correct `classroomId`

### Issue: Rules still not working
1. Clear your browser cache
2. Sign out and sign back in
3. Check Firebase Console for errors under Firestore Usage

## Next Steps

After deploying rules, test the full workflow:

1. **Create Teacher Account** → Sign up with teacher role
2. **Create Classroom** → Click "My Classrooms" → Create new classroom
3. **Share Code** → Copy the 6-character classroom code
4. **Create Student Account** → Sign up with student role
5. **Join Classroom** → Click "Join Classroom" → Enter code
6. **Submit Answer** → Click "Practice" or classroom quiz
7. **View Dashboard** → Teacher views student submissions
