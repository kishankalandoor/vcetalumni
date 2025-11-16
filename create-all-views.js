const fs = require('fs');
const path = require('path');

// Ensure directories exist
const dirs = [
  'views/newsfeed',
  'views/directory', 
  'views/jobs',
  'views/profile',
  'views/admin',
  'views/errors'
];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// View templates
const templates = {
  'views/newsfeed/index.ejs': `<%- include('../partials/navbar') %>
<div class="content-wrapper">
<%- include('../partials/flash') %>
<div class="container-fluid p-3">
    <div class="d-flex justify-content-between align-items-center mb-3">
        <h5 class="mb-0"><i class="bi bi-newspaper me-2"></i>Newsfeed</h5>
        <% if (user.role === 'alumni' || user.role === 'admin') { %>
            <a href="/newsfeed/create" class="btn btn-primary btn-sm">
                <i class="bi bi-plus-circle"></i>
            </a>
        <% } %>
    </div>
    <% if (posts && posts.length > 0) { %>
        <% posts.forEach(post => { %>
        <div class="post-card mb-3" data-post-id="<%= post.id %>">
            <div class="post-header">
                <a href="/profile/<%= post.user_id %>" class="text-decoration-none">
                    <div class="post-author">
                        <% if (post.profile_picture) { %>
                            <img src="/<%= post.profile_picture %>" alt="Profile">
                        <% } else { %>
                            <div class="avatar-placeholder"><%= post.name.charAt(0).toUpperCase() %></div>
                        <% } %>
                        <div>
                            <strong><%= post.name %></strong>
                            <%- getRoleBadge(post.role) %>
                            <small class="text-muted d-block"><%= timeAgo(post.created_at) %></small>
                        </div>
                    </div>
                </a>
            </div>
            <div class="post-content">
                <p><%= post.content %></p>
                <% if (post.image) { %>
                    <img src="/<%= post.image %>" alt="Post" class="post-image">
                <% } %>
            </div>
            <div class="post-footer">
                <button class="btn btn-sm btn-light like-btn" onclick="likePost(<%= post.id %>)">
                    <i class="bi bi-heart"></i> <span class="like-count"><%= post.likes_count %></span>
                </button>
                <button class="btn btn-sm btn-light"><i class="bi bi-chat"></i> Comment</button>
                <button class="btn btn-sm btn-light"><i class="bi bi-share"></i> Share</button>
            </div>
        </div>
        <% }); %>
    <% } else { %>
        <div class="empty-state">
            <i class="bi bi-inbox"></i>
            <p>No posts yet</p>
        </div>
    <% } %>
</div>
</div>
<%- include('../partials/bottom-nav') %>
<script>
function likePost(postId) {
    fetch('/api/like-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post_id: postId })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            const card = document.querySelector(\`[data-post-id="\${postId}"]\`);
            const likeCount = card.querySelector('.like-count');
            likeCount.textContent = data.likes_count;
            const likeBtn = card.querySelector('.like-btn i');
            likeBtn.classList.toggle('bi-heart');
            likeBtn.classList.toggle('bi-heart-fill');
            likeBtn.classList.toggle('text-danger');
        }
    });
}
</script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
<script src="/js/app.js"></script>`,

  'views/newsfeed/create.ejs': `<%- include('../partials/navbar') %>
<div class="content-wrapper">
<%- include('../partials/flash') %>
<div class="container-fluid p-3">
    <div class="d-flex align-items-center mb-3">
        <a href="/newsfeed" class="btn btn-sm btn-light me-2"><i class="bi bi-arrow-left"></i></a>
        <h5 class="mb-0">Create Post</h5>
    </div>
    <form method="POST" action="/newsfeed/create" enctype="multipart/form-data">
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <label class="form-label">What's on your mind?</label>
                    <textarea class="form-control" name="content" rows="5" 
                              placeholder="Share your thoughts..." required></textarea>
                </div>
                <div class="mb-3">
                    <label class="form-label">Post Type</label>
                    <select class="form-select" name="post_type">
                        <option value="update">General Update</option>
                        <option value="achievement">Achievement</option>
                        <option value="event">Event</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label class="form-label">Add Image (Optional)</label>
                    <input type="file" class="form-control" name="image" accept="image/*">
                    <small class="text-muted">JPG, PNG only. Max 5MB.</small>
                </div>
            </div>
        </div>
        <div class="d-grid gap-2">
            <button type="submit" class="btn btn-primary"><i class="bi bi-send me-2"></i>Post</button>
            <a href="/newsfeed" class="btn btn-outline-secondary">Cancel</a>
        </div>
    </form>
</div>
</div>
<%- include('../partials/bottom-nav') %>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>`,

  'views/directory/index.ejs': `<%- include('../partials/navbar') %>
<div class="content-wrapper">
<%- include('../partials/flash') %>
<div class="container-fluid p-3">
    <div class="section-header mb-3">
        <h5 class="mb-0"><i class="bi bi-people-fill me-2"></i>Alumni Directory</h5>
    </div>
    <form method="GET" class="mb-3">
        <div class="card">
            <div class="card-body">
                <div class="mb-3">
                    <div class="input-group">
                        <span class="input-group-text"><i class="bi bi-search"></i></span>
                        <input type="text" class="form-control" name="search" 
                               value="<%= filters.search || '' %>" placeholder="Search by name...">
                    </div>
                </div>
                <div class="row g-2">
                    <div class="col-6">
                        <select class="form-select form-select-sm" name="batch_year">
                            <option value="">All Years</option>
                            <% if (batchYears) batchYears.forEach(year => { %>
                                <option value="<%= year %>" <%= filters.batch_year == year ? 'selected' : '' %>><%= year %></option>
                            <% }); %>
                        </select>
                    </div>
                    <div class="col-6">
                        <select class="form-select form-select-sm" name="department">
                            <option value="">All Departments</option>
                            <% if (departments) departments.forEach(dept => { %>
                                <option value="<%= dept %>" <%= filters.department == dept ? 'selected' : '' %>><%= dept %></option>
                            <% }); %>
                        </select>
                    </div>
                </div>
                <div class="d-flex gap-2 mt-3">
                    <button type="submit" class="btn btn-primary btn-sm flex-fill"><i class="bi bi-search"></i> Search</button>
                    <a href="/directory" class="btn btn-outline-secondary btn-sm"><i class="bi bi-x-circle"></i></a>
                </div>
            </div>
        </div>
    </form>
    <div class="mb-3">
        <small class="text-muted"><i class="bi bi-info-circle me-1"></i>Found <%= alumni.length %> alumni</small>
    </div>
    <% if (alumni && alumni.length > 0) { %>
        <div class="row g-3">
            <% alumni.forEach(person => { %>
            <div class="col-12">
                <a href="/profile/<%= person.id %>" class="text-decoration-none">
                    <div class="alumni-card">
                        <div class="alumni-avatar">
                            <% if (person.profile_picture) { %>
                                <img src="/<%= person.profile_picture %>" alt="Profile">
                            <% } else { %>
                                <div class="avatar-placeholder"><%= person.name.charAt(0).toUpperCase() %></div>
                            <% } %>
                        </div>
                        <div class="alumni-info">
                            <h6 class="mb-1"><%= person.name %></h6>
                            <% if (person.designation && person.company) { %>
                                <p class="text-muted small mb-1"><%= person.designation %> at <%= person.company %></p>
                            <% } %>
                            <div class="d-flex gap-2 flex-wrap">
                                <% if (person.batch_year) { %>
                                    <span class="badge bg-light text-dark"><i class="bi bi-calendar3"></i> <%= person.batch_year %></span>
                                <% } %>
                                <% if (person.department) { %>
                                    <span class="badge bg-light text-dark"><i class="bi bi-book"></i> <%= person.department %></span>
                                <% } %>
                            </div>
                        </div>
                        <div class="alumni-arrow"><i class="bi bi-chevron-right"></i></div>
                    </div>
                </a>
            </div>
            <% }); %>
        </div>
    <% } else { %>
        <div class="empty-state">
            <i class="bi bi-search"></i>
            <p>No alumni found</p>
        </div>
    <% } %>
</div>
</div>
<%- include('../partials/bottom-nav') %>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>`,

  'views/jobs/index.ejs': `<%- include('../partials/navbar') %>
<div class="content-wrapper">
<%- include('../partials/flash') %>
<div class="container-fluid p-3">
    <div class="d-flex justify-content-between align-items-center mb-3">
        <h5 class="mb-0"><i class="bi bi-briefcase-fill me-2"></i>Job Opportunities</h5>
        <% if (user.role === 'alumni' || user.role === 'admin') { %>
            <a href="/jobs/create" class="btn btn-primary btn-sm"><i class="bi bi-plus-circle"></i></a>
        <% } %>
    </div>
    <form method="GET" class="mb-3">
        <div class="card">
            <div class="card-body">
                <div class="mb-3">
                    <input type="text" class="form-control" name="search" value="<%= filters.search || '' %>" 
                           placeholder="Search jobs...">
                </div>
                <div class="row g-2">
                    <div class="col-6">
                        <select class="form-select form-select-sm" name="job_type">
                            <option value="">All Types</option>
                            <option value="full-time" <%= filters.job_type == 'full-time' ? 'selected' : '' %>>Full-Time</option>
                            <option value="part-time" <%= filters.job_type == 'part-time' ? 'selected' : '' %>>Part-Time</option>
                            <option value="contract" <%= filters.job_type == 'contract' ? 'selected' : '' %>>Contract</option>
                            <option value="internship" <%= filters.job_type == 'internship' ? 'selected' : '' %>>Internship</option>
                        </select>
                    </div>
                    <div class="col-6">
                        <input type="text" class="form-control form-control-sm" name="location" 
                               value="<%= filters.location || '' %>" placeholder="Location">
                    </div>
                </div>
                <div class="d-flex gap-2 mt-3">
                    <button type="submit" class="btn btn-primary btn-sm flex-fill"><i class="bi bi-search"></i> Search</button>
                    <a href="/jobs" class="btn btn-outline-secondary btn-sm"><i class="bi bi-x-circle"></i></a>
                </div>
            </div>
        </div>
    </form>
    <div class="mb-3">
        <small class="text-muted"><i class="bi bi-info-circle me-1"></i>Found <%= jobs.length %> jobs</small>
    </div>
    <% if (jobs && jobs.length > 0) { %>
        <% jobs.forEach(job => { %>
        <div class="job-card mb-3">
            <div class="job-header">
                <div class="job-company-logo"><i class="bi bi-building"></i></div>
                <div class="job-info flex-fill">
                    <h6 class="mb-1"><%= job.job_title %></h6>
                    <p class="text-muted small mb-1"><i class="bi bi-building me-1"></i><%= job.company %></p>
                    <div class="d-flex gap-2 flex-wrap">
                        <span class="badge bg-light text-dark"><i class="bi bi-geo-alt"></i> <%= job.location %></span>
                        <span class="badge bg-primary"><%= job.job_type %></span>
                    </div>
                </div>
            </div>
            <div class="job-description">
                <p class="mb-2"><%= job.description.substring(0, 200) %>...</p>
                <small class="text-muted">Posted by <strong><%= job.posted_by %></strong> • <%= timeAgo(job.created_at) %></small>
            </div>
            <div class="job-actions">
                <% if (job.apply_link) { %>
                    <a href="<%= job.apply_link %>" target="_blank" class="btn btn-sm btn-primary">
                        <i class="bi bi-box-arrow-up-right me-1"></i>Apply Now
                    </a>
                <% } %>
            </div>
        </div>
        <% }); %>
    <% } else { %>
        <div class="empty-state">
            <i class="bi bi-briefcase"></i>
            <p>No job opportunities found</p>
        </div>
    <% } %>
</div>
</div>
<%- include('../partials/bottom-nav') %>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>`,

  'views/jobs/create.ejs': `<%- include('../partials/navbar') %>
<div class="content-wrapper">
<%- include('../partials/flash') %>
<div class="container-fluid p-3">
    <div class="d-flex align-items-center mb-3">
        <a href="/jobs" class="btn btn-sm btn-light me-2"><i class="bi bi-arrow-left"></i></a>
        <h5 class="mb-0">Post a Job</h5>
    </div>
    <form method="POST" action="/jobs/create">
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <label class="form-label">Job Title *</label>
                    <input type="text" class="form-control" name="job_title" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Company *</label>
                    <input type="text" class="form-control" name="company" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Location *</label>
                    <input type="text" class="form-control" name="location" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Job Type</label>
                    <select class="form-select" name="job_type">
                        <option value="full-time">Full-Time</option>
                        <option value="part-time">Part-Time</option>
                        <option value="contract">Contract</option>
                        <option value="internship">Internship</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label class="form-label">Job Description *</label>
                    <textarea class="form-control" name="description" rows="5" required></textarea>
                </div>
                <div class="mb-3">
                    <label class="form-label">Requirements</label>
                    <textarea class="form-control" name="requirements" rows="4"></textarea>
                </div>
                <div class="mb-3">
                    <label class="form-label">Application Link</label>
                    <input type="url" class="form-control" name="apply_link">
                </div>
                <div class="mb-3">
                    <label class="form-label">Salary Range</label>
                    <input type="text" class="form-control" name="salary_range" placeholder="₹10-15 LPA">
                </div>
            </div>
        </div>
        <div class="d-grid gap-2 mb-5">
            <button type="submit" class="btn btn-primary"><i class="bi bi-check-circle me-2"></i>Post Job</button>
            <a href="/jobs" class="btn btn-outline-secondary">Cancel</a>
        </div>
    </form>
</div>
</div>
<%- include('../partials/bottom-nav') %>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>`,

  'views/profile/view.ejs': `<%- include('../partials/navbar') %>
<div class="content-wrapper">
<%- include('../partials/flash') %>
<div class="container-fluid p-0">
    <div class="profile-header">
        <div class="profile-cover"></div>
        <div class="profile-info-container">
            <div class="profile-picture-wrapper">
                <% if (profile.profile_picture) { %>
                    <img src="/<%= profile.profile_picture %>" alt="Profile" class="profile-picture-large">
                <% } else { %>
                    <div class="profile-picture-placeholder"><%= profile.name.charAt(0).toUpperCase() %></div>
                <% } %>
            </div>
            <div class="profile-info-text">
                <h4 class="mb-1"><%= profile.name %></h4>
                <p class="text-muted small mb-2">
                    <%- getRoleBadge(profile.role) %>
                    <% if (profile.designation && profile.company) { %>
                        <br><%= profile.designation %> at <%= profile.company %>
                    <% } %>
                </p>
                <% if (isOwnProfile) { %>
                    <a href="/profile/edit/<%= profile.id %>" class="btn btn-sm btn-primary">
                        <i class="bi bi-pencil me-1"></i>Edit Profile
                    </a>
                <% } %>
            </div>
        </div>
    </div>
    <div class="p-3">
        <% if (profile.bio) { %>
        <div class="card mb-3">
            <div class="card-body">
                <h6 class="card-title"><i class="bi bi-person-lines-fill me-2"></i>About</h6>
                <p class="card-text"><%= profile.bio %></p>
            </div>
        </div>
        <% } %>
        <div class="card mb-3">
            <div class="card-body">
                <h6 class="card-title"><i class="bi bi-info-circle me-2"></i>Details</h6>
                <% if (profile.batch_year) { %>
                <div class="detail-item">
                    <i class="bi bi-calendar3"></i>
                    <div>
                        <small class="text-muted">Batch Year</small>
                        <div><%= profile.batch_year %></div>
                    </div>
                </div>
                <% } %>
                <% if (profile.department) { %>
                <div class="detail-item">
                    <i class="bi bi-book"></i>
                    <div>
                        <small class="text-muted">Department</small>
                        <div><%= profile.department %></div>
                    </div>
                </div>
                <% } %>
                <% if (profile.location) { %>
                <div class="detail-item">
                    <i class="bi bi-geo-alt"></i>
                    <div>
                        <small class="text-muted">Location</small>
                        <div><%= profile.location %></div>
                    </div>
                </div>
                <% } %>
            </div>
        </div>
    </div>
</div>
</div>
<%- include('../partials/bottom-nav') %>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>`,

  'views/profile/edit.ejs': `<%- include('../partials/navbar') %>
<div class="content-wrapper">
<%- include('../partials/flash') %>
<div class="container-fluid p-3">
    <div class="d-flex align-items-center mb-3">
        <a href="/profile/<%= profile.id %>" class="btn btn-sm btn-light me-2"><i class="bi bi-arrow-left"></i></a>
        <h5 class="mb-0">Edit Profile</h5>
    </div>
    <form method="POST" action="/profile/edit/<%= profile.id %>" enctype="multipart/form-data">
        <div class="card mb-3">
            <div class="card-body text-center">
                <% if (profile.profile_picture) { %>
                    <img src="/<%= profile.picture %>" alt="Profile" class="profile-picture-large mb-2">
                <% } else { %>
                    <div class="profile-picture-placeholder mb-2" style="width: 120px; height: 120px; margin: 0 auto;">
                        <%= profile.name.charAt(0).toUpperCase() %>
                    </div>
                <% } %>
                <label class="btn btn-primary btn-sm">
                    <i class="bi bi-camera me-1"></i>Change Photo
                    <input type="file" name="profile_picture" accept="image/*" class="d-none">
                </label>
            </div>
        </div>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <label class="form-label">Batch Year</label>
                    <select class="form-select" name="batch_year">
                        <option value="">Select Year</option>
                        <% for (let y = 2029; y >= 2000; y--) { %>
                            <option value="<%= y %>" <%= profile.batch_year == y ? 'selected' : '' %>><%= y %></option>
                        <% } %>
                    </select>
                </div>
                <div class="mb-3">
                    <label class="form-label">Department</label>
                    <input type="text" class="form-control" name="department" value="<%= profile.department || '' %>">
                </div>
                <div class="mb-3">
                    <label class="form-label">Company</label>
                    <input type="text" class="form-control" name="company" value="<%= profile.company || '' %>">
                </div>
                <div class="mb-3">
                    <label class="form-label">Designation</label>
                    <input type="text" class="form-control" name="designation" value="<%= profile.designation || '' %>">
                </div>
                <div class="mb-3">
                    <label class="form-label">Skills</label>
                    <input type="text" class="form-control" name="skills" value="<%= profile.skills || '' %>">
                </div>
                <div class="mb-3">
                    <label class="form-label">Bio</label>
                    <textarea class="form-control" name="bio" rows="4"><%= profile.bio || '' %></textarea>
                </div>
                <div class="mb-3">
                    <label class="form-label">Location</label>
                    <input type="text" class="form-control" name="location" value="<%= profile.location || '' %>">
                </div>
                <div class="mb-3">
                    <label class="form-label">Contact Email</label>
                    <input type="email" class="form-control" name="contact_email" value="<%= profile.contact_email || '' %>">
                </div>
                <div class="mb-3">
                    <label class="form-label">LinkedIn URL</label>
                    <input type="url" class="form-control" name="linkedin_url" value="<%= profile.linkedin_url || '' %>">
                </div>
                <div class="mb-3">
                    <label class="form-label">GitHub URL</label>
                    <input type="url" class="form-control" name="github_url" value="<%= profile.github_url || '' %>">
                </div>
            </div>
        </div>
        <div class="d-grid gap-2 mb-5">
            <button type="submit" class="btn btn-primary"><i class="bi bi-check-circle me-2"></i>Save Changes</button>
            <a href="/profile/<%= profile.id %>" class="btn btn-outline-secondary">Cancel</a>
        </div>
    </form>
</div>
</div>
<%- include('../partials/bottom-nav') %>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>`,

  'views/admin/dashboard.ejs': `<%- include('../partials/navbar') %>
<div class="content-wrapper">
<%- include('../partials/flash') %>
<div class="container-fluid p-3">
    <h5 class="mb-3"><i class="bi bi-gear-fill me-2"></i>Admin Dashboard</h5>
    <div class="row g-3 mb-3">
        <div class="col-6">
            <div class="stat-card bg-primary">
                <div class="stat-icon"><i class="bi bi-people"></i></div>
                <div class="stat-info">
                    <h3><%= stats.totalUsers %></h3>
                    <p>Total Users</p>
                </div>
            </div>
        </div>
        <div class="col-6">
            <div class="stat-card bg-success">
                <div class="stat-icon"><i class="bi bi-file-post"></i></div>
                <div class="stat-info">
                    <h3><%= stats.totalPosts %></h3>
                    <p>Total Posts</p>
                </div>
            </div>
        </div>
    </div>
    <% if (postsAwaitingApproval && postsAwaitingApproval.length > 0) { %>
    <h6 class="mb-2">Pending Posts</h6>
    <% postsAwaitingApproval.forEach(post => { %>
    <div class="card mb-2">
        <div class="card-body">
            <strong><%= post.name %></strong>
            <p class="mb-2"><%= post.content.substring(0, 100) %>...</p>
            <form method="POST" action="/admin/posts/<%= post.id %>/approve" style="display:inline;">
                <button type="submit" class="btn btn-sm btn-success">Approve</button>
            </form>
            <form method="POST" action="/admin/posts/<%= post.id %>/delete" style="display:inline;">
                <button type="submit" class="btn btn-sm btn-danger">Delete</button>
            </form>
        </div>
    </div>
    <% }); %>
    <% } %>
</div>
</div>
<%- include('../partials/bottom-nav') %>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>`,

  'views/errors/404.ejs': `<!DOCTYPE html>
<html>
<head>
    <title>404 - Page Not Found</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="d-flex align-items-center justify-content-center" style="min-height: 100vh; background: #f5f5f5;">
    <div class="text-center">
        <h1 class="display-1">404</h1>
        <p class="lead">Page Not Found</p>
        <a href="/" class="btn btn-primary">Go Home</a>
    </div>
</body>
</html>`,

  'views/errors/500.ejs': `<!DOCTYPE html>
<html>
<head>
    <title>500 - Server Error</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="d-flex align-items-center justify-content-center" style="min-height: 100vh; background: #f5f5f5;">
    <div class="text-center">
        <h1 class="display-1">500</h1>
        <p class="lead">Internal Server Error</p>
        <a href="/" class="btn btn-primary">Go Home</a>
    </div>
</body>
</html>`
};

// Write all files
Object.entries(templates).forEach(([file, content]) => {
  fs.writeFileSync(file, content);
  console.log(`✅ Created ${file}`);
});

console.log('\n🎉 All view templates created successfully!');
