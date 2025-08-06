import React, { useEffect } from 'react';
import SidebarWidget from '../SidebarWidget';

// Approved domains that should be converted to sidebar widgets
const APPROVED_DOMAINS = [
  'kubernetes.io',
  'k8s.io',
  'helm.sh',
  'kustomize.io',
  'istio.io',
  'linkerd.io',
  'consul.io',
  'cert-manager.io',
  'knative.dev',
  'docs.aws.amazon.com',
  'aws.amazon.com',
  'prometheus.io',
  'grafana.com',
  'jaegertracing.io',
  'fluentd.org',
  'elastic.co',
  'opensearch.org',
  'argoproj.github.io',
  'tekton.dev',
  'jenkins.io',
  'spinnaker.io',
  'fluxcd.io',
  'docker.com',
  'docs.docker.com',
  'containerd.io',
  'cri-o.io',
  'podman.io',
  'vault.hashicorp.com',
  'terraform.io',
  'nomad.io',
  'docs.helm.sh',
  'kubectl.docs.kubernetes.io'
];

// Domains known to block iframe embedding (X-Frame-Options)
const IFRAME_BLOCKED_DOMAINS = [
  'docs.aws.amazon.com',
  'aws.amazon.com',
  'console.aws.amazon.com'
];

// Domain-specific configurations (relative sizing)
const DOMAIN_CONFIG = {
  'kubernetes.io': {
    widthRatio: 0.4,    // 40% of viewport width
    heightRatio: 0.75,  // 75% of viewport height
    titlePrefix: 'Kubernetes: '
  },
  'docs.aws.amazon.com': {
    widthRatio: 0.45,   // 45% of viewport width
    heightRatio: 0.8,   // 80% of viewport height
    titlePrefix: 'AWS: '
  },
  'helm.sh': {
    widthRatio: 0.35,   // 35% of viewport width
    heightRatio: 0.7,   // 70% of viewport height
    titlePrefix: 'Helm: '
  },
  'istio.io': {
    widthRatio: 0.4,
    heightRatio: 0.75,
    titlePrefix: 'Istio: '
  },
  'prometheus.io': {
    widthRatio: 0.35,
    heightRatio: 0.7,
    titlePrefix: 'Prometheus: '
  },
  'grafana.com': {
    widthRatio: 0.4,
    heightRatio: 0.75,
    titlePrefix: 'Grafana: '
  },
  'docker.com': {
    widthRatio: 0.35,
    heightRatio: 0.7,
    titlePrefix: 'Docker: '
  },
  'docs.docker.com': {
    widthRatio: 0.4,
    heightRatio: 0.75,
    titlePrefix: 'Docker: '
  }
};

const DEFAULT_CONFIG = {
  widthRatio: 0.35,   // 35% of viewport width
  heightRatio: 0.7,   // 70% of viewport height
  titlePrefix: ''
};

// Function to calculate responsive dimensions
function calculateDimensions(config) {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
  // Calculate base dimensions
  let width = Math.floor(viewportWidth * config.widthRatio);
  let height = Math.floor(viewportHeight * config.heightRatio);
  
  // Apply constraints based on screen size
  if (viewportWidth < 768) {
    // Mobile: use more of the screen
    width = Math.min(viewportWidth - 40, Math.max(300, width));
    height = Math.min(viewportHeight - 100, Math.max(400, height));
  } else if (viewportWidth < 1024) {
    // Tablet: moderate sizing
    width = Math.min(500, Math.max(350, width));
    height = Math.min(700, Math.max(500, height));
  } else {
    // Desktop: apply min/max constraints
    width = Math.min(800, Math.max(400, width));
    height = Math.min(900, Math.max(600, height));
  }
  
  return {
    width: width + 'px',
    height: height + 'px'
  };
}

