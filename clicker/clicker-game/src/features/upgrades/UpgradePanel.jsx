// src/components/UpgradePanel.jsx
import React from 'react';
import styles from './UpgradePanel.module.scss';

const UpgradePanel = ({ upgrades, buyUpgrade }) => {
  return (
    <div className={styles.upgradePanel}>
      <h2>Апгрейди</h2>
      {upgrades.length === 0 ? (
        <p>Всі апгрейди куплені</p>
      ) : (
        <ul>
          {upgrades.map(({ id, name, price, bonus }) => (
            <li key={id}>
              <button onClick={() => buyUpgrade(id)}>
                {name} (Бонус: {bonus}) – {price} кредитів
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UpgradePanel;
