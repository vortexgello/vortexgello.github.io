document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.projects-grid');
    const buttons = document.querySelectorAll('.sort-btn');
    const cards = Array.from(document.querySelectorAll('.project-card'));

    function sortProjects(criterion) {
        const sortedCards = cards.sort((a, b) => {
            let valA, valB;

            if (criterion === 'date') {
                valA = new Date(a.getAttribute('data-date'));
                valB = new Date(b.getAttribute('data-date'));
                // Sort Date Descending (Newest first)
                return valB - valA;
            } else if (criterion === 'views') {
                valA = parseInt(a.getAttribute('data-views') || '0');
                valB = parseInt(b.getAttribute('data-views') || '0');
                // Sort Views Descending (Highest first)
                return valB - valA;
            }
        });

        // Re-append in new order
        grid.innerHTML = '';
        sortedCards.forEach(card => grid.appendChild(card));
    }

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            buttons.forEach(b => b.classList.remove('active'));
            // Add active to clicked
            btn.classList.add('active');

            // Sort
            const criterion = btn.getAttribute('data-sort');
            sortProjects(criterion);
        });
    });
});
