import { Box, Typography } from '@mui/material';
import { useContext } from 'react';
import { UnitDetailContext } from '../context';
import { UNIT_TYPES } from '../lib/constants';
import { applyFiltersToUnits, typeFilterFactory } from '../lib/filters';
import UnitCard from './UnitCard';

// TODO: the buildClasses function interface needs more strictly
// defined parameter rules.
export const CLASSIFIERS = [
  {
    id: 'milestone',
    name: 'Milestone',
    buildClasses: (units, topics) => [
      ...applyFiltersToUnits(units, [typeFilterFactory('milestone')])
        .sort((a, b) => a.summary.localeCompare(b.summary))
        .map((unit) => new MilestoneClass(unit)),
      new NullClass('milestone'),
    ],
  },
  {
    id: 'topicId',
    name: 'Topic',
    buildClasses: (units, topics) => [
      ...topics.map((topic) => new TopicClass(topic)),
      new NullClass('topicId'),
    ],
  },
  {
    id: 'type',
    name: 'Type',
    buildClasses: (units, topics) => [
      ...UNIT_TYPES.map((type) => new TypeClass(type)),
      new NullClass('type'),
    ],
  },
];

/**
 * Abstract Class.
 * Enforces Class API required to group units in ClassLists.
 * TODO: convert to abstract class in TypeScript migration.
 *
 * @class Class
 */
class Class {
  constructor() {
    this.isMember = this.isMember.bind(this);
  }
  isMember() {
    throw new Error('isMember() must be implemented.');
  }
  buildHeader() {
    throw new Error('buildHeader() must be implemented.');
  }
}

class NullClass extends Class {
  constructor(classifierId) {
    super();
    this.classifierId = classifierId;
  }

  isMember(unit) {
    return unit.type !== this.classifierId && !unit[this.classifierId];
  }
  buildHeader() {
    return <Typography>(none)</Typography>;
  }
}

class TypeClass extends Class {
  constructor(type) {
    super();
    this.id = type;
    this.type = type;
  }
  isMember(unit) {
    return unit.type === this.type;
  }
  buildHeader() {
    return <Typography>{this.type}</Typography>;
  }
}

class TopicClass extends Class {
  constructor(topic) {
    super();
    this.id = topic.id;
    this.topic = topic;
  }
  isMember(unit) {
    return unit.topicId === this.id;
  }
  buildHeader() {
    return <Typography>{this.topic.name}</Typography>;
  }
}

class MilestoneClass extends Class {
  constructor(unit) {
    super();
    this.id = unit.id;
    this.unit = unit;
  }
  isMember(unit) {
    return unit.milestone === this.id;
  }
  buildHeader() {
    // This method will only ever be called inside a function
    // component, so we can safely suppress the error message.
    /* eslint-disable react-hooks/rules-of-hooks */
    const openForm = useContext(UnitDetailContext);
    return (
      <Box
        sx={{
          minHeight: 150,
          padding: 2,
          bgcolor: 'background.secondary',
        }}
      >
        <UnitCard unitProps={this.unit} onClick={() => openForm(this.id)} />
      </Box>
    );
  }
}

export function buildClasses(classifierId, units, topics) {
  const classifier = CLASSIFIERS.find((c) => c.id === classifierId);
  return classifier.buildClasses(units, topics);
}
