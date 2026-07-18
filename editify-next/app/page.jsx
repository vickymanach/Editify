"use client";

import { useEffect, useRef, useState } from "react";

const WAITLIST_HREF =
  "mailto:marta@folch.org?subject=Editify%20waitlist&body=Hi%20Editify%20team%2C%20add%20me%20to%20the%20waitlist!";
const PROTOTYPE_URL = "https://style-wise-creator.lovable.app/";

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

export default function Home() {
  const [demoStarted, setDemoStarted] = useState(false);
  const [clock, setClock] = useState("4:00:00");
  const [counterText, setCounterText] = useState("240");
  const [counterUnit, setCounterUnit] = useState("min");
  const [counterCap, setCounterCap] = useState(
    "the average manual edit for one short-form video"
  );
  const fillRef = useRef(null);
  const headRef = useRef(null);
  const heroRef = useRef(null);
  const heroTimerRef = useRef(null);
  const heroRevealRef = useRef(null);
  const tiltRef = useRef(null);
  const countRef = useRef(null);

  // scroll: progress bar + hero countdown + hero crossfade
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      if (fillRef.current) fillRef.current.style.width = p * 100 + "%";
      if (headRef.current) headRef.current.style.left = p * 100 + "%";

      const hero = heroRef.current;
      const timer = heroTimerRef.current;
      const reveal = heroRevealRef.current;
      if (!hero || !timer || !reveal) return;
      const hMax = hero.offsetHeight - window.innerHeight;
      const hp = clamp(hMax > 0 ? window.scrollY / hMax : 1, 0, 1);
      const tp = clamp(hp / 0.62, 0, 1);
      const remaining = Math.round(14400 * (1 - tp));
      const hh = Math.floor(remaining / 3600);
      const mm = String(Math.floor((remaining % 3600) / 60)).padStart(2, "0");
      const ss = String(remaining % 60).padStart(2, "0");
      setClock(`${hh}:${mm}:${ss}`);
      timer.style.opacity = hp < 0.62 ? 1 : clamp(1 - (hp - 0.62) / 0.12, 0, 1);
      timer.style.transform = `scale(${1 - hp * 0.08})`;
      const rp = clamp((hp - 0.72) / 0.22, 0, 1);
      reveal.style.opacity = rp;
      reveal.style.transform = `translateY(${30 * (1 - rp)}px)`;
      reveal.style.pointerEvents = rp > 0.6 ? "auto" : "none";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // reveal on scroll
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.15 }
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // screenshot 3D tilt
  useEffect(() => {
    const onMove = (e) => {
      const tilt = tiltRef.current;
      if (!tilt || window.matchMedia("(max-width:860px)").matches) return;
      const r = tilt.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 7;
      const y = (e.clientY / window.innerHeight - 0.5) * -6;
      tilt.style.transform = `rotateX(${8 + y}deg) rotateY(${x}deg) scale(.98)`;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // 240 min -> 0.5 min counter
  useEffect(() => {
    const el = countRef.current;
    if (!el) return;
    const cio = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          cio.disconnect();
          const t0 = performance.now();
          const dur = 2200;
          const step = (t) => {
            const p = Math.min((t - t0) / dur, 1);
            const ease = 1 - Math.pow(1 - p, 3);
            const v = Math.round(240 - 239.5 * ease);
            if (p < 1) {
              setCounterText(String(v));
              requestAnimationFrame(step);
            } else {
              setCounterText("0.5");
              setCounterUnit("min");
              setCounterCap("with editify");
            }
          };
          requestAnimationFrame(step);
        });
      },
      { threshold: 0.6 }
    );
    cio.observe(el);
    return () => cio.disconnect();
  }, []);

  return (
    <>
      <nav>
        <a href="#hero" className="logo wordmark">
          editify
        </a>
        <div className="links">
          <a href="#problem">The problem</a>
          <a href="#solution">What we do</a>
          <a href="#demo">Demo</a>
          <a href="#pricing">Pricing</a>
          <a href="#team">Team</a>
        </div>
        <a className="cta-mini" href={WAITLIST_HREF}>
          Join waitlist
        </a>
      </nav>
      <div id="scrubber">
        <div className="fill" ref={fillRef} />
        <div className="head" ref={headRef} />
      </div>

      {/* HERO: scroll-driven countdown */}
      <section id="hero" ref={heroRef}>
        <div className="hero-sticky">
          <div className="glow" />
          <div className="hero-timer" ref={heroTimerRef}>
            <div className="clock">{clock}</div>
            <div className="cap">the editing time behind one 30-second reel</div>
            <div className="hint">Scroll</div>
          </div>
          <div className="hero-reveal" ref={heroRevealRef}>
            <div className="logo-hero wordmark">editify</div>
            <h1>
              <span className="shimmer">Create more.</span>
              <br />
              In less time.
            </h1>
            <p className="tagline">The first video editor with AI at its core.</p>
            <div className="actions">
              <a className="btn" href={WAITLIST_HREF}>
                Join the waitlist
              </a>
              <a className="btn ghost" href="#demo">
                Watch it work
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCT SHOT */}
      <section id="shot">
        <div className="hero-shot reveal">
          <div className="frame" ref={tiltRef}>
            <img src="/ui.jpg" alt="The Editify AI editor interface" />
          </div>
        </div>
        <div className="strip reveal">
          <div className="clips">
            <div className="clip c1" />
            <div className="clip c2" />
            <div className="clip c3" />
            <div className="clip c4" />
            <div className="playline" />
          </div>
          <div className="labels">
            <span>00:00</span>
            <span>00:05</span>
            <span>00:10</span>
            <span>00:15</span>
            <span>00:20</span>
            <span>00:25</span>
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section id="problem">
        <div className="container">
          <h2 className="big reveal">
            Behind a 30-second reel,
            <br />
            are <span className="grad-text">4 hours</span> of editing.
          </h2>
          <div className="counter-wrap reveal">
            <div className="num">
              <span ref={countRef}>{counterText}</span>
              <span className="unit grad-text">{counterUnit}</span>
            </div>
            <div className="cap">{counterCap}</div>
          </div>
          <div className="cards3">
            <div className="pcard reveal">
              <div className="bar" />
              <h3>Time-consuming</h3>
              <p>Hours of trimming clips, syncing music and adding effects.</p>
            </div>
            <div className="pcard reveal" style={{ transitionDelay: ".12s" }}>
              <div className="bar" />
              <h3>Overwhelming</h3>
              <p>
                Social media moves fast. Daily posting and shifting trends are hard to
                keep up with.
              </p>
            </div>
            <div className="pcard reveal" style={{ transitionDelay: ".24s" }}>
              <div className="bar" />
              <h3>Repetitive</h3>
              <p>Recreating your style by hand, video after video.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SOLUTION */}
      <section id="solution">
        <div className="container" style={{ textAlign: "center" }}>
          <h2 className="big reveal">
            That&apos;s why we built
            <br />
            <span className="grad-text">editify.</span>
          </h2>
          <p className="sub reveal" style={{ marginLeft: "auto", marginRight: "auto" }}>
            An AI video editor that <strong>learns your style</strong> and{" "}
            <strong>builds personalised templates</strong> to automate your editing.
          </p>
          <div className="feat3">
            <div className="fcard reveal">
              <div className="icon">
                <svg viewBox="0 0 24 24">
                  <path d="M3 17l5-6 4 4 6-8 3 4" />
                  <path d="M3 21h18" />
                </svg>
              </div>
              <h3>Predicts what performs</h3>
              <p>
                Editify studies your past videos and live trends to predict the styles
                most likely to hit.
              </p>
            </div>
            <div className="fcard reveal" style={{ transitionDelay: ".12s" }}>
              <div className="icon">
                <svg viewBox="0 0 24 24">
                  <path d="M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.4z" />
                  <path d="M19 17l.8 2.2L22 20l-2.2.8L19 23l-.8-2.2L16 20l2.2-.8z" />
                </svg>
              </div>
              <h3>Edits in your style</h3>
              <p>
                It learns your cuts, captions, pacing and colour. Every edit still looks
                like <em>you</em>.
              </p>
            </div>
            <div className="fcard reveal" style={{ transitionDelay: ".24s" }}>
              <div className="icon">
                <svg viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3.5 2" />
                </svg>
              </div>
              <h3>Removes repetitive work</h3>
              <p>
                First cuts, beat-syncing and captions happen automatically. You keep full
                manual control.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SHOWCASE */}
      <section id="showcase">
        <div className="container" style={{ textAlign: "center" }}>
          <h2 className="big reveal">
            Your style, <span className="grad-text">learned.</span>
          </h2>
          <p className="sub reveal" style={{ marginLeft: "auto", marginRight: "auto" }}>
            Editify builds a first cut in seconds. Then direct the AI like an editor:{" "}
            <strong>&quot;make the intro punchier and add the trending sound.&quot;</strong>
          </p>
          <div className="showcase-img reveal">
            <img
              src="/ui.jpg"
              alt="Editify AI editor: predictive templates, style profile and AI chat editing"
            />
          </div>
          <div className="chips reveal">
            <span className="chip">✦ Pattern recognition</span>
            <span className="chip">✦ Predictive AI templates</span>
            <span className="chip">✦ Free advanced AI editing</span>
            <span className="chip">✦ Trends &amp; performance analytics</span>
            <span className="chip">✦ Manual control over every AI edit</span>
          </div>
          <div className="formats reveal">
            <div className="format">
              <div className="box r916" />
              9:16 · Reels / TikTok
            </div>
            <div className="format">
              <div className="box r11" />
              1:1 · Feed
            </div>
            <div className="format">
              <div className="box r169" />
              16:9 · YouTube
            </div>
          </div>
        </div>
      </section>

      {/* DEMO */}
      <section id="demo">
        <div className="container">
          <h2 className="big reveal">
            See the <span className="grad-text">prototype.</span>
          </h2>
          <p className="sub reveal">Our working prototype, live in your browser. Press play.</p>
          <div className="player reveal">
            <div className="bar-top">
              <span className="dot d1" />
              <span className="dot d2" />
              <span className="dot d3" />
              <span className="title">editify · prototype.mov</span>
            </div>
            <div className="screen">
              {demoStarted && (
                <iframe
                  src={PROTOTYPE_URL}
                  title="Editify live prototype"
                  loading="lazy"
                  allow="fullscreen"
                />
              )}
              <div
                className={`cover${demoStarted ? " gone" : ""}`}
                onClick={() => setDemoStarted(true)}
              >
                <div className="playbtn">
                  <svg viewBox="0 0 24 24">
                    <path d="M6 4.5v15c0 1.2 1.3 1.9 2.3 1.3l12-7.5c1-.6 1-2 0-2.6l-12-7.5C7.3 2.6 6 3.3 6 4.5z" />
                  </svg>
                </div>
                <span>Play the live demo</span>
              </div>
            </div>
            <div className="bar-bottom">
              <span className="t">00:00</span>
              <div className="track">
                <div className="prog" />
              </div>
              <span className="t">LIVE</span>
            </div>
          </div>
          <div className="demo-cta reveal">
            <a className="btn ghost" href={PROTOTYPE_URL} target="_blank" rel="noopener noreferrer">
              Open the full prototype ↗
            </a>
          </div>
        </div>
      </section>

      {/* AUDIENCE */}
      <section id="audience">
        <div className="container">
          <h2 className="big reveal">
            Made for the creators
            <br />
            <span className="grad-text">on their way up.</span>
          </h2>
          <div className="row">
            <div className="acard reveal">
              <div className="big-n grad-text">0–150K</div>
              <p>Built for micro-influencers, the creators growing fastest and editing hardest.</p>
            </div>
            <div className="acard reveal" style={{ transitionDelay: ".12s" }}>
              <div className="big-n grad-text">Full-time</div>
              <p>For people turning content creation into a full-time job.</p>
            </div>
            <div className="acard reveal" style={{ transitionDelay: ".24s" }}>
              <div className="big-n grad-text">First-hand</div>
              <p>We create content ourselves. We built Editify because we needed it.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing">
        <div className="container" style={{ textAlign: "center" }}>
          <h2 className="big reveal">
            Free to start.
            <br />
            <span className="grad-text">Serious when you are.</span>
          </h2>
          <span className="save-pill reveal">Save 20% billed annually</span>
          <div className="plans">
            <div className="plan reveal">
              <h3>Free</h3>
              <div className="for">For everyone starting out</div>
              <div className="price">
                €0<span> / forever</span>
              </div>
              <div className="annual">No card required</div>
              <ul>
                <li>Core editing suite</li>
                <li>Advanced AI edits included</li>
                <li>720p exports · 3 projects</li>
              </ul>
              <a className="btn ghost" href="mailto:marta@folch.org?subject=Editify%20waitlist%20Free">
                Start free
              </a>
            </div>
            <div className="plan pop reveal" style={{ transitionDelay: ".12s" }}>
              <div className="flag">Most popular</div>
              <h3>Creator</h3>
              <div className="for">For creators posting weekly</div>
              <div className="price">
                €12<span> / month</span>
              </div>
              <div className="annual">or €9,60/mo billed annually</div>
              <ul>
                <li>Everything in Free</li>
                <li>Pattern recognition that learns your style</li>
                <li>4K exports · unlimited projects</li>
                <li>Priority AI rendering</li>
              </ul>
              <a className="btn" href="mailto:marta@folch.org?subject=Editify%20waitlist%20Creator">
                Go Creator
              </a>
            </div>
            <div className="plan reveal" style={{ transitionDelay: ".24s" }}>
              <h3>Studio</h3>
              <div className="for">For teams &amp; power editors</div>
              <div className="price">
                €29<span> / month</span>
              </div>
              <div className="annual">or €23,20/mo billed annually</div>
              <ul>
                <li>Everything in Creator</li>
                <li>Multi-cam AI &amp; auto-captions+</li>
                <li>Team workspaces &amp; shared styles</li>
                <li>API access &amp; brand kits</li>
              </ul>
              <a className="btn ghost" href="mailto:marta@folch.org?subject=Editify%20waitlist%20Studio">
                Scale up
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section id="team">
        <div className="container">
          <h2 className="big reveal" style={{ textAlign: "center" }}>
            Active. Passionate.
            <br />
            <span className="grad-text">Entrepreneurial.</span>
          </h2>
          <div className="founders">
            <div className="founder reveal">
              <div className="ring">
                <img src="/victoria.jpg" alt="Victoria Mañach" />
              </div>
              <h3>Victoria Mañach</h3>
              <div className="loc">Co-founder · London (UK)</div>
              <p className="one-liner">Builder and storyteller. Raised millions before graduating.</p>
              <div className="tags">
                <span className="tag hl">Acceler8 co-founder · £7.5M raised</span>
                <span className="tag">TEDx speaker</span>
                <span className="tag">£3M raised for charity</span>
                <span className="tag">DJ &amp; trekker</span>
              </div>
              <a className="mail" href="mailto:victoriamanach@gmail.com">
                victoriamanach@gmail.com
              </a>
            </div>
            <div className="founder reveal" style={{ transitionDelay: ".12s" }}>
              <div className="ring">
                <img src="/marta.jpg" alt="Marta Folch" />
              </div>
              <h3>Marta Folch</h3>
              <div className="loc">Co-founder · Boston (USA)</div>
              <p className="one-liner">Serial entrepreneur. Two startups before Editify.</p>
              <div className="tags">
                <span className="tag hl">Founded Circul8 &amp; HelpUp</span>
                <span className="tag">RISE Rhodes-Schmidt Fellow</span>
                <span className="tag">eTower e-Board</span>
                <span className="tag">TEDx speaker</span>
                <span className="tag">Violinist · 2 years in Japan</span>
              </div>
              <a className="mail" href="mailto:marta@folch.org">
                marta@folch.org
              </a>
            </div>
          </div>
          <div className="backed reveal">
            <div className="label">Backed by</div>
            <div className="logos">
              <span>eTower</span>
              <span>acceler8</span>
              <span>ElevenLabs</span>
              <span>cala</span>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section id="final">
        <div className="glow" />
        <p className="sub in" style={{ margin: "0 auto", textAlign: "center", position: "relative" }}>
          Be first in line when Editify launches.
        </p>
        <div style={{ marginTop: 34, position: "relative" }}>
          <a className="btn" style={{ fontSize: 18, padding: "18px 44px" }} href={WAITLIST_HREF}>
            Join the waitlist
          </a>
        </div>
      </section>

      <footer>
        <span className="logo wordmark">editify</span>
        <div className="flinks">
          <a href={PROTOTYPE_URL} target="_blank" rel="noopener noreferrer">
            Prototype
          </a>
          <a href="#team">Team</a>
          <a href="mailto:marta@folch.org">Contact</a>
        </div>
        <span className="fine">© 2026 Editify. The first video editor with AI at its core.</span>
      </footer>
    </>
  );
}
