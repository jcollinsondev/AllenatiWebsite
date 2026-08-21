/*window.addEventListener("scroll", () => {
    const scale = 1 - window.scrollY / 1000;
    const opacity = 1 - window.scrollY / 800;

    document.documentElement.style.setProperty(
        "--scroll-scale",
        scale
    );

    document.documentElement.style.setProperty(
        "--scroll-opacity",
        opacity
    );
});*/

window.addEventListener("load", function () {
    console.log("setup")
    setupOrbitalPulse();
});

function setupOrbitalPulse() {
    const container = document.getElementById("orbital-pulse");
    if (!container) return;

    container.innerHTML = "";

    // Make sure the container can contain the canvas
    container.style.position = "relative";

    const canvas = document.createElement("canvas");
    canvas.style.position = "absolute";
    canvas.style.left = "0";
    canvas.style.top = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.pointerEvents = "none";

    container.appendChild(canvas);

    const ctx = canvas.getContext("2d");

    let width = 0;
    let height = 0;
    let centerX = 0;
    let centerY = 0;
    let maxRadius = 0;
    let scale = 0;

    function resize() {
        const rect = container.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;

        width = rect.width;
        height = rect.height;

        canvas.width = width * dpr;
        canvas.height = height * dpr;

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        centerX = width / 2;
        centerY = height / 2;

        // Scale the orbital system to the available space
        maxRadius = Math.min(width, height);
        scale = maxRadius / 150;
    }

    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    let time = 0;
    let lastTime = 0;

    const orbits = [
        { radius: 0.10, dotCount: 6 },
        { radius: 0.18, dotCount: 10 },
        { radius: 0.26, dotCount: 14 },
        { radius: 0.34, dotCount: 18 },
        { radius: 0.42, dotCount: 22 },
        { radius: 0.50, dotCount: 26 }
    ];

    const pulseFrequency = 0.2;
    const pulseAmplitude = 2;

    function animate(timestamp) {
        if (!lastTime) lastTime = timestamp;

        const deltaTime = timestamp - lastTime;
        lastTime = timestamp;
        time += deltaTime * 0.001;

        ctx.clearRect(0, 0, width, height);

        // Center
        ctx.beginPath();
        ctx.arc(centerX, centerY, 3, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.fill();

        orbits.forEach((orbit) => {
            const radius = maxRadius * orbit.radius;

            // Orbit circle
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
            ctx.lineWidth = 1;
            ctx.stroke();

            // Pulse
            const normalizedRadius = radius / maxRadius;
            const pulseDelay = normalizedRadius * 1.5;

            const pulsePhase =
                (time * pulseFrequency - pulseDelay) % 1;

            const pulseEffect =
                Math.sin(pulsePhase * Math.PI) * pulseAmplitude;

            const finalPulseEffect =
                pulseEffect > 0 ? pulseEffect : 0;

            // Dots
            for (let i = 0; i < orbit.dotCount; i++) {
                const angle =
                    (i / orbit.dotCount) * Math.PI * 2;

                const pulsedRadius =
                    radius + finalPulseEffect;

                const x =
                    centerX + Math.cos(angle) * pulsedRadius;

                const y =
                    centerY + Math.sin(angle) * pulsedRadius;

                const dotSize =
                    (2 + (finalPulseEffect / pulseAmplitude) * 1.5) * scale;

                const opacity =
                    0.7 +
                    (finalPulseEffect / pulseAmplitude) * 0.3;

                ctx.beginPath();
                ctx.arc(x, y, dotSize, 0, Math.PI * 2);
                ctx.fillStyle =
                    `rgba(255, 255, 255, ${opacity})`;
                ctx.fill();
            }
        });

        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
}