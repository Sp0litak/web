import React from 'react';
import styles from './SkinSwitcher.module.scss';

const skins = [
  { id: 'light', label: 'Світла', price: 0 },
  { id: 'dark', label: 'Темна', price: 200 },
  { id: 'red', label: 'Червона', price: 300 },
  { id: 'blue', label: 'Синя', price: 500 },
];

const SkinSwitcher = ({ skin, changeSkin, credits, ownedSkins }) => {
  return (
    <div className={styles.panel}>
      <h2>Скіни / Змінити тему</h2>
      {skins.map(({ id, label, price }) => {
        const owned = ownedSkins.includes(id);
        const isActive = skin === id;

        return (
          <button
            key={id}
            onClick={() => changeSkin(id)}
            disabled={!owned && credits < price}
            className={`${isActive ? styles.active : ''} ${!owned ? styles.locked : ''}`}
          >
            {label}
            {owned ? (isActive ? ' ✓' : '') : ` – Купити за ${price}`}
          </button>
        );
      })}
    </div>
  );
};

export default SkinSwitcher;
