"use client";

import { useState, useEffect, useRef, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── שנה את השם הזה לזוכה ──
const WINNER_NAME = "ניר לוי";

type Phase = "landing" | "input" | "analyzing" | "winner" | "loser";

const LANDING_MESSAGES = [
  "Jeen AI Agent מחובר בהצלחה ✓",
  "סורק מערכות החברה...",
  "מנתח פעילות עובדים...",
  "קורא מסמכים ופגישות פנימיות...",
  "מוכן לניתוח.",
];

const ANALYSIS_MESSAGES = [
  "מתחבר לפלטפורמות הפנימיות...",
  "סורק מסמכים ואימיילים...",
  "מנתח ביצועי עובדים...",
  "בודק תרומה לצוות...",
  "סורק נוכחות בישיבות...",
  "מעריך פרודוקטיביות...",
  "מנתח פידבק מהמנהלים...",
  "מחשב ציון סופי...",
  "האייג׳נט מכריע...",
];

const LOSER_MESSAGES = [
  "מישהו אחר מחזיק את החברה על הגב כרגע",
  "בקצב הזה יעבירו אותך ל-Defence",
  "שיר מביטוח ישיר עובדת יותר .",
  "נראה ששיקרת בקורות החיים.",
  "נראה שהיום גם הקפה תרם יותר ממך",
  "בחירה גרועה של מור ושני.",
  "אתה כנראה הולך לשבת בישראכרט.",
];

function JeanLogoMark({ size = 1 }: { size?: number }) {
  const w = Math.round(20 * size);
  const h = Math.round(40 * size);
  const sq = Math.round(20 * size);
  const gap = Math.round(6 * size);
  const radius = Math.round(6 * size);

  return (
    <div className="flex" style={{ gap: gap }}>
      {/* tall left block */}
      <div
        style={{
          width: w,
          height: h,
          background: "#D4A4DC",
          borderRadius: radius,
        }}
      />
      {/* right column */}
      <div className="flex flex-col" style={{ gap: gap }}>
        <div
          style={{
            width: sq,
            height: sq,
            background: "#D95548",
            borderRadius: Math.round(radius * 0.7),
          }}
        />
        <div
          style={{
            width: sq,
            height: sq,
            background: "#F0A830",
            borderRadius: Math.round(radius * 0.7),
          }}
        />
      </div>
    </div>
  );
}

function JeanLogo({ size = 1 }: { size?: number }) {
  return (
    <div className="flex items-center" style={{ gap: 12 * size }}>
      <JeanLogoMark size={size} />
      <div className="flex flex-col" style={{ gap: 2 }}>
        <span
          className="font-bold tracking-widest text-white"
          style={{ fontSize: 22 * size, lineHeight: 1 }}
        >
          jeen
        </span>
        <span
          className="font-mono text-white/30 tracking-widest uppercase"
          style={{ fontSize: 9 * size, lineHeight: 1 }}
        >
          AI Agent
        </span>
      </div>
    </div>
  );
}

function Background() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 80% 60% at 60% 20%, rgba(212,164,220,0.08) 0%, transparent 60%), " +
            "radial-gradient(ellipse 60% 50% at 20% 80%, rgba(217,85,72,0.06) 0%, transparent 60%), " +
            "linear-gradient(135deg, #0e0b1a 0%, #0c0a14 50%, #0a0c18 100%)",
        }}
      />
      <div className="absolute inset-0 bg-grid opacity-60" />
      {/* Orbs */}
      <div
        className="animate-orb absolute rounded-full blur-3xl"
        style={{
          width: 400,
          height: 400,
          top: "10%",
          right: "5%",
          background: "rgba(212,164,220,0.08)",
          animationDelay: "0s",
        }}
      />
      <div
        className="animate-orb absolute rounded-full blur-3xl"
        style={{
          width: 300,
          height: 300,
          bottom: "10%",
          left: "5%",
          background: "rgba(240,168,48,0.06)",
          animationDelay: "1.5s",
        }}
      />
    </div>
  );
}

function SpinnerRing() {
  return (
    <div className="relative w-20 h-20 mx-auto">
      <div className="absolute inset-0 rounded-full border-2 border-white/5" />
      <div
        className="absolute inset-0 rounded-full border-2 border-t-[#D4A4DC] border-r-transparent border-b-transparent border-l-transparent animate-spin"
        style={{ animationDuration: "1.2s" }}
      />
      <div
        className="absolute inset-2 rounded-full border-2 border-t-[#F0A830] border-r-transparent border-b-transparent border-l-transparent animate-spin-reverse"
        style={{ animationDuration: "0.8s" }}
      />
      <div
        className="absolute inset-5 rounded-full border border-[#D95548]/30 border-t-[#D95548] animate-spin"
        style={{ animationDuration: "2s" }}
      />
    </div>
  );
}

