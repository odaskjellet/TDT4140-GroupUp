import {Link, useNavigate} from 'react-router-dom';
import {useForm} from 'react-hook-form';
import {Card, Button, Stack, TextField} from '@mui/material';

export default function CreateGroupForm() {
  const {register, formState: {errors}, handleSubmit} = useForm();
  const navigate = useNavigate();
  const onSubmit = async (data) => {
    console.log(data);
    fetch('/api/insert-group', {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data),
    }).then((res) => {
      if (res.ok) {
        console.log('group created!');
        navigate('/home');
      } else {
        console.log(res.text()); // TODO
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
            label="Group name"
            type={'text'}
            {...register('name', {required: true})}
          />
        </div>

        <div>
          <TextField
            required
            fullWidth
            margin="normal"
            error={errors.id}
            helperText={errors.id && 'A group id cannot be negative.'}
            label="Group id"
            type={'number'}
            {...register('id', {required: true, min: 0, max: 999999})}
          />
        </div>

        <div>
          <TextField
            required
            fullWidth
            margin="normal"
            error={errors.interests}
            helperText={errors.interests && 'Interests are required.'}
            label="Group interests"
            type={'text'}
            {...register('interests', {required: true})}
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
            type={'text'}
            {...register('description', {required: true})}
          />
        </div>

        <div>
          <TextField
            fullWidth
            margin="normal"
            error={errors.members}
            label="Add members"
            type={'text'}
            {...register('members', {required: false})}
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
