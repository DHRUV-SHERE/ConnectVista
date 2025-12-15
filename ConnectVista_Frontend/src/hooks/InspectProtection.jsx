import { useEffect } from 'react';
import toast from 'react-hot-toast';

const InspectProtection = ({ children }) => {
  useEffect(() => {
    // Custom toast notification function
    const showNotification = (message) => {
      toast(message, {
        position: 'bottom-right',
        duration: 3000,
        style: {
          background: 'var(--accent-color)',
          color: 'white',
          fontSize: '14px',
          fontWeight: '500',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        },
        icon: '🔒',
      });
    };

    // Disable right-click
    const handleContextMenu = (e) => {
      showNotification('Right-click is disabled for security');
      e.preventDefault();
      return false;
    };

    // Disable keyboard shortcuts
    const handleKeyDown = (e) => {
      const disabledKeys = {
        'F12': 'Developer Tools',
        'I': e.ctrlKey && e.shiftKey ? 'Inspect Element' : false,
        'J': e.ctrlKey && e.shiftKey ? 'Browser Console' : false,
        'C': e.ctrlKey && e.shiftKey ? 'Inspect Element' : false,
        'U': e.ctrlKey ? 'View Source' : false,
        'u': e.ctrlKey ? 'View Source' : false,
        'S': e.ctrlKey ? 'Save Page' : false,
        's': e.ctrlKey ? 'Save Page' : false
      };

      if (disabledKeys[e.key] || (e.key in disabledKeys && disabledKeys[e.key])) {
        const action = disabledKeys[e.key] || 'This action';
        showNotification(`${action} is not allowed`);
        e.preventDefault();
        return false;
      }
    };

    // Detect devtools opening
    let devToolsOpen = false;
    let lastWidth = window.outerWidth;
    let lastHeight = window.outerHeight;
    
    const checkDevTools = () => {
      const widthThreshold = window.outerWidth - window.innerWidth > 160;
      const heightThreshold = window.outerHeight - window.innerHeight > 160;
      
      // Also check if window size changed significantly (devtools opened)
      const widthChanged = Math.abs(window.outerWidth - lastWidth) > 100;
      const heightChanged = Math.abs(window.outerHeight - lastHeight) > 100;
      
      if ((widthThreshold || heightThreshold || widthChanged || heightChanged) && !devToolsOpen) {
        devToolsOpen = true;
        showNotification('Developer tools detection active');
        
        // Optional: You can reload the page or redirect
        // setTimeout(() => window.location.reload(), 1000);
      }
      
      lastWidth = window.outerWidth;
      lastHeight = window.outerHeight;
    };

    // Check periodically for devtools
    const devToolsInterval = setInterval(checkDevTools, 500);

    // Prevent drag and drop of images and links
    const handleDragStart = (e) => {
      if (e.target.tagName === 'IMG' || e.target.tagName === 'A') {
        showNotification('Dragging content is disabled');
        e.preventDefault();
      }
    };

    // Prevent text selection on sensitive elements (optional)
    const handleSelectStart = (e) => {
      if (e.target.classList.contains('no-select')) {
        showNotification('Text selection is disabled');
        e.preventDefault();
      }
    };

    // Add all event listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('selectstart', handleSelectStart);

    // Clear console on load
    if (typeof console !== 'undefined') {
      console.log('%c🔒 Security Protection Active', 'color: #ef4444; font-size: 16px; font-weight: bold;');
      console.log('%cThis browser feature is protected for security reasons.', 'color: #6b7280;');
    }

    return () => {
      clearInterval(devToolsInterval);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('selectstart', handleSelectStart);
    };
  }, []);

  return children;
};

export default InspectProtection;