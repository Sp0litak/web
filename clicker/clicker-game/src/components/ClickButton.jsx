import React from 'react';
import styles from './ClickButton.module.scss';

const ClickButton = ({ onClick, clickValue }) => {
  const handleClick = () => {
    onClick();
    console.log(`+${clickValue.toFixed(2)} click!`);
  };

  return (
    <button className={styles.button} onClick={handleClick}>
      Натисни мене! (+{clickValue.toFixed(2)})
    </button>
  );
};

export default ClickButton;
