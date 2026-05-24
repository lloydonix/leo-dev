const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.2,
});

document.querySelectorAll('.icon, .fade-in-on-enter, .fade-left, .fade-right').forEach((element) => {
    observer.observe(element);
});

