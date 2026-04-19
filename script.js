// ===== ADVANCED NETWORK BACKGROUND ANIMATION =====
const canvas = document.getElementById('network-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Node {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 1;
        this.connections = [];
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

        this.x = Math.max(0, Math.min(canvas.width, this.x));
        this.y = Math.max(0, Math.min(canvas.height, this.y));
    }

    draw() {
        const isDark = document.documentElement.classList.contains('dark');
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? 'rgba(139, 92, 246, 0.6)' : 'rgba(99, 102, 241, 0.6)';
        ctx.fill();
    }
}

const nodeCount = Math.floor((canvas.width * canvas.height) / 15000);
const nodes = [];
for (let i = 0; i < nodeCount; i++) {
    nodes.push(new Node());
}

function drawConnections() {
    const isDark = document.documentElement.classList.contains('dark');
    const maxDistance = 150;

    for (let i = 0; i < nodes.length; i++) {
        nodes[i].connections = [];

        for (let j = i + 1; j < nodes.length; j++) {
            const dx = nodes[i].x - nodes[j].x;
            const dy = nodes[i].y - nodes[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < maxDistance) {
                nodes[i].connections.push(nodes[j]);

                const opacity = (1 - distance / maxDistance) * 0.3;
                ctx.beginPath();
                ctx.moveTo(nodes[i].x, nodes[i].y);
                ctx.lineTo(nodes[j].x, nodes[j].y);
                ctx.strokeStyle = isDark
                    ? `rgba(139, 92, 246, ${opacity})`
                    : `rgba(99, 102, 241, ${opacity})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    nodes.forEach(node => {
        node.update();
        node.draw();
    });

    drawConnections();
    requestAnimationFrame(animate);
}

animate();

// ===== MOBILE MENU =====
document.getElementById('menu-btn').addEventListener('click', function () {
    document.getElementById('mobile-menu').classList.toggle('hidden');
});

// ===== ACTIVE NAV LINK ON SCROLL =====
window.addEventListener('scroll', function () {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 300) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active-nav');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active-nav');
        }
    });
});

// ===== SMOOTH SCROLLING =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });

        if (!document.getElementById('mobile-menu').classList.contains('hidden')) {
            document.getElementById('mobile-menu').classList.add('hidden');
        }
    });
});

// ===== THEME TOGGLE =====
const themeToggle = document.getElementById('theme-toggle');
const themeToggleMobile = document.getElementById('theme-toggle-mobile');
const html = document.documentElement;

const currentTheme = localStorage.getItem('theme') || 'light';
if (currentTheme === 'dark') {
    html.classList.add('dark');
}

function toggleTheme() {
    html.classList.toggle('dark');
    const theme = html.classList.contains('dark') ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
}

themeToggle.addEventListener('click', toggleTheme);
themeToggleMobile.addEventListener('click', toggleTheme);

// ===== SCROLL PROGRESS INDICATOR =====
window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    document.getElementById('scroll-indicator').style.width = scrolled + '%';
});

// ===== INTERSECTION OBSERVER FADE-IN =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.card, .project-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ===== TYPING EFFECT =====
const heroTitle = document.querySelector('h1 .gradient-text');
if (heroTitle) {
    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    let i = 0;

    function typeWriter() {
        if (i < text.length) {
            heroTitle.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    }

    setTimeout(typeWriter, 500);
}
