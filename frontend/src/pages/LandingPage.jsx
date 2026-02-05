import React, { useEffect, useRef, useState, useMemo } from "react";
import { Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  Stars,
  TorusKnot,
  MeshDistortMaterial,
  Cone,
  Sphere,
  Icosahedron,
  Box,
  Torus,
  Environment,
} from "@react-three/drei";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAuth } from "../hooks/useAuth";
import "./LandingPage.scss";

// Register Plugin
gsap.registerPlugin(ScrollTrigger);

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+";

const HyperText = ({ text }) => {
  const [displayText, setDisplayText] = useState(text);
  const iterations = useRef(0);

  const scramble = () => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText((prev) =>
        prev
          .split("")
          .map((letter, index) => {
            if (index < iteration) {
              return text[index];
            }
            return ALPHABET[Math.floor(Math.random() * 26)];
          })
          .join(""),
      );

      if (iteration >= text.length) {
        clearInterval(interval);
      }

      iteration += 1 / 3;
    }, 30);
  };

  return (
    <span
      className="hyper-text"
      onMouseEnter={scramble}
      style={{ display: "inline-block", minWidth: "1ch" }}
    >
      {displayText}
    </span>
  );
};

// --- 3D VISUALS FOR CARDS ---

// 1. Heatmap 3D (The "Ignited" Streak)
const Heatmap3D = () => {
  const count = 30; // Number of floating embers
  const mesh = useRef(null);
  const light = useRef(null);

  // Generate random initial positions
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = 0.01 + Math.random() / 200;
      const xFactor = -0.5 + Math.random() * 1;
      const yFactor = -0.5 + Math.random() * 1;
      const zFactor = -0.5 + Math.random() * 1;
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    particles.forEach((particle, i) => {
      let { t: time, factor, speed, xFactor, yFactor, zFactor } = particle;

      // Upward movement (Fire)
      const t0 = (particle.t = time + speed / 2); // Speed up
      const x = Math.sin(t0 * 3 + xFactor * 10) * ((t0 % 5) * 0.2); // Wiggle
      const y = (t0 % 5) * 0.8 - 2; // Rise from -2 to +2
      const z = Math.cos(t0 * 3 + zFactor * 10) * ((t0 % 5) * 0.2); // Wiggle

      // Reset if too high
      // Using a dummy object to set instance matrices would be performant,
      // but for <30 items, individual meshes are fine for readability here.
    });

    // Since we need to animate multiple meshes efficiently, let's use a simpler "Jumping Blocks" approach
    // which is cleaner for this R3F setup without InstancedMesh complexity
  });

  // Simpler "Exciting" Animation: The "Equalizer" / "City" Stagger
  // A grid of blocks that shoots up randomly like pistons
  const groupRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    groupRef.current.children.forEach((child, i) => {
      // Random piston motion
      // Use Noise-like chaos
      const noise = Math.sin(t * 5 + i * 200) + Math.cos(t * 3 + i * 10);
      child.scale.y = 1 + Math.max(0, noise * 2); // Shoot up only
      child.position.y = (child.scale.y * 1) / 2 - 1; // Anchor to bottom

      // Color Shift based on height
      if (child.material) {
        const intensity = child.scale.y / 2;
        child.material.color.setHSL(0.5 + intensity * 0.1, 1, 0.5); // Cyan to Blue
        child.material.emissiveIntensity = intensity * 1.5;
      }
    });
  });

  // 5x5 Grid
  const grid = useMemo(() => {
    const items = [];
    for (let x = -2; x <= 2; x++) {
      for (let z = -2; z <= 2; z++) {
        items.push({ x: x * 0.8, z: z * 0.8 });
      }
    }
    return items;
  }, []);

  return (
    <group ref={groupRef} rotation={[0.4, 0, 0]}>
      {grid.map((pos, i) => (
        <mesh key={i} position={[pos.x, 0, pos.z]}>
          <boxGeometry args={[0.6, 1, 0.6]} />
          <meshStandardMaterial
            color="#00F5FF"
            emissive="#00F5FF"
            roughness={0.1}
          />
        </mesh>
      ))}
    </group>
  );
};

