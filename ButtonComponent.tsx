import React from 'react';

const ButtonComponent: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <button onClick={onClick} style={{ backgroundColor: '#4CAF4F', color: 'white', border: 'none', padding: '15px', margin: '10px', cursor: 'pointer' }}>
      Click Me
    </button>
  );
};

export default ButtonComponent;
