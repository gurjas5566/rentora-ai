import { useEffect, useRef } from "react";

const NeuralBackground = () => {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: null, y: null });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const nodes = [];
    const NODE_COUNT = 70;

    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // CONNECTIONS
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            let opacity = 0.05;

            // BOOST near mouse
            if (mouse.current.x) {
              const mx = nodes[i].x - mouse.current.x;
              const my = nodes[i].y - mouse.current.y;
              const mDist = Math.sqrt(mx * mx + my * my);

              if (mDist < 150) {
                opacity = 0.2;
              }
            }

            ctx.strokeStyle = `rgba(34,197,94,${opacity})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // NODES
      nodes.forEach(node => {
        let size = 2;

        // Grow near mouse
        if (mouse.current.x) {
          const dx = node.x - mouse.current.x;
          const dy = node.y - mouse.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) size = 3;
        }

        ctx.beginPath();
        ctx.arc(node.x, node.y, size, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(34,197,94,0.7)";
        ctx.fill();
      });

      // MOVEMENT
      nodes.forEach(node => {
        node.x += node.vx;
        node.y += node.vy;

        // Mouse attraction
        if (mouse.current.x) {
          const dx = mouse.current.x - node.x;
          const dy = mouse.current.y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            node.x += dx * 0.002;
            node.y += dy * 0.002;
          }
        }

        // Bounce edges
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;
      });

      requestAnimationFrame(draw);
    };

    draw();

    const handleMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none"
    />
  );
};

export default NeuralBackground;