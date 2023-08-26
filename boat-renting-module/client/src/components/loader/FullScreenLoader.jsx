import React from 'react';
import { CircularProgress, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  loaderContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
  },
}));

const FullScreenLoader = () => {
  const classes = useStyles();

  return (
    <div className={classes.loaderContainer}>
      <CircularProgress color='#00778b' />
    </div>
  );
};

export default FullScreenLoader;
