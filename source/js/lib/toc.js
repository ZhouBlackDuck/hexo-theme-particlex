// TOC Sidebar with tocbot
mixins.toc = {
    data() {
        return {
            tocOpen: false
        };
    },
    mounted() {
        this.$nextTick(() => {
            this.initTocbot();
        });
    },
    methods: {
        initTocbot() {
            // Wait for content to be fully rendered
            const checkContent = setInterval(() => {
                const contentEl = document.querySelector('.article .content');
                if (contentEl && contentEl.innerHTML.trim() !== '') {
                    clearInterval(checkContent);
                    this.setupTocbot(contentEl);
                }
            }, 100);

            // Timeout after 5 seconds
            setTimeout(() => clearInterval(checkContent), 5000);
        },
        setupTocbot(contentEl) {
            // Check if there are any headings
            const headings = contentEl.querySelectorAll('h1, h2, h3, h4, h5, h6');
            if (headings.length === 0) {
                const sidebar = document.getElementById('toc-sidebar');
                if (sidebar) sidebar.style.display = 'none';
                return;
            }

            // Add IDs to headings if not present
            headings.forEach((heading, index) => {
                if (!heading.id) {
                    heading.id = `heading-${index}`;
                }
            });

            // Initialize tocbot
            tocbot.init({
                tocSelector: '.toc',
                contentSelector: '.article .content',
                headingSelector: 'h1, h2, h3, h4, h5',
                hasInnerContainers: true,
                scrollSmooth: true,
                scrollSmoothDuration: 300,
                scrollSmoothOffset: -80,
                headingsOffset: 80,
                collapseDepth: 3,
                orderedList: false,
                linkClass: 'toc-link',
                activeLinkClass: 'is-active-link',
                listClass: 'toc-list',
                listItemClass: 'toc-list-item',
                activeListItemClass: 'is-active-li',
            });

            // Handle escape key to close drawer
            this.handleEscapeKey();
            
            // Handle click on article to close drawer
            this.handleArticleClick();
        },
        handleEscapeKey() {
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.tocOpen) {
                    this.tocOpen = false;
                }
            });
        },
        handleArticleClick() {
            const article = document.querySelector('.article');
            if (article) {
                const closeToc = () => {
                    if (this.tocOpen) {
                        this.tocOpen = false;
                    }
                };
                article.addEventListener('click', closeToc);
                article.addEventListener('touchstart', closeToc, { passive: true });
            }
        }
    },
    beforeUnmount() {
        if (typeof tocbot !== 'undefined') {
            tocbot.destroy();
        }
    }
};
