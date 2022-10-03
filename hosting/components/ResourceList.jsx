import * as React from 'react';

export default function ResourceList({ resources }) {
  return (
    <>
      <ul>
        {resources.map(({ id, name, link }) => (
          <li key={id}>
            {name}
            <br />
            {link}
          </li>
        ))}
      </ul>
    </>
  );
}
