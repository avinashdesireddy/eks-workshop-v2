import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt, faTimes, faExpand, faCompress } from '@fortawesome/free-solid-svg-icons';
import './styles.scss';

const SidebarWidget = ({ url, title = "External Content", width = "400px", height = "600px" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(url);
  const iframeRef = useRef(null);

  useEffect(() => {
    setCurrentUrl(url);
  }, [url]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
    setIsExpanded(false);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const openInNewTab = () => {
    window.open(currentUrl, '_blank', 'noopener,noreferrer');
  };

  if (!url) {
    return (
      <div className="sidebar-widget-error">
        <p>Error: No URL provided for sidebar widget</p>
      </div>
    );
  }

  return (
    <>
      <button 
        className="sidebar-widget-trigger"
        onClick={toggleSidebar}
        title={`Open ${title} in sidebar`}
      >
        <FontAwesomeIcon icon={faExternalLinkAlt} />
        <span>{title}</span>
      </button>

      {isOpen && (
        <div className={`sidebar-widget-overlay ${isExpanded ? 'expanded' : ''}`}>
          <div 
            className="sidebar-widget-container"
            style={{
              width: isExpanded ? '80vw' : width,
              height: isExpanded ? '80vh' : height
            }}
          >
            <div className="sidebar-widget-header">
              <h3 className="sidebar-widget-title">{title}</h3>
              <div className="sidebar-widget-controls">
                <button
                  className="sidebar-widget-control"
                  onClick={toggleExpanded}
                  title={isExpanded ? "Minimize" : "Expand"}
                >
                  <FontAwesomeIcon icon={isExpanded ? faCompress : faExpand} />
                </button>
                <button
                  className="sidebar-widget-control"
                  onClick={openInNewTab}
                  title="Open in new tab"
                >
                  <FontAwesomeIcon icon={faExternalLinkAlt} />
                </button>
                <button
                  className="sidebar-widget-control sidebar-widget-close"
                  onClick={closeSidebar}
                  title="Close"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
            </div>
            <div className="sidebar-widget-content">
              <iframe
                ref={iframeRef}
                src={currentUrl}
                title={title}
                className="sidebar-widget-iframe"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SidebarWidget;