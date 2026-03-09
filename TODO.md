# Classroom Feature Implementation TODO

## Current Status: Classroom feature is mostly implemented, needs integration updates

### Completed:
- ✅ SignUpPage - Role selector (Teacher/Student)
- ✅ CreateClassroomPage - Teachers create classrooms
- ✅ JoinClassroomPage - Students join classrooms
- ✅ TeacherDashboardPage - View submissions
- ✅ classroomService.ts - Firebase functions
- ✅ AuthContext.tsx - User role management

### TODO - Integration Updates:

1. [ ] **Update App.tsx** - Add routes for classroom pages
   - /create-classroom (Teacher only)
   - /join-classroom (Student only)
   - /classroom/:classroomId (Teacher: dashboard, Student: take quiz)
   - /teacher-dashboard/:classroomId (Teacher analytics)

2. [ ] **Update HomePage.tsx** - Role-specific buttons
   - Teachers: "Create Classroom" and "View Classrooms"
   - Students: "Join Classroom" and "My Classrooms"

3. [ ] **Update MainApp.tsx** - Role-based navigation
   - Teachers: Show "My Classrooms" instead of "Practice"
   - Students: Show "Join Classroom" alongside "Practice"

4. [ ] **Update FIRESTORE_SCHEMA.md** - Document classroom collections
   - classrooms collection
   - classroomSubmissions collection
   - classroomMembers collection (for tracking student-classroom relationships)

5. [ ] **Create Classroom.css** - Styling for classroom pages

## Implementation Order:
1. App.tsx (routes)
2. FIRESTORE_SCHEMA.md (documentation)
3. HomePage.tsx (role-specific UI)
4. MainApp.tsx (navigation updates)
5. Classroom.css (styling)

