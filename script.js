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

const blogForm = document.getElementById('blog-form');
const formMessage = document.getElementById('form-message');
if (blogForm) {
    blogForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const title = blogForm.title.value.trim();
        const content = blogForm.content.value.trim();

        if (!title || !content) {
            formMessage.textContent = 'Please provide both a title and a blog post body.';
            return;
        }

        formMessage.textContent = 'Saving your post...';

        try {
            const response = await fetch('/api/blogs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, content }),
            });

            const result = await response.json();
            if (response.ok) {
                formMessage.textContent = 'Blog post saved successfully.';
                blogForm.reset();
            } else {
                formMessage.textContent = result.error || 'Failed to save the post.';
            }
        } catch (error) {
            formMessage.textContent = 'Unable to reach the server. Please try again later.';
            console.error(error);
        }
    });
}