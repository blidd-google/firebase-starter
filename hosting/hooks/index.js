import { useEffect, useState } from 'react';
import { getAllUnitsForProject } from '../lib/client/unit';
import _ from 'lodash';

export const useUnits = (unitsProp, projectIdProp = '') => {
  const [units, setUnits] = useState(unitsProp);
  const [stale, setStale] = useState(false);
  const [projectId, setProjectId] = useState(projectIdProp);

  // SSR triggered refresh
  useEffect(() => {
    // Only call setUnits when new projectId prop from SSR is passed.
    // We only want this effect to run when the user switches to a
    // different project.
    if (projectId !== projectIdProp) {
      setUnits(unitsProp);
      setProjectId(projectIdProp);
    }
  }, [projectId, projectIdProp, unitsProp]);

  // client triggered refresh
  useEffect(() => {
    const fetch = async () => {
      const updated = await getAllUnitsForProject(projectId);
      setUnits(updated);
    };
    // Only do a client-side fetch if we are explicitly told to
    // update by the updateUnits() function being called.
    if (stale) {
      fetch();
      setStale(false);
    }
  }, [stale, projectId]);

  return { units, updateUnits: () => setStale(true) };
};

export const useTopics = (topicsSSR, projectIdSSR = '') => {
  const [topics, setTopics] = useState([]);
  const [projectId, setProjectId] = useState(null);

  useEffect(() => {
    if (projectId !== projectIdSSR) {
      setTopics(topicsSSR);
      setProjectId(projectIdSSR);
    }
  }, [projectId, projectIdSSR, topicsSSR]);

  return { topics };
};

export const useStacks = (stacksProp) => {
  const [stacks, setStacks] = useState();
};
