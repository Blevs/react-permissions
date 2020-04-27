import React, { useContext, useState } from 'react';
import { Route, Redirect, useHistory } from 'react-router';

type Permission = 'user:write' | 'user:read';

// placeholder for login system
const users: Record<string, Permission[]> = {
  user: ['user:read'],
  admin: ['user:read', 'user:write'],
};


interface PermissionsContextValue {
  userPermissions: Permission[],
  login: (username: string) => void,
};

const PermissionsContext = React.createContext<PermissionsContextValue | null>(null);

export const usePermissions = () => {
  const context = useContext(PermissionsContext);
  if (context === null) {
    throw new Error('usePermissions must be used inside of PermissionsProvider');
  }
  return context;
};

export const usePermissionsMatch = (permissions: Permission | Permission[]) => {
  const { userPermissions } = usePermissions();
  return checkMatch(permissions, userPermissions);
};

export const PermissionsProvider: React.FC = ({ children }) => {
  const history = useHistory();
  const [userPermissions, setUserPermissions] = useState<Permission[]>([]);

  const login = (user: string) => {
    if (users[user]) {
      setUserPermissions(users[user]);
      history.push('/')
    }
  }

  return (
    <PermissionsContext.Provider value={{ userPermissions, login }}>
      {children}
    </PermissionsContext.Provider>
  );
};


interface CanProps {
  permissions?: Permission | Permission[];
}

const coerceArray = <T extends unknown>(x: T | T[]): T[] => {
  return Array.isArray(x) ? x : [x];
};

const checkMatch = (permissions: Permission | Permission[] = [], userPermissions: Permission[]) => {
  const permissionsArray = coerceArray(permissions);
  // always match empty permissions for Switch fallthrough purposes
  if (permissionsArray.length === 0) {
    return true;
  }
  return permissionsArray.some(p => userPermissions.includes(p));
};


export const Can: React.FC<CanProps> = ({ permissions, children }) => {
  const { userPermissions } = usePermissions();
  const match = checkMatch(permissions, userPermissions);
  return match ? <>{children}</> : null;
}

export const Switch: React.FC = ({ children }) => {
  const { userPermissions } = usePermissions();
  let element: React.ReactElement | null = null;
  let match = false;
  React.Children.forEach(children || [], child => {
    if (match === false && React.isValidElement(child)) {
      element = child;
      // We specifically check for Can elements, which limits extensibility, but gives us a little bit of safety 
      if (element.type === Can) {
        const permissions = (element.props as CanProps).permissions;
        match = checkMatch(permissions, userPermissions);
      }
    }
  });
  return match ? element : null;
};

export const PrivateRoute: React.FC<React.ComponentProps<typeof Route> & CanProps> = ({ permissions, ...rest }) => {
  const { userPermissions } = usePermissions();
  const match = checkMatch(permissions, userPermissions);

  if (!match) {
    return <Redirect to="/login" />;
  }

  return <Route {...rest} />;
};
