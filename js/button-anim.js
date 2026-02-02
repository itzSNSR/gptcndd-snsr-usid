// Button Animation Logic (Refactored for Standard GSAP)
// Replaces Physics2D with standard tweens for compatibility

// Helper to Create SVG Elements
const createSVG = (width, height, className, childType, childAttributes) => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.classList.add(className);
    const child = document.createElementNS("http://www.w3.org/2000/svg", childType);

    svg.setAttributeNS("http://www.w3.org/2000/svg", "viewBox", `0 0 ${width} ${height}`);

    for (const attr in childAttributes) {
        child.setAttribute(attr, childAttributes[attr]);
    }

    svg.appendChild(child);
    return { svg, child };
};

// Global Loader Helpers (for manual button control)
window.startLoader = function (btn) {
    if (!btn) return;
    btn.classList.add('loading');
    btn.disabled = true;
};

window.finishLoader = function (btn, success) {
    if (!btn) return;

    if (success) {
        btn.classList.add('loaded');
        setTimeout(() => {
            btn.classList.add('finished');
        }, 500);
    } else {
        // Error case: Just stop loading and re-enable
        btn.classList.remove('loading');
        btn.disabled = false;
    }
};

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".generate-button").forEach((button) => {
        const width = button.offsetWidth;
        const height = button.offsetHeight;
        const style = getComputedStyle(button);

        // create dots SVG
        const { svg, child: circle } = createSVG(width, height, "dots", "circle", {
            cx: "0",
            cy: "0",
            r: "0",
        });

        // create stroke group
        const strokeGroup = document.createElement("div");
        strokeGroup.classList.add("stroke");

        const { svg: stroke } = createSVG(width, height, "stroke-line", "rect", {
            x: "0",
            y: "0",
            width: "100%",
            height: "100%",
            rx: parseInt(style.borderRadius, 10),
            ry: parseInt(style.borderRadius, 10),
            pathLength: "10",
        });

        button.appendChild(svg);
        strokeGroup.appendChild(stroke);
        strokeGroup.appendChild(stroke.cloneNode(true));
        button.appendChild(strokeGroup);

        // Main Animation Timeline
        const timeline = gsap.timeline({ paused: true });
        const DOT_AMOUNT = 30; // Reduced slighty for performance

        for (let i = 0; i < DOT_AMOUNT; i++) {
            const p = circle.cloneNode(true);
            svg.appendChild(p);

            gsap.set(p, {
                attr: {
                    cx: gsap.utils.random(width * 0.25, width * 0.75),
                    cy: gsap.utils.random(height * 0.5, height * 0.5),
                    r: 0,
                },
            });

            const durationRandom = gsap.utils.random(10, 12);
            const tl = gsap.timeline();

            // Simulate Physics without Plugin
            // Velocity: Move Up (-y) and Out (x)
            const angle = -90 * (Math.PI / 180); // Upwards
            const velocity = gsap.utils.random(10, 25);
            const vx = Math.cos(angle) * velocity + gsap.utils.random(-10, 10); // Random spread
            const vy = Math.sin(angle) * velocity;

            tl.to(p, {
                duration: durationRandom,
                rotation: i % 2 === 0 ? 200 : -200,
                attr: {
                    r: gsap.utils.random(0.75, 1.5),
                    // Standard tween approximation of physics
                    cy: `-=${width * gsap.utils.random(1.25, 1.75)}`,
                    cx: `+=${gsap.utils.random(-20, 20)}`
                },
                ease: "power1.out"
            }, "-=" + durationRandom / 2).to(p, {
                duration: durationRandom / 3,
                attr: {
                    r: 0,
                },
            }, "-=" + durationRandom / 4);

            timeline.add(tl, i / 3);
        }

        svg.removeChild(circle);

        const finalTimeline = gsap.to(timeline, {
            duration: 10,
            repeat: -1,
            time: timeline.duration(),
            paused: true,
        });

        // Star Animations
        const stars = gsap.to(button, {
            repeat: -1,
            repeatDelay: 0.75,
            paused: true,
            keyframes: [
                {
                    "--generate-button-star-2-scale": ".5",
                    "--generate-button-star-2-opacity": ".25",
                    "--generate-button-star-3-scale": "1.25",
                    "--generate-button-star-3-opacity": "1",
                    duration: 0.3,
                },
                {
                    "--generate-button-star-1-scale": "1.5",
                    "--generate-button-star-1-opacity": ".5",
                    "--generate-button-star-2-scale": ".5",
                    "--generate-button-star-3-scale": "1",
                    "--generate-button-star-3-opacity": ".5",
                    duration: 0.3,
                },
                {
                    "--generate-button-star-1-scale": "1",
                    "--generate-button-star-1-opacity": ".25",
                    "--generate-button-star-2-scale": "1.15",
                    "--generate-button-star-2-opacity": "1",
                    duration: 0.3,
                },
                {
                    "--generate-button-star-2-scale": "1",
                    duration: 0.35,
                },
            ],
        });

        // Event Listeners
        button.addEventListener("pointerenter", () => {
            gsap.to(button, {
                "--generate-button-dots-opacity": ".5",
                duration: 0.25,
                onStart: () => {
                    finalTimeline.restart().play();
                    setTimeout(() => stars.restart().play(), 500);
                },
            });
        });

        button.addEventListener("pointerleave", () => {
            gsap.to(button, {
                "--generate-button-dots-opacity": "0",
                "--generate-button-star-1-opacity": ".25",
                "--generate-button-star-1-scale": "1",
                "--generate-button-star-2-opacity": "1",
                "--generate-button-star-2-scale": "1",
                "--generate-button-star-3-opacity": ".5",
                "--generate-button-star-3-scale": "1",
                duration: 0.15,
                onComplete: () => {
                    finalTimeline.pause();
                    stars.pause();
                },
            });
        });

        // DISABLED: Chat toggle is handled by onclick="toggleChatbot()" in HTML
        // button.addEventListener("click", () => {
        //     const container = document.querySelector('.chatbot-container');
        //     const btn = document.querySelector('.generate-button');
        //     if (container) {
        //         container.classList.toggle('active');
        //     }
        // });
    });
});