function isApprovedDomain(url) {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    
    return APPROVED_DOMAINS.some(domain => {
      if (domain.includes('/')) {
        return url.toLowerCase().includes(domain.toLowerCase());
      }
      return hostname === domain || hostname.endsWith('.' + domain);
    });
  } catch (e) {
    return false;
  }
}

function isIframeBlocked(url) {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    
    return IFRAME_BLOCKED_DOMAINS.some(domain => 
      hostname === domain || hostname.endsWith('.' + domain)
    );
  } catch (e) {
    return false;
  }
}

function getDomainConfig(url) {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    
    for (const [domain, config] of Object.entries(DOMAIN_CONFIG)) {
      if (hostname === domain || hostname.endsWith('.' + domain)) {
        return config;
      }
    }
    
    return DEFAULT_CONFIG;
  } catch (e) {
    return DEFAULT_CONFIG;
  }
}

function generateTitle(linkText, url) {
  const config = getDomainConfig(url);
  
  if (linkText === url || linkText.startsWith('http')) {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/').filter(part => part);
      
      if (pathParts.length > 0) {
        const lastPart = pathParts[pathParts.length - 1];
        const title = lastPart.replace(/[-_]/g, ' ')
          .replace(/\b\w/g, l => l.toUpperCase());
        return config.titlePrefix + title;
      }
      
      return config.titlePrefix + urlObj.hostname;
    } catch (e) {
      return config.titlePrefix + 'External Resource';
    }
  }
  
  return config.titlePrefix + linkText;
}

// Function to get screen size category for debugging
function getScreenCategory() {
  const width = window.innerWidth;
  if (width < 768) return 'Mobile';
  if (width < 1024) return 'Tablet';
  return 'Desktop';
}

