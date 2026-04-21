
import { useEffect, useRef } from 'react';
import './event_qr.css';

function EventQr() {
  const canvasRef = useRef(null);
  const counterRef = useRef(null);

  /* ── 1. Particle Canvas ─────────────── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animId;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.r = Math.random() * 1.8 + 0.4;
        this.alpha = Math.random() * 0.5 + 0.1;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = -(Math.random() * 0.4 + 0.1);
        this.life = 0;
        this.maxLife = Math.random() * 300 + 200;
        const hue = Math.random() > 0.5 ? 250 : 38;
        this.color = `hsla(${hue}, 75%, 72%, `;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life++;
        const t = this.life / this.maxLife;
        this.currentAlpha = this.alpha * Math.sin(Math.PI * t);
        if (this.life >= this.maxLife) this.reset();
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = this.color + this.currentAlpha + ')';
        ctx.fill();
      }
    }

    for (let i = 0; i < 80; i++) {
      const p = new Particle();
      p.life = Math.floor(Math.random() * p.maxLife);
      particles.push(p);
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      animId = requestAnimationFrame(animate);
    }
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  /* ── 2. Number Counter ──────────────── */
  useEffect(() => {
    const el = counterRef.current;
    if (!el) return;
    const target = 50000;
    let started = false;

    function formatNum(n) {
      return Math.floor(n).toLocaleString('ko-KR');
    }

    function runCounter() {
      const duration = 2000;
      const start = performance.now();
      function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        el.textContent = formatNum(target * ease);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = formatNum(target);
      }
      requestAnimationFrame(step);
    }

    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !started) {
        started = true;
        runCounter();
      }
    }, { threshold: 0.5 });
    obs.observe(el);

    return () => obs.disconnect();
  }, []);

  /* ── 3. AOS (scroll reveal) ─────────── */
  useEffect(() => {
    const targets = document.querySelectorAll('[data-aos]');
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('aos-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    targets.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  /* ── 4. Benefit cards: slide from left ─ */
  useEffect(() => {
    const cards = document.querySelectorAll('.b-card');
    cards.forEach((c, i) => {
      c.style.opacity = '0';
      c.style.transform = 'translateX(-36px)';
      c.style.transition = `opacity 0.55s ${i * 0.1}s ease, transform 0.55s ${i * 0.1}s ease`;
    });

    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const c = entry.target;
          c.style.opacity = '1';
          c.style.transform = 'translateX(0)';
          obs.unobserve(c);
        }
      });
    }, { threshold: 0.15 });

    cards.forEach(c => obs.observe(c));
    return () => obs.disconnect();
  }, []);

  /* ── 5. Smooth anchor scroll ────────── */
  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault();
    const target = document.querySelector(targetId);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section className="hero">
        <canvas ref={canvasRef} id="particles"></canvas>
        <div className="hero__glow-1"></div>
        <div className="hero__glow-2"></div>
        <div className="hero__glow-3"></div>

        <div className="hero__content">
          <div className="hero__badge">
            <span className="dot"></span>
            🎉 LIMITED EVENT
          </div>

          <p className="hero__eyebrow">피카플레이 QR 로그인과 함께하는</p>

          <h1 className="hero__title">
            매주
            <span className="hero__num" ref={counterRef}>0</span>
            마일리지<br />당첨 이벤트
          </h1>

          <div className="hero__box">
            <p><strong>QR 로그인 이용 횟수가 많을수록 당첨 확률이 올라갑니다!</strong></p>
            <p className="note">*스마트폰 기본 카메라 APP으로도 로그인이 가능합니다!</p>
          </div>

          <a
            href="#qr-how"
            className="btn btn--primary"
            onClick={(e) => handleSmoothScroll(e, '#qr-how')}
          >
            참여 방법 알아보기
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

        <div className="hero__scroll">
          <div className="hero__scroll-mouse"></div>
          <p>SCROLL</p>
        </div>
      </section>

      {/* ══════════════════════════════════════
          QR 로그인 이용 방법
      ══════════════════════════════════════ */}
      <section className="section" id="qr-how">
        <div className="container">
          <div className="section__hd" data-aos="">
            <span className="section__label">HOW TO PARTICIPATE</span>
            <h2 className="section__title">QR 로그인 이용 방법</h2>
          </div>

          <div className="steps-row">
            {/* Step 01 */}
            <div className="step" data-aos="" data-delay="1">
              <div className="step__num">01</div>
              <div className="step__card">
                <span className="step__card-icon">📱</span>
                <span className="step__card-label">피카플레이 APP<br />회원가입 이미지</span>
              </div>
              <div className="step__pill">Step 01</div>
              <p className="step__desc">피카플레이 App<br />회원가입 &amp; 로그인</p>
            </div>

            {/* Arrow */}
            <div className="step-connector" aria-hidden="true">
              <svg viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 10h24M20 4l8 6-8 6" stroke="#818CF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* Step 02 */}
            <div className="step" data-aos="" data-delay="2">
              <div className="step__num">02</div>
              <div className="step__card">
                <span className="step__card-icon">🖥️</span>
                <span className="step__card-label">AI 클라이언트 잠금화면<br />&amp; QR 로그인 이미지</span>
              </div>
              <div className="step__pill">Step 02</div>
              <p className="step__desc">PC방 회원 자리에서<br />QR로 로그인!</p>
              <p className="step__note">*첫 방문 매장인 경우 PC방 ID와<br />연동이 필요합니다.</p>
            </div>

            {/* Arrow */}
            <div className="step-connector" aria-hidden="true">
              <svg viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 10h24M20 4l8 6-8 6" stroke="#818CF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* Step 03 */}
            <div className="step" data-aos="" data-delay="3">
              <div className="step__num">03</div>
              <div className="step__card">
                <span className="step__card-icon">🎮</span>
                <span className="step__card-label">PC방에서 게임 &amp; 먹을거<br />먹으면서 노는 이미지</span>
              </div>
              <div className="step__pill">Step 03</div>
              <p className="step__desc">이벤트 자동 참가 &amp;<br />즐겁게 PC방 이용!</p>
            </div>
          </div>

          <div className="cta-banner" data-aos="">
            🎁 피카플레이 APP에서도 다양한 혜택을 받으시면서 즐겨보세요!
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          혜택 안내 (DARK)
      ══════════════════════════════════════ */}
      <section className="benefits" id="benefits">
        <div className="benefits__blob-1"></div>
        <div className="benefits__blob-2"></div>

        <div className="container">
          <div className="benefits__inner">
            {/* Left: benefit cards */}
            <div className="benefits__left">
              <div className="benefits__hd" data-aos="">
                <span className="section__label">BENEFITS</span>
                <h2 className="section__title">마일리지, 이렇게 받아요!</h2>
              </div>

              <div className="b-card" data-aos="" data-delay="1">
                <div className="b-card__icon">📅</div>
                <div>
                  <h3>매일 받아요</h3>
                  <p>출석체크, 행운의 룰렛, 오늘의 운세 보고 마일리지 받기!</p>
                </div>
              </div>

              <div className="b-card" data-aos="" data-delay="2">
                <div className="b-card__icon">🕹️</div>
                <div>
                  <h3>재밌게 받아요</h3>
                  <p>달고나 게임, 두더지 잡기, 다른 색 찾기, 오목, 점핑캣 등<br />다양한 게임을 플레이하고 마일리지 받기!</p>
                </div>
              </div>

              <div className="b-card" data-aos="" data-delay="3">
                <div className="b-card__icon">🎯</div>
                <div>
                  <h3>다양하게 받아요</h3>
                  <p>게임 미션, 일반 미션 참여하고 마일리지 받기!</p>
                </div>
              </div>

              <div className="b-card b-card--gold" data-aos="" data-delay="4">
                <div className="b-card__icon">💡</div>
                <div>
                  <h3>모르면 손해!</h3>
                  <p>다양한 PC게임 이벤트!</p>
                </div>
              </div>
            </div>

            {/* Right: phone mockup */}
            <div className="phone-wrap" data-aos="" data-delay="2">
              <div className="phone-float">
                <div className="phone-device">
                  <div className="phone-screen">
                    <span className="ps-tag">피카플레이 APP</span>
                    <p className="ps-title">
                      선택한 태그<br />이미지 노출<br />
                      <strong style={{ color: '#818CF8' }}>혜택존</strong>
                    </p>
                    <div className="ps-items">
                      <div className="ps-item">
                        <span className="pi">📅</span>
                        <span className="pt">매일 받아요</span>
                      </div>
                      <div className="ps-item">
                        <span className="pi">🕹️</span>
                        <span className="pt">재밌게 받아요</span>
                      </div>
                      <div className="ps-item">
                        <span className="pi">🎯</span>
                        <span className="pt">다양하게 받아요</span>
                      </div>
                      <div className="ps-item" style={{ border: '1px solid rgba(245,158,11,0.25)' }}>
                        <span className="pi">💡</span>
                        <span className="pt" style={{ color: '#FCD34D' }}>모르면 손해!</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="phone-reflection"></div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          혜택존 이용방법
      ══════════════════════════════════════ */}
      <section className="section section--gray" id="app-how">
        <div className="container">
          <div className="section__hd" data-aos="">
            <span className="section__label">APP GUIDE</span>
            <h2 className="section__title">피카플레이 APP <em>혜택존</em> 이용방법!</h2>
          </div>

          <div className="steps-row">
            {/* Step 01 */}
            <div className="step" data-aos="" data-delay="1">
              <div className="step__num">01</div>
              <div className="step__card">
                <span className="step__card-icon">📱</span>
                <span className="step__card-label">피카플레이 APP<br />회원가입 이미지</span>
              </div>
              <div className="step__pill">Step 01</div>
              <p className="step__desc">피카플레이 App<br />회원가입 &amp; 로그인</p>
            </div>

            <div className="step-connector">
              <svg viewBox="0 0 32 20" fill="none">
                <path d="M2 10h24M20 4l8 6-8 6" stroke="#818CF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* Step 02 */}
            <div className="step" data-aos="" data-delay="2">
              <div className="step__num">02</div>
              <div className="step__card">
                <span className="step__card-icon">📋</span>
                <span className="step__card-label">APP 혜택박스<br />선택한 화면</span>
              </div>
              <div className="step__pill">Step 02</div>
              <p className="step__desc">메뉴에서<br />혜택박스 선택!</p>
            </div>

            <div className="step-connector">
              <svg viewBox="0 0 32 20" fill="none">
                <path d="M2 10h24M20 4l8 6-8 6" stroke="#818CF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* Step 03 */}
            <div className="step" data-aos="" data-delay="3">
              <div className="step__num">03</div>
              <div className="step__card">
                <span className="step__card-icon">🕹️</span>
                <span className="step__card-label">게임하는 이미지</span>
              </div>
              <div className="step__pill">Step 03</div>
              <p className="step__desc">원하는 이벤트 참여!</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FOOTER
      ══════════════════════════════════════ */}
      <footer className="footer">
        <p className="footer__logo">PICA<span>PLAY</span></p>
        <div className="footer__divider"></div>
        <p>&copy; PICAPLAY. All rights reserved.</p>
        <p>이벤트 관련 문의사항은 고객센터를 이용해 주세요.</p>
      </footer>
    </>
  );
}

export default EventQr;
