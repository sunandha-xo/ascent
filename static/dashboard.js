document.getElementById('generateBtn').addEventListener('click', generateRoadmap);

document.getElementById('careerInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        generateRoadmap();
    }
});

async function generateRoadmap() {
    const career = document.getElementById('careerInput').value.trim();
    
    if (!career) {
        alert('Please enter a career goal!');
        return;
    }

    document.getElementById('loading').classList.add('active');
    document.getElementById('roadmapSection').classList.remove('active');
    document.getElementById('generateBtn').disabled = true;

    try {
        const response = await fetch('/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ career: career })
        });

        const data = await response.json();
        
        document.getElementById('loading').classList.remove('active');
        document.getElementById('generateBtn').disabled = false;

        const htmlContent = marked.parse(data.roadmap);
        document.getElementById('output').innerHTML = htmlContent;
        document.getElementById('roadmapSection').classList.add('active');

        document.getElementById('roadmapSection').scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });

    } catch (error) {
        document.getElementById('loading').classList.remove('active');
        document.getElementById('generateBtn').disabled = false;
        document.getElementById('output').innerHTML = 
            `<div class="error">⚠️ Error: ${error.message}</div>`;
        document.getElementById('roadmapSection').classList.add('active');
    }
}

function downloadRoadmap() {
    const content = document.getElementById('output').innerText;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'career-roadmap.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}