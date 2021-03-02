import React from 'react';
import TextField from '@material-ui/core/TextField';

import { useForm, Controller } from 'react-hook-form';

const Index = (props) => (
  <Controller as={<TextField {...props} />} />
);

export default Index;