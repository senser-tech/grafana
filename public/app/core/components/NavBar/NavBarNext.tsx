import React, { FC, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { css, cx } from '@emotion/css';
import { cloneDeep } from 'lodash';
import { GrafanaTheme2, NavModelItem, NavSection } from '@grafana/data';
import { Icon, useTheme2 } from '@grafana/ui';
import { locationService } from '@grafana/runtime';
import config from 'app/core/config';
import { KioskMode } from 'app/types';
import { enrichConfigItems, getActiveItem, isSearchActive, SEARCH_ITEM_ID } from './utils';
import { OrgSwitcher } from '../OrgSwitcher';
import { NavBarSection } from './NavBarSection';
import { NavBarMenu } from './NavBarMenu';

const onOpenSearch = () => {
  locationService.partial({ search: 'open' });
};

const searchItem: NavModelItem = {
  id: SEARCH_ITEM_ID,
  onClick: onOpenSearch,
  text: 'Search dashboards',
  icon: 'search',
};

export const NavBarNext: FC = React.memo(() => {
  const theme = useTheme2();
  const styles = getStyles(theme);
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const kiosk = query.get('kiosk') as KioskMode;
  const [showSwitcherModal, setShowSwitcherModal] = useState(false);
  const toggleSwitcherModal = () => {
    setShowSwitcherModal(!showSwitcherModal);
  };
  const navTree: NavModelItem[] = cloneDeep(config.bootData.navTree);
  const coreItems = navTree.filter((item) => item.section === NavSection.Core);
  const pluginItems = navTree.filter((item) => item.section === NavSection.Plugin);
  const configItems = enrichConfigItems(
    navTree.filter((item) => item.section === NavSection.Config),
    location,
    toggleSwitcherModal
  );
  const activeItem = isSearchActive(location) ? searchItem : getActiveItem(navTree, location.pathname);
  const [menuOpen, setMenuOpen] = useState(false);

  if (kiosk !== null) {
    return null;
  }

  return (
    <nav className={cx(styles.sidemenu, 'sidemenu')} data-testid="sidemenu" aria-label="Main menu">
      <div className={styles.mobileSidemenuLogo} onClick={() => setMenuOpen(!menuOpen)} key="hamburger">
        <Icon name="bars" size="xl" />
      </div>

      <NavBarSection>
        {/*<NavBarItem*/}
        {/*  onClick={() => setMenuOpen(!menuOpen)}*/}
        {/*  label="Main menu"*/}
        {/*  className={styles.grafanaLogo}*/}
        {/*  showMenu={false}*/}
        {/*  id="home"*/}
        {/*>*/}
        {/*  <Branding.MenuLogo />*/}
        {/*</NavBarItem>*/}
        {/*<NavBarItem*/}
        {/*  className={styles.search}*/}
        {/*  isActive={activeItem === searchItem}*/}
        {/*  label={searchItem.text}*/}
        {/*  onClick={searchItem.onClick}*/}
        {/*  id="search"*/}
        {/*  link={searchItem}*/}
        {/*>*/}
        {/*  <Icon name="search" size="xl" />*/}
        {/*</NavBarItem>*/}
      </NavBarSection>

      <NavBarSection>
        {/*{coreItems.map((link, index) => (*/}
        {/*  <NavBarItem*/}
        {/*    key={`${link.id}-${index}`}*/}
        {/*    isActive={isMatchOrChildMatch(link, activeItem)}*/}
        {/*    label={link.text}*/}
        {/*    menuItems={link.children}*/}
        {/*    target={link.target}*/}
        {/*    url={link.url}*/}
        {/*    link={link}*/}
        {/*    id={link.id}*/}
        {/*    index={index}*/}
        {/*  >*/}
        {/*    {link.icon && <Icon name={link.icon as IconName} size="xl" />}*/}
        {/*    {link.img && <img src={link.img} alt={`${link.text} logo`} />}*/}
        {/*  </NavBarItem>*/}
        {/*))}*/}
      </NavBarSection>

      {/*{pluginItems.length > 0 && (*/}
      {/*  <NavBarSection>*/}
      {/*    {pluginItems.map((link, index) => (*/}
      {/*      <NavBarItem*/}
      {/*        key={`${link.id}-${index}`}*/}
      {/*        isActive={isMatchOrChildMatch(link, activeItem)}*/}
      {/*        label={link.text}*/}
      {/*        menuItems={link.children}*/}
      {/*        menuSubTitle={link.subTitle}*/}
      {/*        onClick={link.onClick}*/}
      {/*        target={link.target}*/}
      {/*        url={link.url}*/}
      {/*        link={link}*/}
      {/*        id={link.id}*/}
      {/*        index={index}*/}
      {/*      >*/}
      {/*        {link.icon && <Icon name={link.icon as IconName} size="xl" />}*/}
      {/*        {link.img && <img src={link.img} alt={`${link.text} logo`} />}*/}
      {/*      </NavBarItem>*/}
      {/*    ))}*/}
      {/*  </NavBarSection>*/}
      {/*)}*/}

      <div className={styles.spacer} />

      <NavBarSection>
        {/*{configItems.map((link, index) => (*/}
        {/*  <NavBarItem*/}
        {/*    key={`${link.id}-${index}`}*/}
        {/*    isActive={isMatchOrChildMatch(link, activeItem)}*/}
        {/*    label={link.text}*/}
        {/*    menuItems={link.children}*/}
        {/*    menuSubTitle={link.subTitle}*/}
        {/*    onClick={link.onClick}*/}
        {/*    reverseMenuDirection*/}
        {/*    target={link.target}*/}
        {/*    url={link.url}*/}
        {/*    link={link}*/}
        {/*    id={link.id}*/}
        {/*    index={index}*/}
        {/*  >*/}
        {/*    {link.icon && <Icon name={link.icon as IconName} size="xl" />}*/}
        {/*    {link.img && <img src={link.img} alt={`${link.text} logo`} />}*/}
        {/*  </NavBarItem>*/}
        {/*))}*/}
      </NavBarSection>

      {showSwitcherModal && <OrgSwitcher onDismiss={toggleSwitcherModal} />}
      {menuOpen && (
        <NavBarMenu
          activeItem={activeItem}
          navItems={[searchItem, ...coreItems, ...pluginItems, ...configItems]}
          onClose={() => setMenuOpen(false)}
        />
      )}
    </nav>
  );
});

NavBarNext.displayName = 'NavBar';

const getStyles = (theme: GrafanaTheme2) => ({
  search: css`
    display: none;
    margin-top: 0;

    ${theme.breakpoints.up('md')} {
      display: block;
    }
  `,
  sidemenu: css`
    display: flex;
    flex-direction: column;
    position: fixed;
    z-index: ${theme.zIndex.sidemenu};

    ${theme.breakpoints.up('md')} {
      gap: ${theme.spacing(1)};
      margin-left: ${theme.spacing(1)};
      padding: ${theme.spacing(1)} 0;
      position: relative;
      width: ${theme.components.sidemenu.width}px;
    }

    .sidemenu-hidden & {
      display: none;
    }
  `,
  grafanaLogo: css`
    align-items: center;
    display: flex;
    img {
      height: ${theme.spacing(3)};
      width: ${theme.spacing(3)};
    }
    justify-content: center;
  `,
  mobileSidemenuLogo: css`
    align-items: center;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: ${theme.spacing(2)};

    ${theme.breakpoints.up('md')} {
      display: none;
    }
  `,
  spacer: css`
    flex: 1;
  `,
});
