import React, { useEffect, useRef, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars, Text, Trail } from "@react-three/drei";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  IoRocket,
  IoTrophy,
  IoStatsChart,
  IoShieldCheckmark,
} from "react-icons/io5";
import { useAuth } from "../hooks/useAuth";
import "./LandingPage.scss";

// Register GSAP Plugin
gsap.registerPlugin(ScrollTrigger);

// --- 3D Components ---
const Core = () => {
  const meshRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    meshRef.current.rotation.x = time * 0.2;
    meshRef.current.rotation.y = time * 0.3;
    // Pulse effect
    const scale = 1 + Math.sin(time) * 0.1;
    meshRef.current.scale.set(scale, scale, scale);
  });

  return (
    <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[2.5, 0]} />
        <meshStandardMaterial
          color="#00f3ff"
          emissive="#00f3ff"
          emissiveIntensity={0.5}
          wireframe
        />
      </mesh>
      <mesh scale={[2.4, 2.4, 2.4]}>
        <icosahedronGeometry args={[2.5, 0]} />
        <meshBasicMaterial color="#000" />
      </mesh>
      {/* Inner Core */}
      <mesh>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={2}
        />
      </mesh>
    </Float>
  );
};

const HeroScene = () => {
  return (
    <Canvas
      className="landing-page__hero-canvas"
      camera={{ position: [0, 0, 10], fov: 45 }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} color="#00f3ff" intensity={2} />
      <pointLight position={[-10, -10, -10]} color="#cd00ff" intensity={2} />
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />
      <Core />
    </Canvas>
  );
};

// --- Main Landing Page ---
const LandingPage = () => {
  const { user } = useAuth();
  const sectionRef = useRef(null);
  const triggerRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Mouse Parallax Logic
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const x = (clientX / window.innerWidth - 0.5) * 20; // Move range -10 to 10px
    const y = (clientY / window.innerHeight - 0.5) * 20;
    setMousePosition({ x, y });
  };

  // GSAP Scroll Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".landing-page__features-card", {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        scrollTrigger: {
          trigger: ".landing-page__features-grid",
          start: "top 80%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/app" replace />;
  }

  return (
    <div
      className="landing-page"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
    >
      {/* Hero Section */}
      <section className="landing-page__hero">
        <HeroScene />

        <div
          className="landing-page__hero-content"
          style={{
            transform: `translate(${-mousePosition.x}px, ${-mousePosition.y}px)`,
            transition: "transform 0.1s ease-out",
          }}
        >
          <motion.h1
            data-text="Master Your Mind"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            Master <span>Your Mind</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            The ultimate gamified discipline tracker. Break addictions, compete
            with friends, and reclaim your potential.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Link to="/register" className="landing-page__hero-cta">
              Initialize Protocol
            </Link>
          </motion.div>
        </div>

        <div className="landing-page__hero-scroll">
          <div className="mouse"></div>
          <span>Scroll</span>
        </div>
      </section>

      {/* Features Section */}
      <section className="landing-page__features">
        <div className="landing-page__features-content">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            System <span>Capabilities</span>
          </motion.h2>

          <div className="landing-page__features-grid">
            <div className="landing-page__features-card">
              <div className="icon">
                <IoRocket />
              </div>
              <h3>Streak Engine</h3>
              <p>
                Precision tracking with milestone visualization. Watch your
                progress evolve in real-time.
              </p>
            </div>
            <div className="landing-page__features-card">
              <div className="icon">
                <IoTrophy />
              </div>
              <h3>Competition Arena</h3>
              <p>
                Challenge friends in PvP mode. Last man standing wins.
                Accountability has never been this intense.
              </p>
            </div>
            <div className="landing-page__features-card">
              <div className="icon">
                <IoStatsChart />
              </div>
              <h3>Data Analytics</h3>
              <p>
                Deep insights into your habits. visualize your recovery journey
                and identify patterns.
              </p>
            </div>
            <div className="landing-page__features-card">
              <div className="icon">
                <IoShieldCheckmark />
              </div>
              <h3>Iron-Clad Auth</h3>
              <p>
                Secure, private, and anonymous. Your journey is yours alone
                unless you choose to share.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="landing-page__footer">
        <h2>Ready to Begin?</h2>
        <p>Join the ranks of the elite. Conquer yourself today.</p>
        <Link to="/register" className="landing-page__hero-cta">
          Start Your Journey
        </Link>
      </section>
    </div>
  );
};

export default LandingPage;
