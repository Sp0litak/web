import React from 'react';
import styles from './UpgradeItem.module.scss';

const UpgradeItem = ({ name, price, level, owned, affordable, onBuy }) => (
  <div className={styles.item}>
    <button onClick={onBuy} disabled={!affordable}>
      {name} {level ? `(x${level})` : ''} — {price.toFixed(2)} кредитів
    </button>
    {owned && <span className={styles.owned}>✅ Куплено</span>}
    {!affordable && <span className={styles.locked}>Недостатньо кредитів</span>}
  </div>
);


export default UpgradeItem;
