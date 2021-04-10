import React from 'react'

const FileInput = ({
  name,
  onChange
}) => (
  <div>
    <input
      type="file"
      id={name}
      onChange={onChange}
    />
  </div>
)

export default FileInput