// 2. PvP Trophy 3D (Floating Crown/Chalice)
const Trophy3D = () => {
  return (
    <Float speed={4} rotationIntensity={2} floatIntensity={2}>
      <group>
        {/* Crown Base */}
        <mesh position={[0, -0.5, 0]}>
          <cylinderGeometry args={[0.8, 0.8, 0.3, 8]} />
          <meshStandardMaterial
            color="#FFD700"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        {/* Crown Points */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[1.2, 0.8, 0.8, 8, 1, true]} />
          <meshStandardMaterial
            color="#FFD700"
            metalness={0.8}
            roughness={0.2}
            side={2}
          />
        </mesh>
        {/* Crown Gems */}
        <mesh position={[0, 0.5, 0]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial
            color="#FF0000"
            emissive="#FF0000"
            emissiveIntensity={2}
          />
        </mesh>
        {/* Glowing Orb inside */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial
            color="#FFD700"
            emissive="#FFD700"
            emissiveIntensity={0.5}
            opacity={0.5}
            transparent
          />
        </mesh>
      </group>
    </Float>
  );
};

// 3. Atom 3D (Atomic Tracking)
const Atom3D = () => {
  const groupRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.y = t * 0.2;
  });

  return (
    <group ref={groupRef}>
      {/* Nucleus */}
      <mesh>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshStandardMaterial
          color="#8A2BE2"
          emissive="#8A2BE2"
          emissiveIntensity={2}
        />
      </mesh>
      {/* Electrons */}
      <group rotation={[0, 0, Math.PI / 3]}>
        <mesh>
          <torusGeometry args={[2, 0.05, 16, 100]} />
          <meshStandardMaterial
            color="#00F5FF"
            emissive="#00F5FF"
            transparent
            opacity={0.5}
          />
        </mesh>
        <mesh position={[2, 0, 0]}>
          <sphereGeometry args={[0.15]} />
          <meshStandardMaterial
            color="#00F5FF"
            emissive="#00F5FF"
            emissiveIntensity={3}
          />
        </mesh>
      </group>
      <group rotation={[0, 0, -Math.PI / 3]}>
        <mesh>
          <torusGeometry args={[2, 0.05, 16, 100]} />
          <meshStandardMaterial
            color="#00F5FF"
            emissive="#00F5FF"
            transparent
            opacity={0.5}
          />
        </mesh>
        <mesh position={[-2, 0, 0]}>
          <sphereGeometry args={[0.15]} />
          <meshStandardMaterial
            color="#00F5FF"
            emissive="#00F5FF"
            emissiveIntensity={3}
          />
        </mesh>
      </group>
      <group rotation={[Math.PI / 2, 0, 0]}>
        <mesh>
          <torusGeometry args={[2, 0.05, 16, 100]} />
          <meshStandardMaterial
            color="#00F5FF"
            emissive="#00F5FF"
            transparent
            opacity={0.5}
          />
        </mesh>
        <mesh position={[0, 2, 0]}>
          <sphereGeometry args={[0.15]} />
          <meshStandardMaterial
            color="#00F5FF"
            emissive="#00F5FF"
            emissiveIntensity={3}
          />
        </mesh>
      </group>
    </group>
  );
};

// 4. Neuro 3D (Neural Network)
const Neuro3D = () => {
  const meshRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.x = t * 0.1;
    meshRef.current.rotation.y = t * 0.1;
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={0.5}>
      <Icosahedron ref={meshRef} args={[2, 1]}>
        <meshStandardMaterial
          color="#00F5FF"
          wireframe
          emissive="#00F5FF"
          emissiveIntensity={0.5}
          transparent
          opacity={0.6}
        />
      </Icosahedron>
      {/* Inner Brain Pulse */}
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <MeshDistortMaterial
          color="#8A2BE2"
          emissive="#8A2BE2"
          emissiveIntensity={1}
          distort={0.6}
          speed={3}
        />
      </mesh>
    </Float>
  );
};

