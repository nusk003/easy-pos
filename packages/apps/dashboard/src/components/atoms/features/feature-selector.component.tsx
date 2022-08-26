import { useFlags, Flags } from '@src/util/features';
import React from 'react';

interface Props {
  children: React.ReactNode;
  name: Flags;
}

export const Feature: React.FC<Props> = ({ children, name }) => {
  const flags = useFlags();

  if (flags[name]) {
    return <>{children}</>;
  }

  return null;
};
