import {
  Button,
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
import AddIcon from '@mui/icons-material/Add';
import * as React from 'react';
import { useRouter } from 'next/router';
import { createNewTopic } from '../lib/client/topic';

export default function Topics({ projectId, topics }) {
  const router = useRouter();

  const handleNew = async () => {
    const id = await createNewTopic(projectId);
    router.push(`/projects/${projectId}/topics/${id}`);
  };

  return (
    <Grid container sx={{ width: 1200 }}>
      {topics.map(({ id, name, notes, projectId }) => (
        <Grid item key={id} xs={4} sx={{ alignContent: 'flex-start', m: 1 }}>
          <TopicCard
            topicId={id}
            name={name}
            notes={notes}
            onClick={() => {
              router.push(`/projects/${projectId}/topics/${id}`);
            }}
          />
        </Grid>
      ))}

      {projectId && (
        <Grid item xs={4}>
          <Button variant="outlined" endIcon={<AddIcon />} onClick={handleNew}>
            Add
          </Button>
        </Grid>
      )}
    </Grid>
  );
}

const TopicCard = ({ name, notes, resources, onClick }) => {
  return (
    <Card>
      <CardActionArea onClick={onClick}>
        <CardContent>
          <Typography variant={'h4'}>{name}</Typography>
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
