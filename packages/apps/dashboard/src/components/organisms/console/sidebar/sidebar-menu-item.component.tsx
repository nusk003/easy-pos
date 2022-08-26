import { Badge, Text } from '@src/components/atoms';
import { theme } from '@src/components/theme';
import React, { useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

const SWrapper = styled.div<{
  noChildren: number;
  isChildActive: boolean;
  isMenuVisible: boolean;
}>`
  min-width: 30px;
  height: ${(props) =>
    props.isChildActive ? 36 + props.noChildren * 40 : 36}px;
  overflow: hidden;

  :hover {
    height: ${(props) =>
      props.noChildren ? 36 + props.noChildren * 40 + 'px' : undefined};

    & .sidebar-badge {
      display: ${(props) => (props.noChildren ? 'none' : undefined)};
    }
  }

  ${theme.mediaQueries.desktop} {
    height: ${(props) => (!props.isMenuVisible ? '36px' : undefined)};

    :hover {
      height: ${(props) => (!props.isMenuVisible ? '36px' : undefined)};
    }
  }

  transition: height 0.3s;
`;

const SMenuItemWrapper = styled.div<{
  isMenuVisible: boolean;
  isActive: boolean;
  isChildren: boolean;
  isChildActive: boolean;
}>`
  height: 20px;
  display: grid;
  grid-template-columns: 20px auto;
  gap: 8px;
  align-items: center;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  user-select: none;
  background-color: ${(props) => (props.isActive ? '#f2f2f2' : undefined)};

  :hover {
    background-color: ${(props) => (!props.isChildren ? '#f2f2f2' : undefined)};
  }

  transition: background-color 0.3s;

  ${theme.mediaQueries.desktop} {
    grid-template-columns: ${(props) =>
      !props.isMenuVisible ? 'auto' : undefined};

    background-color: ${(props) =>
      !props.isMenuVisible && props.isChildActive ? '#f2f2f2' : undefined};

    :hover {
      background-color: ${(props) =>
        !props.isMenuVisible && !props.isChildActive ? '#f2f2f2' : undefined};
      transition: background-color 0.3s;
    }

    transition: background-color 0s;
  }
`;

const SIconWrapper = styled.div`
  display: grid;
  align-items: center;
`;

const SMenuText = styled(Text.Primary)<{ isMenuVisible: boolean }>`
  white-space: nowrap;
  display: grid;
  grid-auto-flow: column;
  justify-content: space-between;
  align-items: center;

  ${theme.mediaQueries.desktop} {
    display: ${(props) => (!props.isMenuVisible ? 'none' : undefined)};
  }
`;

const SSubMenuItemsWrapper = styled.div<{ isMenuVisible: boolean }>`
  display: grid;
  gap: 8px;
  margin-top: 8px;
`;

interface MenuItemProps {
  title: string;
  isMenuVisible: boolean;
  icon: React.FC;
  location?: string;
  badgeCount?: number;
  onClick?: () => void;
  children?: React.ReactElement | React.ReactElement[];
}

export const SidebarMenuItem: React.FC<MenuItemProps> = ({
  title,
  location,
  icon: Icon,
  isMenuVisible,
  badgeCount = 0,
  onClick,
  children,
}) => {
  const history = useHistory();

  const handleClick = () => {
    onClick?.();

    if (location) {
      history.push(location);
    } else {
      if (children) {
        if (Array.isArray(children)) {
          let child = children[0];

          if (child && typeof child === 'object' && 'props' in child) {
            if (!child.props.location) {
              child = child.props.children;
            }
            if (child && typeof child === 'object' && 'props' in child) {
              history.push(child?.props?.location);
            }
          }
        } else {
          history.push(children.props.location);
        }
      }
    }
  };

  const isActive = Boolean(
    title === 'Dashboard'
      ? history.location.pathname === '/'
      : location &&
          history.location.pathname
            .replace(/([^/])$/, '$1/')
            .includes(location.replace(/([^/])$/, '$1/')) &&
          (history.location.pathname.includes('manage')
            ? location.includes('manage')
            : true)
  );

  const isChildActive = useMemo(() => {
    if (!children) {
      return false;
    }

    if (Array.isArray(children)) {
      return !!children
        .flatMap((component) => {
          if (
            component &&
            typeof component === 'object' &&
            'props' in component
          ) {
            if (component.props.location) {
              return component;
            }
            return component.props.children;
          }
        })
        .find((child) => {
          if (child && typeof child === 'object' && 'props' in child) {
            return (
              history.location.pathname.includes(child?.props.location) &&
              (history.location.pathname.includes('manage')
                ? child?.props.location.includes('manage')
                : true)
            );
          }

          return false;
        });
    }

    return (
      history.location.pathname.includes(children.props.location) &&
      (history.location.pathname.includes('manage')
        ? children.props.location.includes('manage')
        : true)
    );
  }, [children, history.location.pathname]);

  const noChildren = children
    ? Array.isArray(children)
      ? children.length
      : 1
    : 0;

  return (
    <SWrapper
      isMenuVisible={isMenuVisible}
      isChildActive={isChildActive}
      noChildren={noChildren}
    >
      <SMenuItemWrapper
        isMenuVisible={isMenuVisible}
        isActive={isActive}
        isChildActive={isChildActive}
        isChildren={!!children}
        onClick={handleClick}
      >
        <SIconWrapper>
          <Icon />
        </SIconWrapper>

        <SMenuText fontWeight="medium" isMenuVisible={isMenuVisible}>
          {title}
          {!isChildActive && badgeCount > 0 ? (
            <Badge className="sidebar-badge" count={badgeCount} />
          ) : null}
        </SMenuText>
      </SMenuItemWrapper>
      <SSubMenuItemsWrapper isMenuVisible={isMenuVisible}>
        {children}
      </SSubMenuItemsWrapper>
    </SWrapper>
  );
};
