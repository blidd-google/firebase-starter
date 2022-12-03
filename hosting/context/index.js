import { createContext } from 'react';

export const ProjectsContext = createContext({
  projects: [],
  setProjects: () => {},
});

export const UnitsContext = createContext();
export const UnitDetailContext = createContext();
export const StacksContext = createContext();
export const TopicsContext = createContext();

export const StackDisplayContext = createContext();
