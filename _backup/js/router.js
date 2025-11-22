// Simple Router for DentLink SPA-style navigation

const router = {
    routes: {},
    currentRoute: null,

    init() {
        window.addEventListener('popstate', () => this.handleRoute());
        this.handleRoute();
    },

    register(path, handler) {
        this.routes[path] = handler;
    },

    navigate(path) {
        history.pushState(null, null, path);
        this.handleRoute();
    },

    handleRoute() {
        const path = window.location.pathname;
        this.currentRoute = path;

        if (this.routes[path]) {
            this.routes[path]();
        }
    },

    // Navigation with transition
    transitionTo(url) {
        // Add fade-out effect
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.3s ease';

        setTimeout(() => {
            window.location.href = url;
        }, 300);
    }
};

// Initialize router when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => router.init());
} else {
    router.init();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = router;
}
