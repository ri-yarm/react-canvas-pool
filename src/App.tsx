import React, { useRef, useEffect, useState } from "react";

interface Ball {
  x: number;
  y: number;
  radius: number;
  dx: number;
  dy: number;
}

const TriangleBalls: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [balls, setBalls] = useState<Ball[]>([]);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [activeBallIndex, setActiveBallIndex] = useState(-1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const newBalls: Ball[] = [];
    const radius = 20;
    const space = 50;
    const startX = canvas.width / 2 - space;
    const startY = canvas.height / 2;
    const height = Math.sqrt(3) * radius;

    for (let i = 0; i < 5; i++) {
      const x = startX + i * space;
      const y = startY + (i % 2 === 0 ? 0 : height / 2);
      newBalls.push({ x, y, radius, dx: 0, dy: 0 });
    }

    setBalls(newBalls);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      balls.forEach((ball) => {
        ball.x += ball.dx;
        ball.y += ball.dy;

        balls.forEach((otherBall) => {
          if (ball !== otherBall) {
            const dx = otherBall.x - ball.x;
            const dy = otherBall.y - ball.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const minDistance = ball.radius + otherBall.radius;

            if (distance < minDistance) {
              const angle = Math.atan2(dy, dx);
              const targetX = ball.x + Math.cos(angle) * minDistance;
              const targetY = ball.y + Math.sin(angle) * minDistance;
              const ax = (targetX - otherBall.x) * 0.1;
              const ay = (targetY - otherBall.y) * 0.1;

              ball.dx -= ax;
              ball.dy -= ay;
              otherBall.dx += ax;
              otherBall.dy += ay;
            }
          }
        });

        if (ball.x - ball.radius <= 0 || ball.x + ball.radius >= canvas.width) {
          ball.dx *= -0.8;
        }
        if (
          ball.y - ball.radius <= 0 ||
          ball.y + ball.radius >= canvas.height
        ) {
          ball.dy *= -0.8;
        }

        ball.dx *= 0.99;
        ball.dy *= 0.99;

        if (Math.abs(ball.dx) < 0.1) ball.dx = 0;
        if (Math.abs(ball.dy) < 0.1) ball.dy = 0;

        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      });

      requestAnimationFrame(animate);
    };

    animate();
  }, [balls]);

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const clickedBallIndex = balls.findIndex((ball) => {
      const dx = ball.x - mouseX;
      const dy = ball.y - mouseY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance <= ball.radius;
    });

    if (clickedBallIndex !== -1) {
      setActiveBallIndex(clickedBallIndex);
      setStartX(mouseX);
      setStartY(mouseY);
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (activeBallIndex !== -1) {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      const dx = (startX - mouseX) / 10;
      const dy = (startY - mouseY) / 10;

      const newBalls = balls.map((ball, index) => {
        if (index === activeBallIndex) {
          return {
            ...ball,
            dx,
            dy,
          };
        }
        return ball;
      });

      setBalls(newBalls);
    }
  };

  const handleMouseUp = () => {
    if (activeBallIndex !== -1) {
      setActiveBallIndex(-1);
    }
  };

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={800}
      style={{ backgroundColor: "white" }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    />
  );
};

export default TriangleBalls;
