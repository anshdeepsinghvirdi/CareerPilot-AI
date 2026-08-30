import { useEffect, useRef, useState } from "react";
import "./AnimatedBackground.css";

function AnimatedBackground() {
    const canvasRef = useRef(null);

    const mouseRef = useRef({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
    });

    const [position, setPosition] = useState({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
    });

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        let animationFrame;
        let particles = [];

        const particleCount = 70;
        const connectionDistance = 140;
        const cursorDistance = 180;

        const createParticles = () => {
            particles = [];

            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.35,
                    vy: (Math.random() - 0.5) * 0.35,
                    size: Math.random() * 2 + 1,
                });
            }
        };

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            createParticles();
        };

        const moveCursor = (e) => {
            mouseRef.current = {
                x: e.clientX,
                y: e.clientY,
            };

            setPosition({
                x: e.clientX,
                y: e.clientY,
            });
        };

        const animate = () => {
            ctx.clearRect(
                0,
                0,
                canvas.width,
                canvas.height
            );

            particles.forEach((particle) => {
                particle.x += particle.vx;
                particle.y += particle.vy;

                if (
                    particle.x < 0 ||
                    particle.x > canvas.width
                ) {
                    particle.vx *= -1;
                }

                if (
                    particle.y < 0 ||
                    particle.y > canvas.height
                ) {
                    particle.vy *= -1;
                }

                ctx.beginPath();

                ctx.arc(
                    particle.x,
                    particle.y,
                    particle.size,
                    0,
                    Math.PI * 2
                );

                ctx.fillStyle =
                    "rgba(96, 165, 250, 0.75)";

                ctx.shadowBlur = 10;
                ctx.shadowColor =
                    "rgba(96, 165, 250, 0.8)";

                ctx.fill();

                ctx.shadowBlur = 0;
            });

            // Connect nearby particles
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {

                    const dx =
                        particles[i].x -
                        particles[j].x;

                    const dy =
                        particles[i].y -
                        particles[j].y;

                    const particleDistance =
                        Math.sqrt(
                            dx * dx + dy * dy
                        );

                    if (
                        particleDistance <
                        connectionDistance
                    ) {
                        const opacity =
                            (1 -
                                particleDistance /
                                    connectionDistance) *
                            0.28;

                        ctx.beginPath();

                        ctx.moveTo(
                            particles[i].x,
                            particles[i].y
                        );

                        ctx.lineTo(
                            particles[j].x,
                            particles[j].y
                        );

                        ctx.strokeStyle =
                            `rgba(96, 165, 250, ${opacity})`;

                        ctx.lineWidth = 1;

                        ctx.stroke();
                    }
                }
            }

            // Connect nearby particles to cursor
            particles.forEach((particle) => {

                const dx =
                    particle.x -
                    mouseRef.current.x;

                const dy =
                    particle.y -
                    mouseRef.current.y;

                const mouseDistance =
                    Math.sqrt(
                        dx * dx + dy * dy
                    );

                if (
                    mouseDistance <
                    cursorDistance
                ) {
                    const opacity =
                        (1 -
                            mouseDistance /
                                cursorDistance) *
                        0.7;

                    ctx.beginPath();

                    ctx.moveTo(
                        particle.x,
                        particle.y
                    );

                    ctx.lineTo(
                        mouseRef.current.x,
                        mouseRef.current.y
                    );

                    ctx.strokeStyle =
                        `rgba(124, 58, 237, ${opacity})`;

                    ctx.lineWidth = 1.2;

                    ctx.stroke();
                }
            });

            animationFrame =
                requestAnimationFrame(animate);
        };

        resizeCanvas();
        animate();

        window.addEventListener(
            "resize",
            resizeCanvas
        );

        window.addEventListener(
            "mousemove",
            moveCursor
        );

        return () => {
            window.removeEventListener(
                "resize",
                resizeCanvas
            );

            window.removeEventListener(
                "mousemove",
                moveCursor
            );

            cancelAnimationFrame(
                animationFrame
            );
        };
    }, []);

    return (
        <div className="bg-container">

            <canvas
                ref={canvasRef}
                className="particle-canvas"
            />

            <div className="blob blob1"></div>

            <div className="blob blob2"></div>

            <div className="blob blob3"></div>

            <div
                className="cursor-glow"
                style={{
                    left: position.x,
                    top: position.y,
                }}
            ></div>

        </div>
    );
}

export default AnimatedBackground;