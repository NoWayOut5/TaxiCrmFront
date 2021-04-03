import React from 'react';
import { useForm, Controller } from "react-hook-form";

const Select = ({
  name,
  control,
  defaultValue
}) => (
  <Controller
    render={({ onChange, onBlur, value, name, ref }) => {
      return (
        <Select
          onChange={onChange}
          onBlur={onBlur}
          value={value == '0' ? 'Заблокирован' : 'Активен'}
          name={name}
          ref={ref}
          defaultValue="Активен"
        >
          <Option value="0">Заблокирован</Option>
          <Option value="1">Активен</Option>
        </Select>
      )
    }}
    name="enabled"
    control={control}
  />
);

export default Select;