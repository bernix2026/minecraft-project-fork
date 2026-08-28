document.addEventListener('DOMContentLoaded', function() {
    // Check if page has scroll and adjust footer
    function adjustFooter() {
        const footer = document.querySelector('footer');
        if (document.body.scrollHeight <= window.innerHeight) {
            footer.style.position = 'fixed';
            footer.style.bottom = '0';
            footer.style.width = '100%';
        } else {
            footer.style.position = 'static';
        }
    }
    
    window.addEventListener('resize', adjustFooter);
    adjustFooter();
    
    // Scrolling Header Functionality
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
});

/* Missing global styles */
html, body {
    height: 100%;
    margin: 0;
    padding: 0;
    background: #0f0f0f;
    color: #ffffff;
}

body {
    font-family: 'Roboto', sans-serif;
    line-height: 1.6;
}

/* Missing container styles with proper text visibility */
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

/* Missing section styles */
.section {
    padding: 80px 0;
}

/* Missing heading styles */
h1, h2, h3, h4, h5, h6 {
    color: white;
    margin: 0 0 15px 0;
}

p {
    color: rgba(255, 255, 255, 0.8);
    margin: 0 0 15px 0;
    line-height: 1.6;
}

/* Missing footer styles */
footer {
    background: rgba(0, 0, 0, 0.8);
    padding: 30px 0;
    text-align: center;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}

footer p {
    color: rgba(255, 255, 255, 0.7);
    margin: 5px 0;
}

