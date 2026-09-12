/* ===================================================================
   Lumosia — Magic System (reusable)
   • theme toggle (remembers choice)
   • canvas particle system  -> window.LumosiaMagic.burst(x,y,count,spread,up)
   • button micro-interactions (ripple + sparkle)
   • the "sign-in unlock" sequence on form submit
   • respects prefers-reduced-motion
   =================================================================== */
(function () {
    var reduced = false;
    try { reduced = matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}

    /* ---------------- theme toggle ---------------- */
    try { if (localStorage.getItem("lumosia-theme") === "dark") document.body.classList.add("dark"); } catch (e) {}
    var toggle = document.createElement("button");
    toggle.className = "toggle";
    function paint() {
        var d = document.body.classList.contains("dark");
        toggle.innerHTML = "<span>" + (d ? "☀️ Light" : "🌙 Dark") + "</span>";
    }
    paint();
    toggle.addEventListener("click", function () {
        var d = document.body.classList.toggle("dark");
        try { localStorage.setItem("lumosia-theme", d ? "dark" : "light"); } catch (e) {}
        paint();
    });
    document.body.appendChild(toggle);

    /* ---------------- canvas particle system ---------------- */
    var canvas, ctx, particles = [], running = false, last = 0;
    // warm gold, champagne, occasional white sparkle
    var COLORS = ["#e7c464", "#e7c464", "#f2e2bb", "#f2e2bb", "#c99a3a", "#fff7e6"];

    function ensureCanvas() {
        if (canvas) return;
        canvas = document.createElement("canvas");
        canvas.setAttribute("aria-hidden", "true");
        canvas.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:9998";
        document.body.appendChild(canvas);
        ctx = canvas.getContext("2d");
        resize();
        addEventListener("resize", resize);
    }
    function resize() {
        if (!canvas) return;
        var d = window.devicePixelRatio || 1;
        canvas.width = innerWidth * d; canvas.height = innerHeight * d;
        canvas.style.width = innerWidth + "px"; canvas.style.height = innerHeight + "px";
        ctx.setTransform(d, 0, 0, d, 0, 0);
    }
    function spawn(x, y, count, spread, up) {
        ensureCanvas();
        for (var i = 0; i < count; i++) {
            var a = Math.random() * Math.PI * 2, sp = spread * (0.28 + Math.random() * 0.85);
            particles.push({
                x: x, y: y,
                vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - (up || 0),
                life: 0, max: 620 + Math.random() * 780,
                size: 1.4 + Math.random() * 2.6,
                col: COLORS[(Math.random() * COLORS.length) | 0]
            });
        }
        if (!running) { running = true; last = performance.now(); requestAnimationFrame(loop); }
    }
    function loop(t) {
        var dt = Math.min(50, t - last); last = t;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (var i = particles.length - 1; i >= 0; i--) {
            var p = particles[i]; p.life += dt;
            if (p.life >= p.max) { particles.splice(i, 1); continue; }
            var k = p.life / p.max;
            p.x += p.vx * dt / 1000; p.y += p.vy * dt / 1000;
            p.vy += 20 * dt / 1000; p.vx *= 0.986;
            var op = (1 - k); if (k < 0.14) op = k / 0.14;
            ctx.globalAlpha = Math.max(0, op) * 0.92;
            ctx.fillStyle = p.col; ctx.shadowColor = p.col; ctx.shadowBlur = 7;
            var s = p.size * (0.55 + 0.6 * (1 - k));
            ctx.beginPath(); ctx.arc(p.x, p.y, s, 0, 7); ctx.fill();
        }
        ctx.globalAlpha = 1; ctx.shadowBlur = 0;
        if (particles.length) requestAnimationFrame(loop); else running = false;
    }
    window.LumosiaMagic = {
        burst: function (x, y, count, spread, up) { if (!reduced) spawn(x, y, count || 14, spread || 100, up || 0); }
    };

    /* ---------------- button ripple ---------------- */
    function ripple(btn, e) {
        var r = btn.getBoundingClientRect();
        var d = Math.max(r.width, r.height) * 1.6;
        var s = document.createElement("span");
        s.className = "ripple";
        s.style.width = s.style.height = d + "px";
        s.style.left = (e.clientX - r.left - d / 2) + "px";
        s.style.top = (e.clientY - r.top - d / 2) + "px";
        btn.appendChild(s);
        setTimeout(function () { s.remove(); }, 650);
    }

    /* ---------------- clicks: sparkle + ripple ---------------- */
    document.addEventListener("click", function (e) {
        if (!(e.clientX || e.clientY)) return;               // ignore keyboard clicks
        var big = e.target.closest(".btn,.magic-btn,.charm,.nav a,.logout-btn,a");
        window.LumosiaMagic.burst(e.clientX, e.clientY, big ? 16 : 8, big ? 130 : 80, 18);
        var b = e.target.closest(".btn,.magic-btn,.logout-btn");
        if (b && !reduced) ripple(b, e);
    });

    /* ---------------- sign-in / sign-up UNLOCK ---------------- */
    document.addEventListener("submit", function (e) {
        var form = e.target;
        if (!(form instanceof HTMLFormElement)) return;
        if (form.checkValidity && !form.checkValidity()) return;   // keep native validation
        e.preventDefault();

        var btn = form.querySelector(".btn,.magic-btn") || form.querySelector("button");
        if (btn) btn.classList.add("magic-go");
        document.body.classList.add("logo-flare");

        if (!reduced) {
            var r = btn ? btn.getBoundingClientRect() : { left: innerWidth / 2, top: innerHeight / 2, width: 0, height: 0 };
            var cx = r.left + r.width / 2, cy = r.top + r.height / 2;
            spawn(cx, cy, 46, 240, 46);
            setTimeout(function () { spawn(cx, cy, 30, 340, 26); }, 150);
            // gentle spread across the whole page
            for (var i = 0; i < 46; i++) {
                (function (d) { setTimeout(function () { spawn(Math.random() * innerWidth, Math.random() * innerHeight * 0.92, 2, 90, 12); }, d); })(220 + Math.random() * 520);
            }
            shimmer();
            var card = form.closest(".card"); if (card) card.classList.add("magic-unlock");
        }
        setTimeout(function () { form.submit(); }, reduced ? 150 : 1150);
    }, true);

    /* ---------------- page shimmer sweep ---------------- */
    function shimmer() {
        var s = document.createElement("div");
        s.className = "shimmer-sweep";
        document.body.appendChild(s);
        setTimeout(function () { s.remove(); }, 1200);
    }

})();