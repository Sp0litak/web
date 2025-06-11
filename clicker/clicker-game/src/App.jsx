import React, { useState } from 'react';

import { useClicker } from './hooks/useClicker';
import WheelOfFortune from './features/bonuses/WheelOfFortune';
import UpgradePanel from './features/upgrades/UpgradePanel';
import BonusPanel from './features/bonuses/BonusPanel';
import AntiBonusPanel from './features/antibonuses/AntiBonusPanel';
import PrestigePanel from './features/prestige/PrestigePanel';
import SkinSwitcher from './features/skins/SkinSwitcher';
import ClickButton from './components/ClickButton';

import styles from './styles/App.module.scss';

function App() {
  const {
    credits,
    clickValue,
    increaseCredits,
    upgrades,
    buyUpgrade,
    openCase,
    canOpenCase,
    getCaseCooldown,
    boosterActive,
    boosterCooldown,
    activateBooster,
    antibonusActive,
    antibonusCooldown,
    activateAntibonus,
    prestigePoints,
    doPrestige,
    resetProgress,
    skin,
    changeSkin,
    ownedSkins,
    caseCooldown,
    skins,
  } = useClicker();

  const [wheelCredits, setWheelCredits] = useState(0);

  const handlePrestige = () => {
    setWheelCredits(0); 
    doPrestige();
  };

  return (
    <div className={`${styles.app} ${styles[skin]}`}>
      <div className={styles.header}>
        <h1>Клікер на React</h1>
        <div>Кредити: {(credits + wheelCredits).toFixed(2)}</div>
        <div>Потужність кліка: {clickValue.toFixed(2)}</div>
      </div>

      <ClickButton onClick={increaseCredits} clickValue={clickValue} />

      <UpgradePanel
        upgrades={upgrades}
        buyUpgrade={buyUpgrade}
        credits={credits}
      />

      <BonusPanel
        openCase={openCase}
        canOpenCase={canOpenCase}
        getCaseCooldown={getCaseCooldown}
        activateBooster={activateBooster}
        boosterActive={boosterActive}
        boosterCooldown={boosterCooldown}
      />

      <AntiBonusPanel
  antibonusActive={antibonusActive}
  antibonusCooldown={antibonusCooldown}
  activateAntibonus={activateAntibonus}
/>


      <PrestigePanel
        prestigePoints={prestigePoints}
        doPrestige={handlePrestige}
        resetProgress={resetProgress}
      />

      <SkinSwitcher
        skins={skins}
        currentSkin={skin}
        changeSkin={changeSkin}
        ownedSkins={ownedSkins}
        credits={credits}
      />

      <WheelOfFortune
  addCredits={amount => setWheelCredits(c => c + amount)}
  activateBooster={activateBooster}
  activateAntibonus={activateAntibonus}
/>

    </div>
  );
}

export default App;
