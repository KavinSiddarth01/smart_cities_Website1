// State Management
let user = null;
let isDarkMode = false;
let isSignIn = true;
let anomalies = [
    {
        id: '1',
        type: 'high',
        title: 'Unusual Noise Spike Detected',
        location: 'Central Park',
        time: '2 minutes ago',
        description: 'Noise levels 45% above normal threshold. Possible event or gathering.'
    },
    {
        id: '2',
        type: 'medium',
        title: 'Traffic Congestion Alert',
        location: 'Main Street',
        time: '5 minutes ago',
        description: 'Traffic flow reduced to 22%. Estimated delay: 15-20 minutes.'
    },
    {
        id: '3',
        type: 'low',
        title: 'Crowd Density Increased',
        location: 'City Square',
        time: '8 minutes ago',
        description: 'Pedestrian traffic 120% above normal. Monitoring situation.'
    }
];

let trafficChart = null;
let chatMessages = [];

// Loading Screen
function initLoadingScreen() {
    const progress = document.getElementById('loading-progress');
    const percentage = document.getElementById('loading-percentage');
    const status = document.getElementById('loading-status');
    const loadingScreen = document.getElementById('loading-screen');
    
    let currentProgress = 0;
    
    // Create particles
    const particlesContainer = document.getElementById('loading-particles');
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 8px;
            height: 8px;
            background: #06b6d4;
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: particleFloat ${3 + Math.random() * 2}s ease-in-out infinite;
            animation-delay: ${Math.random() * 2}s;
            opacity: 0;
        `;
        particlesContainer.appendChild(particle);
    }
    
    const interval = setInterval(() => {
        currentProgress += 2;
        progress.style.width = currentProgress + '%';
        percentage.textContent = currentProgress + '%';
        
        if (currentProgress < 30) {
            status.textContent = 'Initializing sensors...';
        } else if (currentProgress < 60) {
            status.textContent = 'Connecting to data feeds...';
        } else if (currentProgress < 90) {
            status.textContent = 'Loading AI modules...';
        } else {
            status.textContent = 'Ready to launch!';
        }
        
        if (currentProgress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                loadingScreen.style.animation = 'fadeOut 0.5s ease forwards';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    document.getElementById('app').classList.remove('hidden');
                    showAuthModal();
                }, 500);
            }, 500);
        }
    }, 30);
}

// Auth Modal
function showAuthModal() {
    if (!user) {
        setTimeout(() => {
            document.getElementById('auth-modal').classList.remove('hidden');
        }, 500);
    }
}

function hideAuthModal() {
    document.getElementById('auth-modal').classList.add('hidden');
}

function toggleAuthMode() {
    isSignIn = !isSignIn;
    const title = document.getElementById('auth-title');
    const subtitle = document.getElementById('auth-subtitle');
    const btnText = document.getElementById('auth-btn-text');
    const toggleText = document.getElementById('toggle-text');
    const toggleBtn = document.getElementById('toggle-auth');
    const emailGroup = document.getElementById('email-group');
    
    if (isSignIn) {
        title.textContent = 'Welcome Back';
        subtitle.textContent = 'Sign in to access the command center';
        btnText.textContent = 'Sign In';
        toggleText.textContent = "Don't have an account?";
        toggleBtn.textContent = 'Sign Up';
        emailGroup.style.display = 'none';
    } else {
        title.textContent = 'Join Us';
        subtitle.textContent = 'Create your account to get started';
        btnText.textContent = 'Create Account';
        toggleText.textContent = 'Already have an account?';
        toggleBtn.textContent = 'Sign In';
        emailGroup.style.display = 'block';
    }
}

function handleAuth(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value || username + '@example.com';
    
    user = { username, email };
    updateUserProfile();
    hideAuthModal();
    
    // Reset form
    document.getElementById('auth-form').reset();
}

function updateUserProfile() {
    const userProfile = document.getElementById('user-profile');
    const signinBtn = document.getElementById('signin-btn');
    const userName = document.getElementById('user-name');
    const userEmail = document.getElementById('user-email');
    const mobileUserInfo = document.getElementById('mobile-user-info');
    const mobileUserName = document.getElementById('mobile-user-name');
    const mobileUserEmail = document.getElementById('mobile-user-email');
    const mobileLogoutBtn = document.getElementById('mobile-logout-btn');
    const mobileSigninBtn = document.getElementById('mobile-signin-btn');
    
    if (user) {
        userProfile.classList.remove('hidden');
        signinBtn.classList.add('hidden');
        userName.textContent = user.username;
        userEmail.textContent = user.email;
        
        mobileUserInfo.classList.remove('hidden');
        mobileUserName.textContent = user.username;
        mobileUserEmail.textContent = user.email;
        mobileLogoutBtn.classList.remove('hidden');
        mobileSigninBtn.classList.add('hidden');
    } else {
        userProfile.classList.add('hidden');
        signinBtn.classList.remove('hidden');
        
        mobileUserInfo.classList.add('hidden');
        mobileLogoutBtn.classList.add('hidden');
        mobileSigninBtn.classList.remove('hidden');
    }
}

function handleLogout() {
    user = null;
    updateUserProfile();
    showAuthModal();
}

// Theme Toggle
function toggleTheme() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark', isDarkMode);
    
    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');
    const mobileSunIcon = document.getElementById('mobile-sun-icon');
    const mobileMoonIcon = document.getElementById('mobile-moon-icon');
    const mobileThemeText = document.getElementById('mobile-theme-text');
    
    if (isDarkMode) {
        sunIcon.classList.remove('hidden');
        moonIcon.classList.add('hidden');
        mobileSunIcon.classList.remove('hidden');
        mobileMoonIcon.classList.add('hidden');
        mobileThemeText.textContent = 'Light Mode';
    } else {
        sunIcon.classList.add('hidden');
        moonIcon.classList.remove('hidden');
        mobileSunIcon.classList.add('hidden');
        mobileMoonIcon.classList.remove('hidden');
        mobileThemeText.textContent = 'Dark Mode';
    }
}

// Mobile Menu
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');
    const closeIcon = document.getElementById('close-icon');
    
    mobileMenu.classList.toggle('hidden');
    menuIcon.classList.toggle('hidden');
    closeIcon.classList.toggle('hidden');
}

// Anomalies
function renderAnomalies() {
    const list = document.getElementById('anomalies-list');
    const count = document.getElementById('anomaly-count');
    const section = document.getElementById('anomalies-section');
    
    if (anomalies.length === 0) {
        section.style.display = 'none';
        return;
    }
    
    section.style.display = 'block';
    count.textContent = `${anomalies.length} Active`;
    
    list.innerHTML = anomalies.map(anomaly => `
        <div class="anomaly-card ${anomaly.type}">
            <div class="anomaly-content">
                <div class="anomaly-icon ${anomaly.type}">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4m0 4h.01"/>
                    </svg>
                </div>
                <div class="anomaly-details">
                    <div class="anomaly-header">
                        <div>
                            <h4 class="anomaly-title">${anomaly.title}</h4>
                            <div class="anomaly-meta">
                                <span>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                                        <circle cx="12" cy="10" r="3"/>
                                    </svg>
                                    ${anomaly.location}
                                </span>
                                <span>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <circle cx="12" cy="12" r="10"/>
                                        <path d="M12 6v6l4 2"/>
                                    </svg>
                                    ${anomaly.time}
                                </span>
                            </div>
                        </div>
                        <button class="anomaly-close" onclick="dismissAnomaly('${anomaly.id}')">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>
                    <p class="anomaly-description">${anomaly.description}</p>
                </div>
            </div>
        </div>
    `).join('');
}

function dismissAnomaly(id) {
    anomalies = anomalies.filter(a => a.id !== id);
    renderAnomalies();
}

// City Map
function renderCityMap() {
    const map = document.getElementById('city-map');
    
    const sensors = [
        { id: 1, x: 20, y: 30, status: 'active', type: 'Traffic Camera' },
        { id: 2, x: 45, y: 25, status: 'alert', type: 'Air Quality Sensor' },
        { id: 3, x: 65, y: 40, status: 'active', type: 'Noise Monitor' },
        { id: 4, x: 30, y: 60, status: 'active', type: 'Crowd Density' },
        { id: 5, x: 75, y: 65, status: 'warning', type: 'Traffic Sensor' },
        { id: 6, x: 50, y: 75, status: 'active', type: 'Transit Monitor' },
    ];
    
    const statusColors = {
        active: 'linear-gradient(135deg, #10b981, #059669)',
        alert: 'linear-gradient(135deg, #ef4444, #f97316)',
        warning: 'linear-gradient(135deg, #f59e0b, #f97316)'
    };
    
    const statusPulseColors = {
        active: '#10b981',
        alert: '#ef4444',
        warning: '#f59e0b'
    };
    
    map.innerHTML = `
        <div class="map-grid"></div>
        <svg class="map-buildings" xmlns="http://www.w3.org/2000/svg">
            <rect x="10%" y="15%" width="15%" height="20%" fill="currentColor" class="text-blue-600" opacity="0.2"/>
            <rect x="30%" y="10%" width="20%" height="15%" fill="currentColor" class="text-purple-600" opacity="0.2"/>
            <rect x="55%" y="20%" width="18%" height="25%" fill="currentColor" class="text-indigo-600" opacity="0.2"/>
            <rect x="15%" y="45%" width="25%" height="18%" fill="currentColor" class="text-cyan-600" opacity="0.2"/>
            <rect x="45%" y="50%" width="15%" height="20%" fill="currentColor" class="text-blue-600" opacity="0.2"/>
            <rect x="65%" y="55%" width="20%" height="15%" fill="currentColor" class="text-purple-600" opacity="0.2"/>
        </svg>
        ${sensors.map((sensor, index) => `
            <div class="map-sensor" style="left: ${sensor.x}%; top: ${sensor.y}%; animation-delay: ${index * 0.1}s">
                <div class="sensor-pulse" style="background: ${statusPulseColors[sensor.status]}; filter: blur(8px);"></div>
                <div class="sensor-marker" style="background: ${statusColors[sensor.status]};">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        ${sensor.status === 'active' ? '<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>' :
                          sensor.status === 'alert' ? '<path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>' :
                          '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>'}
                    </svg>
                </div>
                <div class="sensor-tooltip">
                    ${sensor.type}
                    <div class="sensor-status">${sensor.status}</div>
                </div>
            </div>
        `).join('')}
        <div class="map-legend">
            <p>Sensor Status</p>
            <div class="legend-item">
                <div class="legend-dot" style="background: linear-gradient(135deg, #10b981, #059669);"></div>
                <span>Active</span>
            </div>
            <div class="legend-item">
                <div class="legend-dot" style="background: linear-gradient(135deg, #f59e0b, #f97316);"></div>
                <span>Warning</span>
            </div>
            <div class="legend-item">
                <div class="legend-dot" style="background: linear-gradient(135deg, #ef4444, #f97316);"></div>
                <span>Alert</span>
            </div>
        </div>
        <div class="map-stats">
            <div class="stats-header">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                </svg>
                <span>Live Monitoring</span>
            </div>
            <div class="stats-list">
                <div>Total Sensors: ${sensors.length}</div>
                <div style="color: #10b981;">Active: ${sensors.filter(s => s.status === 'active').length}</div>
                <div style="color: #ef4444;">Alerts: ${sensors.filter(s => s.status === 'alert').length}</div>
            </div>
        </div>
    `;
}

// Data Feed
function initDataFeed() {
    const feedTemplates = [
        { source: 'Traffic Monitor', messages: [
            'Main Street traffic flow increased to 78%',
            'Highway 101 congestion cleared',
            'Downtown Boulevard slowdown detected',
            '5th Avenue traffic normal',
            'Bridge traffic spike detected'
        ]},
        { source: 'Air Quality', messages: [
            'Downtown AQI improved to 65',
            'Industrial Zone pollution levels rising',
            'City Center air quality good',
            'East District AQI stable at 82',
            'Wind patterns improving air quality'
        ]},
        { source: 'Public Transit', messages: [
            'Metro Line A delay: 5 minutes',
            'Bus Route 12 on schedule',
            'Station capacity at 75%',
            'Route 34 experiencing delays',
            'Transit ridership up 12%'
        ]},
        { source: 'Social Media', messages: [
            'Event detected at Central Park',
            'Increased activity at City Square',
            'Traffic complaint spike on Main St',
            'Positive transit feedback',
            'Weather advisory trending'
        ]},
        { source: 'City Sensors', messages: [
            'Noise levels elevated at park',
            'Crowd density 120% at square',
            'Parking occupancy at 85%',
            'Street lighting optimal',
            'Temperature sensors nominal'
        ]}
    ];
    
    const trends = ['up', 'down', 'stable'];
    const trendIcons = {
        up: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: #10b981;"><path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>',
        down: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: #ef4444;"><path d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6"/></svg>',
        stable: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: #3b82f6;"><path d="M5 12h14"/></svg>'
    };
    
    function generateFeed() {
        const template = feedTemplates[Math.floor(Math.random() * feedTemplates.length)];
        const message = template.messages[Math.floor(Math.random() * template.messages.length)];
        const trend = trends[Math.floor(Math.random() * trends.length)];
        const time = new Date().toLocaleTimeString();
        
        return { source: template.source, message, trend, time };
    }
    
    function addFeed() {
        const feed = generateFeed();
        const feedList = document.getElementById('data-feed');
        
        const feedItem = document.createElement('div');
        feedItem.className = 'feed-item';
        feedItem.innerHTML = `
            <div class="feed-content">
                <div class="feed-trend">${trendIcons[feed.trend]}</div>
                <div class="feed-details">
                    <div class="feed-meta">
                        <span class="feed-source">${feed.source}</span>
                        <span class="feed-time">${feed.time}</span>
                    </div>
                    <p class="feed-message">${feed.message}</p>
                </div>
            </div>
        `;
        
        feedList.insertBefore(feedItem, feedList.firstChild);
        
        // Keep only last 10 items
        while (feedList.children.length > 10) {
            feedList.removeChild(feedList.lastChild);
        }
    }
    
    // Initial feeds
    for (let i = 0; i < 5; i++) {
        addFeed();
    }
    
    // Add new feed every 3-5 seconds
    setInterval(() => {
        addFeed();
    }, 3000 + Math.random() * 2000);
}

// Traffic Chart
function initTrafficChart() {
    const ctx = document.getElementById('traffic-chart').getContext('2d');
    
    // Generate initial data
    const now = new Date();
    const data = [];
    for (let i = 11; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 5 * 60000);
        data.push({
            time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            traffic: 40 + Math.random() * 40,
            airQuality: 50 + Math.random() * 30,
            transit: 60 + Math.random() * 25
        });
    }
    
    trafficChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map(d => d.time),
            datasets: [
                {
                    label: 'Traffic Flow',
                    data: data.map(d => d.traffic),
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Air Quality',
                    data: data.map(d => d.airQuality),
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Transit Capacity',
                    data: data.map(d => d.transit),
                    borderColor: '#8b5cf6',
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    fill: true,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        color: isDarkMode ? '#f9fafb' : '#111827'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: isDarkMode ? '#374151' : '#e5e7eb'
                    },
                    ticks: {
                        color: isDarkMode ? '#9ca3af' : '#6b7280'
                    }
                },
                x: {
                    grid: {
                        color: isDarkMode ? '#374151' : '#e5e7eb'
                    },
                    ticks: {
                        color: isDarkMode ? '#9ca3af' : '#6b7280'
                    }
                }
            }
        }
    });
    
    // Update chart every 5 seconds
    setInterval(() => {
        const newTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        trafficChart.data.labels.push(newTime);
        trafficChart.data.labels.shift();
        
        trafficChart.data.datasets.forEach((dataset, index) => {
            let newValue;
            if (index === 0) newValue = 40 + Math.random() * 40;
            else if (index === 1) newValue = 50 + Math.random() * 30;
            else newValue = 60 + Math.random() * 25;
            
            dataset.data.push(newValue);
            dataset.data.shift();
        });
        
        trafficChart.update('none');
    }, 5000);
}

// Chat
function initChat() {
    const initialMessage = {
        type: 'bot',
        content: "Hello! I'm your Urban Intelligence Copilot. I can help you with real-time city data, anomaly detection, traffic analysis, and more. What would you like to know?",
        time: new Date().toLocaleTimeString()
    };
    
    chatMessages.push(initialMessage);
    renderChatMessages();
}

function renderChatMessages() {
    const messagesContainer = document.getElementById('chat-messages');
    
    messagesContainer.innerHTML = chatMessages.map(msg => `
        <div class="chat-message ${msg.type}">
            <div class="message-avatar ${msg.type}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    ${msg.type === 'bot' 
                        ? '<rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4m-4 0h8"/>'
                        : '<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"/>'}
                </svg>
            </div>
            <div class="message-content">
                <div class="message-bubble ${msg.type}">
                    ${msg.content}
                </div>
                <div class="message-time">${msg.time}</div>
            </div>
        </div>
    `).join('');
    
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function simulateResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('traffic') || lowerMessage.includes('congestion')) {
        return "Based on current traffic data, the most congested routes are: Main Street (78% congestion), Highway 101 (65%), and Downtown Boulevard (72%). Traffic is expected to ease in approximately 45 minutes. Would you like me to suggest alternative routes?";
    } else if (lowerMessage.includes('air quality') || lowerMessage.includes('pollution')) {
        return "Current air quality index: Downtown area is at 85 (Moderate), Industrial Zone at 142 (Unhealthy for Sensitive Groups). Wind patterns suggest improvement in the next 3 hours. I recommend limiting outdoor activities in the Industrial Zone.";
    } else if (lowerMessage.includes('anomaly') || lowerMessage.includes('alert')) {
        return "I've detected 3 active anomalies: High noise levels in Central Park (unusual for this time), increased crowd density at City Square (120% above normal), and a traffic spike on 5th Avenue. All emergency services have been notified.";
    } else if (lowerMessage.includes('transit') || lowerMessage.includes('public transport')) {
        return "Current transit status: Metro Line A is running 5 minutes behind schedule due to signal maintenance. Bus routes 12 and 34 are experiencing delays. Overall ridership is at 85% capacity. Real-time updates are being monitored.";
    } else if (lowerMessage.includes('central park')) {
        return "Central Park current status: 1,247 people detected, noise levels at 78dB (15% above normal), air quality good (AQI: 45). There's an unusual noise spike reported - investigating possible event or gathering.";
    } else if (lowerMessage.includes('suggest') || lowerMessage.includes('recommend')) {
        return "Based on current data, I recommend: 1) Rerouting traffic from Main Street to Park Avenue (30% faster), 2) Deploying additional public transport on Route 12, 3) Monitoring Central Park noise levels. Would you like detailed action plans?";
    } else {
        return "I'm analyzing real-time data from 1,247 sensors, 47 traffic cameras, and multiple social media feeds across the city. I can provide insights on traffic patterns, air quality, public safety, transit efficiency, and anomaly detection. What specific area would you like me to focus on?";
    }
}

function sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message
    chatMessages.push({
        type: 'user',
        content: message,
        time: new Date().toLocaleTimeString()
    });
    
    input.value = '';
    renderChatMessages();
    
    // Show typing indicator
    const messagesContainer = document.getElementById('chat-messages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-message bot';
    typingDiv.innerHTML = `
        <div class="message-avatar bot">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="10" rx="2"/>
                <circle cx="12" cy="5" r="2"/>
                <path d="M12 7v4m-4 0h8"/>
            </svg>
        </div>
        <div class="message-content">
            <div class="message-bubble bot">
                <div class="typing-indicator">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        </div>
    `;
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Simulate bot response
    setTimeout(() => {
        messagesContainer.removeChild(typingDiv);
        
        chatMessages.push({
            type: 'bot',
            content: simulateResponse(message),
            time: new Date().toLocaleTimeString()
        });
        
        renderChatMessages();
    }, 1500);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initialize loading screen
    initLoadingScreen();
    
    // Auth modal events
    document.getElementById('modal-close').addEventListener('click', hideAuthModal);
    document.getElementById('toggle-auth').addEventListener('click', toggleAuthMode);
    document.getElementById('auth-form').addEventListener('submit', handleAuth);
    
    // Theme toggle events
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
    document.getElementById('mobile-theme-toggle').addEventListener('click', toggleTheme);
    
    // User profile events
    document.getElementById('logout-btn').addEventListener('click', handleLogout);
    document.getElementById('mobile-logout-btn').addEventListener('click', () => {
        handleLogout();
        toggleMobileMenu();
    });
    document.getElementById('signin-btn').addEventListener('click', showAuthModal);
    document.getElementById('mobile-signin-btn').addEventListener('click', () => {
        showAuthModal();
        toggleMobileMenu();
    });
    
    // Mobile menu
    document.getElementById('mobile-menu-btn').addEventListener('click', toggleMobileMenu);
    
    // Chat events
    document.getElementById('chat-send').addEventListener('click', sendMessage);
    document.getElementById('chat-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Initialize components
    setTimeout(() => {
        renderAnomalies();
        renderCityMap();
        initDataFeed();
        initTrafficChart();
        initChat();
    }, 2000);
});

// Add particle animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes particleFloat {
        0%, 100% {
            opacity: 0;
            transform: translateY(0);
        }
        50% {
            opacity: 0.7;
        }
        100% {
            transform: translateY(-100vh);
        }
    }
`;
document.head.appendChild(style);
