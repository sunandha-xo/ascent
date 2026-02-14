// Load user data
let submissions = [];
let currentGraphView = 'year';

async function loadUserData() {
    try {
        const response = await fetch('/api/user-data');
        const data = await response.json();
        submissions = data.submissions || [];
        
        updateStats();
        renderContributionGraph('year');
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

function updateStats() {
    const currentStreak = calculateStreak();
    const longestStreak = calculateLongestStreak();
    
    document.getElementById('streakDisplay').textContent = currentStreak;
    document.getElementById('submissionCount').textContent = submissions.length;
    document.getElementById('longestStreak').textContent = longestStreak;
}

function calculateStreak() {
    if (submissions.length === 0) return 0;
    
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < submissions.length; i++) {
        const submissionDate = new Date(submissions[i].date);
        submissionDate.setHours(0, 0, 0, 0);
        
        const diffTime = currentDate - submissionDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === streak) {
            streak++;
            currentDate.setDate(currentDate.getDate() - 1);
        } else {
            break;
        }
    }
    
    return streak;
}

function calculateLongestStreak() {
    if (submissions.length === 0) return 0;
    
    let maxStreak = 1;
    let currentStreak = 1;
    
    for (let i = 1; i < submissions.length; i++) {
        const prevDate = new Date(submissions[i - 1].date);
        const currDate = new Date(submissions[i].date);
        
        prevDate.setHours(0, 0, 0, 0);
        currDate.setHours(0, 0, 0, 0);
        
        const diffDays = Math.floor((prevDate - currDate) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
            currentStreak++;
            maxStreak = Math.max(maxStreak, currentStreak);
        } else {
            currentStreak = 1;
        }
    }
    
    return maxStreak;
}

function setGraphView(view) {
    currentGraphView = view;
    document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    renderContributionGraph(view);
}

function renderContributionGraph(view) {
    const graph = document.getElementById('contributionGraph');
    graph.innerHTML = '';
    
    const submissionMap = {};
    submissions.forEach(sub => {
        const date = new Date(sub.date);
        const dateKey = date.toDateString();
        submissionMap[dateKey] = true;
    });
    
    if (view === 'year') {
        renderYearView(graph, submissionMap);
    } else {
        renderMonthView(graph, submissionMap);
    }
}

function renderYearView(graph, submissionMap) {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 364);
    
    const dayOfWeek = startDate.getDay();
    startDate.setDate(startDate.getDate() - dayOfWeek);
    
    const weeksContainer = document.createElement('div');
    weeksContainer.style.display = 'flex';
    weeksContainer.style.gap = '3px';
    weeksContainer.style.position = 'relative';
    
    // Add month labels
    let lastMonth = -1;
    for (let week = 0; week < 53; week++) {
        const weekDate = new Date(startDate);
        weekDate.setDate(startDate.getDate() + (week * 7));
        const currentMonth = weekDate.getMonth();
        
        if (currentMonth !== lastMonth) {
            const label = document.createElement('span');
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            label.textContent = months[currentMonth];
            label.style.position = 'absolute';
            label.style.left = (week * 15) + 'px';
            label.style.top = '-20px';
            label.style.fontSize = '11px';
            label.style.fontWeight = '600';
            label.style.color = '#666';
            weeksContainer.appendChild(label);
            lastMonth = currentMonth;
        }
    }
    
    // Create weeks
    for (let week = 0; week < 53; week++) {
        const weekDiv = document.createElement('div');
        weekDiv.className = 'graph-week';
        
        for (let day = 0; day < 7; day++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + (week * 7) + day);
            
            if (currentDate <= today) {
                const dayDiv = createDaySquare(currentDate, submissionMap);
                weekDiv.appendChild(dayDiv);
            }
        }
        
        weeksContainer.appendChild(weekDiv);
    }
    
    graph.appendChild(weeksContainer);
}

function renderMonthView(graph, submissionMap) {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    const monthHeader = document.createElement('div');
    monthHeader.style.fontSize = '14px';
    monthHeader.style.fontWeight = '600';
    monthHeader.style.color = '#667eea';
    monthHeader.style.marginBottom = '15px';
    monthHeader.textContent = firstDay.toLocaleString('default', { month: 'long', year: 'numeric' });
    graph.appendChild(monthHeader);
    
    const weeksContainer = document.createElement('div');
    weeksContainer.style.display = 'flex';
    weeksContainer.style.gap = '3px';
    
    const startDate = new Date(firstDay);
    startDate.setDate(firstDay.getDate() - firstDay.getDay());
    
    const totalDays = Math.ceil((lastDay - startDate) / (1000 * 60 * 60 * 24)) + 7;
    const weeks = Math.ceil(totalDays / 7);
    
    for (let week = 0; week < weeks; week++) {
        const weekDiv = document.createElement('div');
        weekDiv.className = 'graph-week';
        
        for (let day = 0; day < 7; day++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + (week * 7) + day);
            
            if (currentDate >= firstDay && currentDate <= lastDay) {
                const dayDiv = createDaySquare(currentDate, submissionMap);
                weekDiv.appendChild(dayDiv);
            } else {
                const emptyDiv = document.createElement('div');
                emptyDiv.className = 'graph-day';
                emptyDiv.style.background = 'transparent';
                weekDiv.appendChild(emptyDiv);
            }
        }
        
        weeksContainer.appendChild(weekDiv);
    }
    
    graph.appendChild(weeksContainer);
}

function createDaySquare(date, submissionMap) {
    const dayDiv = document.createElement('div');
    dayDiv.className = 'graph-day';
    
    const dateKey = date.toDateString();
    const hasSubmission = submissionMap[dateKey];
    
    if (hasSubmission) {
        dayDiv.classList.add('level-3');
    } else {
        dayDiv.classList.add('level-0');
    }
    
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    dayDiv.title = `${dateStr}${hasSubmission ? ' - 1 submission' : ' - No submissions'}`;
    
    return dayDiv;
}

// Load data on page load
window.onload = loadUserData;