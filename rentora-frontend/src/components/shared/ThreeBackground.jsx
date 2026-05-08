import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const ThreeBackground = ({ 
  intensity = 0.015, 
  density = 85, 
  spacing = 0.5, 
  particleSize = 0.12,
  offsetY = -4,
  offsetX = 5
}) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;
    const W = el.clientWidth;
    const H = el.clientHeight;
    const scene = new THREE.Scene();
    
    const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 1000);
    camera.position.set(0, 8, 20);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    const terrainGroup = new THREE.Group();
    terrainGroup.position.set(offsetX, offsetY, 0);
    scene.add(terrainGroup);

    const width = density;
    const depth = density;
    
    const particleCount = width * depth;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    const geometry = new THREE.BufferGeometry();
    
    const material = new THREE.PointsMaterial({
      size: particleSize,
      vertexColors: true,
      transparent: true,
      opacity: 0.9
    });

    let i = 0;
    for (let ix = 0; ix < width; ix++) {
      for (let iz = 0; iz < depth; iz++) {
        const x = (ix - width / 2) * spacing;
        const z = (iz - depth / 2) * spacing;
        
        positions[i * 3] = x;
        positions[i * 3 + 1] = 0; 
        positions[i * 3 + 2] = z;
        
        const depthRatio = iz / depth;
        if (Math.random() > 0.96) {
          colors[i * 3] = 0.72; // gold
          colors[i * 3 + 1] = 0.58; 
          colors[i * 3 + 2] = 0.18; 
        } else {
          colors[i * 3] = 0.15 + depthRatio * 0.15; // green
          colors[i * 3 + 1] = 0.38 + depthRatio * 0.25; 
          colors[i * 3 + 2] = 0.22 + depthRatio * 0.15; 
        }
        
        i++;
      }
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    
    const particles = new THREE.Points(geometry, material);
    terrainGroup.add(particles);

    scene.fog = new THREE.FogExp2(0xF8F5EE, 0.035);

    let mouseX = 0, mouseY = 0;
    const onMouse = (e) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMouse);

    let animId;
    let time = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      time += intensity;

      let idx = 0;
      for (let ix = 0; ix < width; ix++) {
        for (let iz = 0; iz < depth; iz++) {
          const y = Math.sin((ix * 0.2 + time)) * 1.2 + 
                    Math.cos((iz * 0.2 + time)) * 1.2 +
                    Math.sin((ix * 0.1 + iz * 0.1 + time)) * 0.5;
          
          positions[idx * 3 + 1] = y;
          idx++;
        }
      }
      
      geometry.attributes.position.needsUpdate = true;

      const targetRotX = mouseY * 0.08;
      const targetRotY = -mouseX * 0.12;
      
      terrainGroup.rotation.x += (targetRotX - terrainGroup.rotation.x) * 0.05;
      terrainGroup.rotation.y += (targetRotY - terrainGroup.rotation.y) * 0.05;

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const w = el.clientWidth, h = el.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, [intensity, density, spacing, particleSize, offsetY, offsetX]);

  return <div ref={mountRef} className="absolute inset-0 z-0 pointer-events-none" />;
};

export default ThreeBackground;
