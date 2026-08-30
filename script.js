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
