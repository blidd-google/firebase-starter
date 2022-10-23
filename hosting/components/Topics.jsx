import {
  Card,
  CardActionArea,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import * as React from 'react';

export default function Topics({ topics, openTopic }) {
  return (
    <Grid container sx={{ width: 1200 }}>
      {topics.map(({ id, name, notes, resources }) => (
        <Grid item key={id} xs={4} sx={{ alignContent: 'flex-start', m: 1 }}>
          <TopicCard
            topicId={id}
            topicName={name}
            notes={notes}
            onClick={() => openTopic(id)}
          />
        </Grid>
      ))}
    </Grid>
  );
}

Topics.propType = {
  projectId: PropTypes.string,
  topicsProp: PropTypes.array,
};

const TopicCard = ({ topicName, notes, resources, onClick }) => {
  return (
    <Card>
      <CardActionArea onClick={onClick}>
        <CardContent>
          <Typography variant={'h4'}>{topicName}</Typography>
          <Typography variant={'body'}>{notes}</Typography>
          <List>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemText>Resource 1</ListItemText>
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemText>Resource 2</ListItemText>
              </ListItemButton>
            </ListItem>
          </List>
          {/* <Grid container>
            {resources.map(({ name }) => (
              <Grid item key={name} xs={12}>
                <Typography variant={'h5'}>{name}</Typography>
              </Grid>
            ))}
          </Grid> */}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
