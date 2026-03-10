# Classroom System - Complete Setup & Testing Guide

## ✅ What's Now Working

### 1. Teacher Registration
Teachers can now register with their own accounts:
- Go to Sign Up page
- Select "👩‍🏫 Teacher" role
- Enter email and password
- Account created with teacher role in Firestore

### 2. Create Classrooms
Teachers can create classrooms with unique join codes:
- Navigate to "My Classrooms" or click "Create Classroom"
- Enter classroom name (e.g., "Physics 101")
- System auto-generates 6-character code (e.g., "PHY201")
- Classroom appears in their list

### 3. Student Join Classrooms
Students can join teacher classrooms:
- Navigate to "Join Classroom"
- Enter the 6-character code from teacher
- Successfully joins and sees it in "My Classrooms"

### 4. Teacher Dashboard
Teachers can view all student submissions in their classroom:
- Click "View Details" on a classroom
- See:
  - Total submissions received
  - Average class score
  - Number of excellent/good/needs improvement submissions
  - Table with each student's answer, score, and submission date

## 🚀 Step-by-Step Testing

### Setup (One time only)

```bash
# 1. Navigate to project directory
cd d:\Project CEDT

# 2. Start the development environment
npm start  # or use your start script

# 3. In your browser, go to:
http://localhost:3000
```

### Test Flow - Teacher Path

```
1. Sign Up as Teacher
   → Go to /signup
   → Select "👩‍🏫 Teacher" button
   → Email: teacher@test.com
   → Password: test123456
   → Click "Sign Up with Email"

2. Create First Classroom
   → Click "My Classrooms" in navigation
   → Enter classroom name: "Test Class"
   → Click "Create Classroom"
   → ✅ See classroom created with a join code

3. View Classroom Details
   → Scroll down to see "Your Classrooms"
   → Click the classroom → "View Details" button
   → See empty teacher dashboard (no submissions yet)

4. Note the Join Code
   → You'll need this to test as student
   → It looks like: ABC123
```

### Test Flow - Student Path

```
1. Sign Up as Student (new browser or incognito window)
   → Go to /signup
   → Select "👨‍🎓 Student" button
   → Email: student@test.com
   → Password: test123456
   → Click "Sign Up with Email"

2. Join Classroom
   → Click "Join Classroom" in navigation
   → Enter the teacher's classroom code (e.g., PHY201)
   → Click "Join Classroom"
   → ✅ See classroom in "Your Classrooms"

3. Take a Quiz
   → Click "Practice" in navigation
   → Record an answer (voice or text)
   → Submit the answer
   → See AI analysis with score

4. Student's Answer Should Now Appear in Teacher Dashboard
```

### Verify Teacher Dashboard Shows Student Work

```
1. Switch back to teacher account (or new browser)
2. Go to /create-classroom
3. Click classroom → "View Details"
4. ✅ Should now see:
   - 1 submission received
   - Updated average score
   - Student answer in submissions table
```

## 🐛 Common Issues & Fixes

### Issue 1: "Permission denied" errors in console

**Cause:** Firestore rules not deployed or browser cache

**Fix:**
```bash
cd d:\Project CEDT
firebase deploy --only firestore:rules
# Then clear browser cache and reload
```

### Issue 2: Teachers can create classroom but it doesn't appear

**Cause:** Role not saved properly

**Fix:**
1. Check Firebase Console → Firestore → users collection
2. Verify your user document has `"role": "teacher"`
3. If not, delete account and re-register

### Issue 3: Student can't join classroom with code

**Cause:** Classroom code doesn't exist or typo

**Fix:**
1. Teacher should share exact code (case-sensitive)
2. Teacher should verify classroom is in "Your Classrooms" list
3. Code must be exactly 6 characters

### Issue 4: Teacher dashboard shows "You do not have permission"

**Cause:** Trying to view classroom that belongs to different teacher

**Fix:**
1. Make sure you're logged in as the classroom teacher
2. Copy the correct classroomId from your classroom URL
3. Sign out and sign back in if needed

## 📊 Database Structure Verification

To verify everything is set up correctly in Firestore:

### Check 1: User Documents
```
Firestore Console → Collections → users
Should have documents like:
{
  "email": "teacher@test.com",
  "role": "teacher",
  "createdAt": "2024-03-10..."
}
```

### Check 2: Classroom Documents
```
Firestore Console → Collections → classrooms
Should have documents like:
{
  "className": "Test Class",
  "classKey": "ABC123",
  "teacherId": "user-uid-from-auth",
  "students": ["student-uid-1", "student-uid-2"],
  "createdAt": "2024-03-10..."
}
```

### Check 3: Submission Documents
```
Firestore Console → Collections → classroomSubmissions
Should have documents like:
{
  "classroomId": "classroom-doc-id",
  "studentId": "student-uid",
  "questionText": "Question from quiz...",
  "userAnswer": "Student's response...",
  "score": 85,
  "submittedAt": "2024-03-10..."
}
```

## 📝 Next Steps

After successful testing:

1. **Test with Multiple Students**
   - Create more student accounts
   - Have each join the classroom
   - Submit different answers
   - Verify teacher dashboard shows all submissions

2. **Test Score Distribution**
   - Verify "Excellent" (80%+), "Good" (60-79%), and "Needs Improvement" (<60%) counts
   - Check average score calculation

3. **Test Role-Based Access**
   - Make sure students can't access teacher pages
   - Make sure teachers can't join classrooms
   - Verify appropriate error messages

4. **Deploy to Production** (when ready)
   ```bash
   npm run build
   firebase deploy
   ```

## 🎓 Using the System

### For Teachers
1. Create a classroom for each class/subject
2. Share the 6-character code with students
3. Students enter code to join
4. Monitor submissions and scores in dashboard
5. Provide feedback based on performance data

### For Students
1. Sign up with your account
2. Get classroom code from teacher
3. Join classroom
4. Complete quizzes within the classroom
5. Get AI feedback on your answers

## 📞 Support

If you encounter issues:
1. Check error messages in browser console (F12)
2. Look at this guide's "Common Issues" section
3. Verify Firestore rules are deployed: `firebase deploy --only firestore:rules`
4. Check user role is set correctly in Firestore users collection
