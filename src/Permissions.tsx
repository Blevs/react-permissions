import React, { useState, useContext, useMemo } from 'react';

type Permission = 'user:write' | 'user:read' | 'user:admin' | 'something';

type PermissionContextValue = {
  permissions: Permission[],
};

export const PermissionsContext = React.createContext<PermissionContextValue | null>(null);

export const usePermissions = () => {
  const pc = useContext(PermissionsContext);
  if (pc === null) {
    throw new Error('usePermissions must be inside of PermissionsProvider');
  }
  return pc;
};

export const PermissionsProvider: React.FC = ({ children }) => {
  const [permissions, setPermissions] =
    useState<Permission[]>(['user:read']);

  const value = useMemo(() => {
    return { permissions }
  }, [permissions]);

  return (
    <PermissionsContext.Provider value={value}>
      {children}
    </PermissionsContext.Provider>
  );
};

interface CanProps {
  permissions?: Permission | Permission[],
}

// function coerceArray<T>(x: T | T[]): T[] {
// return Array.isArray(x) ? x : [x];
// }

const checkMatch = (userPermissions: Permission[], canProps: CanProps) => {
  let match = false;
  const { permissions = [] } = canProps;
  const permissionsArr = Array.isArray(permissions) ? permissions : [permissions];
  if (permissionsArr.length === 0) {
    match = true;
  } else {
    match = permissionsArr.some(p => userPermissions.includes(p));
  }
  return match;
};

export const Can: React.FC<CanProps> = (props) => {
  const { children } = props
  const { permissions: userPermissions } = usePermissions();
  const match = checkMatch(userPermissions, props);

  if (match) {
    return <>{children}</>;
  } else {
    return null;
  }
};

export const Switch: React.FC = ({ children }) => {
  const { permissions: userPermissions } = usePermissions();

  let element: React.ReactNode = null;
  let match = false;

  React.Children.forEach(children, child => {
    if (!match && React.isValidElement(child) && child.type === Can) {
      element = child;
      match = checkMatch(userPermissions, (child.props as CanProps));
    }
  });

  return match ? element : null;
}
