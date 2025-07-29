// context/PermissionContext.tsx
import { createContext, useContext, ReactNode } from 'react';

interface PermissionContextType {
  permissions: string[];
  hasPermission: (perm: string) => boolean;
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export const PermissionProvider = ({
  children,
  permissions,
}: {
  children: ReactNode;
  permissions: string[];
}) => {
  const permissionNames = permissions;

  const hasPermission = (perm: string) => permissionNames.includes(perm);

  return (
    <PermissionContext.Provider value={{ permissions: permissionNames, hasPermission }}>
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermissions = () => {
  const context = useContext(PermissionContext);
  if (!context) throw new Error('usePermissions must be used within a PermissionProvider');
  return context;
};
