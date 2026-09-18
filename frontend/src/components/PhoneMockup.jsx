import { useEffect, useRef } from 'react';
import './PhoneMockup.css';

const SPARK_CHARS = ['✦', '✧', '★', '✴'];
const SPARK_TONES = ['var(--brand-red)', 'var(--brand-crimson)', 'var(--brand-maroon)'];
const pick = (list) => list[Math.floor(Math.random() * list.length)];
const clampTilt = (deg) => Math.max(-14, Math.min(14, deg));

// Decorative app splash screen. It tilts toward the pointer (or the device's own tilt)
// and throws sparks when pressed, swiped, or held. Hidden from assistive tech.
export default function PhoneMockup({ tags, tagline }) {
  const stageRef = useRef(null);
  const wrapRef = useRef(null);
  const phoneRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined;

    const stage = stageRef.current;
    const wrap = wrapRef.current;
    const phone = phoneRef.current;
    const timers = new Set();
    let lastSpark = 0;
    let isDragging = false;
    let isHolding = false;
    let holdTimer = null;
    let holdInterval = null;

    const later = (fn, ms) => {
      const t = setTimeout(() => {
        timers.delete(t);
        fn();
      }, ms);
      timers.add(t);
    };

    const setTilt = (rx, ry, transition) => {
      wrap.style.transition = `transform ${transition}`;
      wrap.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    };
    const resetTilt = () => setTilt(0, 0, '.7s cubic-bezier(.25,.46,.45,.94)');

    const setGlow = (blur, alpha, brightness, speed) => {
      wrap.style.transition = `filter ${speed}`;
      wrap.style.filter = `drop-shadow(0 0 ${blur}px rgba(175,28,28,${alpha})) brightness(${brightness})`;
    };
    const clearGlow = () => {
      wrap.style.transition = 'filter .3s ease';
      wrap.style.filter = '';
    };

    const phoneBox = () => {
      const p = wrap.getBoundingClientRect();
      const s = stage.getBoundingClientRect();
      return { cx: p.left - s.left + p.width / 2, cy: p.top - s.top + p.height / 2, hw: p.width / 2, hh: p.height / 2 };
    };

    const addSpark = (x, y, dx, dy, spin, quick) => {
      const el = document.createElement('span');
      const isLogo = Math.random() < 0.25;
      el.className = `phone-spark${isLogo ? ' phone-spark-logo' : ''}${quick ? ' phone-spark-quick' : ''}`;
      if (!isLogo) {
        el.textContent = pick(SPARK_CHARS);
        el.style.fontSize = `${(quick ? 9 : 10) + Math.floor(Math.random() * (quick ? 7 : 9))}px`;
        el.style.color = pick(SPARK_TONES);
      }
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      el.style.setProperty('--spark-x', `${dx}px`);
      el.style.setProperty('--spark-y', `${dy}px`);
      el.style.setProperty('--spark-spin', `${spin}deg`);
      stage.appendChild(el);
      later(() => el.remove(), quick ? 500 : 750);
    };

    const riseSpark = (x, y) =>
      addSpark(x, y, (Math.random() - 0.5) * 70, -28 - Math.random() * 52, (Math.random() - 0.5) * 200, false);

    const trailSpark = (x, y) => {
      const now = Date.now();
      if (now - lastSpark < 130) return;
      lastSpark = now;
      riseSpark(x, y);
    };

    const burst = () => {
      const { cx, cy } = phoneBox();
      for (let i = 0; i < 6; i++) {
        later(() => riseSpark(cx + (Math.random() - 0.5) * 80, cy + (Math.random() - 0.5) * 110), i * 40);
      }
    };

    const edgeSparks = (count) => {
      const { cx, cy, hw, hh } = phoneBox();
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 38 + Math.random() * 58;
        addSpark(
          cx + Math.cos(angle) * (hw * 0.9 + (Math.random() - 0.5) * 10),
          cy + Math.sin(angle) * (hh * 0.9 + (Math.random() - 0.5) * 10),
          Math.cos(angle) * speed,
          Math.sin(angle) * speed,
          (Math.random() - 0.5) * 380,
          true
        );
      }
    };

    const onMouseMove = (e) => {
      const r = stage.getBoundingClientRect();
      setTilt(((e.clientY - r.top) / r.height - 0.5) * -14, ((e.clientX - r.left) / r.width - 0.5) * 14, '.08s linear');
      if (isDragging) lastSpark = 0;
      trailSpark(e.clientX - r.left + (Math.random() - 0.5) * 30, e.clientY - r.top + (Math.random() - 0.5) * 30);
    };
    const onMouseDown = () => {
      isDragging = true;
      burst();
    };
    const onMouseUp = () => {
      if (!isDragging) return;
      isDragging = false;
      resetTilt();
    };

    const onOrientation = (e) => {
      if (e.gamma === null) return;
      setTilt(clampTilt((e.beta - 45) * 0.28), clampTilt(e.gamma * 0.38), '.15s linear');
    };

    const onTouchStart = () => {
      isHolding = false;
      setGlow(22, 0.65, 1.1, '.1s ease');
      burst();
      later(() => {
        if (!isHolding) clearGlow();
      }, 280);
      holdTimer = setTimeout(() => {
        isHolding = true;
        phone.classList.add('is-holding');
        setGlow(32, 0.85, 1.18, '.2s ease');
        holdInterval = setInterval(() => edgeSparks(5), 80);
      }, 500);
    };
    // Passive, so a swipe that starts on the phone still scrolls the page.
    const onTouchMove = () => {
      clearTimeout(holdTimer);
      edgeSparks(5 + Math.floor(Math.random() * 4));
    };
    const onTouchEnd = () => {
      isHolding = false;
      clearTimeout(holdTimer);
      clearInterval(holdInterval);
      phone.classList.remove('is-holding');
      clearGlow();
      resetTilt();
    };

    // iOS 13+ asks permission for motion data, and only from inside a user gesture.
    const needsPermission = typeof DeviceOrientationEvent !== 'undefined'
      && typeof DeviceOrientationEvent.requestPermission === 'function';
    const askForMotion = () => {
      DeviceOrientationEvent.requestPermission()
        .then((state) => {
          if (state === 'granted') window.addEventListener('deviceorientation', onOrientation);
        })
        .catch(() => {});
    };
    if (needsPermission) {
      document.addEventListener('touchstart', askForMotion, { once: true, passive: true });
    } else {
      window.addEventListener('deviceorientation', onOrientation);
    }

    stage.addEventListener('mousemove', onMouseMove);
    stage.addEventListener('mouseleave', resetTilt);
    wrap.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    wrap.addEventListener('touchstart', onTouchStart, { passive: true });
    wrap.addEventListener('touchmove', onTouchMove, { passive: true });
    wrap.addEventListener('touchend', onTouchEnd, { passive: true });
    wrap.addEventListener('touchcancel', onTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', askForMotion);
      window.removeEventListener('deviceorientation', onOrientation);
      stage.removeEventListener('mousemove', onMouseMove);
      stage.removeEventListener('mouseleave', resetTilt);
      wrap.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
      wrap.removeEventListener('touchstart', onTouchStart);
      wrap.removeEventListener('touchmove', onTouchMove);
      wrap.removeEventListener('touchend', onTouchEnd);
      wrap.removeEventListener('touchcancel', onTouchEnd);
      timers.forEach(clearTimeout);
      clearTimeout(holdTimer);
      clearInterval(holdInterval);
      stage.querySelectorAll('.phone-spark').forEach((el) => el.remove());
    };
  }, []);

  return (
    <div className="phone-stage" ref={stageRef} aria-hidden="true">
      <div className="phone-wrap" ref={wrapRef}>
        {tags.map((tag, i) => (
          <span key={tag} className={`phone-tag phone-tag-${i + 1}`}>{tag}</span>
        ))}
        <div className="phone" ref={phoneRef}>
          <div className="phone-island" />
          <div className="phone-screen">
            <div className="phone-status">
              <span>11:11</span>
              <span className="phone-signal">●●●</span>
            </div>
            <div className="phone-splash">
              <span className="phone-logo" />
              <p className="phone-tagline">{tagline}</p>
            </div>
            <div className="phone-buttons">
              <span className="phone-btn phone-btn-fill">register</span>
              <span className="phone-btn phone-btn-outline">log in</span>
              <span className="phone-guest">log in as guest</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
