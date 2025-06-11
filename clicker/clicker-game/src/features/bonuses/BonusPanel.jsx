import React, { useEffect, useState } from 'react';
import styles from './BonusPanel.module.scss';

const BonusPanel = ({
  openCase,
  canOpenCase,
  getCaseCooldown,
  activateBooster,
  boosterActive,
  boosterCooldown,
}) => {

  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    setCooldown(getCaseCooldown());

    const interval = setInterval(() => {
      setCooldown(getCaseCooldown());
    }, 1000);

    return () => clearInterval(interval);
  }, [getCaseCooldown]);

  const handleCaseOpen = () => {
    if (!canOpenCase()) {
      alert(`🕒 Кейс можна буде відкрити через ${cooldown} сек.`);
      return;
    }

    const reward = openCase();
    if (reward !== null) {
      alert(`🎁 Ви відкрили кейс і отримали +${reward} кредитів!`);
      setCooldown(getCaseCooldown());
    }
  };

  const handleBooster = () => {
    if (boosterCooldown > 0 || boosterActive) {
      alert(`🚀 Бустер активний або на перезарядці. Зачекайте ${boosterCooldown} сек.`);
      return;
    }
    activateBooster();
    alert('🚀 Активовано бустер на 30 секунд!');
  };

  return (
    <div className={styles.panel}>
      <h2>Бонуси</h2>
      <button onClick={handleCaseOpen} disabled={cooldown > 0}>
        {cooldown > 0 ? `Зачекайте ${cooldown}с` : 'Відкрити кейс'}
      </button>
      <button
        onClick={handleBooster}
        disabled={boosterActive || boosterCooldown > 0}
      >
        {boosterActive
          ? 'Бустер активний!'
          : boosterCooldown > 0
          ? `Бустер: ${boosterCooldown}с`
          : 'Активувати бустер'}
      </button>
    </div>
  );
};

export default BonusPanel;