const AutoSidebarLinks = () => {
  useEffect(() => {
    const handleLinkClick = (event) => {
      const link = event.target.closest('a[href]');
      if (!link) return;
      
      const href = link.getAttribute('href');
      const linkText = link.textContent || href;
      
      // Skip if not an approved domain
      if (!isApprovedDomain(href)) {
        return;
      }
      
      // Skip if it's inside a SidebarWidget (avoid double processing)
      if (link.closest('.sidebar-widget-trigger')) {
        return;
      }
      
      // If domain blocks iframes, just open in new tab
      if (isIframeBlocked(href)) {
        event.preventDefault();
        event.stopPropagation();
        window.open(href, '_blank', 'noopener,noreferrer');
        return;
      }
      
      // Prevent default link behavior for sidebar-compatible sites
      event.preventDefault();
      event.stopPropagation();
      
      const config = getDomainConfig(href);
      const dimensions = calculateDimensions(config);
      const title = generateTitle(linkText, href);
      
      // Create and show the sidebar widget
      showSidebarWidget(href, title, config, dimensions);
    };
    
    const showSidebarWidget = (url, title, config, dimensions) => {
      // Remove any existing sidebar
      const existingSidebar = document.querySelector('.sidebar-widget-overlay');
      if (existingSidebar) {
        existingSidebar.remove();
      }
      
      // Create sidebar overlay
      const overlay = document.createElement('div');
      overlay.className = 'sidebar-widget-overlay';
      
      // Create sidebar container
      const container = document.createElement('div');
      container.className = 'sidebar-widget-container resizable';
      container.style.width = dimensions.width;
      container.style.height = dimensions.height;
      container.style.position = 'relative';
      
      // State variables
      let isPinned = false;
      let isExpanded = false;
      
      // Create header
      const header = document.createElement('div');
      header.className = 'sidebar-widget-header';
      header.style.cursor = 'move'; // Indicate draggable
      
      const titleElement = document.createElement('h3');
      titleElement.className = 'sidebar-widget-title';
      titleElement.textContent = title;
      
      // Add size info as a subtle indicator
      const sizeInfo = document.createElement('span');
      sizeInfo.className = 'sidebar-widget-size-info';
      sizeInfo.textContent = ` (${dimensions.width} × ${dimensions.height})`;
      sizeInfo.style.fontSize = '0.75em';
      sizeInfo.style.color = 'var(--ifm-color-content-secondary)';
      sizeInfo.style.fontWeight = 'normal';
      titleElement.appendChild(sizeInfo);
      
      const controls = document.createElement('div');
      controls.className = 'sidebar-widget-controls';
      
      // Pin button
      const pinBtn = document.createElement('button');
      pinBtn.className = 'sidebar-widget-control';
      pinBtn.innerHTML = '📌';
      pinBtn.title = 'Pin to side';
      pinBtn.onclick = () => {
        isPinned = !isPinned;
        if (isPinned) {
          overlay.classList.add('pinned');
          overlay.style.background = 'transparent';
          container.style.position = 'fixed';
          container.style.right = '20px';
          container.style.top = '80px';
          container.style.zIndex = '9999';
          container.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
          pinBtn.innerHTML = '📍';
          pinBtn.title = 'Unpin';
        } else {
          overlay.classList.remove('pinned');
          overlay.style.background = 'rgba(0, 0, 0, 0.5)';
          container.style.position = 'relative';
          container.style.right = 'auto';
          container.style.top = 'auto';
          container.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
          pinBtn.innerHTML = '📌';
          pinBtn.title = 'Pin to side';
        }
      };
      
      // Expand button
      const expandBtn = document.createElement('button');
      expandBtn.className = 'sidebar-widget-control';
      expandBtn.innerHTML = '⛶';
      expandBtn.title = 'Expand';
      expandBtn.onclick = () => {
        isExpanded = !isExpanded;
        if (isExpanded) {
          if (isPinned) {
            container.style.width = '60vw';
            container.style.height = '70vh';
          } else {
            overlay.classList.add('expanded');
            container.style.width = '80vw';
            container.style.height = '80vh';
          }
          expandBtn.innerHTML = '⛷';
          expandBtn.title = 'Minimize';
        } else {
          overlay.classList.remove('expanded');
          container.style.width = dimensions.width;
          container.style.height = dimensions.height;
          expandBtn.innerHTML = '⛶';
          expandBtn.title = 'Expand';
        }
      };
      
      // External link button
      const externalBtn = document.createElement('button');
      externalBtn.className = 'sidebar-widget-control';
      externalBtn.innerHTML = '↗';
      externalBtn.title = 'Open in new tab';
      externalBtn.onclick = () => {
        window.open(url, '_blank', 'noopener,noreferrer');
      };
      
      // Close button
      const closeBtn = document.createElement('button');
      closeBtn.className = 'sidebar-widget-control sidebar-widget-close';
      closeBtn.innerHTML = '×';
      closeBtn.title = 'Close';
      closeBtn.onclick = () => {
        overlay.remove();
      };
      
      controls.appendChild(pinBtn);
      controls.appendChild(expandBtn);
      controls.appendChild(externalBtn);
      controls.appendChild(closeBtn);
      
      header.appendChild(titleElement);
      header.appendChild(controls);
      
      // Add drag functionality to header
      let isDragging = false;
      let dragStartX, dragStartY, dragStartLeft, dragStartTop;
      
      header.addEventListener('mousedown', (e) => {
        // Only drag if clicking on header, not controls
        if (e.target.closest('.sidebar-widget-controls')) return;
        
        isDragging = true;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        
        const rect = container.getBoundingClientRect();
        dragStartLeft = rect.left;
        dragStartTop = rect.top;
        
        // Add dragging class for visual feedback
        container.classList.add('dragging');
        document.body.style.userSelect = 'none';
        
        const handleDragMove = (e) => {
          if (!isDragging) return;
          
          const deltaX = e.clientX - dragStartX;
          const deltaY = e.clientY - dragStartY;
          
          let newLeft = dragStartLeft + deltaX;
          let newTop = dragStartTop + deltaY;
          
          // Constrain to viewport
          const maxLeft = window.innerWidth - container.offsetWidth;
          const maxTop = window.innerHeight - container.offsetHeight;
          
          newLeft = Math.max(0, Math.min(maxLeft, newLeft));
          newTop = Math.max(0, Math.min(maxTop, newTop));
          
          container.style.left = newLeft + 'px';
          container.style.top = newTop + 'px';
          container.style.right = 'auto';
          container.style.position = 'fixed';
        };
        
        const handleDragEnd = () => {
          isDragging = false;
          container.classList.remove('dragging');
          document.body.style.userSelect = '';
          document.removeEventListener('mousemove', handleDragMove);
          document.removeEventListener('mouseup', handleDragEnd);
        };
        
        document.addEventListener('mousemove', handleDragMove);
        document.addEventListener('mouseup', handleDragEnd);
        
        e.preventDefault();
      });
      
      // Create content area
      const content = document.createElement('div');
      content.className = 'sidebar-widget-content';
      
      const iframe = document.createElement('iframe');
      iframe.className = 'sidebar-widget-iframe';
      iframe.src = url;
      iframe.title = title;
      iframe.sandbox = 'allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox';
      iframe.loading = 'lazy';
      
      // Create fallback content for unexpected iframe failures
      const fallbackContent = document.createElement('div');
      fallbackContent.className = 'sidebar-widget-fallback';
      fallbackContent.style.display = 'none';
      fallbackContent.style.padding = '2rem';
      fallbackContent.style.textAlign = 'center';
      fallbackContent.style.backgroundColor = 'var(--ifm-color-emphasis-100)';
      fallbackContent.style.height = '100%';
      fallbackContent.style.display = 'flex';
      fallbackContent.style.flexDirection = 'column';
      fallbackContent.style.justifyContent = 'center';
      fallbackContent.style.alignItems = 'center';
      
      fallbackContent.innerHTML = `
        <div style="margin-bottom: 1rem;">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="var(--ifm-color-content-secondary)">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
        </div>
        <h4 style="margin-bottom: 1rem; color: var(--ifm-color-content);">Loading Failed</h4>
        <p style="margin-bottom: 1.5rem; color: var(--ifm-color-content-secondary); max-width: 300px; line-height: 1.5;">
          Unable to load content in sidebar. Click below to open in a new tab.
        </p>
        <button onclick="window.open('${url}', '_blank', 'noopener,noreferrer')" 
                style="padding: 0.75rem 1.5rem; background: var(--ifm-color-primary); color: white; border: none; border-radius: 0.375rem; cursor: pointer; font-size: 0.875rem; font-weight: 500;">
          Open in New Tab →
        </button>
      `;
      
      // Handle iframe load errors (for unexpected failures)
      iframe.addEventListener('error', () => {
        iframe.style.display = 'none';
        fallbackContent.style.display = 'flex';
      });
      
      content.appendChild(iframe);
      content.appendChild(fallbackContent);
      
      // Create resize handles
      const createResizeHandle = (className, cursor) => {
        const handle = document.createElement('div');
        handle.className = `resize-handle ${className}`;
        handle.style.position = 'absolute';
        handle.style.cursor = cursor;
        handle.style.backgroundColor = 'transparent';
        handle.style.zIndex = '10';
        return handle;
      };
      
      // Resize handles
      const resizeRight = createResizeHandle('resize-right', 'ew-resize');
      resizeRight.style.right = '0';
      resizeRight.style.top = '0';
      resizeRight.style.width = '5px';
      resizeRight.style.height = '100%';
      
      const resizeBottom = createResizeHandle('resize-bottom', 'ns-resize');
      resizeBottom.style.bottom = '0';
      resizeBottom.style.left = '0';
      resizeBottom.style.width = '100%';
      resizeBottom.style.height = '5px';
      
      const resizeCorner = createResizeHandle('resize-corner', 'nw-resize');
      resizeCorner.style.bottom = '0';
      resizeCorner.style.right = '0';
      resizeCorner.style.width = '15px';
      resizeCorner.style.height = '15px';
      resizeCorner.style.backgroundColor = 'rgba(0,0,0,0.1)';
      
      // Add resize functionality
      const addResizeListener = (handle, resizeType) => {
        let isResizing = false;
        let startX, startY, startWidth, startHeight;
        
        handle.addEventListener('mousedown', (e) => {
          isResizing = true;
          startX = e.clientX;
          startY = e.clientY;
          startWidth = parseInt(document.defaultView.getComputedStyle(container).width, 10);
          startHeight = parseInt(document.defaultView.getComputedStyle(container).height, 10);
          
          // Add resizing class for visual feedback
          container.classList.add('resizing');
          document.body.style.userSelect = 'none';
          document.body.style.cursor = handle.style.cursor;
          
          // Attach to document to prevent losing mouse events
          document.addEventListener('mousemove', handleMouseMove, true);
          document.addEventListener('mouseup', handleMouseUp, true);
          e.preventDefault();
          e.stopPropagation();
        });
        
        const handleMouseMove = (e) => {
          if (!isResizing) return;
          
          if (resizeType === 'right' || resizeType === 'corner') {
            const width = startWidth + e.clientX - startX;
            container.style.width = Math.max(300, Math.min(window.innerWidth - 40, width)) + 'px';
          }
          
          if (resizeType === 'bottom' || resizeType === 'corner') {
            const height = startHeight + e.clientY - startY;
            container.style.height = Math.max(200, Math.min(window.innerHeight - 40, height)) + 'px';
          }
          
          e.preventDefault();
          e.stopPropagation();
        };
        
        const handleMouseUp = (e) => {
          isResizing = false;
          container.dataset.userResized = 'true'; // Mark as user-resized
          container.classList.remove('resizing');
          document.body.style.userSelect = '';
          document.body.style.cursor = '';
          
          // Remove with capture flag to match how they were added
          document.removeEventListener('mousemove', handleMouseMove, true);
          document.removeEventListener('mouseup', handleMouseUp, true);
          
          e.preventDefault();
          e.stopPropagation();
        };
      };
      
      addResizeListener(resizeRight, 'right');
      addResizeListener(resizeBottom, 'bottom');
      addResizeListener(resizeCorner, 'corner');
      
      // Add resize handles to container
      container.appendChild(resizeRight);
      container.appendChild(resizeBottom);
      container.appendChild(resizeCorner);
      
      // Assemble the sidebar
      container.appendChild(header);
      container.appendChild(content);
      overlay.appendChild(container);
      
      // Close on overlay click (only when not pinned)
      overlay.onclick = (e) => {
        if (e.target === overlay && !isPinned) {
          overlay.remove();
        }
      };
      
      // Add to document
      document.body.appendChild(overlay);
    };
    
    // Handle window resize to update sidebar dimensions
    const handleWindowResize = () => {
      const existingSidebar = document.querySelector('.sidebar-widget-container');
      if (existingSidebar && !existingSidebar.dataset.userResized) {
        // Only auto-resize if user hasn't manually resized
        const overlay = existingSidebar.closest('.sidebar-widget-overlay');
        if (overlay && !overlay.classList.contains('expanded')) {
          // Get the original config from the iframe src
          const iframe = existingSidebar.querySelector('iframe');
          if (iframe) {
            const url = iframe.src;
            const config = getDomainConfig(url);
            const newDimensions = calculateDimensions(config);
            existingSidebar.style.width = newDimensions.width;
            existingSidebar.style.height = newDimensions.height;
          }
        }
      }
    };
    
    // Add event listeners
    document.addEventListener('click', handleLinkClick, true);
    window.addEventListener('resize', handleWindowResize);
    
    return () => {
      document.removeEventListener('click', handleLinkClick, true);
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);
  
  return null; // This component doesn't render anything visible
};

export default AutoSidebarLinks;