import { Card, CardContent, Grid, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import * as React from 'react';

export default function Topics({ topics }) {
  return (
    <Grid container>
      {topics.map(({ id, name, resources }) => (
        <Grid item key={id} xs={6} sx={{ alignContent: 'flex-start' }}>
          <ResourceList topicId={id} topicName={name} resources={resources} />
        </Grid>
      ))}
    </Grid>
  );
}

Topics.propType = {
  projectId: PropTypes.string,
  topicsProp: PropTypes.array,
};

const ResourceList = ({ topicName, resources }) => {
  return (
    <Card sx={{ margin: 2 }}>
      <CardContent>
        <Typography variant={'h5'}>{topicName}</Typography>
        <Grid container spacing={4} sx={{ mt: 1 }}>
          {resources.map(({ name }) => (
            <Grid item key={name} xs={6}>
              <Typography variant={'body'}>{name}</Typography>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};
