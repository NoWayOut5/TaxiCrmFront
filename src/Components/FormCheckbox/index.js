import React from 'react'
import { Checkbox } from 'antd'

import st from './index.module.scss'

const FormCheckbox = (props) => (
  <div>
    <Checkbox
      {...props}
      className={st.checkbox}
    />
  </div>
)

export default FormCheckbox