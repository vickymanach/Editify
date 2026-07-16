"use client";

import { useEffect, useRef, useState } from "react";

const WAITLIST_HREF =
  "mailto:marta@folch.org?subject=Editify%20waitlist&body=Hi%20Editify%20team%2C%20add%20me%20to%20the%20waitlist!";
const PROTOTYPE_URL = "https://style-wise-creator.lovable.app/";

export default function Home() {
  const [paused, setPaused] = useState(false);
  const [demoStarted, setDemoStarted] = useState(false);
  const [timecode, setTimecode] = useState("00:00:00:00");
  const [counterText, setCounterText] = useState("240");
  const [counterCaption, setCounterCaption] = useState(" min");
  const fillRef = useRef(null);
  const headRef = useRef(null);
  const tiltRef = useRef(null);
  const countRef = useRef(null);

  // pause/play page animations
  useEffect(() => {
    document.body.classList.toggle("paused", paused);
  }, [paused]);

  // scroll timeline + running timecode
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      if (fillRef.current) fillRef.current.style.width = p * 100 + "%";
      if (headRef.current) headRef.current.style.left = p * 100 + "%";
      const total = p * 180; // the page as a 3-minute film
      const m = String(Math.floor(total / 60)).padStart(2, "0");
      const s = String(Math.floor(total % 60)).padStart(2, "0");
      const f = String(Math.floor((total % 1) * 24)).padStart(2, "0");
      setTimecode(`00:${m}:${s}:${f}`);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
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

  // hero 3D tilt
  useEffect(() => {
    const onMove = (e) => {
      const tilt = tiltRef.current;
      if (!tilt) return;
      if (
        window.matchMedia("(max-width:860px)").matches ||
        document.body.classList.contains("paused")
      )
        return;
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
              setCounterCaption(" min — with editify");
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
        <div className="right">
          <span className="timecode">{timecode}</span>
          <button
            className="playpause"
            title="Play / pause the page"
            aria-label="Play or pause animations"
            onClick={() => setPaused((p) => !p)}
          >
            {paused ? (
              <svg viewBox="0 0 12 12">
                <path d="M2 1.2v9.6c0 .9 1 1.5 1.8 1L11 7c.8-.5.8-1.6 0-2.1L3.8.2C3 -.3 2 .3 2 1.2z" />
              </svg>
            ) : (
              <svg viewBox="0 0 12 12">
                <rect x="1" y="1" width="3.4" height="10" rx="1" />
                <rect x="7.6" y="1" width="3.4" height="10" rx="1" />
              </svg>
            )}
          </button>
          <a className="cta-mini" href={WAITLIST_HREF}>
            Join waitlist
          </a>
        </div>
      </nav>
      <div id="scrubber">
        <div className="fill" ref={fillRef} />
        <div className="head" ref={headRef} />
      </div>

      {/* HERO */}
      <section id="hero">
        <div className="glow" />
        <div className="logo-hero wordmark">editify</div>
        <h1>
          <span className="shimmer">Edit less.</span>
          <br />
          Create more.
        </h1>
        <p className="tagline">The first video editor with AI at its core.</p>
        <div className="actions">
          <a className="btn" href={WAITLIST_HREF}>
            Join the waitlist
          </a>
          <a className="btn ghost" href="#demo">
            ▶&nbsp; Watch it work
          </a>
        </div>
        <div className="hero-shot">
          <div className="frame" ref={tiltRef}>
            <img src="/ui.jpg" alt="The Editify AI editor interface" />
          </div>
        </div>
        <div className="strip">
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
          <div className="tc-marker reveal">Scene 01 · The problem</div>
          <h2 className="big reveal">
            Behind a 30-second reel,
            <br />
            are <span className="grad-text">4 hours</span> of editing.
          </h2>
          <div className="counter-wrap reveal">
            <div className="num">
              <span ref={countRef}>{counterText}</span>
              <span className="grad-text" style={{ fontSize: ".45em" }}>
                {counterCaption}
              </span>
            </div>
            <div className="cap">the average manual edit, for one short-form video</div>
          </div>
          <div className="cards3">
            <div className="pcard reveal">
              <span className="tclabel">CLIP 01</span>
              <div className="bar" />
              <h3>Time-consuming</h3>
              <p>
                Creators spend hours manually editing footage — trimming clips, syncing
                music, adding effects.
              </p>
            </div>
            <div className="pcard reveal" style={{ transitionDelay: ".12s" }}>
              <span className="tclabel">CLIP 02</span>
              <div className="bar" />
              <h3>Overwhelming</h3>
              <p>
                Social media moves fast. Keeping up with daily posting and shifting trends
                is hard.
              </p>
            </div>
            <div className="pcard reveal" style={{ transitionDelay: ".24s" }}>
              <span className="tclabel">CLIP 03</span>
              <div className="bar" />
              <h3>Repetitive</h3>
              <p>
                Recreating your style by hand, video after video, eats time you should
                spend creating.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SOLUTION */}
      <section id="solution">
        <div className="container" style={{ textAlign: "center" }}>
          <div className="tc-marker reveal" style={{ justifyContent: "center", display: "flex" }}>
            Scene 02 · The cut
          </div>
          <h2 className="big reveal">
            That&apos;s why we built
            <br />
            <span className="grad-text">editify.</span>
          </h2>
          <p className="sub reveal" style={{ marginLeft: "auto", marginRight: "auto" }}>
            An AI video editor that <strong>analyses your content and performance patterns</strong>,
            then builds <strong>personalised templates</strong> to automate the editing process —
            in your style.
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
                Editify studies your past videos and live trends, then predicts the styles
                most likely to hit — before you post.
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
                Pattern recognition learns your cuts, captions, pacing and colour — so
                every AI edit still looks like <em>you</em>.
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
                First cuts, beat-syncing, captions and reframing happen automatically. You
                keep full manual control over every AI edit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SHOWCASE */}
      <section id="showcase">
        <div className="container" style={{ textAlign: "center" }}>
          <div className="tc-marker reveal" style={{ justifyContent: "center", display: "flex" }}>
            Scene 03 · The editor
          </div>
          <h2 className="big reveal">
            Your style, <span className="grad-text">learned.</span>
          </h2>
          <p className="sub reveal" style={{ marginLeft: "auto", marginRight: "auto" }}>
            Import your footage and Editify builds a first cut in seconds — hook
            front-loaded, beat-synced, in the format you need. Then direct the AI like an
            editor: <strong>&quot;make the intro punchier and add the trending sound.&quot;</strong>
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
          <div className="tc-marker reveal">Scene 04 · Press play</div>
          <h2 className="big reveal">
            See the <span className="grad-text">prototype.</span>
          </h2>
          <p className="sub reveal">
            This is the real thing — our working prototype, live in your browser. Press
            play.
          </p>
          <div className="player reveal">
            <div className="bar-top">
              <span className="dot d1" />
              <span className="dot d2" />
              <span className="dot d3" />
              <span className="title">editify — prototype.mov</span>
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

      {/* HACKATHON */}
      <section id="hackathon">
        <div className="container wrap">
          <div>
            <div className="tc-marker reveal">Scene 05 · The origin</div>
            <h2 className="big reveal">
              Born in a<br />
              <span className="grad-text">hackathon.</span>
            </h2>
            <p className="sub reveal">
              Editify started when we were invited to the <strong>ElevenLabs × Cala</strong>{" "}
              startup hackathon — where we developed the idea and built our first
              prototype. We haven&apos;t stopped editing since.
            </p>
            <div className="badges reveal">
              <div className="badge">
                <small>Invited by</small>ElevenLabs
              </div>
              <div className="badge">
                <small>× Startup</small>Cala
              </div>
              <div className="badge">
                <small>Format</small>Hackathon → Prototype
              </div>
            </div>
          </div>
          <div className="hack-visual reveal">
            <div className="node n1">
              Idea<small>one insight: editing is the bottleneck</small>
            </div>
            <div className="node n0">
              editify<small>the first cut</small>
            </div>
            <div className="node n2">
              Prototype<small>built &amp; demoed live</small>
            </div>
            <div className="node n3">
              Momentum<small>backed by our community</small>
            </div>
          </div>
        </div>
      </section>

      {/* AUDIENCE */}
      <section id="audience">
        <div className="container">
          <div className="tc-marker reveal" style={{ justifyContent: "center", display: "flex" }}>
            Scene 06 · Who it&apos;s for
          </div>
          <h2 className="big reveal">
            Made for the creators
            <br />
            <span className="grad-text">on their way up.</span>
          </h2>
          <div className="row">
            <div className="acard reveal">
              <div className="big-n grad-text">0–150K</div>
              <p>
                We&apos;re built for micro-influencers — the creators growing fastest and
                editing hardest.
              </p>
            </div>
            <div className="acard reveal" style={{ transitionDelay: ".12s" }}>
              <div className="big-n grad-text">Full-time</div>
              <p>
                For people who want to turn content creation into a full-time job — and
                get their hours back.
              </p>
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
          <div className="tc-marker reveal" style={{ justifyContent: "center", display: "flex" }}>
            Scene 07 · Plans
          </div>
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
                <li>Advanced AI edits — included</li>
                <li>720p exports · 3 projects</li>
              </ul>
              <a className="btn ghost" href="mailto:marta@folch.org?subject=Editify%20waitlist%20—%20Free">
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
                <li>Pattern recognition — learns your editing style</li>
                <li>4K exports · unlimited projects</li>
                <li>Priority AI rendering</li>
              </ul>
              <a className="btn" href="mailto:marta@folch.org?subject=Editify%20waitlist%20—%20Creator">
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
              <a className="btn ghost" href="mailto:marta@folch.org?subject=Editify%20waitlist%20—%20Studio">
                Scale up
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section id="team">
        <div className="container">
          <div className="tc-marker reveal" style={{ justifyContent: "center", display: "flex" }}>
            Scene 08 · The team
          </div>
          <h2 className="big reveal" style={{ textAlign: "center" }}>
            Active. Passionate.
            <br />
            <span className="grad-text">Entrepreneurial.</span>
          </h2>
          <p className="sub reveal" style={{ margin: "24px auto 0", textAlign: "center" }}>
            Two founders, two continents, one obsession: giving creators their time back.
          </p>
          <div className="founders">
            <div className="founder reveal">
              <div className="head">
                <img src="/victoria.jpg" alt="Victoria Mañach" />
                <div className="who">
                  <h3>Victoria Mañach</h3>
                  <div className="loc">Co-founder · London (UK)</div>
                  <a className="mail" href="mailto:victoriamanach@gmail.com">
                    victoriamanach@gmail.com
                  </a>
                </div>
              </div>
              <ul>
                <li>Co-founder of Acceler8 — backed by YC founders, raised £7.5M</li>
                <li>
                  Challenge Leader for Student Minds: £150K+ raised, £3M with charity
                  partners
                </li>
                <li>TEDx speaker</li>
                <li>DJ &amp; avid trekker</li>
              </ul>
            </div>
            <div className="founder reveal" style={{ transitionDelay: ".12s" }}>
              <div className="head">
                <img src="/marta.jpg" alt="Marta Folch" />
                <div className="who">
                  <h3>Marta Folch</h3>
                  <div className="loc">Co-founder · Boston (USA)</div>
                  <a className="mail" href="mailto:marta@folch.org">
                    marta@folch.org
                  </a>
                </div>
              </div>
              <ul>
                <li>Serial entrepreneur: Circul8 and HelpUp</li>
                <li>RISE Rhodes-Schmidt Global Fellow</li>
                <li>
                  e-Board at eTower — Boston&apos;s oldest live-in incubator ($3B created
                  by alumni)
                </li>
                <li>TEDx speaker · violinist · lived in Japan for 2 years</li>
              </ul>
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
        <h2>
          Ready to
          <br />
          <span className="grad-text">roll credits</span> on manual editing?
        </h2>
        <p className="sub in" style={{ margin: "26px auto 0", textAlign: "center" }}>
          Be first in line when Editify launches.
        </p>
        <div style={{ marginTop: 40, position: "relative" }}>
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
