// Router - loads pages dynamically

(function() {
    const container = document.getElementById('mainContent');
    let currentScript = null;

    function loadPage() {
        const hash = window.location.hash.slice(1) || 'home';
        
        if (!container) {
            console.error('mainContent container not found');
            return;
        }

        // Clear container
        container.innerHTML = '';

        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${hash}`) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Remove previous page script
        if (currentScript) {
            currentScript.remove();
            currentScript = null;
        }

        // Load new page script
        currentScript = document.createElement('script');
        currentScript.src = `src/pages/${hash}.js`;
        
        currentScript.onload = function() {
            const initFunction = window[`init${capitalize(hash)}`];
            if (typeof initFunction === 'function') {
                initFunction(container);
            } else {
                console.error(`Init function not found for ${hash}`);
                container.innerHTML = `<h1 class="page-title">Error loading ${hash}</h1>`;
            }
        };

        currentScript.onerror = function() {
            console.error(`Failed to load page: ${hash}`);
            container.innerHTML = `<h1 class="page-title">Page not found</h1>`;
        };

        document.body.appendChild(currentScript);
    }

    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // Listen for hash changes
    window.addEventListener('hashchange', loadPage);
    
    // Load initial page
    window.addEventListener('DOMContentLoaded', loadPage);
    
    // If already loaded
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(loadPage, 0);
    }
})();