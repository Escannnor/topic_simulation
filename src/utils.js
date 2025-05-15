// utils placeholder 

// Initialize dropdown functionality
function initializeDropdowns() {
    const dropdowns = document.querySelectorAll('.chapter-dropdown');
    
    dropdowns.forEach(dropdown => {
        const button = dropdown.querySelector('.chapter-btn');
        const content = dropdown.querySelector('.chapter-content');
        
        // Toggle dropdown on click
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = content.style.display === 'block';
            
            // Close all other dropdowns
            dropdowns.forEach(otherDropdown => {
                if (otherDropdown !== dropdown) {
                    otherDropdown.querySelector('.chapter-content').style.display = 'none';
                }
            });
            
            // Toggle current dropdown
            content.style.display = isOpen ? 'none' : 'block';
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target)) {
                content.style.display = 'none';
            }
        });
        
        // Prevent dropdown from closing when clicking inside
        content.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeDropdowns();
}); 