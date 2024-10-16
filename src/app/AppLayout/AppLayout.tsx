import * as React from 'react';
import { NavLink, Outlet, useLoaderData, useLocation } from 'react-router-dom';
import {
  Brand,
  Button,
  Masthead,
  MastheadBrand,
  MastheadLogo,
  MastheadMain,
  MastheadToggle,
  Nav,
  NavExpandable,
  NavItem,
  NavList,
  Page,
  PageSidebar,
  PageSidebarBody,
  SkipToContent,
} from '@patternfly/react-core';
import { IAppRoute, IAppRouteGroup, routes as staticRoutes } from '@app/routes';
import { BarsIcon } from '@patternfly/react-icons';
import { CannedChatbot } from '../types/CannedChatbot';
import logo from '@app/bgimages/Logo-Red_Hat-Composer_AI_Studio-A-Standard-RGB.svg';
import logoDark from '@app/bgimages/Logo-Red_Hat-Composer_AI_Studio-A-Reverse.svg';

const getChatbots = () => {
  const url = process.env.REACT_APP_INFO_URL ?? '';
  return fetch(url)
    .then((res) => res.json())
    .then((data: CannedChatbot[]) => {
      return data;
    })
    .catch((e) => {
      throw new Response(e.message, { status: 404 });
    });
};

export async function loader() {
  const chatbots = await getChatbots();
  return { chatbots };
}

const AppLayout: React.FunctionComponent = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [routes, setRoutes] = React.useState(staticRoutes);
  const { chatbots } = useLoaderData() as { chatbots: CannedChatbot[] };

  React.useEffect(() => {
    if (chatbots) {
      const newRoutes = structuredClone(routes);
      chatbots.forEach((chatbot) => {
        const isNotPresent =
          routes.filter((route) => {
            if ('path' in route) {
              return route.path === `assistants/${chatbot.name}`;
            }
            return false;
          }).length === 0;
        if (isNotPresent) {
          newRoutes.push({
            path: `assistants/${chatbot.name}`,
            label: chatbot.displayName,
            title: chatbot.displayName,
          });
        }
      });
      setRoutes(newRoutes);
    }
  }, []);

  const masthead = (
    <Masthead>
      <MastheadMain>
        <MastheadToggle>
          <Button
            icon={<BarsIcon />}
            variant="plain"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Global navigation"
          />
        </MastheadToggle>
        <MastheadBrand data-codemods>
          <MastheadLogo data-codemods>
            <div className="show-light">
              <Brand src={logo} alt="Red Hat Composer AI Studio" heights={{ default: '36px' }} />
            </div>
            <div className="show-dark">
              <Brand src={logoDark} alt="Red Hat Composer AI Studio" heights={{ default: '36px' }} />
            </div>
          </MastheadLogo>
        </MastheadBrand>
      </MastheadMain>
    </Masthead>
  );

  const location = useLocation();

  const renderNavItem = (route: IAppRoute, index: number) => (
    <NavItem key={`${route.label}-${index}`} id={`${route.label}-${index}`} isActive={route.path === location.pathname}>
      <NavLink
        to={route.path}
        reloadDocument
        className={({ isActive, isPending, isTransitioning }) =>
          [isPending ? 'pending' : '', isActive ? 'active' : '', isTransitioning ? 'transitioning' : ''].join(' ')
        }
      >
        {route.label}
      </NavLink>
    </NavItem>
  );

  const renderNavGroup = (group: IAppRouteGroup, groupIndex: number) => (
    <NavExpandable
      key={`${group.label}-${groupIndex}`}
      id={`${group.label}-${groupIndex}`}
      title={group.label}
      isActive={group.routes.some((route) => route.path === location.pathname)}
    >
      {group.routes.map((route, idx) => route.label && renderNavItem(route, idx))}
    </NavExpandable>
  );

  const Navigation = (
    <Nav id="nav-primary-simple">
      <NavList id="nav-list-simple">
        {routes.map(
          (route, idx) => route.label && (!route.routes ? renderNavItem(route, idx) : renderNavGroup(route, idx)),
        )}
      </NavList>
    </Nav>
  );

  const Sidebar = (
    <PageSidebar>
      <PageSidebarBody>{Navigation}</PageSidebarBody>
    </PageSidebar>
  );

  const pageId = 'primary-app-container';

  const PageSkipToContent = (
    <SkipToContent
      onClick={(event) => {
        event.preventDefault();
        const primaryContentContainer = document.getElementById(pageId);
        primaryContentContainer && primaryContentContainer.focus();
      }}
      href={`#${pageId}`}
    >
      Skip to Content
    </SkipToContent>
  );

  return (
    <Page
      mainContainerId={pageId}
      masthead={masthead}
      sidebar={sidebarOpen && Sidebar}
      skipToContent={PageSkipToContent}
      isContentFilled
    >
      <Outlet />
    </Page>
  );
};

export { AppLayout };
