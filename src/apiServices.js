import api from "./api";

// Student Service
export const studentService = {
  getAll: (params) => api.get("/students", { params }),
  get: (id) => api.get(`/students/${id}`),
  create: (data) => api.post("/students", data),
  update: (id, data) => api.put(`/students/${id}`, data),
  delete: (id) => api.delete(`/students/${id}`),
};

// Department Service
export const departmentService = {
  getAll: (params) => api.get("/departments", { params }),
  get: (id) => api.get(`/departments/${id}`),
  create: (data) => api.post("/departments", data),
  update: (id, data) => api.put(`/departments/${id}`, data),
  delete: (id) => api.delete(`/departments/${id}`),
};

// Course Service
export const courseService = {
  getAll: (params) => api.get("/courses", { params }),
  get: (id) => api.get(`/courses/${id}`),
  create: (data) => api.post("/courses", data),
  update: (id, data) => api.put(`/courses/${id}`, data),
  delete: (id) => api.delete(`/courses/${id}`),
};

// Staff Service
export const staffService = {
  getAll: (params) => api.get("/staff", { params }),
  get: (id) => api.get(`/staff/${id}`),
  create: (data) => api.post("/staff", data),
  update: (id, data) => api.put(`/staff/${id}`, data),
  delete: (id) => api.delete(`/staff/${id}`),
};

// Satisfaction Survey Service
export const surveyService = {
  getAll: (params) => api.get("/surveys", { params }),
  get: (id) => api.get(`/surveys/${id}`),
  submit: (data) => api.post("/satisfaction-surveys", data), // Public endpoint
  create: (data) => api.post("/surveys", data),
  update: (id, data) => api.put(`/surveys/${id}`, data),
  delete: (id) => api.delete(`/surveys/${id}`),
};

// Intervention Service
export const interventionService = {
  getAll: (params) => api.get("/interventions", { params }),
  get: (id) => api.get(`/interventions/${id}`),
  create: (data) => api.post("/interventions", data),
  update: (id, data) => api.put(`/interventions/${id}`, data),
  delete: (id) => api.delete(`/interventions/${id}`),
};

// Counselling Service
export const counsellingService = {
  getAll: (params) => api.get("/counselling", { params }),
  get: (id) => api.get(`/counselling/${id}`),
  create: (data) => api.post("/counselling", data),
  update: (id, data) => api.put(`/counselling/${id}`, data),
  delete: (id) => api.delete(`/counselling/${id}`),
};

// Job Placement Service
export const jobPlacementService = {
  getAll: (params) => api.get("/job-placements", { params }),
  get: (id) => api.get(`/job-placements/${id}`),
  create: (data) => api.post("/job-placements", data),
  update: (id, data) => api.put(`/job-placements/${id}`, data),
  delete: (id) => api.delete(`/job-placements/${id}`),
};

// Club Service
export const clubService = {
  getAll: (params) => api.get("/clubs", { params }),
  get: (id) => api.get(`/clubs/${id}`),
  create: (data) => api.post("/clubs", data),
  update: (id, data) => api.put(`/clubs/${id}`, data),
  delete: (id) => api.delete(`/clubs/${id}`),
};

// Analytics Service
export const analyticsService = {
  getCareerInsights: () => api.get("/analytics/career-insights"),
};

// Auth Service
export const authService = {
  login: (email, password) => api.post("/login", { email, password }),
  logout: () => api.post("/logout"),
  me: () => api.get("/me"),
};