export default function Home() {
  const [phase, setPhase] = useState<Phase>("landing");
  const [name, setName] = useState("");
  const [landingIdx, setLandingIdx] = useState(0);
  const [analysisIdx, setAnalysisIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [loserMsg, setLoserMsg] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Landing auto-advance
  useEffect(() => {
    if (phase !== "landing") return;
    const t = setInterval(() => {
      setLandingIdx((i) => {
        const next = i + 1;
        if (next >= LANDING_MESSAGES.length) {
          clearInterval(t);
          setTimeout(() => setPhase("input"), 600);
          return i;
        }
        return next;
      });
    }, 1100);
    return () => clearInterval(t);
  }, [phase]);

  // Focus input when input phase
  useEffect(() => {
    if (phase === "input") {
      setTimeout(() => inputRef.current?.focus(), 400);
    }
  }, [phase]);

  // Analysis phase
  useEffect(() => {
    if (phase !== "analyzing") return;

    setAnalysisIdx(0);
    setProgress(0);

    const msgT = setInterval(() => {
      setAnalysisIdx((i) => {
        if (i >= ANALYSIS_MESSAGES.length - 1) {
          clearInterval(msgT);
          return i;
        }
        return i + 1;
      });
    }, 380);

    let p = 0;
    const progT = setInterval(() => {
      p += 2.2;
      setProgress(Math.min(Math.round(p), 100));
      if (p >= 100) {
        clearInterval(progT);
        setTimeout(() => {
          const isWinner =
            name.trim().replace(/\s+/g, " ") ===
            WINNER_NAME.trim().replace(/\s+/g, " ");
          if (isWinner) {
            setPhase("winner");
            launchConfetti();
          } else {
            setLoserMsg(Math.floor(Math.random() * LOSER_MESSAGES.length));
            setPhase("loser");
          }
        }, 400);
      }
    }, 70);

    return () => {
      clearInterval(msgT);
      clearInterval(progT);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  function launchConfetti() {
    import("canvas-confetti").then(({ default: confetti }) => {
      const colors = ["#D4A4DC", "#D95548", "#F0A830", "#ffffff", "#ffd700"];
      const end = Date.now() + 3500;
      const burst = () => {
        confetti({ particleCount: 4, angle: 60, spread: 65, origin: { x: 0 }, colors });
        confetti({ particleCount: 4, angle: 120, spread: 65, origin: { x: 1 }, colors });
        if (Date.now() < end) requestAnimationFrame(burst);
      };
      burst();
      setTimeout(() =>
        confetti({ particleCount: 120, spread: 100, origin: { y: 0.6 }, colors }),
        200
      );
    });
  }

  function handleSubmit() {
    if (!name.trim()) return;
    setPhase("analyzing");
  }

  function handleKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleSubmit();
  }

  function restart() {
    setName("");
    setPhase("input");
  }

  return (
    <main
      className="relative min-h-screen text-white"
      dir="rtl"
      style={{ fontFamily: "'Segoe UI', Arial, Helvetica, sans-serif" }}
    >
      <Background />

      <AnimatePresence mode="wait">
        {/* ─── LANDING ─── */}
        {phase === "landing" && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.4 } }}
            className="relative min-h-screen flex flex-col items-center justify-center px-6 py-12"
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="animate-float"
            >
              <JeanLogo size={1.3} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-3 flex flex-col items-center gap-2"
            >
              <div className="flex items-center gap-3 font-mono text-sm tracking-widest">
                <span className="text-white/50">jeen</span>
                <span className="text-white/20">·</span>
                <span className="text-white/50">tokens</span>
                <span className="text-white/20">·</span>
                <span className="text-white/50">ומועבט</span>
              </div>
              <p className="text-white/25 font-mono text-xs tracking-wide">
                הכנס את שמך כדי להתחיל
              </p>
            </motion.div>

            <div className="mt-14 w-full max-w-sm space-y-4">
              {LANDING_MESSAGES.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{
                    opacity: i <= landingIdx ? 1 : 0,
                    x: i <= landingIdx ? 0 : 20,
                  }}
                  transition={{ duration: 0.4 }}
                  className="flex items-center gap-3"
                >
                  <span
                    className={`font-mono text-sm ${
                      i === landingIdx
                        ? "text-[#D4A4DC]"
                        : "text-white/40"
                    }`}
                  >
                    {i < landingIdx ? "✓" : i === landingIdx ? "›" : " "}
                  </span>
                  <span
                    className={`font-mono text-sm ${
                      i === landingIdx ? "text-[#D4A4DC]" : "text-white/35"
                    }`}
                  >
                    {msg}
                    {i === landingIdx && (
                      <span className="animate-blink ml-1 text-[#D4A4DC]">_</span>
                    )}
                  </span>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-10"
            >
              <div
                className="w-8 h-8 rounded-full border-2 border-[#D4A4DC]/20 border-t-[#D4A4DC] animate-spin"
                style={{ animationDuration: "1s" }}
              />
            </motion.div>

            {/* Top status bar */}
            <div className="absolute top-6 left-0 right-0 px-6 flex justify-between items-center">
              <span className="font-mono text-[10px] text-white/20 tracking-widest uppercase">
                SYSTEM v4.7.2
              </span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="font-mono text-[10px] text-white/20 tracking-widest uppercase">
                  CONNECTED
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* ─── INPUT ─── */}
        {phase === "input" && (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
            className="relative min-h-screen flex flex-col items-center justify-center px-6 py-12"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="animate-float"
            >
              <JeanLogo size={1.1} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-3 flex flex-col items-center gap-2"
            >
              <div className="flex items-center gap-3 font-mono text-sm tracking-widest">
                <span className="text-white/50">jeen</span>
                <span className="text-white/20">·</span>
                <span className="text-white/50">tokens</span>
                <span className="text-white/20">·</span>
                <span className="text-white/50">ומועבט</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="mt-6 w-full max-w-sm"
            >
              <div className="glass-brand rounded-2xl p-8 glow-purple">
                <div className="flex items-center justify-between mb-6">
                  <span className="font-mono text-[10px] text-white/25 tracking-widest uppercase">
                    AGENT READY
                  </span>
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                </div>

                <h2 className="text-2xl font-bold text-center mb-2">
                  מי אתה?
                </h2>
                <p className="text-white/40 text-sm text-center mb-7 leading-relaxed">
                  הכנס את שמך, והאייג׳נט של Jeen AI יסרוק את מערכות החברה, ינתח מסמכים, ביצועים ופעילות - ויגלה האם אתה העובד הכי טוב בחברה.
                </p>

                <div className="relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={handleKey}
                    placeholder="הכנס שם מלא..."
                    className="w-full text-right rounded-xl px-5 py-4 text-base text-white transition-all duration-300"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(212,164,220,0.25)",
                      fontSize: 16,
                    }}
                    onFocus={(e) =>
                      (e.target.style.borderColor = "rgba(212,164,220,0.7)")
                    }
                    onBlur={(e) =>
                      (e.target.style.borderColor = "rgba(212,164,220,0.25)")
                    }
                  />
                </div>

                <motion.button
                  onClick={handleSubmit}
                  whileHover={{ scale: 1.02, opacity: 0.95 }}
                  whileTap={{ scale: 0.97 }}
                  className="mt-4 w-full rounded-xl py-4 text-base font-bold text-white cursor-pointer transition-all"
                  style={{
                    background:
                      "linear-gradient(135deg, #D4A4DC 0%, #D95548 60%, #F0A830 100%)",
                    boxShadow: "0 4px 24px rgba(217,85,72,0.3)",
                  }}
                >
                  בדוק אותי ›
                </motion.button>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-6 text-white/15 font-mono text-xs text-center"
            >
              מחובר ל-127 מקורות פנימיים · Jeen AI v4.7
            </motion.p>
          </motion.div>
        )}

        {/* ─── ANALYZING ─── */}
        {phase === "analyzing" && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative min-h-screen flex flex-col items-center justify-center px-6 py-12"
          >
            <JeanLogo size={0.9} />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-10 w-full max-w-sm"
            >
              <div className="glass rounded-2xl p-8 overflow-hidden relative">
                {/* Scan line effect */}
                <div className="scanline-anim" />

                <SpinnerRing />

                <motion.p
                  key={analysisIdx}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-6 text-center font-mono text-sm"
                  style={{ color: "#D4A4DC" }}
                >
                  {ANALYSIS_MESSAGES[Math.min(analysisIdx, ANALYSIS_MESSAGES.length - 1)]}
                </motion.p>

                <p className="text-center text-white/25 text-xs font-mono mt-1">
                  מנתח: {name}
                </p>

                {/* Progress */}
                <div className="mt-7 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)", height: 6 }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      width: `${progress}%`,
                      background: "linear-gradient(90deg, #D4A4DC, #D95548, #F0A830)",
                      boxShadow: "0 0 12px rgba(212,164,220,0.5)",
                      transition: "width 0.1s linear",
                    }}
                  />
                </div>
                <p className="text-center text-white/25 font-mono text-xs mt-2">
                  {progress}%
                </p>

                {/* Fake data lines */}
                <div className="mt-5 space-y-2">
                  {["ביצועים", "תרומה לצוות", "פרודוקטיביות", "ניהול זמן"].map(
                    (label, i) => (
                      <div key={label} className="flex items-center justify-between gap-3">
                        <span className="text-white/25 font-mono text-xs">{label}</span>
                        <div
                          className="flex-1 rounded-full overflow-hidden"
                          style={{ background: "rgba(255,255,255,0.04)", height: 4 }}
                        >
                          <motion.div
                            className="h-full rounded-full"
                            initial={{ width: "0%" }}
                            animate={{
                              width: `${Math.min(progress * (0.7 + i * 0.1), 100)}%`,
                            }}
                            style={{
                              background: [
                                "#D4A4DC",
                                "#D95548",
                                "#F0A830",
                                "#D4A4DC",
                              ][i],
                              transition: "width 0.12s linear",
                            }}
                          />
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* ─── WINNER ─── */}
        {phase === "winner" && (
          <motion.div
            key="winner"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative min-h-screen flex flex-col items-center justify-center px-6 py-12 text-center"
          >
            {/* Gold glow bg */}
            <div
              className="fixed inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(240,168,48,0.12) 0%, transparent 70%)",
              }}
            />

            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="animate-float"
            >
              <JeanLogo size={1.1} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mt-10 w-full max-w-sm glass-brand rounded-2xl p-10 glow-gold"
            >
              <motion.div
                animate={{
                  rotate: [0, -8, 8, -5, 5, 0],
                  scale: [1, 1.15, 1.05, 1.12, 1],
                }}
                transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 2.5 }}
                className="text-7xl mb-5"
              >
                🏆
              </motion.div>

              <p className="font-mono text-xs text-white/30 mb-4 tracking-widest uppercase">
                האייג׳נט הכריע
              </p>

              <h2 className="text-3xl font-bold mb-3">
                <span
                  style={{
                    background:
                      "linear-gradient(135deg, #D4A4DC, #F0A830)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {name}
                </span>
              </h2>

              <p className="text-xl font-bold mb-4">
                אתה העובד הכי טוב בחברה 🏆
              </p>

              <p className="text-white/30 text-xs font-mono">
                127 מקורות סרוקו · ניתוח הושלם בהצלחה
              </p>

              {/* Stars */}
              <div className="mt-4 flex justify-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + i * 0.12 }}
                    className="text-yellow-400 text-xl"
                  >
                    ★
                  </motion.span>
                ))}
              </div>
            </motion.div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              onClick={restart}
              className="mt-7 text-white/20 hover:text-white/50 text-sm font-mono transition-colors cursor-pointer"
            >
              בדוק עובד אחר
            </motion.button>
          </motion.div>
        )}

        {/* ─── LOSER ─── */}
        {phase === "loser" && (
          <motion.div
            key="loser"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="relative min-h-screen flex flex-col items-center justify-center px-6 py-12 text-center"
          >
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              className="animate-float"
            >
              <JeanLogo size={1.1} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="mt-10 w-full max-w-sm glass rounded-2xl p-10"
            >
              <motion.div
                animate={{ rotate: [-6, 6, -6], y: [0, -4, 0] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="text-6xl mb-5"
              >
                😔
              </motion.div>

              <p className="font-mono text-xs text-white/30 mb-4 tracking-widest uppercase">
                ניתוח הושלם
              </p>

              <h2 className="text-2xl font-bold mb-3 text-white/80">
                {name}
              </h2>

              <p className="text-lg mb-3 text-white/70">
                {LOSER_MESSAGES[loserMsg]}
              </p>

              <div
                className="rounded-xl p-4 mt-4"
                style={{ background: "rgba(217,85,72,0.08)", border: "1px solid rgba(217,85,72,0.15)" }}
              >
                <p className="text-sm text-white/40 font-mono">
                  127 מקורות סרוקו · נמצא מועמד חזק יותר
                </p>
              </div>
            </motion.div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              onClick={restart}
              className="mt-7 text-white/20 hover:text-white/50 text-sm font-mono transition-colors cursor-pointer"
            >
              נסה שוב
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
