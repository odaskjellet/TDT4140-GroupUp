import React, {useContext, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useForm} from 'react-hook-form';
import {Card, Button, Stack, TextField, Alert, Chip} from '@mui/material';
import {nanoid} from 'nanoid';
import {UserContext} from '../../contexts/User';

export default function CreateGroupForm() {
  const [badRequest, setBadRequest] = useState(false);
  const {register, formState: {errors}, handleSubmit} = useForm();
  const [userState, _] = useContext(UserContext);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setBadRequest(false);
    data.groupId = nanoid();
    data.admin = userState.username;
    fetch('/api/insert-group', {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data),
    }).then(async (res) => {
      if (res.ok) {
        navigate('/group/' + data.groupId);
      } else {
        setBadRequest(true);
        console.log('Could not register group!'); // TODO
        const errorMessage = await (res.json());
        console.log(errorMessage);
        alert(errorMessage);
      }
    });
  };

  return (
    <Card elevation={5}>
      <form style={{padding: '2rem'}} onSubmit={handleSubmit(onSubmit)}>
        <h2>Create a new group</h2>
        <div>
          <TextField
            required
            fullWidth
            margin="normal"
            error={errors.name}
            helperText={errors.name && 'A group name is required.'}
            label="Name"
            inputProps={{'data-testid': 'group-name-input'}}
            type={'text'}
            {...register('name', {required: true})}
          />
        </div>

        <div>
          <TextField
            required
            fullWidth
            margin="normal"
            error={errors.description}
            helperText={errors.description && 'A description is required.'}
            label="Description"
            inputProps={{'data-testid': 'description-input'}}
            type={'text'}
            {...register('description', {required: true})}
          />
        </div>

        <div>
          <TextField
            disabled
            fullWidth
            margin="normal"
            error={errors.interests}
            helperText={errors.interests && 'Interests are required.'}
            label="Interests - TODO"
            type={'text'}
            {...register('interests', {required: false})}
          />
        </div>

        <div>
          <TextField
            fullWidth
            margin="normal"
            error={errors.image}
            helperText={errors.image && 'Image URL is required.'}
            label="Image URL"
            type={'text'}
            {...register('image', {required: false})}
          />
        </div>

        <div>
          <TextField
            fullWidth
            margin="normal"
            error={errors.location}
            helperText={errors.location && 'Location is required.'}
            label="Location"
            inputProps={{'data-testid': 'location-input'}}
            type={'text'}
            {...register('location', {required: true})}
          />
        </div>

        <br></br>
        
        <Stack
          spacing={2}
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Button
            onClick={() => navigate('/home')}
          >
            Cancel
          </Button>
          {badRequest && <Alert
            severity="error"
            onClose={() => setBadRequest(false)}
          >
            Something went wrong!
          </Alert>}
          <Button
            variant="contained"
            type="submit"
          >
            Create Group
          </Button>
        </Stack>

      </form>
    </Card>
  );
}
