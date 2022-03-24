import React, {useContext, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useForm, Controller} from 'react-hook-form';
import {Card, Button, Stack, TextField, Alert, FormControl,
  InputLabel, Select, MenuItem, Autocomplete,
  createFilterOptions} from '@mui/material';
import {nanoid} from 'nanoid';
import {UserContext} from '../../contexts/User';

/**
 * returns a form used to create groups.
 * @return {JSX.Element}
 * @constructor
 */
export default function CreateGroupForm() {
  const [badRequest, setBadRequest] = useState(false);
  const {register, formState: {errors}, handleSubmit, control} = useForm();
  const [userState] = useContext(UserContext);
  const [interests, setInterests] = useState([]);
  const navigate = useNavigate();
  const filter = createFilterOptions();

  const onSubmit = async (data) => {
    setBadRequest(false);
    data.groupId = nanoid();
    data.admin = userState.username;
    data.interests = interests;
    fetch('/api/insert-group', {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data),
    }).then(async (res) => {
      if (res.ok) {
        navigate('/group/' + data.groupId);
      } else {
        setBadRequest(true);
        console.log('Could not register group!');
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
          <FormControl fullWidth margin="normal" required>
            <InputLabel id="member-label">Membership</InputLabel>
            <Controller
              name='membership'
              inputProps={{'data-testid': 'membership-option'}}
              labelId="membership-label"
              label='membership'
              defaultValue={'standard'}
              control={control}
              render={({field}) => (
                <Select {...field}>
                  <MenuItem value={'standard'}>Standard</MenuItem>
                  <MenuItem value={'gold'}>Gold</MenuItem>
                </Select>
              )}
            />
          </FormControl>
        </div>


        <div>
          <TextField
            fullWidth
            margin="normal"
            error={errors.image}
            inputProps={{'data-testid': 'image-input'}}
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

        <Autocomplete
          multiple
          freeSolo
          autoSelect
          options={interestOptions}
          getOptionLabel={(option) => option}
          onChange={(event, value) => {
            setInterests(value);
          }}
          filterOptions={(options, params) => {
            const filtered = filter(options, params);

            if (params.inputValue !== '') {
              filtered.push(params.inputValue);
            }

            return filtered;
          }}
          style={{width: 300}}
          renderInput={(params) => (
            <TextField {...params}
              margin="normal"
              label="Interests"
              variant="outlined"
              fullWidth
            />
          )}
        />


        <br/>

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

const interestOptions = [
  'Astrology',
  'Chess',
  'Gaming',
  'Skiing',
  'Traveling',
  'Sports',
  'Food',
  'Wine',
  'Movies',
  'Paragliding',
];
