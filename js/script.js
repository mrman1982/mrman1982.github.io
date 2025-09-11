document.addEventListener('DOMContentLoaded', () => {

    // Mobile Navigation Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (navToggle && mainNav) {
        const toggleMenu = () => {
            const open = !mainNav.classList.contains('active');
            mainNav.classList.toggle('active', open);
            navToggle.classList.toggle('is-active', open);
            document.body.classList.toggle('no-scroll', open);
        };

        navToggle.addEventListener('click', toggleMenu);

        // Close menu when a nav link is clicked (for single-page navigation)
        mainNav.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                navToggle.classList.remove('is-active');
                document.body.classList.remove('no-scroll');
            }
        });
    }

    // Contact Form Submission
    const contactForm = document.querySelector('#contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Get form data
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');

            // For demonstration purposes, we'll just log it to the console
            // In a real-world scenario, you would send this to a server.
            console.log('Form Submitted!');
            console.log(`Name: ${name}`);
            console.log(`Email: ${email}`);
            console.log(`Subject: ${subject}`);
            console.log(`Message: ${message}`);

            // Provide feedback to the user
            alert('Thank you for your message! I will get back to you soon.');

            // Clear the form
            contactForm.reset();
        });
    }

});
