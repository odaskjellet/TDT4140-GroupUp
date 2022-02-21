import classes from './LoginForm.module.css';
import Card from '../../ui/Card';
import {Link, useNavigate} from 'react-router-dom';
import {useForm} from 'react-hook-form';

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
    <Card>
      <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>

        <div className={classes.control}>
          <label htmlFor={'name'}>Group name</label>
          <input type={'text'} {...register('name',
              {required: true})} />
          {errors.password && 'A group name is required'}
        </div>

        <div className={classes.control}>
          <label htmlFor={'name'}>Group ID</label>
          <input type={'number'} {...register('id',
              {required: true})} />
          {errors.password && 'A group ID is required'}
        </div>

        <div className={classes.control}>
          <label htmlFor={'interests'}>Interests</label>
          <input type={'text'} {...register('interests',
              {required: true})} />
          {errors.password && 'Group Name is required'}
        </div>

        <div className={classes.control}>
          <label htmlFor={'Description'}>Description</label>
          <textarea {...register('Description',
              {required: true})} />
          {errors.password && 'Group Name is required'}
        </div>

        <div className={classes.control}>
          <label htmlFor={'members'}>Add members</label>
          <input type={'text'} {...register('members',
              {required: false})} />
          {errors.password && 'Members are not required?'}
        </div>

        <div className={classes.actions}>
          <button onClick={() => navigate('/home')} className={classes.buttonSecondary}>Cancel</button>
          <button className={classes.buttonPrimary}>Create Group</button>
        </div>

      </form>
    </Card>
  );
}
