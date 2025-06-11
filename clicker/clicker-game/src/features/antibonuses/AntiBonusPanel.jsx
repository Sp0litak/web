import React from 'react';
import styles from './AntiBonusPanel.module.scss';

const AntiBonusPanel = ({
  antibonusStates = {},  // если пропс не пришёл, будет пустой объект
  activateAntibonus,
}) => {
  const handleClick = (type) => {
    const state = antibonusStates[type] || { active: false, cooldown: 0 };
    const { active, cooldown } = state;

    if (active || cooldown > 0) {
      alert(`🛑 Антибонус «${type}» активний або на перезарядці. Зачекайте ${cooldown} сек.`);
      return;
    }

    activateAntibonus(type);
    alert(`🛑 Активовано антибонус «${type}»!`);
  };

  const buttons = [
    { label: '🐛 Баг', type: 'bug' },
    { label: '🦠 Вірус', type: 'virus' },
    { label: '🌐 DDoS-атака', type: 'ddos' },
    { label: '💥 Помилка системи', type: 'error' },
  ];

  return (
    <div className={styles.panel}>
      <h2>Антибонуси</h2>
      {buttons.map(({ label, type }) => {
        // если antibonusStates нет или ключа type - подставляем значения по умолчанию
        const state = antibonusStates && antibonusStates[type]
          ? antibonusStates[type]
          : { active: false, cooldown: 0 };

        const { active, cooldown } = state;

        return (
          <button
            key={type}
            onClick={() => handleClick(type)}
            disabled={active || cooldown > 0}
          >
            {active
              ? `${label} активний!`
              : cooldown > 0
              ? `${label}: ${cooldown}с`
              : `Активувати ${label}`}
          </button>
        );
      })}
    </div>
  );
};

export default AntiBonusPanel;
