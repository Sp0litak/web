import React from 'react';
import styles from './PrestigePanel.module.scss';

const PrestigePanel = ({ prestigePoints, doPrestige, resetProgress }) => {
  const handlePrestige = () => {
    if (window.confirm('Скинути прогрес за DuiktCoins?')) {
      doPrestige();
    }
  };

  const handleReset = () => {
    if (window.confirm('Повний скидання прогресу?')) {
      resetProgress();
    }
  };

  return (
    <div className={styles.prestigePanel}>
      <h2>Престиж</h2>
      <p>Очки престижу: {prestigePoints}</p>
      <button onClick={handlePrestige} disabled={prestigePoints >= 10000}>
        Виконати престиж (конвертація)
      </button>
      <button onClick={handleReset} className={styles.resetButton}>
        Скинути все
      </button>
    </div>
  );
};

export default PrestigePanel;
