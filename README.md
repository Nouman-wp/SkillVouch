---

# 🌟 SkillVouch - Student Skill-Based Gig Marketplace

## About the Project

SkillVouch is a platform designed for college students to showcase their skills and connect with recruiters or startups for paid gigs. The idea is to create a space where students can build a solid profile, upload their GitHub contributions, apply for gigs, and get noticed by organizations. Recruiters can post gigs, view applicants, and download resumes directly from the platform.  

The goal is to help students land opportunities based on what they’re good at, making the hiring process easier and more skill-focused.

---

## Features

- Separate dashboards for **Students**, **Recruiters**, and **Organizations**
- **GitHub contributions** fetched directly from profile link
- **Resume upload & download** functionality
- Apply for gigs with just a click
- **User authentication** with Passport.js
- Simple and clean UI with **Bootstrap 5**
- Planned: AI-powered job suggestions
- Planned: LinkedIn posts and LeetCode profile proof integration
- In-progress: View applied jobs & recruiters' view of applicants

---

## Tech Stack

- **Frontend:** HTML, CSS, Bootstrap 5, EJS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** Passport.js (local strategy)
- **File Uploads:** Multer for handling resumes
- **APIs:** GitHub API (LinkedIn & LeetCode planned)
- **Charts:** Chart.js (for LeetCode visualizations later)

---

## Project Setup

1. **Clone the repo**
```bash
git clone https://github.com/your-username/SkillVouch.git
cd SkillVouch
```

2. **Install dependencies**
```bash
npm install
```

3. **Create a `.env` file**
```
PORT=3000
MONGO_URI=your_mongo_connection_string
SESSION_SECRET=your_session_secret
```

4. **Run the app**
```bash
node app.js
```
or
```bash
npx nodemon app.js
```

Visit `http://localhost:3000`

---

## Project Structure
```
/models      -> Database models (User, Gig, Application)
/routes      -> All routes (auth, user, gigs)
/views       -> EJS templates
/public      -> CSS, JS, images
/uploads     -> Resume files
app.js       -> Main server file
```

---

## Roadblocks / Challenges
- LinkedIn API integration is tough due to OAuth and access limitations
- LeetCode work-proof feature is still under testing
- AI recommendation takes time, working on it for later versions

---

## What’s Next
- Wrap up applied jobs view and recruiter’s applicant management
- Start integrating LinkedIn posts and LeetCode stats
- Polish the AI recommendations

