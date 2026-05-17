'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

type SceneMode = 'hero' | 'compact';

function makeTextTexture(text: string, color: string, accent: string) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'rgba(2, 12, 28, 0.72)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = accent;
  ctx.lineWidth = 10;
  ctx.strokeRect(6, 6, canvas.width - 12, canvas.height - 12);
  ctx.fillStyle = color;
  ctx.font = '800 78px Arial, Helvetica, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export default function MathFieldScene({ mode = 'hero' }: { mode?: SceneMode }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0.15, mode === 'hero' ? 7.2 : 8.4);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const root = new THREE.Group();
    scene.add(root);

    const blue = new THREE.Color('#2774AE');
    const deep = new THREE.Color('#003B5C');
    const gold = new THREE.Color('#FFD100');
    const ice = new THREE.Color('#DAEBFE');

    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.45, 3),
      new THREE.MeshPhysicalMaterial({
        color: blue,
        metalness: 0.25,
        roughness: 0.28,
        clearcoat: 0.7,
        clearcoatRoughness: 0.25,
        transparent: true,
        opacity: 0.92,
      })
    );
    root.add(core);

    const wire = new THREE.LineSegments(
      new THREE.WireframeGeometry(core.geometry),
      new THREE.LineBasicMaterial({ color: gold, transparent: true, opacity: 0.42 })
    );
    root.add(wire);

    const ringMat = new THREE.MeshBasicMaterial({ color: gold, transparent: true, opacity: 0.78 });
    const ringA = new THREE.Mesh(new THREE.TorusGeometry(2.05, 0.018, 12, 180), ringMat);
    const ringB = new THREE.Mesh(new THREE.TorusGeometry(2.55, 0.014, 12, 180), ringMat.clone());
    ringA.rotation.set(1.05, 0.4, 0.05);
    ringB.rotation.set(0.32, 1.1, 0.35);
    root.add(ringA, ringB);

    const nodeMat = new THREE.MeshStandardMaterial({ color: ice, roughness: 0.38, metalness: 0.08 });
    const goldNodeMat = new THREE.MeshStandardMaterial({ color: gold, roughness: 0.3, metalness: 0.1 });
    const boxGeo = new THREE.BoxGeometry(0.18, 0.18, 0.18);
    for (let i = 0; i < 18; i += 1) {
      const theta = (i / 18) * Math.PI * 2;
      const radius = i % 3 === 0 ? 3.1 : 2.55;
      const node = new THREE.Mesh(boxGeo, i % 4 === 0 ? goldNodeMat : nodeMat);
      node.position.set(Math.cos(theta) * radius, Math.sin(theta * 1.7) * 0.9, Math.sin(theta) * radius * 0.38);
      node.rotation.set(theta * 0.7, theta, 0);
      root.add(node);
    }

    const labels = [
      { text: 'LAMT', x: -2.7, y: 1.55, z: 0.6, s: 0.92 },
      { text: '2026', x: 2.58, y: -1.35, z: 0.45, s: 0.82 },
      { text: 'PROOF', x: -2.95, y: -1.22, z: -0.25, s: 0.7 },
      { text: 'UCLA', x: 2.9, y: 1.35, z: -0.3, s: 0.74 },
    ];
    const labelPlanes: THREE.Mesh[] = [];
    labels.forEach((item) => {
      const texture = makeTextTexture(item.text, '#FFFFFF', '#FFD100');
      if (!texture) return;
      const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(1.55 * item.s, 0.76 * item.s),
        new THREE.MeshBasicMaterial({ map: texture, transparent: true })
      );
      plane.position.set(item.x, item.y, item.z);
      plane.rotation.set(0, item.x > 0 ? -0.28 : 0.28, item.x > 0 ? 0.08 : -0.08);
      labelPlanes.push(plane);
      root.add(plane);
    });

    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(260 * 3);
    for (let i = 0; i < 260; i += 1) {
      starPositions[i * 3] = (Math.random() - 0.5) * 12;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 7;
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 8 - 1.5;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const stars = new THREE.Points(
      starGeo,
      new THREE.PointsMaterial({ color: ice, size: 0.016, transparent: true, opacity: 0.5 })
    );
    scene.add(stars);

    const key = new THREE.DirectionalLight('#FFFFFF', 4.5);
    key.position.set(4, 5, 7);
    const fill = new THREE.DirectionalLight('#FFD100', 1.1);
    fill.position.set(-4, -2, 3);
    const ambient = new THREE.AmbientLight(deep, 1.6);
    scene.add(key, fill, ambient);

    let frame = 0;
    let targetProgress = 0;
    let progress = 0;
    const setSize = () => {
      const { width, height } = mount.getBoundingClientRect();
      renderer.setSize(Math.max(width, 1), Math.max(height, 1), false);
      camera.aspect = Math.max(width, 1) / Math.max(height, 1);
      camera.updateProjectionMatrix();
    };

    const updateProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      targetProgress = max > 0 ? window.scrollY / max : 0;
    };

    const animate = (time: number) => {
      progress += (targetProgress - progress) * 0.055;
      const pulse = Math.sin(time * 0.0012) * 0.08;
      root.rotation.y = progress * Math.PI * 2.2 + time * 0.00012;
      root.rotation.x = -0.18 + progress * 0.9 + pulse;
      root.rotation.z = Math.sin(progress * Math.PI * 2) * 0.16;
      root.position.y = Math.sin(time * 0.0008) * 0.08;
      core.scale.setScalar(1 + Math.sin(time * 0.001) * 0.025);
      ringA.rotation.z += 0.0025;
      ringB.rotation.z -= 0.0018;
      stars.rotation.y = time * 0.000035;
      camera.position.x = Math.sin(progress * Math.PI) * 0.55;
      camera.position.y = 0.1 + Math.cos(progress * Math.PI * 1.5) * 0.18;
      camera.lookAt(0, 0, 0);
      labelPlanes.forEach((plane) => {
        plane.lookAt(camera.position);
      });
      renderer.render(scene, camera);
      frame = window.requestAnimationFrame(animate);
    };

    setSize();
    updateProgress();
    window.addEventListener('resize', setSize);
    window.addEventListener('scroll', updateProgress, { passive: true });
    if (reducedMotion) {
      renderer.render(scene, camera);
    } else {
      frame = window.requestAnimationFrame(animate);
    }

    return () => {
      window.removeEventListener('resize', setSize);
      window.removeEventListener('scroll', updateProgress);
      window.cancelAnimationFrame(frame);
      mount.removeChild(renderer.domElement);
      scene.traverse((object) => {
        if ('geometry' in object && object.geometry instanceof THREE.BufferGeometry) object.geometry.dispose();
        if ('material' in object) {
          const material = object.material;
          if (Array.isArray(material)) material.forEach((item) => item.dispose());
          else if (material instanceof THREE.Material) material.dispose();
        }
      });
      renderer.dispose();
    };
  }, [mode]);

  return <div ref={mountRef} className={`math-field-scene math-field-scene--${mode}`} aria-hidden="true" />;
}
