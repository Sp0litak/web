import React, { useState, useRef, useEffect } from 'react';

const segments = [
  { label: '10', value: 10 },
  { label: '50', value: 50 },
  { label: '100', value: 100 },
  { label: '200', value: 200 },
  { label: '500', value: 500 },
  { label: 'Бонус x2', value: 'booster' },
  { label: 'Анти-бонус x0.2', value: 'antibonus' },
  { label: 'Пусто', value: 0 },
];

export default function WheelOfFortune({ addCredits, activateBooster, activateAntibonus }) {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [cooldown, setCooldown] = useState(0);
  const wheelRef = useRef(null);
  const cooldownIntervalRef = useRef(null);

  useEffect(() => {
    if (cooldown > 0) {
      cooldownIntervalRef.current = setInterval(() => {
        setCooldown(c => {
          if (c <= 1) {
            clearInterval(cooldownIntervalRef.current);
            return 0;
          }
          return c - 1;
        });
      }, 1000);
    }
    return () => clearInterval(cooldownIntervalRef.current);
  }, [cooldown]);

  const spinWheel = () => {
    if (spinning || cooldown > 0) return;
    setSpinning(true);
    setResult(null);

    const segmentIndex = Math.floor(Math.random() * segments.length);
    const selectedSegment = segments[segmentIndex];

    const segmentAngle = 360 / segments.length;
    const randomTurns = 3 + Math.random() * 2;
    const finalRotation = 360 * randomTurns + segmentIndex * segmentAngle + segmentAngle / 2;

    if (wheelRef.current) {
      wheelRef.current.style.transition = 'transform 4s cubic-bezier(0.33, 1, 0.68, 1)';
      wheelRef.current.style.transform = `rotate(${finalRotation}deg)`;
    }

    setTimeout(() => {
      setSpinning(false);
      setResult(selectedSegment.label);

      // Обработка результата
      if (typeof selectedSegment.value === 'number' && selectedSegment.value > 0) {
        addCredits(selectedSegment.value);
      } else if (selectedSegment.value === 'booster') {
        activateBooster();
      } else if (selectedSegment.value === 'antibonus') {
        activateAntibonus();
      }

      setCooldown(30);
    }, 4000);
  };

  const resetWheel = () => {
    if (wheelRef.current) {
      wheelRef.current.style.transition = 'none';
      wheelRef.current.style.transform = 'rotate(0deg)';
    }
  };

  return (
    <div>
      <div
        ref={wheelRef}
        onTransitionEnd={resetWheel}
        style={{
          width: 200,
          height: 200,
          borderRadius: '50%',
          border: '5px solid #333',
          position: 'relative',
          margin: '0 auto',
          userSelect: 'none',
          cursor: spinning || cooldown > 0 ? 'wait' : 'pointer',
          background: 'conic-gradient(' +
            segments.map((seg, i) => (i % 2 === 0 ? '#f8c471' : '#f5b041') + ` ${i * (360 / segments.length)}deg ${(i + 1) * (360 / segments.length)}deg`).join(',') +
            ')',
        }}
        onClick={spinWheel}
        aria-disabled={spinning || cooldown > 0}
        role="button"
        tabIndex={0}
        onKeyDown={e => { if ((e.key === 'Enter' || e.key === ' ') && !spinning && cooldown === 0) spinWheel(); }}
        title={spinning ? 'Обертається...' : cooldown > 0 ? `Оберти доступно через ${cooldown} сек.` : 'Натисніть, щоб крутити колесо удачі'}
      >
        <div style={{
          position: 'absolute',
          top: -10,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 0,
          height: 0,
          borderLeft: '10px solid transparent',
          borderRight: '10px solid transparent',
          borderBottom: '20px solid red',
        }} />
      </div>
      {result && <p style={{ textAlign: 'center', marginTop: 10 }}>Результат: {result}</p>}
      {cooldown > 0 && <p style={{ textAlign: 'center', marginTop: 5 }}>До следующего вращения: {cooldown} сек.</p>}
    </div>
  );
}
