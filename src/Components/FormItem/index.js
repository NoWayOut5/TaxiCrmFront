import React from 'react'
import st from './index.module.scss'

const FormItem = ({ label, children }) => (
  <div className={st.formItem}>
    <div className={st.label}>{label}  </div>
    <div className={st.formItemChildren}> {children}</div>
  </div>
)

export default FormItem;