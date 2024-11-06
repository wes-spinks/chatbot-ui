import React, { useEffect, useRef, useState } from 'react';
import { Brand, Nav, NavItem, NavList, PageSidebar } from '@patternfly/react-core';
import logo from '@app/bgimages/Logo-Red_Hat-Composer_AI_Studio-A-Standard-RGB.svg';
import logoDark from '@app/bgimages/Logo-Red_Hat-Composer_AI_Studio-A-Reverse.svg';
import { FlyoutHeader } from '@app/FlyoutHeader.tsx/FlyoutHeader';
import { FlyoutStartScreen } from '@app/FlyoutStartScreen.tsx/FlyoutStartScreen';
import { FlyoutMenu } from './FlyoutMenu';
import { NavLink } from 'react-router-dom';

export const SidebarWithFlyout: React.FunctionComponent = () => {
  const [sidebarHeight, setSidebarHeight] = useState(0);
  const [visibleFlyout, setVisibleFlyout] = useState(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const flyoutMenuRef = useRef<HTMLDivElement>(null);

  // Capture sidebar height initially and whenever it changes.
  // We use this to control the flyout height.
  useEffect(() => {
    const updateHeight = () => {
      if (sidebarRef.current) {
        setSidebarHeight(sidebarRef.current.offsetHeight);
      }
    };

    // Set initial height and add event listeners for window resize
    updateHeight();
    window.addEventListener('resize', updateHeight);

    return () => {
      window.removeEventListener('resize', updateHeight);
    };
  }, []);

  // Adjust flyout height to match the sidebar height when flyout is visible
  useEffect(() => {
    if (visibleFlyout && sidebarRef.current && flyoutMenuRef.current) {
      const sidebarHeight = sidebarRef.current.offsetHeight;
      flyoutMenuRef.current.style.height = `${sidebarHeight}px`;
    }
  }, [visibleFlyout]);

  /*const toggleFlyout = (e) => {
    if (visibleFlyout === e.target.innerText) {
      setVisibleFlyout(null);
    } else {
      setVisibleFlyout(e.target.innerText);
    }
  };*/

  return (
    <PageSidebar>
      <div id="page-sidebar" ref={sidebarRef} className="pf-c-page__sidebar" style={{ height: '100%' }}>
        <div className="sidebar-masthead">
          <div className="show-light">
            <Brand src={logo} alt="Red Hat Composer AI Studio" heights={{ default: '36px' }} />
          </div>
          <div className="show-dark">
            <Brand src={logoDark} alt="Red Hat Composer AI Studio" heights={{ default: '36px' }} />
          </div>
        </div>

        <Nav id="nav-primary-simple" className="pf-c-nav" aria-label="Global">
          <NavList>
            <NavItem onClick={() => setVisibleFlyout(null)}>
              <NavLink to="/">Home</NavLink>
            </NavItem>
            {/*<NavItem
              component="button"
              onClick={toggleFlyout}
              aria-haspopup="dialog"
              aria-expanded={visibleFlyout === 'Chats'}
            >
              Chats
            </NavItem>
            <NavItem
              component="button"
              onClick={toggleFlyout}
              aria-haspopup="dialog"
              aria-expanded={visibleFlyout === 'Assistants'}
            >
              Assistants
            </NavItem>*/}
          </NavList>
        </Nav>
        {/* Flyout menu */}
        {visibleFlyout && (
          <FlyoutMenu
            key={visibleFlyout}
            id={visibleFlyout}
            height={sidebarHeight}
            hideFlyout={() => setVisibleFlyout(null)}
          >
            <FlyoutHeader title={visibleFlyout} hideFlyout={() => setVisibleFlyout(null)} />
            <FlyoutStartScreen
              title="Create your first assistant"
              subtitle="Work smarter and faster with tailored assistance"
              primaryButtonText="Create assistant"
            />
          </FlyoutMenu>
        )}
      </div>
    </PageSidebar>
  );
};
