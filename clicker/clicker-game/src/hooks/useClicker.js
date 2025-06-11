// useClicker.js
import { useEffect, useState, useRef } from 'react';
import { get, set } from 'idb-keyval';

export const useClicker = () => {
  const [credits, setCredits] = useState(0);
  const [clickValue, setClickValue] = useState(1);
  const [upgrades, setUpgrades] = useState([
    { id: 1, name: 'Click Power x2', price: 100, bonus: 'x2' },
    { id: 2, name: 'Auto Clicker', price: 250, bonus: '1/s' },
    { id: 3, name: 'Click Power x3', price: 500, bonus: 'x3' },
    { id: 4, name: 'Auto Clicker Speed x2', price: 1000, bonus: 'x2 Speed' },
    { id: 5, name: 'Click Power +10', price: 750, bonus: '+10' },
  ]);

  const skins = [
    { id: 'light', label: 'Світла', price: 0 },
    { id: 'dark', label: 'Темна', price: 200 },
    { id: 'red', label: 'Червона', price: 300 },
    { id: 'blue', label: 'Синя', price: 500 },
  ];

  const [autoClickerActive, setAutoClickerActive] = useState(false);
  const [lastCaseOpenTime, setLastCaseOpenTime] = useState(0);
  const [prestigePoints, setPrestigePoints] = useState(0);

  const [boosterActive, setBoosterActive] = useState(false);
  const [boosterCooldown, setBoosterCooldown] = useState(0);
  const boosterTimeout = useRef(null);
  const boosterCooldownInterval = useRef(null);

  const [antibonusActive, setAntibonusActive] = useState(false);
  const [antibonusCooldown, setAntibonusCooldown] = useState(0);
  const antibonusTimeout = useRef(null);
  const antibonusCooldownInterval = useRef(null);

  const autoClickerInterval = useRef(null);

  const [skin, setSkin] = useState('light');
  const [ownedSkins, setOwnedSkins] = useState(() => {
    const saved = localStorage.getItem('ownedSkins');
    return saved ? JSON.parse(saved) : ['light'];
  });

  const [caseCooldown, setCaseCooldown] = useState(0);
  const caseCooldownInterval = useRef(null);

  const addCredits = (amount) => setCredits(c => c + amount);

  // Загрузка сохранения из IndexedDB при старте
  useEffect(() => {
    async function load() {
      const saved = await get('clickerSave');
      if (saved) {
        setCredits(saved.credits || 0);
        setClickValue(saved.clickValue || 1);
        setUpgrades(saved.upgrades || upgrades);
        setPrestigePoints(saved.prestigePoints || 0);
        setAutoClickerActive(saved.autoClickerActive || false);
        setSkin(saved.skin || 'light');
        if (saved.skin) document.body.className = saved.skin;
      } else {
        document.body.className = 'light';
      }
    }
    load();
  }, []);

  // Автосохранение каждые 5 секунд
  useEffect(() => {
    const interval = setInterval(() => {
      set('clickerSave', {
        credits,
        clickValue,
        upgrades,
        prestigePoints,
        autoClickerActive,
        skin,
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [credits, clickValue, upgrades, prestigePoints, autoClickerActive, skin]);

  // Автокликер
  useEffect(() => {
    if (autoClickerActive) {
      autoClickerInterval.current = setInterval(() => {
        setCredits(c => c + clickValue);
      }, 1000);
    } else {
      clearInterval(autoClickerInterval.current);
    }
    return () => clearInterval(autoClickerInterval.current);
  }, [autoClickerActive, clickValue]);

  // Бустер
  useEffect(() => {
    if (boosterActive) {
      boosterTimeout.current = setTimeout(() => {
        setBoosterActive(false);
        setBoosterCooldown(30);
        boosterCooldownInterval.current = setInterval(() => {
          setBoosterCooldown(c => {
            if (c <= 1) {
              clearInterval(boosterCooldownInterval.current);
              return 0;
            }
            return c - 1;
          });
        }, 1000);
      }, 30000);
    }
    return () => {
      clearTimeout(boosterTimeout.current);
      clearInterval(boosterCooldownInterval.current);
    };
  }, [boosterActive]);

  // Антибонус
  useEffect(() => {
    if (antibonusActive) {
      antibonusTimeout.current = setTimeout(() => {
        setAntibonusActive(false);
        setAntibonusCooldown(30);
        antibonusCooldownInterval.current = setInterval(() => {
          setAntibonusCooldown(cd => {
            if (cd <= 1) {
              clearInterval(antibonusCooldownInterval.current);
              return 0;
            }
            return cd - 1;
          });
        }, 1000);
      }, 15000);
    }
    return () => {
      clearTimeout(antibonusTimeout.current);
      clearInterval(antibonusCooldownInterval.current);
    };
  }, [antibonusActive]);

  // Логика клика с учетом бонусов и престижных очков
  const increaseCredits = () => {
    const antiMultiplier = antibonusActive ? 0.2 : 1;
    const boosterMultiplier = boosterActive ? 2 : 1;
    const prestigeBonus = 1 + prestigePoints * 0.1;
    setCredits(c => c + clickValue * boosterMultiplier * antiMultiplier * prestigeBonus);
  };

  // Покупка апгрейда (с удалением апгрейда после покупки)
  const buyUpgrade = (id) => {
    const upgrade = upgrades.find(u => u.id === id);
    if (!upgrade || credits < upgrade.price) return;

    setCredits(c => c - upgrade.price);

    const { bonus } = upgrade;
    if (bonus.includes('x') && bonus.includes('Speed') && autoClickerActive) {
      // Ускорение автокликера в 2 раза
      clearInterval(autoClickerInterval.current);
      autoClickerInterval.current = setInterval(() => {
        setCredits(c => c + clickValue);
      }, 500);
    } else if (bonus.startsWith('x')) {
      // Множитель клика
      const multiplier = Number(bonus.replace('x', ''));
      setClickValue(cv => cv * multiplier);
    } else if (bonus.startsWith('+')) {
      // Добавка к клику
      const value = Number(bonus.replace('+', ''));
      setClickValue(cv => cv + value);
    } else if (bonus.includes('/s')) {
      // Включение автокликера
      setAutoClickerActive(true);
    }

    // Удаляем купленный апгрейд из списка
    setUpgrades(prev => prev.filter(u => u.id !== id));
  };

  // Проверка возможности открыть кейс
  const canOpenCase = () => Date.now() - lastCaseOpenTime >= 30000;

  // Открытие кейса с наградой
  const openCase = () => {
    const now = Date.now();
    if (!canOpenCase()) return null;
    const reward = Math.floor(Math.random() * 100) + 50;
    setCredits(c => c + reward);
    setLastCaseOpenTime(now);
    return reward;
  };

  // Остаток кулдауна кейса в секундах
  const getCaseCooldown = () => {
    const remaining = 30000 - (Date.now() - lastCaseOpenTime);
    return remaining > 0 ? Math.ceil(remaining / 1000) : 0;
  };

  useEffect(() => {
    caseCooldownInterval.current = setInterval(() => {
      setCaseCooldown(getCaseCooldown());
    }, 1000);
    return () => clearInterval(caseCooldownInterval.current);
  }, [lastCaseOpenTime]);

  const activateBooster = () => {
    if (boosterCooldown === 0 && !boosterActive) {
      setBoosterActive(true);
    }
  };

  const activateAntibonus = () => {
    if (antibonusCooldown === 0 && !antibonusActive) {
      setAntibonusActive(true);
    }
  };

  // Престиж — сброс прогресса с начислением очков
  const doPrestige = () => {
    const gainedPoints = Math.floor(credits / 1000);
    if (gainedPoints > 0) {
      setPrestigePoints(p => p + gainedPoints);
      setCredits(0);
      setClickValue(1);
      setAutoClickerActive(false);
    }
  };

  // Полный сброс прогресса
  const resetProgress = () => {
    setCredits(0);
    setClickValue(1);
    const defaultUpgrades = [
      { id: 1, name: 'Click Power x2', price: 100, bonus: 'x2' },
      { id: 2, name: 'Auto Clicker', price: 250, bonus: '1/s' },
      { id: 3, name: 'Click Power x3', price: 500, bonus: 'x3' },
      { id: 4, name: 'Auto Clicker Speed x2', price: 1000, bonus: 'x2 Speed' },
      { id: 5, name: 'Click Power +10', price: 750, bonus: '+10' },
    ];
    setUpgrades(defaultUpgrades);
    setPrestigePoints(0);
    setBoosterActive(false);
    setBoosterCooldown(0);
    setAntibonusActive(false);
    setAntibonusCooldown(0);

    const defaultSkin = 'light';
    setSkin(defaultSkin);
    setOwnedSkins([defaultSkin]);
    localStorage.setItem('ownedSkins', JSON.stringify([defaultSkin]));
    document.body.className = defaultSkin;

    localStorage.removeItem('clickerData');
    set('clickerSave', {
      credits: 0,
      clickValue: 1,
      upgrades: defaultUpgrades,
      prestigePoints: 0,
      autoClickerActive: false,
      skin: defaultSkin,
    });
  };

  // Смена скина (покупка, если нужно)
  const changeSkin = (newSkin) => {
    const skinInfo = skins.find(s => s.id === newSkin);
    if (!skinInfo) return;

    if (!ownedSkins.includes(newSkin)) {
      if (credits >= skinInfo.price) {
        setCredits(prev => prev - skinInfo.price);
        const updated = [...ownedSkins, newSkin];
        setOwnedSkins(updated);
        localStorage.setItem('ownedSkins', JSON.stringify(updated));
      } else return; // Недостатньо кредитів
    }

    setSkin(newSkin);
    document.body.className = newSkin;
  };

  return {
  credits,
  clickValue,
  upgrades,
  buyUpgrade,
  increaseCredits,
  autoClickerActive,
  setAutoClickerActive,
  openCase,
  canOpenCase,
  getCaseCooldown,
  caseCooldown,
  boosterActive,
  boosterCooldown,
  activateBooster,
  antibonusActive,
  antibonusCooldown,
  activateAntibonus,
  doPrestige,
  resetProgress,
  skin,
  changeSkin,
  ownedSkins,
};

};
