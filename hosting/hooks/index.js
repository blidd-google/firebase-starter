import { useContext, useEffect, useState } from 'react';
import { getAllUnitsForProject } from '../lib/client/unit';
import { TopicsContext, UnitsContext } from '../context';
import { applyFiltersToUnits, typeFilterFactory } from '../lib/filters';
import { UNIT_TYPES } from '../lib/constants';
import { buildClasses } from '../components/classes';

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

// export const useStacks = (stacksProp) => {
//   const [stacks, setStacks] = useState();
// };

export const useClassifiers = (classifierProp) => {
  const [classifierId, setClassifierId] = useState(classifierProp);
  const { units } = useContext(UnitsContext);
  const topics = useContext(TopicsContext);

  const classifiers = [
    {
      id: 'milestone',
      name: 'Milestone',
      classes: applyFiltersToUnits(units, [
        typeFilterFactory('milestone'),
      ]).sort((a, b) => a.summary.localeCompare(b.summary)),
    },
    {
      id: 'topicId',
      name: 'Topic',
      classes: topics,
    },
    {
      id: 'type',
      name: 'Type',
      classes: UNIT_TYPES.map((type) => ({ id: type, name: type })),
    },
  ];

  return {
    classifier: classifiers.find((c) => c.id === classifierId),
    allClassifiers: classifiers,
    setClassifierId,
  };
};

export const useClasses = (classifierProp) => {
  const [classifierId, setClassifierId] = useState(classifierProp);
  const { units } = useContext(UnitsContext);
  const topics = useContext(TopicsContext);

  return {
    classes: buildClasses(classifierId, units, topics),
    classifierId,
    setClassifierId,
  };
};
