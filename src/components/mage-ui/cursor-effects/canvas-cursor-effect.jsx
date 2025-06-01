'use client';

import { useEffect, useRef } from 'react';

const useCanvasCursor = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    let ctx;
    let f;
    let pos = { x: 0, y: 0 };
    let lines = [];

    const E = {
      debug: true,
      friction: 0.5,
      trails: 20,
      size: 50,
      dampening: 0.25,
      tension: 0.98,
    };

    class Oscillator {
      constructor(options = {}) {
        this.phase = options.phase || 0;
        this.offset = options.offset || 0;
        this.frequency = options.frequency || 0.001;
        this.amplitude = options.amplitude || 1;
      }

      update() {
        this.phase += this.frequency;
        return this.offset + Math.sin(this.phase) * this.amplitude;
      }

      value() {
        return this.offset + Math.sin(this.phase) * this.amplitude;
      }
    }

    class Node {
      constructor() {
        this.x = 0;
        this.y = 0;
        this.vx = 0;
        this.vy = 0;
      }
    }

    class Line {
      constructor(options = {}) {
        this.spring = (options.spring || 0.45) + (0.1 * Math.random() - 0.02);
        this.friction = E.friction + (0.01 * Math.random() - 0.002);
        this.nodes = [];

        for (let i = 0; i < E.size; i++) {
          const node = new Node();
          node.x = pos.x;
          node.y = pos.y;
          this.nodes.push(node);
        }
      }

      update() {
        let spring = this.spring;
        let node = this.nodes[0];

        node.vx += (pos.x - node.x) * spring;
        node.vy += (pos.y - node.y) * spring;

        for (let i = 0; i < this.nodes.length; i++) {
          node = this.nodes[i];

          if (i > 0) {
            const prev = this.nodes[i - 1];
            node.vx += (prev.x - node.x) * spring;
            node.vy += (prev.y - node.y) * spring;
            node.vx += prev.vx * E.dampening;
            node.vy += prev.vy * E.dampening;
          }

          node.vx *= this.friction;
          node.vy *= this.friction;
          node.x += node.vx;
          node.y += node.vy;

          spring *= E.tension;
        }
      }

      draw() {
        if (!ctx) return;

        let x = this.nodes[0].x;
        let y = this.nodes[0].y;

        ctx.beginPath();
        ctx.moveTo(x, y);

        for (let i = 1; i < this.nodes.length - 2; i++) {
          const curNode = this.nodes[i];
          const nextNode = this.nodes[i + 1];
          x = 0.5 * (curNode.x + nextNode.x);
          y = 0.5 * (curNode.y + nextNode.y);
          ctx.quadraticCurveTo(curNode.x, curNode.y, x, y);
        }

        if (this.nodes.length > 2) {
          const i = this.nodes.length - 2;
          const curNode = this.nodes[i];
          const nextNode = this.nodes[i + 1];
          ctx.quadraticCurveTo(curNode.x, curNode.y, nextNode.x, nextNode.y);
        }

        ctx.stroke();
        ctx.closePath();
      }
    }

    const createLines = () => {
      lines = [];
      for (let i = 0; i < E.trails; i++) {
        lines.push(new Line({ spring: 0.4 + (i / E.trails) * 0.025 }));
      }
    };

    const handlePointerMove = (e) => {
      if ('touches' in e && e.touches.length > 0) {
        pos.x = e.touches[0].pageX;
        pos.y = e.touches[0].pageY;
      } else {
        pos.x = e.clientX;
        pos.y = e.clientY;
      }

      if (e.cancelable) e.preventDefault();
    };

    const handleTouchStart = (e) => {
      if (e.touches.length === 1) {
        pos.x = e.touches[0].pageX;
        pos.y = e.touches[0].pageY;
      }
    };

    const render = () => {
      if (!ctx || !ctx.running) return;

      ctx.globalCompositeOperation = 'source-over';
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.globalCompositeOperation = 'lighter';

      try {
        const hue = Math.round(f.update());
        ctx.strokeStyle = `hsla(${hue},50%,50%,0.2)`;
        ctx.lineWidth = 1;

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          line.update();
          line.draw();
        }

        if (ctx.frame !== undefined) ctx.frame++;

        window.requestAnimationFrame(render);
      } catch (error) {
        console.error("Error in render loop:", error);
        ctx.running = false;
      }
    };

    const resizeCanvas = () => {
      if (!canvasRef.current) return;
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;
    };

    const onMousemove = (e) => {
      document.removeEventListener('mousemove', onMousemove);
      document.removeEventListener('touchstart', onMousemove);

      document.addEventListener('mousemove', handlePointerMove);
      document.addEventListener('touchmove', handlePointerMove, { passive: true });
      document.addEventListener('touchstart', handleTouchStart);

      handlePointerMove(e);
      createLines();
      render();
    };

    const handleFocus = () => {
      if (ctx && !ctx.running) {
        ctx.running = true;
        render();
      }
    };

    const handleBlur = () => {
      if (ctx) ctx.running = false;
    };

    const initCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.running = true;
      ctx.frame = 1;

      f = new Oscillator({
        phase: Math.random() * 2 * Math.PI,
        amplitude: 85,
        frequency: 0.0015,
        offset: 285,
      });

      document.addEventListener('mousemove', onMousemove);
      document.addEventListener('touchstart', onMousemove);
      window.addEventListener('resize', resizeCanvas);
      window.addEventListener('focus', handleFocus);
      window.addEventListener('blur', handleBlur);

      resizeCanvas();

      pos = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      };

      createLines();
      render();
    };

    initCanvas();

    return () => {
      if (ctx) ctx.running = false;

      document.removeEventListener('mousemove', onMousemove);
      document.removeEventListener('touchstart', onMousemove);
      document.removeEventListener('mousemove', handlePointerMove);
      document.removeEventListener('touchmove', handlePointerMove);
      document.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  return canvasRef;
};

const CanvasCursor = () => {
  const canvasRef = useCanvasCursor();

  return (
    <canvas
      ref={canvasRef}
      id="canvas"
      className="pointer-events-none fixed inset-0 w-full h-screen z-50"
    />
  );
};

export default CanvasCursor;
