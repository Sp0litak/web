import React from 'react';
import styles from './StatsPanel.module.scss';

const StatsPanel = () => {
  return (
    <div className={styles.panel}>
      <p>Кредити: <strong>0</strong></p>
      <p>DuiktCoins: <strong>0</strong></p>
    </div>
  );
};

export default StatsPanel;
