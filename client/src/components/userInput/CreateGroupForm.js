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
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data),
    }).then((res) => {
      if (res.ok) {
        console.log('group created!');
      } else {
        console.log(res.text()); // TODO
      }
    });
  };


  return (
    <Card>
      <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>

        <div className={classes.control}>
          <label htmlFor={'groupName'}>Group name</label>
          <input type={'text'} {...register('groupName',
              {required: true})} />
          {errors.password && 'Group Name is required'}
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
          <label htmlFor={'groupName'}>Add members</label>
          <input type={'text'} {...register('groupName',
              {required: true})} />
          {errors.password && 'Group Name is required'}
        </div>


        <div className={classes.actions}>
          <button>Create Group</button>
        </div>


      </form>
    </Card>
  );
}
