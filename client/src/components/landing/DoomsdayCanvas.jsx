import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { 
  Float, 
  Sparkles, 
  Stars, 
  PerspectiveCamera 
} from '@react-three/drei'
import * as THREE from 'three'

/**
 * The Central Dimensional Rift / Doom Core
 * Highly optimized: uses cached scroll offset, zero postprocessing passes, zero layout reflows.
 */
function DoomCore({ scrollOffsetRef }) {
  const group = useRef()
  const coreMesh = useRef()
  const rings = useRef([])

  // Optimized materials
  const coreMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#0B7A4E',
    emissive: '#1EFFA0',
    emissiveIntensity: 1.8,
    roughness: 0.15,
    metalness: 0.85,
  }), [])

  const ringMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#050606',
    emissive: '#1EFFA0',
    emissiveIntensity: 0.4,
    roughness: 0.7,
    metalness: 0.9,
    wireframe: true,
  }), [])

  const outerShellMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#0A0E0C',
    emissive: '#0B7A4E',
    emissiveIntensity: 0.2,
    wireframe: true,
    transparent: true,
    opacity: 0.35,
  }), [])

  useFrame((state, delta) => {
    if (!group.current) return
    const offset = scrollOffsetRef.current

    // Rotate core based on time and scroll
    if (coreMesh.current) {
      coreMesh.current.rotation.y += delta * 0.4
      coreMesh.current.rotation.z = offset * Math.PI * 1.5
    }

    // Animate rings smoothly
    rings.current.forEach((ring, i) => {
      if (ring) {
        ring.rotation.x += delta * (0.15 + i * 0.08)
        ring.rotation.y += delta * (0.2 - i * 0.1)
      }
    })

    // Move group along Z and Y according to scroll offset
    group.current.position.y = -offset * 4
    group.current.position.z = offset * 10
    group.current.rotation.x = offset * Math.PI * 0.35
  })

  return (
    <group ref={group}>
      <Float speed={1.5} rotationIntensity={0.6} floatIntensity={1.2}>
        {/* The Energy Core */}
        <mesh ref={coreMesh} scale={2}>
          <octahedronGeometry args={[1, 0]} />
          <primitive object={coreMaterial} attach="material" />
        </mesh>
        
        {/* Orbital Wireframe Rings */}
        {[0, 1, 2].map((i) => (
          <mesh 
            key={i} 
            ref={(el) => (rings.current[i] = el)}
            scale={2.8 + i * 1.4}
            rotation={[Math.PI * 0.25 * i, Math.PI * 0.3 * i, 0]}
          >
            <torusGeometry args={[1, 0.02, 12, 64]} />
            <primitive object={ringMaterial} attach="material" />
          </mesh>
        ))}
        
        {/* Outer Geometric Cage */}
        <mesh scale={2.6}>
          <icosahedronGeometry args={[1, 1]} />
          <primitive object={outerShellMaterial} attach="material" />
        </mesh>
      </Float>
    </group>
  )
}

function Rig() {
  const { camera } = useThree()
  
  useFrame((state) => {
    // Subtle, buttery smooth mouse parallax
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, (state.pointer.x * 2.5), 0.05)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, (state.pointer.y * 2.5), 0.05)
    camera.lookAt(0, 0, 0)
  })
  return null
}

export default function DoomsdayCanvas() {
  const scrollOffsetRef = useRef(0)

  // Cached scroll tracking with requestAnimationFrame throttle (no reflow in render loop)
  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1)
          scrollOffsetRef.current = Math.min(Math.max(window.scrollY / maxScroll, 0), 1)
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="fixed inset-0 z-0 bg-doom-bg pointer-events-none overflow-hidden">
      <Canvas 
        dpr={[1, 1.25]}
        camera={{ position: [0, 0, 14], fov: 45 }}
        gl={{ 
          antialias: false, 
          powerPreference: 'high-performance',
          stencil: false,
          depth: true
        }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 14]} fov={45} />
        <color attach="background" args={['#050606']} />
        
        {/* Ambient & Spotlight Lighting */}
        <ambientLight intensity={0.2} />
        <spotLight 
          position={[8, 16, 8]} 
          angle={0.25} 
          penumbra={1} 
          intensity={2.5} 
          color="#1EFFA0" 
        />
        <pointLight position={[-8, -8, -6]} intensity={1.2} color="#8B0000" />
        
        {/* Atmospherics — optimized counts */}
        <fog attach="fog" args={['#050606', 12, 35]} />
        <Stars radius={80} depth={40} count={1200} factor={3} saturation={0} fade speed={0.8} />
        <Sparkles count={60} scale={18} size={4} speed={0.3} opacity={0.3} color="#1EFFA0" />
        
        {/* The Scroll-driven Core */}
        <DoomCore scrollOffsetRef={scrollOffsetRef} />
        <Rig />
      </Canvas>
    </div>
  )
}
