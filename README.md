# 🏔️ Ascent - A Career Crafting Tool

![Ascent Banner](https://img.shields.io/badge/Ascent-Career%20Roadmap%20Generator-blueviolet)
![Python](https://img.shields.io/badge/Python-3.8+-blue)
![Flask](https://img.shields.io/badge/Flask-3.0-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

> AI-powered career roadmaps with gamified streak tracking and productivity tools

Built for **Next Byte Hacks January 2026** 🚀

## 🌟 Overview

Ascent is your complete learning companion that transforms career confusion into clear action. Using Google's Gemini AI, it generates personalized 6-month learning roadmaps for any tech career, then helps you execute with GitHub-style streak tracking, Pomodoro timers, and task management.

## ✨ Features

- 🤖 **AI Roadmap Generator** - Personalized learning paths powered by Gemini AI
- 🔥 **Streak Tracking** - GitHub-style contribution graph
- 📝 **Daily Submissions** - Document your learning journey
- ⏱️ **Pomodoro Timer** - Stay focused with proven time management
- ✅ **Task Management** - Organize your daily to-dos
- 🔐 **User Authentication** - Secure login system with data persistence

## 🚀 Quick Start

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)
- Google Gemini API key

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/YOUR-USERNAME/ascent.git
cd ascent
```

2. **Install dependencies:**
```bash
pip install flask google-generativeai python-dotenv
```

3. **Set up environment variables:**

Create a `.env` file in the root directory:
```
GEMINI_API_KEY=your_api_key_here
```

Get your API key from: [Google AI Studio](https://aistudio.google.com/app/apikey)

4. **Run the application:**
```bash
python app.py
```

5. **Open your browser:**
```
http://localhost:5000
```

## 📁 Project Structure
```
ascent/
├── app.py                 # Main Flask application
├── .env                   # API keys (not in repo)
├── users.json            # User data (auto-created)
├── templates/
│   ├── login.html
│   ├── signup.html
│   ├── dashboard.html
│   ├── streaks.html
│   ├── submissions.html
│   ├── pomodoro.html
│   └── todos.html
├── static/
│   ├── auth.css
│   ├── dashboard.css
│   ├── dashboard.js
│   └── streaks.js
└── README.md
```

## 🛠️ Built With

- **Backend:** Flask (Python)
- **AI:** Google Gemini API
- **Frontend:** HTML5, CSS3, JavaScript
- **Database:** JSON file storage
- **Authentication:** Flask sessions

## 🎯 How to Use

1. **Sign Up** - Create your account
2. **Generate Roadmap** - Enter your career goal (e.g., "Data Analyst")
3. **Track Progress** - Submit daily work to maintain your streak
4. **Stay Focused** - Use Pomodoro timer for deep work sessions
5. **Manage Tasks** - Organize daily to-dos from your roadmap

## 🔐 Security Notes

⚠️ **Important:** This is a hackathon demo project. For production use:
- Implement password hashing (bcrypt)
- Use a real database (PostgreSQL/MongoDB)
- Add CSRF protection
- Enable HTTPS
- Implement rate limiting

## 📝 License

This project is licensed under the MIT License - see below for details.
```
MIT License

Copyright (c) 2026 Sunandha S

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 🙏 Acknowledgments

- Built for **Next Byte Hacks January 2026**
- Powered by [Google Gemini AI](https://ai.google.dev/)
- Inspired by the struggle of navigating tech career paths

## 👨‍💻 Author

**[Sunandha S]**
- GitHub: [sunandha-xo] https://github.com/sunandha-xo

- Devpost: https://devpost.com/sunandhaselvaraj124?ref_content=user-portfolio&ref_feature=portfolio&ref_medium=global-nav

---



🏔️ **Start your climb to career success with Ascent today!**
