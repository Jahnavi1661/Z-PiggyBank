"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
const COLORS = {
  yellow: "#E8F900",
  cyan: "#00D4E8",
  pink: "#FF6FD8",
  purple: "#C8B4FF",
  green: "#72F7AE",
  white: "#FFFFFF",
  black: "#0A0A0A",
  offwhite: "#F5F4EE",
};

export default function ZPiggyBank() {
  const [streak] = useState(26);
  const [xp] = useState(80);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [ticker, setTicker] = useState(0);

  const tickerItems = [
    "🐷 START SAVING TODAY",
    "🔥 26-DAY STREAK UNLOCKED",
    "💸 ₹48,200 TOTAL SAVINGS",
    "🚀 LEVEL 12 INVESTOR",
    "🎯 MACBOOK GOAL 72% DONE",
    "✈️ JAPAN TRIP INCOMING",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTicker((t) => (t + 1) % tickerItems.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{ fontFamily: "'Syne', 'Space Grotesk', sans-serif", background: COLORS.offwhite, color: COLORS.black }}
      className="min-h-screen overflow-x-hidden"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .hover-lift { transition: transform 0.18s ease; }
        .hover-lift:hover { transform: translateY(-3px) scale(1.015); }
        .btn-bounce { transition: transform 0.15s cubic-bezier(.34,1.56,.64,1); }
        .btn-bounce:hover { transform: scale(1.06); }
        .btn-bounce:active { transform: scale(0.97); }
        .marquee-track { display: flex; gap: 48px; white-space: nowrap; animation: marquee 18s linear infinite; }
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .progress-fill { transition: width 1.2s cubic-bezier(.4,0,.2,1); }
        .stripe-bg { background-image: repeating-linear-gradient(
          -45deg,
          transparent,
          transparent 8px,
          rgba(0,0,0,0.04) 8px,
          rgba(0,0,0,0.04) 16px
        ); }
        @media (max-width: 768px) {
          .hero-grid { flex-direction: column !important; }
          .phone-wrap { display: none !important; }
          .feat-grid { grid-template-columns: 1fr 1fr !important; }
          .goal-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 520px) {
          .feat-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* TICKER BAR */}
      <div style={{ background: COLORS.black, color: COLORS.yellow, padding: "10px 0", overflow: "hidden" }}>
        <div style={{ display: "flex" }}>
          <div className="marquee-track">
            {[...tickerItems, ...tickerItems].map((item, i) => (
              <span key={i} style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.08em" }}>{item}</span>
            ))}
          </div>
        </div>
      </div>

      {/* NAVBAR */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        background: COLORS.yellow, borderBottom: `3px solid ${COLORS.black}`,
        padding: "0 5%",
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: COLORS.black, display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: 22, border: `2px solid ${COLORS.black}`,
            }}>🐷</div>
            <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.03em" }}>Z-PiggyBank</span>
          </div>

          {/* Inside your navbar, replace the nav-links section with this: */}
<div style={{ display: "flex", gap: 36, fontSize: 14, fontWeight: 700 }} className="hidden md:flex">
  <a href="#goals" style={{ textDecoration: "none", color: COLORS.black, opacity: 0.75 }} className="hover-lift">Goals</a>
  <a href="savings" style={{ textDecoration: "none", color: COLORS.black, opacity: 0.75 }} className="hover-lift">Savings</a>
  
  {/* Updated Invest Link */}
  <a 
    href="/invest" 
    style={{ textDecoration: "none", color: COLORS.black, opacity: 0.75 }} 
    className="hover-lift"
  >
    Invest
  </a>
  
  <a href="#leaderboard" style={{ textDecoration: "none", color: COLORS.black, opacity: 0.75 }} className="hover-lift">Leaderboard</a>
</div>

          <button className="btn-bounce" style={{
            background: COLORS.black, color: COLORS.yellow,
            border: `2.5px solid ${COLORS.black}`, borderRadius: 40,
            padding: "10px 28px", fontWeight: 800, fontSize: 14,
            cursor: "pointer", fontFamily: "inherit",
          }}>Get Started →</button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "60px 5% 0" }}>
        <div className="hero-grid" style={{ display: "flex", alignItems: "flex-start", gap: 48 }}>

          {/* LEFT */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            >
              <span style={{
                display: "inline-block",
                background: COLORS.pink, color: COLORS.black,
                border: `2.5px solid ${COLORS.black}`,
                borderRadius: 40, padding: "7px 20px",
                fontWeight: 800, fontSize: 13, letterSpacing: "0.06em",
                marginBottom: 28,
              }}>LEVEL UP YOUR MONEY 💸</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.08 }}
              style={{
                fontSize: "clamp(52px, 7vw, 88px)",
                fontWeight: 800, lineHeight: 0.95,
                letterSpacing: "-0.04em", marginBottom: 28,
              }}
            >
              The fun<br />
              <span style={{
                background: COLORS.yellow,
                borderRadius: 12, padding: "0 8px",
                display: "inline", boxDecorationBreak: "clone",
              }}>way Gen Z</span><br />
              saves &amp; grows.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.16 }}
              style={{ fontSize: 17, lineHeight: 1.65, maxWidth: 440, color: "#444", marginBottom: 36 }}
            >
              Track expenses, build streaks, complete savings goals,
              learn investing, and unlock new financial levels—
              all wrapped in XP and badges.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.22 }}
              style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 44 }}
            >
              <button className="btn-bounce" style={{
                background: COLORS.black, color: COLORS.white,
                border: `2.5px solid ${COLORS.black}`, borderRadius: 14,
                padding: "14px 32px", fontWeight: 800, fontSize: 16,
                cursor: "pointer", fontFamily: "inherit",
              }}>Start Saving</button>
              <button className="btn-bounce" style={{
                background: COLORS.white, color: COLORS.black,
                border: `2.5px solid ${COLORS.black}`, borderRadius: 14,
                padding: "14px 28px", fontWeight: 800, fontSize: 16,
                cursor: "pointer", fontFamily: "inherit",
              }}>Explore Goals ↗</button>
            </motion.div>

            {/* STAT PILLS */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.28 }}
              style={{ display: "flex", gap: 14, flexWrap: "wrap" }}
            >
              {[
                { val: "₹12,400", label: "Saved this month", bg: COLORS.cyan },
                { val: `${streak} Day 🔥`, label: "Saving streak", bg: COLORS.yellow },
                { val: "LVL 12 🚀", label: "Investor level", bg: COLORS.purple },
              ].map(({ val, label, bg }) => (
                <div key={label} className="hover-lift" style={{
                  background: bg, border: `2.5px solid ${COLORS.black}`,
                  borderRadius: 18, padding: "16px 22px", minWidth: 130,
                }}>
                  <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.03em" }}>{val}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, opacity: 0.65, marginTop: 2 }}>{label}</div>
                </div>
              ))}
            </motion.div>

            {/* PRESS */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.4 }}
              style={{ marginTop: 48, borderTop: `2px solid ${COLORS.black}`, paddingTop: 24, display: "flex", gap: 36, alignItems: "center", flexWrap: "wrap" }}
            >
              
            </motion.div>
          </div>

          {/* RIGHT — PHONE MOCKUP */}
          <div className="phone-wrap" style={{ width: 340, flexShrink: 0, position: "relative", paddingTop: 40 }}>
            {/* blob */}
            <div style={{
              position: "absolute", top: 0, right: -20,
              width: 320, height: 320, borderRadius: "50%",
              background: COLORS.pink, border: `3px solid ${COLORS.black}`,
              zIndex: 0,
            }} />

            <motion.div
              initial={{ opacity: 0, rotate: -12, y: 40 }}
              animate={{ opacity: 1, rotate: -6, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, type: "spring", stiffness: 80 }}
              style={{ position: "relative", zIndex: 1 }}
            >
              <div style={{
                width: 290, margin: "0 auto",
                background: "#111", borderRadius: 42,
                border: `3px solid ${COLORS.black}`,
                padding: "16px 14px 20px",
                boxShadow: "8px 12px 0px #000",
              }}>
                {/* notch */}
                <div style={{ display: "flex", justifyContent: "space-between", padding: "2px 12px 10px", color: "#fff", fontSize: 12, fontWeight: 600 }}>
                  <span>9:41</span><span>⚡ 87%</span>
                </div>

                <div style={{ background: "#1A1A1A", borderRadius: 30, padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
                  {/* Balance */}
                  <div style={{ background: COLORS.yellow, borderRadius: 20, padding: "16px 18px", border: `2px solid ${COLORS.black}` }}>
                    <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.6 }}>Total Savings</div>
                    <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: "-0.04em", marginTop: 4 }}>₹48,200</div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#2a7a2a", marginTop: 4 }}>↑ +₹2,100 this week</div>
                  </div>

                  {/* Goal card */}
                  <div style={{ background: COLORS.pink, borderRadius: 18, padding: "14px 16px", border: `2px solid ${COLORS.black}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 14 }}>MacBook Goal 💻</div>
                      <div style={{ fontSize: 11, fontWeight: 600, marginTop: 3 }}>72% Completed</div>
                    </div>
                    <div style={{ background: COLORS.black, color: COLORS.yellow, borderRadius: 10, padding: "5px 10px", fontSize: 12, fontWeight: 800 }}>LVL 7</div>
                  </div>

                  {/* Progress bar */}
                  <div style={{ background: "#2a2a2a", borderRadius: 99, height: 10, overflow: "hidden", border: `1.5px solid #333` }}>
                    <motion.div
                      initial={{ width: 0 }} animate={{ width: "72%" }}
                      transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
                      style={{ height: "100%", background: COLORS.yellow, borderRadius: 99 }}
                    />
                  </div>

                  {/* Mini stats */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    {[
                      { label: "Daily Save", val: "₹100", color: COLORS.white },
                      { label: "Invest XP", val: "+240", color: COLORS.green },
                    ].map(({ label, val, color }) => (
                      <div key={label} style={{ background: "#242424", borderRadius: 16, padding: "12px 14px", border: "1.5px solid #333" }}>
                        <div style={{ fontSize: 10, color: "#888", fontWeight: 600 }}>{label}</div>
                        <div style={{ fontSize: 20, fontWeight: 800, color, marginTop: 3 }}>{val}</div>
                      </div>
                    ))}
                  </div>

                  {/* XP bar */}
                  <div style={{ background: "#242424", borderRadius: 18, padding: "14px 16px", border: "1.5px solid #333" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                      <div style={{ fontWeight: 800, fontSize: 13, color: "#fff" }}>Financial XP</div>
                      <div style={{ fontSize: 11, color: COLORS.green, fontWeight: 700 }}>Level 12 🚀</div>
                    </div>
                    <div style={{ background: "#333", borderRadius: 99, height: 8, overflow: "hidden" }}>
                      <motion.div
                        initial={{ width: 0 }} animate={{ width: `${xp}%` }}
                        transition={{ duration: 1.4, delay: 1, ease: "easeOut" }}
                        style={{ height: "100%", background: COLORS.green, borderRadius: 99 }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section style={{ maxWidth: 1280, margin: "72px auto 0", padding: "0 5%" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 12 }}>
          <h2 style={{ fontSize: "clamp(30px, 4vw, 46px)", fontWeight: 800, letterSpacing: "-0.04em" }}>Everything you need.</h2>
          <span style={{ fontSize: 14, fontWeight: 700, opacity: 0.45 }}>4 CORE FEATURES</span>
        </div>

        <div className="feat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {[
    { title: "Expense Tracker", desc: "Track where your money goes every single day.", icon: "📊", bg: COLORS.yellow, href: "/expenses" },
  { title: "Saving Streaks", desc: "Build habits, earn XP rewards, never break the chain.", icon: "🔥", bg: COLORS.cyan, href: "/savings" },
  { title: "Safe Investing", desc: "Beginner-friendly finance concepts, zero jargon.", icon: "📈", bg: COLORS.pink, href: "/invest" },
  { title: "Level System", desc: "Complete goals and unlock brand-new financial worlds.", icon: "🎮", bg: COLORS.purple, href: "/goals" },
].map(({ title, desc, icon, bg, href }, i) => (
  <Link key={title} href={href} style={{ textDecoration: "none", color: "inherit", display: "block" }}>
    <motion.div
      className="hover-lift"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.1 * i }}
      style={{
        background: bg, borderRadius: 28,
        border: `2.5px solid ${COLORS.black}`,
        padding: "32px 28px",
        cursor: "pointer",
      }}
    >
      <div style={{ fontSize: 36, marginBottom: 16 }}>{icon}</div>
      <h3 style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 10 }}>{title}</h3>
      <p style={{ fontSize: 14, lineHeight: 1.55, opacity: 0.7, fontWeight: 500 }}>{desc}</p>
    </motion.div>
  </Link>
))}
        </div>
      </section>

      {/* GOAL UNIVERSE SECTION */}
      <section id="goals" style={{ maxWidth: 1280, margin: "72px auto 0", padding: "0 5%" }}>
        <div style={{
          background: COLORS.black, borderRadius: 40,
          border: `3px solid ${COLORS.black}`,
          padding: "64px 56px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 48,
          alignItems: "center",
        }} className="goal-grid">
          <div>
            <span style={{
              display: "inline-block", background: COLORS.purple,
              border: `2px solid ${COLORS.purple}`, borderRadius: 40,
              padding: "6px 18px", fontWeight: 800, fontSize: 12,
              color: COLORS.black, marginBottom: 28, letterSpacing: "0.06em",
            }}>YOUR SAVINGS UNIVERSE ✨</span>

            <h2 style={{
              fontSize: "clamp(38px, 5vw, 64px)", fontWeight: 800,
              lineHeight: 0.97, letterSpacing: "-0.04em",
              color: COLORS.white, marginBottom: 24,
            }}>
              Your savings<br />
              <span style={{ color: COLORS.yellow }}>become</span><br />a world.
            </h2>

            <p style={{ fontSize: 16, lineHeight: 1.7, color: "#aaa", maxWidth: 380, marginBottom: 36 }}>
              Every goal you complete unlocks a new island, badge,
              and achievement in your finance universe. Watch your world grow.
            </p>

            <button className="btn-bounce" style={{
              background: COLORS.yellow, color: COLORS.black,
              border: `2.5px solid ${COLORS.yellow}`, borderRadius: 14,
              padding: "14px 32px", fontWeight: 800, fontSize: 16,
              cursor: "pointer", fontFamily: "inherit",
            }}>Start Your Journey →</button>
          </div>

          {/* Floating goal cards */}
          <div style={{ position: "relative", height: 380 }}>
            {[
              { label: "🎯 Emergency Fund", bg: COLORS.yellow, top: 20, left: 20, delay: 0 },
              { label: "✈️ Trip to Japan", bg: COLORS.pink, top: 140, right: 0, delay: 0.4 },
              { label: "🎮 Gaming Setup", bg: COLORS.green, bottom: 20, left: 40, delay: 0.8 },
              { label: "💻 MacBook Pro", bg: COLORS.cyan, top: 60, right: 60, delay: 0.2 },
            ].map(({ label, bg, top, left, right, bottom, delay }) => (
              <motion.div
                key={label}
                animate={{ y: [0, -14, 0] }}
                transition={{ repeat: Infinity, duration: 3.8 + delay, delay, ease: "easeInOut" }}
                style={{
                  position: "absolute",
                  ...(top !== undefined && { top }),
                  ...(left !== undefined && { left }),
                  ...(right !== undefined && { right }),
                  ...(bottom !== undefined && { bottom }),
                  background: bg, color: COLORS.black,
                  border: `2.5px solid ${COLORS.black}`,
                  borderRadius: 22, padding: "14px 22px",
                  fontWeight: 800, fontSize: 15,
                  boxShadow: "4px 6px 0px #000",
                  whiteSpace: "nowrap",
                }}
              >{label}</motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ maxWidth: 1280, margin: "72px auto 0", padding: "0 5%" }}>
        <h2 style={{ fontSize: "clamp(30px, 4vw, 46px)", fontWeight: 800, letterSpacing: "-0.04em", textAlign: "center", marginBottom: 48 }}>
          How Z-PiggyBank works
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }} className="feat-grid">
          {[
            { step: "01", title: "Set Your Goals", desc: "Create goals like a Laptop, Trip, or Emergency Fund. Set your target amount and timeline.", bg: COLORS.cyan },
            { step: "02", title: "Save Daily", desc: "Log your savings each day. Build streaks and earn XP for every consistent action.", bg: COLORS.yellow },
            { step: "03", title: "Level Up", desc: "Unlock new levels, badges, and virtual islands as your financial world grows.", bg: COLORS.pink },
          ].map(({ step, title, desc, bg }) => (
            <div key={step} className="hover-lift" style={{
              background: COLORS.white, borderRadius: 28,
              border: `2.5px solid ${COLORS.black}`, padding: "36px 30px",
              position: "relative", overflow: "hidden",
            }}>
              <div style={{
                position: "absolute", top: -16, right: -8,
                fontSize: 96, fontWeight: 800, opacity: 0.07, lineHeight: 1,
                letterSpacing: "-0.05em", userSelect: "none",
              }}>{step}</div>
              <div style={{
                display: "inline-block", background: bg,
                border: `2px solid ${COLORS.black}`, borderRadius: 12,
                padding: "6px 16px", fontWeight: 800, fontSize: 13,
                marginBottom: 20,
              }}>{step}</div>
              <h3 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 12 }}>{title}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: "#555", fontWeight: 500 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ maxWidth: 1280, margin: "72px auto 0", padding: "0 5%" }}>
        <div style={{
          background: COLORS.purple, borderRadius: 40,
          border: `3px solid ${COLORS.black}`, padding: "56px 48px",
        }}>
          <h2 style={{ fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 800, letterSpacing: "-0.04em", marginBottom: 36, textAlign: "center" }}>
            What Gen Z is saying
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }} className="feat-grid">
            {[
              { quote: "I love that Z-PiggyBank doesn't overcomplicate things.", name: "Priya, 22", role: "Design Student" },
              { quote: "I've saved more in 3 months than I did all of last year.", name: "Arjun, 24", role: "Software Engineer" },
              { quote: "The streak system keeps me way more accountable than any other app.", name: "Meera, 21", role: "College Student" },
            ].map(({ quote, name, role }) => (
              <div key={name} className="hover-lift" style={{
                background: COLORS.white, borderRadius: 24,
                border: `2.5px solid ${COLORS.black}`, padding: "28px 24px",
              }}>
                <p style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.5, marginBottom: 20, letterSpacing: "-0.01em" }}>
                  "{quote}"
                </p>
                <div style={{ borderTop: `1.5px solid ${COLORS.black}`, paddingTop: 16 }}>
                  <div style={{ fontWeight: 800, fontSize: 14 }}>{name}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, opacity: 0.55, marginTop: 2 }}>{role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section style={{ maxWidth: 1280, margin: "72px auto 0", padding: "0 5%" }}>
        <div style={{
          background: COLORS.yellow, borderRadius: 40,
          border: `3px solid ${COLORS.black}`,
          padding: "64px 56px",
          display: "flex", alignItems: "center",
          justifyContent: "space-between", flexWrap: "wrap", gap: 32,
        }}>
          <div>
            <h2 style={{ fontSize: "clamp(34px, 5vw, 60px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 0.95, marginBottom: 14 }}>
              Ready to level<br />up your money?
            </h2>
            <p style={{ fontSize: 16, fontWeight: 600, opacity: 0.65 }}>Join 50,000+ Gen Z savers today. Free to start.</p>
          </div>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <button className="btn-bounce" style={{
              background: COLORS.black, color: COLORS.yellow,
              border: `2.5px solid ${COLORS.black}`, borderRadius: 16,
              padding: "16px 36px", fontWeight: 800, fontSize: 17,
              cursor: "pointer", fontFamily: "inherit",
            }}>Start Free →</button>
            <button className="btn-bounce" style={{
              background: COLORS.white, color: COLORS.black,
              border: `2.5px solid ${COLORS.black}`, borderRadius: 16,
              padding: "16px 28px", fontWeight: 800, fontSize: 17,
              cursor: "pointer", fontFamily: "inherit",
            }}>Watch Demo</button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        maxWidth: 1280, margin: "0 auto",
        padding: "48px 5% 40px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        borderTop: `2px solid ${COLORS.black}`, marginTop: 64,
        flexWrap: "wrap", gap: 20,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: COLORS.black, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🐷</div>
          <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: "-0.03em" }}>Z-PiggyBank</span>
        </div>
        <p style={{ fontSize: 13, fontWeight: 600, opacity: 0.45 }}>Made with ❤️ for Gen Z • © 2025 Z-PiggyBank</p>
        <div style={{ display: "flex", gap: 24 }}>
          {["Privacy", "Terms", "Contact"].map((l) => (
            <a key={l} href="#" style={{ fontSize: 13, fontWeight: 700, opacity: 0.45, textDecoration: "none", color: COLORS.black }}>{l}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}