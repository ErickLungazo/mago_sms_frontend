# Mago TVTC - Frontend (React) Setup Guide

## Overview

This is a modern React 19 + Vite frontend for the Mago TVTC Student Management System. It integrates seamlessly with the Laravel API backend and includes role-based UI rendering.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Backend API running on `http://localhost:8000`

## Installation & Setup

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# This opens app at http://localhost:5173
```

## Project Structure

```
src/
├── api.js                 # Axios client configuration with auth interceptor
├── apiServices.js         # API service layer (all endpoints)
├── useAuth.js            # Custom React hooks (useAuth, useApi, useFormSubmit)
├── App.jsx               # Main app component with routing
├── Login.jsx             # Login page
├── main.jsx              # React entry point
├── index.css             # Global styles
├── pages/                # Full-page components
│   ├── CareerGuidance.jsx
│   ├── Counselling.jsx
│   └── Clubs.jsx
└── components/           # Reusable UI components (to be created)
```

## Key Features Implemented

### 1. **Authentication Flow**

- Login with email/password
- JWT token stored in localStorage
- Automatic token injection in all API requests
- Session persistence across page reloads

**Usage:**

```jsx
import { useAuth } from "./useAuth";

function MyComponent() {
  const { user, login, logout, hasRole, isAuthenticated } = useAuth();

  return (
    <div>
      {isAuthenticated ? (
        <>
          <p>Welcome, {user.name}!</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <p>Please log in</p>
      )}
    </div>
  );
}
```

### 2. **API Services**

All endpoints are wrapped in service objects for easy consumption.

**Usage:**

```jsx
import { studentService, surveyService } from './apiServices';

// Get all students
const students = await studentService.getAll({ per_page: 15, course_id: 1 });

// Create new student
const newStudent = await studentService.create({
  id: 'MG2024999',
  name: 'John Doe',
  course_id: 1,
  ...
});

// Submit public survey (kiosk mode)
const response = await surveyService.submit({
  student_id: 'MG2024001',
  satisfaction_rating: 'Happy',
  ...
});
```

### 3. **Custom Hooks**

#### useAuth Hook

```jsx
const { user, loading, error, login, logout, hasRole } = useAuth();

// Check if user has specific role
if (hasRole("career_officer")) {
  // Show career officer features
}

if (hasRole(["admin", "principal"])) {
  // Show admin features
}
```

#### useApi Hook (Data Fetching)

```jsx
const { data, loading, error, refetch } = useApi(() =>
  studentService.getAll({ status: "Active" }),
);

if (loading) return <div>Loading...</div>;
if (error) return <div>Error: {error}</div>;
return (
  <div>
    {data.map((s) => (
      <StudentRow key={s.id} student={s} />
    ))}
  </div>
);
```

#### useFormSubmit Hook (Form Handling)

```jsx
const { loading, error, submit } = useFormSubmit();

const handleSubmit = async (formData) => {
  const result = await submit(
    () => studentService.create(formData),
    (newStudent) => {
      console.log("Student created:", newStudent);
      refetchStudents();
    },
  );

  if (result.success) {
    // Show success message
  } else {
    // Show error: result.error, result.errors
  }
};
```

## API Response Handling

All API calls automatically handle responses in this format:

```json
{
  "success": true,
  "data": {...},
  "message": "..."
}
```

Errors:

```json
{
  "success": false,
  "message": "...",
  "errors": {
    "field": ["Error message"]
  }
}
```

## Building Components

### Role-Based Rendering

```jsx
function DashboardPage() {
  const { user, hasRole } = useAuth();

  return (
    <div>
      {hasRole("admin") && <AdminPanel />}
      {hasRole("career_officer") && <CareerOfficerPanel />}
      {hasRole("hod") && <HODPanel />}
      {hasRole("counsellor") && <CounsellorPanel />}
    </div>
  );
}
```

### Form Example with Validation

```jsx
import { useForm } from "react-hook-form";
import { studentService } from "./apiServices";
import { useFormSubmit } from "./useAuth";

function StudentForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { loading, error, submit } = useFormSubmit();

  const onSubmit = async (data) => {
    await submit(() => studentService.create(data));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("id", { required: "ID required" })} />
      {errors.id && <span>{errors.id.message}</span>}

      <input {...register("name", { required: "Name required" })} />
      {errors.name && <span>{errors.name.message}</span>}

      {error && <div className="error">{error.message}</div>}

      <button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Student"}
      </button>
    </form>
  );
}
```

### Data List with Search

```jsx
import { useState, useEffect } from "react";
import { studentService } from "./apiServices";
import { useApi } from "./useAuth";

function StudentsList() {
  const [params, setParams] = useState({ per_page: 15 });
  const { data, loading, error, refetch } = useApi(
    () => studentService.getAll(params),
    [params],
  );

  const handleSearch = (query) => {
    setParams({ ...params, search: query });
  };

  return (
    <div>
      <input
        placeholder="Search..."
        onChange={(e) => handleSearch(e.target.value)}
      />

      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}

      <table>
        <tbody>
          {data?.data?.map((student) => (
            <tr key={student.id}>
              <td>{student.id}</td>
              <td>{student.name}</td>
              <td>{student.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

### Charts with Recharts

```jsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { analyticsService } from "./apiServices";
import { useApi } from "./useAuth";

function AnalyticsDashboard() {
  const { data } = useApi(() => analyticsService.getCareerInsights());

  return (
    <div>
      <h2>Employment Rate: {data?.employment_rate}%</h2>

      <BarChart width={600} height={300} data={data?.departmental_stats}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="department" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="student_count" fill="#0a6e4e" />
      </BarChart>
    </div>
  );
}
```

## Styling

The app uses **Tailwind CSS** (configured in Vite). You can also use inline styles for component theming:

```jsx
const BRAND = "#0a6e4e";
const BRAND_LIGHT = "#e6f4ef";

<div style={{ background: BRAND_LIGHT, color: BRAND }}>Themed content</div>;
```

## Environment Variables

Create `.env` in the frontend root:

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_NAME=Mago TVTC
```

Access in code:

```jsx
const apiUrl = import.meta.env.VITE_API_BASE_URL;
```

## Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Lint code
npm run lint
```

## Common Issues

### CORS Errors

- Ensure backend `CORS` middleware is configured
- Check `.env` has correct `APP_URL`
- Backend should return proper CORS headers

### Auth Token Issues

- Check `localStorage.auth_token` in browser DevTools
- Verify token is being sent in `Authorization: Bearer <token>` header
- Token might have expired - re-login required

### API 404 Errors

- Verify backend is running on `http://localhost:8000`
- Check route definitions in `mago-backend/routes/api.php`
- Try the endpoint directly in Postman/Insomnia

## Next Steps

1. ✅ Authentication setup complete
2. ✅ API services layer ready
3. ✅ Custom hooks implemented
4. ⏳ Build component library (forms, tables, modals)
5. ⏳ Implement all page components (Students, Departments, etc.)
6. ⏳ Add role-based UI rendering
7. ⏳ Create dashboard with charts
8. ⏳ Implement satisfaction survey kiosk mode
9. ⏳ Add error boundaries and error handling
10. ⏳ Write component tests

## Testing the Integration

1. **Start Backend:** `cd mago-backend && composer dev`
2. **Start Frontend:** `cd mago-frontend && npm run dev`
3. **Login** with test credentials (seed data):
   - Email: `admin@mago.test`
   - Password: `password`
4. **Try CRUD operations** - they will sync with backend!

## File Structure to Create

Next components to build:

```
src/components/
├── StudentsList.jsx      # Display students with search/filter
├── StudentForm.jsx       # Create/edit student
├── DepartmentsList.jsx
├── CoursesList.jsx
├── SatisfactionSurvey.jsx # Public kiosk form
├── CareerGuidance.jsx     # Career officer dashboard
├── Counselling.jsx        # Counselling session tracker
├── Analytics.jsx          # Dashboard with charts
└── ProtectedRoute.jsx     # Role-based route protection
```

See `FRONTEND_COMPONENTS.md` for detailed component specs.
