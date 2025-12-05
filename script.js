// ===================================
// Portfolio - JavaScript
// Dynamic GitHub Projects & Scroll Animations
// ===================================

// GitHub Configuration
const GITHUB_USERNAME = 'thinkmoving';
const GITHUB_API_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos`;

// Language color mapping
const LANGUAGE_COLORS = {
  'JavaScript': '#f7df1e',
  'TypeScript': '#3178c6',
  'Python': '#3776ab',
  'PHP': '#777bb4',
  'Java': '#b07219',
  'CSS': '#563d7c',
  'HTML': '#e34c26',
  'C++': '#f34b7d',
  'C': '#555555',
  'Ruby': '#cc342d',
  'Go': '#00add8',
  'Rust': '#dea584',
  'Swift': '#ffac45',
  'Kotlin': '#a97bff',
  'default': '#8b949e'
};

// Project icons mapping
const PROJECT_ICONS = {
  'Face': '🤖',
  'face': '🤖',
  'Recognition': '👤',
  'Graph': '📊',
  'Music': '🎵',
  'music': '🎵',
  'Spotify': '🎧',
  'spotify': '🎧',
  'Dashboard': '📱',
  'dashboard': '📱',
  'Todo': '✅',
  'Site': '🌐',
  'site': '🌐',
  'Military': '🎖️',
  'Portfolio': '💼',
  'portfolio': '💼',
  'default': '📦'
};

// ===================================
// Scroll Animation System
// ===================================

// Intersection Observer for scroll animations
const observerOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px'
};

const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-in');

      // Trigger staggered animations for children
      const children = entry.target.querySelectorAll('.stagger-item');
      children.forEach((child, index) => {
        setTimeout(() => {
          child.classList.add('animate-in');
        }, index * 100);
      });

      // Trigger number counting animation
      if (entry.target.classList.contains('stat-card')) {
        animateNumber(entry.target);
      }
    }
  });
}, observerOptions);

// Number counter animation
function animateNumber(element) {
  const numberElement = element.querySelector('.stat-number');
  if (!numberElement || numberElement.classList.contains('counted')) return;

  numberElement.classList.add('counted');
  const target = parseInt(numberElement.textContent);
  const duration = 2000;
  const increment = target / (duration / 16);
  let current = 0;

  const updateNumber = () => {
    current += increment;
    if (current < target) {
      numberElement.textContent = Math.floor(current) + '+';
      requestAnimationFrame(updateNumber);
    } else {
      numberElement.textContent = target + '+';
    }
  };

  updateNumber();
}

// ===================================
// Navigation Functions
// ===================================

// Toggle mobile menu
function toggleMenu() {
  const navLinks = document.getElementById('navLinks');
  if (navLinks) {
    navLinks.classList.toggle('show');
  }
}

// Close mobile menu when clicking a link
document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const navLinksElement = document.getElementById('navLinks');
      if (navLinksElement && navLinksElement.classList.contains('show')) {
        navLinksElement.classList.remove('show');
      }
    });
  });
});

// Navbar scroll effect with progress bar
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  const currentScroll = window.pageYOffset;

  if (currentScroll > 100) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Add scroll progress indicator
  const scrollProgress = (currentScroll / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
  let progressBar = document.querySelector('.scroll-progress');

  if (!progressBar) {
    progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    navbar.appendChild(progressBar);
  }

  progressBar.style.width = scrollProgress + '%';

  lastScroll = currentScroll;
});

// ===================================
// Theme Toggle Function
// ===================================

function toggleTheme() {
  const body = document.body;
  const themeIcon = document.querySelector('.theme-icon');

  // Toggle dark mode class
  body.classList.toggle('light-mode');

  // Update icon
  if (body.classList.contains('light-mode')) {
    themeIcon.textContent = '☀️';
  } else {
    themeIcon.textContent = '🌙';
  }

  // Save preference
  const isDarkMode = !body.classList.contains('light-mode');
  localStorage.setItem('darkMode', isDarkMode);
}

// Load saved theme preference
document.addEventListener('DOMContentLoaded', () => {
  const savedDarkMode = localStorage.getItem('darkMode');
  if (savedDarkMode === 'false') {
    document.body.classList.add('light-mode');
    const themeIcon = document.querySelector('.theme-icon');
    if (themeIcon) {
      themeIcon.textContent = '☀️';
    }
  }
});

// ===================================
// GitHub Projects Fetching
// ===================================

// Get project icon based on name
function getProjectIcon(name) {
  for (const [keyword, icon] of Object.entries(PROJECT_ICONS)) {
    if (name.includes(keyword)) {
      return icon;
    }
  }
  return PROJECT_ICONS.default;
}

// Get language color
function getLanguageColor(language) {
  return LANGUAGE_COLORS[language] || LANGUAGE_COLORS.default;
}

// Create project card HTML
function createProjectCard(repo) {
  const icon = getProjectIcon(repo.name);
  const languageColor = repo.language ? getLanguageColor(repo.language) : LANGUAGE_COLORS.default;
  const description = repo.description || 'A GitHub repository with no description provided.';

  // Format the project name (replace hyphens and underscores with spaces, capitalize)
  const formattedName = repo.name
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());

  return `
    <div class="project-card stagger-item">
      <div class="project-header">
        <div class="project-icon">${icon}</div>
        <h3>${formattedName}</h3>
      </div>
      <p class="project-description">${description}</p>
      <div class="project-meta">
        ${repo.language ? `
          <div class="project-language">
            <span class="language-dot" style="background-color: ${languageColor}"></span>
            <span>${repo.language}</span>
          </div>
        ` : ''}
        ${repo.stargazers_count > 0 ? `
          <div class="project-language">
            <span>⭐ ${repo.stargazers_count}</span>
          </div>
        ` : ''}
      </div>
      <div class="project-links">
        <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="project-link">
          View on GitHub
        </a>
        ${repo.homepage ? `
          <a href="${repo.homepage}" target="_blank" rel="noopener noreferrer" class="project-link">
            Live Demo
          </a>
        ` : ''}
      </div>
    </div>
  `;
}

// Fetch and display GitHub repositories
async function fetchGitHubProjects() {
  const projectsGrid = document.getElementById('projectsGrid');

  if (!projectsGrid) {
    console.error('Projects grid not found');
    return;
  }

  try {
    // Show loading spinner
    projectsGrid.innerHTML = `
      <div class="loading-spinner">
        <div class="spinner"></div>
        <p>Loading projects from GitHub...</p>
      </div>
    `;

    // Fetch repositories from GitHub API
    const response = await fetch(GITHUB_API_URL);

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const repos = await response.json();

    // Sort by updated date (most recent first) and filter out forks
    const sortedRepos = repos
      .filter(repo => !repo.fork)
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

    // Clear loading spinner
    projectsGrid.innerHTML = '';

    // Create and add project cards
    if (sortedRepos.length > 0) {
      sortedRepos.forEach((repo) => {
        const cardHTML = createProjectCard(repo);
        projectsGrid.innerHTML += cardHTML;
      });

      // Observe project cards for scroll animations
      setTimeout(() => {
        const projectCards = projectsGrid.querySelectorAll('.project-card');
        projectCards.forEach(card => scrollObserver.observe(card));
      }, 100);

      // Add "View All on GitHub" button
      const ctaButton = document.createElement('div');
      ctaButton.style.cssText = 'margin-top: 3rem; text-align: center;';
      ctaButton.innerHTML = `
        <a href="https://github.com/${GITHUB_USERNAME}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="display: inline-flex; align-items: center; gap: 0.75rem;">
          <svg viewBox="0 0 24 24" fill="currentColor" style="width: 20px; height: 20px;">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
          </svg>
          View All on GitHub
        </a>
      `;
      projectsGrid.parentElement.appendChild(ctaButton);

      // Update project count in stats
      const projectCount = document.getElementById('projectCount');
      if (projectCount) {
        projectCount.textContent = `${sortedRepos.length}`;
      }
    } else {
      projectsGrid.innerHTML = `
        <div class="loading-spinner">
          <p>No projects found</p>
        </div>
      `;
    }

  } catch (error) {
    console.error('Error fetching GitHub projects:', error);
    projectsGrid.innerHTML = `
      <div class="loading-spinner">
        <p style="color: var(--color-accent-secondary);">
          Unable to load projects. Please check back later.
        </p>
      </div>
    `;
  }
}

// ===================================
// Smooth Scrolling for Anchor Links
// ===================================

document.addEventListener('DOMContentLoaded', () => {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');

      // Skip if it's just '#' or empty
      if (!href || href === '#') return;

      const target = document.querySelector(href);

      if (target) {
        e.preventDefault();

        const navbarHeight = document.querySelector('.navbar').offsetHeight;
        const targetPosition = target.offsetTop - navbarHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
});

// ===================================
// Parallax Effect for Elements
// ===================================

window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;

  // Parallax for hero orbs
  const orbs = document.querySelectorAll('.gradient-orb');
  orbs.forEach((orb, index) => {
    const speed = 0.3 + (index * 0.15);
    const yPos = -(scrolled * speed);
    orb.style.transform = `translateY(${yPos}px)`;
  });

  // Parallax for section titles
  const sectionTitles = document.querySelectorAll('.section-title');
  sectionTitles.forEach(title => {
    const rect = title.getBoundingClientRect();
    const scrollPercent = rect.top / window.innerHeight;
    if (scrollPercent < 1 && scrollPercent > -1) {
      const translateY = (0.5 - scrollPercent) * 30;
      title.style.transform = `translateY(${translateY}px)`;
    }
  });
});

// ===================================
// Initialize Scroll Animations
// ===================================

document.addEventListener('DOMContentLoaded', () => {
  // Fetch GitHub projects
  fetchGitHubProjects();

  // Observe all sections and cards for scroll animations
  const elementsToAnimate = document.querySelectorAll(`
    .about,
    .skills,
    .projects,
    .contact,
    .skill-card,
    .stat-card,
    .contact-card,
    .about-text,
    .about-stats
  `);

  elementsToAnimate.forEach(element => {
    scrollObserver.observe(element);
  });

  // Add stagger-item class to skill cards and tags
  const skillCards = document.querySelectorAll('.skill-card');
  skillCards.forEach(card => {
    card.classList.add('stagger-item');
    const tags = card.querySelectorAll('.tag');
    tags.forEach(tag => tag.classList.add('stagger-item'));
  });

  // Add stagger-item class to stat cards
  const statCards = document.querySelectorAll('.stat-card');
  statCards.forEach(card => card.classList.add('stagger-item'));

  // Add stagger-item class to contact cards
  const contactCards = document.querySelectorAll('.contact-card');
  contactCards.forEach(card => card.classList.add('stagger-item'));
});

// ===================================
// Display current year in footer
// ===================================

document.addEventListener('DOMContentLoaded', () => {
  const year = new Date().getFullYear();
  const footerText = document.querySelector('.footer-content p');
  if (footerText) {
    footerText.innerHTML = `&copy; ${year} Fatima Abdi. All rights reserved.`;
  }
});

// ===================================
// Add active state to nav links on scroll
// ===================================

window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  let current = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;

    if (window.pageYOffset >= sectionTop - 200) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

// ===================================
// Mouse Trail Effect
// ===================================

document.addEventListener('mousemove', (e) => {
  const trail = document.createElement('div');
  trail.className = 'mouse-trail';
  trail.style.left = e.pageX + 'px';
  trail.style.top = e.pageY + 'px';

  document.body.appendChild(trail);

  setTimeout(() => {
    trail.remove();
  }, 1000);
});

// ===================================
// Typing Effect for Hero Subtitle
// ===================================

document.addEventListener('DOMContentLoaded', () => {
  const subtitle = document.querySelector('.hero-subtitle');
  if (subtitle) {
    const text = subtitle.textContent;
    subtitle.textContent = '';
    subtitle.style.opacity = '1';

    let index = 0;
    const typeSpeed = 100;

    setTimeout(() => {
      const typeWriter = () => {
        if (index < text.length) {
          subtitle.textContent += text.charAt(index);
          index++;
          setTimeout(typeWriter, typeSpeed);
        }
      };
      typeWriter();
    }, 1000);
  }
});
