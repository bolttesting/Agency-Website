/**
 * WebGL shader background (Three.js).
 *
 * This repo uses Vite + React (JSX), not shadcn/Next/Tailwind. Component lives in
 * src/components/ui/ for parity with shadcn-style structure; paths differ from @/components/ui.
 *
 * If you migrate to shadcn + Tailwind + TypeScript: install deps, run `npx shadcn@latest init`,
 * rename to .tsx, replace inline styles with Tailwind classes, and use `import { ShaderAnimation } from "@/components/ui/shader-animation"`.
 */
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function ShaderAnimation({ className = '', style = {} }) {
  const containerRef = useRef(null);
  const rafRef = useRef(0);

  useEffect(() => {
    if (!containerRef.current) return undefined;

    const container = containerRef.current;

    const vertexShader = `
      void main() {
        gl_Position = vec4( position, 1.0 );
      }
    `;

    const fragmentShader = `
      #define TWO_PI 6.2831853072
      #define PI 3.14159265359

      precision highp float;
      uniform vec2 resolution;
      uniform float time;

      void main(void) {
        vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
        float t = time*0.05;
        float lineWidth = 0.002;

        vec3 color = vec3(0.0);
        for(int j = 0; j < 3; j++){
          for(int i=0; i < 5; i++){
            color[j] += lineWidth*float(i*i) / abs(fract(t - 0.01*float(j)+float(i)*0.01)*5.0 - length(uv) + mod(uv.x+uv.y, 0.2));
          }
        }

        gl_FragColor = vec4(color[0],color[1],color[2],1.0);
      }
    `;

    const camera = new THREE.Camera();
    camera.position.z = 1;

    const scene = new THREE.Scene();
    const geometry = new THREE.PlaneGeometry(2, 2);

    const uniforms = {
      time: { value: 1.0 },
      resolution: { value: new THREE.Vector2() },
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch (error) {
      // Some devices/browsers intermittently fail to create a WebGL context.
      // Keep the page usable by disabling only this decorative background.
      console.warn('ShaderAnimation: WebGL unavailable, skipping background.', error);
      geometry.dispose();
      material.dispose();
      return undefined;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    container.appendChild(renderer.domElement);
    let stopped = false;

    const onContextLost = (event) => {
      event.preventDefault();
      stopped = true;
      cancelAnimationFrame(rafRef.current);
    };
    renderer.domElement.addEventListener('webglcontextlost', onContextLost, false);

    const onWindowResize = () => {
      if (stopped) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height);
      uniforms.resolution.value.x = renderer.domElement.width;
      uniforms.resolution.value.y = renderer.domElement.height;
    };

    onWindowResize();
    window.addEventListener('resize', onWindowResize, false);

    /** Stop rendering when the hero is off-screen or the tab is hidden (frees CPU/GPU during scroll). */
    let inView = true;
    const io = new IntersectionObserver(
      (entries) => {
        inView = entries.length > 0 ? entries[0].isIntersecting : true;
        if (inView && !document.hidden) schedule();
      },
      { root: null, threshold: 0, rootMargin: '80px' },
    );
    io.observe(container);

    const onVisibility = () => {
      if (!document.hidden && inView) schedule();
    };
    document.addEventListener('visibilitychange', onVisibility, false);

    const schedule = () => {
      if (stopped) return;
      if (document.hidden || !inView) {
        rafRef.current = 0;
        return;
      }
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(tick);
    };

    const tick = () => {
      if (stopped) return;
      rafRef.current = 0;
      if (document.hidden || !inView) return;
      uniforms.time.value += 0.05;
      try {
        renderer.render(scene, camera);
      } catch (error) {
        stopped = true;
        console.warn('ShaderAnimation: render stopped after WebGL error.', error);
        return;
      }
      schedule();
    };

    schedule();

    return () => {
      stopped = true;
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility, false);
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
      window.removeEventListener('resize', onWindowResize);
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        width: '100%',
        height: '100%',
        minHeight: '100%',
        background: 'transparent',
        overflow: 'hidden',
        ...style,
      }}
      aria-hidden
    />
  );
}

export default ShaderAnimation;
