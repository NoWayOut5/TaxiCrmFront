import React from 'react';

const Table = ({
  children
}) => {


  console.log(children)

  return (
    <table>
      <thead>
        {React.Children.map(children[0], (item) => (
          console.log(item)
        ))}
      </thead>
      <tbody>
        {/*{React.Children.map(children, (item) => (*/}
        {/*  // <tr>{item}</tr>*/}
        {/*))}*/}
      </tbody>
    </table>
  );
}

export default Table;