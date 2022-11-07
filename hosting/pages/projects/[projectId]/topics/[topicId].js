import { Box, Button, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useState } from 'react';
import { deleteTopic, putTopic } from '../../../../lib/client/topic';
import { getTopicDetails } from '../../../../lib/server/projects';

const TopicDetail = ({ topic }) => {
  const router = useRouter();
  const [state, setState] = useState(topic);

  console.log('STATE', state);

  const handleClickSave = async (event) => {
    event.preventDefault();
    await putTopic(state);
    router.push(`/projects/${state.projectId}`);
  };

  const handleClickDelete = async (event) => {
    event.preventDefault();
    await deleteTopic(state.id);
    router.push(`/projects/${state.projectId}`);
  };

  const handleChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <Box>
      <Typography>{topic.projectId}</Typography>

      <TextField
        variant="standard"
        label="Name"
        name="name"
        value={state.name}
        onChange={handleChange}
      />

      <TextField
        multiline
        rows={10}
        label="Notes"
        name="notes"
        value={state.notes}
        onChange={handleChange}
      />

      <Button variant="contained" onClick={handleClickSave}>
          Save
      </Button>

      <Button variant="contained" color="error" onClick={handleClickDelete}>
          Delete
      </Button>

    </Box>
  );
};

export const getServerSideProps = async ({ params }) => {
  const { topicId } = params;
  const topic = await getTopicDetails(topicId);
  console.log('Topic', topic);
  return { props: { topic } };
};


export default TopicDetail;