// --- CUSTOM CURSOR ---
const CustomCursor = () => {
  const cursorRef = useRef(null);
  const trailRef = useRef(null);

  useEffect(() => {
    const onMouseMove = (e) => {
      const { clientX, clientY } = e;
      gsap.to(cursorRef.current, { x: clientX, y: clientY, duration: 0.1 });
      gsap.to(trailRef.current, { x: clientX, y: clientY, duration: 0.4 });
    };

    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  return (
    <>
      <div ref={cursorRef} className="landing-page__cursor" />
      <div ref={trailRef} className="landing-page__cursor-trail" />
    </>
  );
};

// --- HERO ENGINE ---
const EngineCore = () => {
  const meshRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    // Heartbeat Pulse
    const scale = 1 + Math.sin(time * 3) * 0.05 + Math.sin(time * 10) * 0.02;
    meshRef.current.scale.set(scale, scale, scale);
    meshRef.current.rotation.x = time * 0.4;
    meshRef.current.rotation.y = time * 0.2;
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <TorusKnot ref={meshRef} args={[1.5, 0.4, 200, 30]} position={[0, 0, 0]}>
        <MeshDistortMaterial
          color="#00F5FF"
          attach="material"
          distort={0.4}
          speed={2}
          wireframe
          emissive="#00F5FF"
          emissiveIntensity={0.8}
        />
      </TorusKnot>
    </Float>
  );
};

// --- MAIN PAGE ---

const LandingPage = () => {
  const { user } = useAuth();

  // Refs
  const containerRef = useRef(null);

  // Redirect
  if (user) return <Navigate to="/app" replace />;

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero Text Flicker
      gsap.fromTo(
        ".highlight::before",
        { width: "0%" },
        { width: "100%", duration: 2, ease: "power4.out", delay: 0.5 },
      );

      // Heatmap Reveal
      gsap.from(".landing-page__heatmap-card", {
        y: 100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: {
          trigger: ".landing-page__heatmap",
          start: "top 70%",
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="landing-page" ref={containerRef}>
      <CustomCursor />

      {/* BACKGROUND AURORA */}
      <div className="landing-page__aurora">
        <div className="landing-page__aurora-item"></div>
        <div className="landing-page__aurora-item"></div>
        <div className="landing-page__aurora-item"></div>
      </div>

      {/* HERO */}
      <section className="landing-page__hero">
        <div className="landing-page__hero-left">
          <h1>
            <HyperText text="IGNITE" /> <br />
            <HyperText text="YOUR" /> <br />
            <span className="highlight" data-text="DISCIPLINE">
              DISCIPLINE
            </span>
          </h1>
          <Link to="/register" className="landing-page__hero-btn">
            Initialize
          </Link>
        </div>

        <div className="landing-page__hero-right">
          <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} color="#00F5FF" intensity={2} />
            <pointLight
              position={[-10, -5, -10]}
              color="#8A2BE2"
              intensity={2}
            />
            <Stars
              radius={100}
              depth={50}
              count={5000}
              factor={4}
              saturation={0}
              fade
              speed={1}
            />
            <EngineCore />
          </Canvas>
        </div>
      </section>

      {/* FEATURE GRID (DISCIPLINE MATRIX) */}
      <section className="landing-page__heatmap">
        <h2>Discipline Matrix</h2>
        <div className="landing-page__heatmap-grid">
          {/* Card 1: Heatmap */}
          <div className="landing-page__heatmap-card landing-page__heatmap-card--large">
            <Canvas camera={{ position: [0, 5, 5], fov: 45 }}>
              <ambientLight intensity={0.5} />
              <pointLight position={[5, 10, 5]} intensity={2} color="#00F5FF" />
              <Heatmap3D />
            </Canvas>
            <h3>Streak Heatmap</h3>
            <p>Visualizing momentum. A living record of your battles won.</p>
          </div>

          {/* Card 2: PvP */}
          <div className="landing-page__heatmap-card">
            <Canvas camera={{ position: [0, 0, 5] }}>
              <ambientLight intensity={0.3} />
              <pointLight position={[2, 3, 4]} intensity={2} color="#FFD700" />
              <Environment preset="city" />
              <Trophy3D />
            </Canvas>
            <h3>PvP Protocol</h3>
            <p>Compete for the crown.</p>
          </div>

          {/* Card 3: Atomic */}
          <div className="landing-page__heatmap-card">
            <Canvas camera={{ position: [0, 0, 6] }}>
              <ambientLight intensity={0.5} />
              <pointLight position={[-2, 3, 4]} intensity={2} color="#00F5FF" />
              <Atom3D />
            </Canvas>
            <h3>Atomic Tracking</h3>
            <p>Precision time-logging.</p>
          </div>

          {/* Card 4: Neuro */}
          <div className="landing-page__heatmap-card">
            <Canvas camera={{ position: [0, 0, 5] }}>
              <ambientLight intensity={0.5} />
              <pointLight position={[2, 2, 2]} intensity={2} color="#8A2BE2" />
              <Neuro3D />
            </Canvas>
            <h3>Neuro Sync</h3>
            <p>Optimize your mental state.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="landing-page__cta">
        <Link to="/register" className="landing-page__cta-btn">
          Join The Network
        </Link>
      </section>
    </div>
  );
};

export default LandingPage;
