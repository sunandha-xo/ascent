from flask import Flask, render_template, request, jsonify, session, redirect, url_for
import os
import google.generativeai as genai
from dotenv import load_dotenv
from functools import wraps
import json
from datetime import datetime

# Load the API key from .env
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

app = Flask(__name__)
app.secret_key = 'your-secret-key-change-this-in-production'  # Change this!

# Simple user storage (in production, use a real database)
USERS_FILE = 'users.json'

def load_users():
    if os.path.exists(USERS_FILE):
        with open(USERS_FILE, 'r') as f:
            return json.load(f)
    return {}

def save_users(users):
    with open(USERS_FILE, 'w') as f:
        json.dump(users, f)

# Login required decorator
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user' not in session:
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

# Routes
@app.route("/")
def index():
    if 'user' in session:
        return redirect(url_for('dashboard'))
    return redirect(url_for('login'))

@app.route("/login")
def login():
    if 'user' in session:
        return redirect(url_for('dashboard'))
    return render_template("login.html")

@app.route("/signup")
def signup():
    if 'user' in session:
        return redirect(url_for('dashboard'))
    return render_template("signup.html")

@app.route("/api/signup", methods=["POST"])
def api_signup():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    
    if not username or not email or not password:
        return jsonify({"success": False, "message": "All fields are required"}), 400
    
    users = load_users()
    
    if username in users:
        return jsonify({"success": False, "message": "Username already exists"}), 400
    
    # Store user (in production, hash the password!)
    users[username] = {
        "email": email,
        "password": password,  # DON'T DO THIS IN PRODUCTION - hash it!
        "created_at": datetime.now().isoformat(),
        "submissions": [],
        "todos": [],
        "streak": 0
    }
    
    save_users(users)
    session['user'] = username
    
    return jsonify({"success": True, "message": "Account created successfully"})

@app.route("/api/login", methods=["POST"])
def api_login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    users = load_users()
    
    if username not in users:
        return jsonify({"success": False, "message": "Invalid username or password"}), 401
    
    if users[username]['password'] != password:
        return jsonify({"success": False, "message": "Invalid username or password"}), 401
    
    session['user'] = username
    return jsonify({"success": True, "message": "Login successful"})

@app.route("/logout")
def logout():
    session.pop('user', None)
    return redirect(url_for('login'))

@app.route("/dashboard")
@login_required
def dashboard():
    return render_template("dashboard.html", username=session['user'])

@app.route("/streaks")
@login_required
def streaks():
    return render_template("streaks.html", username=session['user'])

@app.route("/pomodoro")
@login_required
def pomodoro():
    return render_template("pomodoro.html", username=session['user'])

@app.route("/todos")
@login_required
def todos():
    return render_template("todos.html", username=session['user'])

@app.route("/submissions")
@login_required
def submissions():
    return render_template("submissions.html", username=session['user'])

@app.route("/generate", methods=["POST"])
@login_required
def generate():
    data = request.get_json()
    career_goal = data.get("career")

    prompt = f"""
Create a 6-month beginner-friendly roadmap to become a {career_goal}.
Include month-wise plan, weekly tasks, and 2 project ideas.
Format it clearly with bullets.
"""

    try:
        # List all available models
        available_models = []
        for model in genai.list_models():
            if 'generateContent' in model.supported_generation_methods:
                available_models.append(model.name)
        
        # Use the first available model
        if available_models:
            model_name = available_models[0]
            model = genai.GenerativeModel(model_name)
            response = model.generate_content(prompt)
            roadmap = response.text
        else:
            roadmap = "No models available for your API key."

    except Exception as e:
        roadmap = f"Error generating roadmap: {e}"

    return jsonify({"roadmap": roadmap})

@app.route("/api/user-data")
@login_required
def get_user_data():
    users = load_users()
    user_data = users.get(session['user'], {})
    return jsonify({
        "submissions": user_data.get("submissions", []),
        "todos": user_data.get("todos", []),
        "streak": user_data.get("streak", 0)
    })

@app.route("/api/save-user-data", methods=["POST"])
@login_required
def save_user_data():
    data = request.get_json()
    users = load_users()
    username = session['user']
    
    if username in users:
        users[username]['submissions'] = data.get('submissions', [])
        users[username]['todos'] = data.get('todos', [])
        users[username]['streak'] = data.get('streak', 0)
        save_users(users)
        return jsonify({"success": True})
    
    return jsonify({"success": False}), 400

if __name__ == "__main__":
    app.run(debug=True)