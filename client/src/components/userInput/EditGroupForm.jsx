import React, {useState, useEffect} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {useForm} from 'react-hook-form';
import {Card, Button, Stack, TextField, Alert,
  Autocomplete, createFilterOptions} from '@mui/material';

/**
 * Form to edit an existing group.
 * @return {JSX.Element}
 * @constructor
 */
export default function EditGroupForm() {
  const {groupId} = useParams();
  const [badRequest, setBadRequest] = useState(false);
  const {register, formState: {errors}, handleSubmit} = useForm();
  const [interests, setInterests] = useState([]);
  const navigate = useNavigate();
  const filter = createFilterOptions();
  const [groupInfo, setGroupInfo] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(async () => {
    await fetchGroupInfo();
    await fetchGroupInterests();
    setLoading(false);
  }, []);

  const fetchGroupInfo = async () => {
    await fetch('/api/get-group', {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({groupId: groupId}),
    }).then((res) => res.json())
        .then((result) => {
          setGroupInfo(result);
        });
  };

  const fetchGroupInterests = async () => {
    await fetch('/api/get-group-interests', {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        groupId: groupId,
      }),
    }).then((res) => res.json()).
        then((result) => {
          setInterests(result.map((e) => e.interest));
        });
  };

  const onSubmit = async (data) => {
    setBadRequest(false);
    data.groupId = groupId;
    data.interests = interests;
    fetch('/api/update-group-attributes', {
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

  if (loading) {
    return <div>loading..</div>;
  } else {
    return (
      <Card elevation={5}>
        <form style={{padding: '2rem'}} onSubmit={handleSubmit(onSubmit)}>

          <h2>Edit group</h2>

          <div>
            <TextField
              required
              fullWidth
              defaultValue={groupInfo.name}
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
              defaultValue={groupInfo.description}
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
              fullWidth
              margin="normal"
              error={errors.image}
              defaultValue={groupInfo.image}
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
              defaultValue={groupInfo.location}
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
            defaultValue={interests}
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

          <br></br>

          <Stack
            spacing={2}
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Button
              onClick={() => navigate('/group/' + groupId)}
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
              Save
            </Button>
          </Stack>

        </form>
      </Card>
    );
  }
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
