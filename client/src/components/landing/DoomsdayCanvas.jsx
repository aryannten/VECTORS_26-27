import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, Sparkles, Stars, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'

/**
 * Doctor Doom Procedural Titanium Mask & Sovereign Hood
 * Ultra-high-contrast, razor-sharp cybernetic sculpture:
 * - Gleaming mirror-finish titanium chrome faceplate
 * - Vibrant imperial Latverian emerald cowl with gold filigree trim
 * - Piercing neon emerald eye-slits with dynamic cast lighting
 * - Iconic 5-slat respirator grille with internal reactor glow
 * - Dual sovereign sunburst medallions with emerald core gems
 */
function DoctorDoomMask({ maskRef }) {
  // Ultra-Reflective Titanium Chrome (Mirror sheen, high metalness, razor specular highlights)
  const titaniumMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#dbe4ed',
        metalness: 0.98,
        roughness: 0.08,
        emissive: '#092518',
        emissiveIntensity: 0.3,
      }),
    []
  )

  // Dark Gunmetal / Obsidian Cavity Material (High-contrast recessed depth)
  const darkIronMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#0a0d10',
        metalness: 0.92,
        roughness: 0.25,
      }),
    []
  )

  // Vibrant Latverian Imperial Emerald Velvet (Saturated, radiant, zero mud)
  const hoodMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#0d6337',
        roughness: 0.38,
        metalness: 0.45,
        emissive: '#073d1f',
        emissiveIntensity: 0.65,
      }),
    []
  )

  // Gleaming Sovereign Gold / Polished Brass (Vivid 24K specular shine)
  const brassMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#ffc83b',
        metalness: 0.98,
        roughness: 0.12,
        emissive: '#664400',
        emissiveIntensity: 0.45,
      }),
    []
  )

  // Blinding Laser Neon Emerald (Eyes, visors, reactor core)
  const eyeGlowMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#25ff9f',
      }),
    []
  )

  // Radiant Emerald Gem Core (For cloak medallions)
  const emeraldGemMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#10b981',
        emissive: '#1effa0',
        emissiveIntensity: 2.2,
        metalness: 0.85,
        roughness: 0.1,
      }),
    []
  )

  const leftEyeLight = useRef()
  const rightEyeLight = useRef()
  const coreGlowLight = useRef()

  useFrame((state) => {
    // Sharp breathing pulse in Doctor Doom's emerald glare
    const pulse = 2.4 + Math.sin(state.clock.elapsedTime * 3.5) * 0.8
    if (leftEyeLight.current) leftEyeLight.current.intensity = pulse
    if (rightEyeLight.current) rightEyeLight.current.intensity = pulse
    if (coreGlowLight.current) coreGlowLight.current.intensity = 2.2 + Math.cos(state.clock.elapsedTime * 2.8) * 0.6
  })

  return (
    <group ref={maskRef} position={[0, 0, 0.2]} scale={1.18}>
      {/* ═══════════════════════════════════════════════════════
          1. SOVEREIGN HOOD & COWL (Sculpted Contoured Canopy)
          ═══════════════════════════════════════════════════════ */}
      {/* Crown Canopy: Sweeps forward over brow with smooth curvature */}
      <mesh position={[0, 1.38, -0.05]} rotation={[0.26, 0, 0]}>
        <cylinderGeometry args={[1.42, 1.62, 1.15, 36, 1, false, 0, Math.PI]} />
        <primitive object={hoodMaterial} attach="material" />
      </mesh>

      {/* Gold Trim Arch along Brow Edge */}
      <mesh position={[0, 1.48, 0.52]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.42, 0.038, 16, 48, Math.PI]} />
        <primitive object={brassMaterial} attach="material" />
      </mesh>

      {/* Left Hood Flap with Angled Bevel */}
      <mesh position={[-1.32, 0.32, 0.05]} rotation={[0.08, 0.14, 0.12]}>
        <boxGeometry args={[0.34, 1.85, 0.82]} />
        <primitive object={hoodMaterial} attach="material" />
      </mesh>
      {/* Left Hood Gold Accent Border */}
      <mesh position={[-1.16, 0.32, 0.44]} rotation={[0.08, 0.14, 0.12]}>
        <boxGeometry args={[0.04, 1.82, 0.06]} />
        <primitive object={brassMaterial} attach="material" />
      </mesh>

      {/* Right Hood Flap with Angled Bevel */}
      <mesh position={[1.32, 0.32, 0.05]} rotation={[0.08, -0.14, -0.12]}>
        <boxGeometry args={[0.34, 1.85, 0.82]} />
        <primitive object={hoodMaterial} attach="material" />
      </mesh>
      {/* Right Hood Gold Accent Border */}
      <mesh position={[1.16, 0.32, 0.44]} rotation={[0.08, -0.14, -0.12]}>
        <boxGeometry args={[0.04, 1.82, 0.06]} />
        <primitive object={brassMaterial} attach="material" />
      </mesh>

      {/* ── Cloak Clasp Medallions (Dual Gold Sunburst Seals + Emerald Gem) ── */}
      {/* Left Medallion */}
      <group position={[-1.15, -0.82, 0.44]} rotation={[Math.PI / 2, 0, 0]}>
        <mesh>
          <torusGeometry args={[0.26, 0.045, 16, 32]} />
          <primitive object={brassMaterial} attach="material" />
        </mesh>
        <mesh>
          <cylinderGeometry args={[0.22, 0.22, 0.06, 24]} />
          <primitive object={brassMaterial} attach="material" />
        </mesh>
        <mesh position={[0, 0.04, 0]} rotation={[0.3, 0.3, 0]}>
          <octahedronGeometry args={[0.13, 0]} />
          <primitive object={emeraldGemMaterial} attach="material" />
        </mesh>
      </group>

      {/* Right Medallion */}
      <group position={[1.15, -0.82, 0.44]} rotation={[Math.PI / 2, 0, 0]}>
        <mesh>
          <torusGeometry args={[0.26, 0.045, 16, 32]} />
          <primitive object={brassMaterial} attach="material" />
        </mesh>
        <mesh>
          <cylinderGeometry args={[0.22, 0.22, 0.06, 24]} />
          <primitive object={brassMaterial} attach="material" />
        </mesh>
        <mesh position={[0, 0.04, 0]} rotation={[0.3, -0.3, 0]}>
          <octahedronGeometry args={[0.13, 0]} />
          <primitive object={emeraldGemMaterial} attach="material" />
        </mesh>
      </group>

      {/* ═══════════════════════════════════════════════════════
          2. TITANIUM FACEPLATE (Chiseled Cybernetic Mask)
          ═══════════════════════════════════════════════════════ */}
      {/* Upper Forehead Plate (Angled forward) */}
      <mesh position={[0, 0.85, 0.24]} rotation={[-0.14, 0, 0]}>
        <boxGeometry args={[1.62, 0.65, 0.38]} />
        <primitive object={titaniumMaterial} attach="material" />
      </mesh>

      {/* Central Widow's Peak Crest (Vertical prow ridge) */}
      <mesh position={[0, 0.94, 0.42]} rotation={[-0.14, 0, 0]}>
        <boxGeometry args={[0.22, 0.74, 0.32]} />
        <primitive object={titaniumMaterial} attach="material" />
      </mesh>

      {/* Recessed Eye Trench Frame (Obsidian shadow backing) */}
      <mesh position={[0, 0.4, 0.26]}>
        <boxGeometry args={[1.52, 0.38, 0.32]} />
        <primitive object={darkIronMaterial} attach="material" />
      </mesh>

      {/* Left Piercing Emerald Laser Eye Slit */}
      <mesh position={[-0.44, 0.4, 0.42]} rotation={[0, 0, -0.2]}>
        <boxGeometry args={[0.42, 0.09, 0.06]} />
        <primitive object={eyeGlowMaterial} attach="material" />
      </mesh>
      {/* Right Piercing Emerald Laser Eye Slit */}
      <mesh position={[0.44, 0.4, 0.42]} rotation={[0, 0, 0.2]}>
        <boxGeometry args={[0.42, 0.09, 0.06]} />
        <primitive object={eyeGlowMaterial} attach="material" />
      </mesh>

      {/* Direct Eye Point Lights (Casts intense neon green light onto cheekplates) */}
      <pointLight
        ref={leftEyeLight}
        position={[-0.44, 0.4, 0.65]}
        color="#25ff9f"
        intensity={2.8}
        distance={4.5}
      />
      <pointLight
        ref={rightEyeLight}
        position={[0.44, 0.4, 0.65]}
        color="#25ff9f"
        intensity={2.8}
        distance={4.5}
      />

      {/* Titanium Nasal Bridge Wedge */}
      <mesh position={[0, 0.26, 0.48]} rotation={[-0.22, 0, 0]}>
        <boxGeometry args={[0.26, 0.62, 0.38]} />
        <primitive object={titaniumMaterial} attach="material" />
      </mesh>

      {/* Left Angled Faceted Cheekbone Plate */}
      <mesh position={[-0.68, 0.08, 0.34]} rotation={[0.16, 0.44, -0.16]}>
        <boxGeometry args={[0.56, 0.86, 0.32]} />
        <primitive object={titaniumMaterial} attach="material" />
      </mesh>
      {/* Right Angled Faceted Cheekbone Plate */}
      <mesh position={[0.68, 0.08, 0.34]} rotation={[0.16, -0.44, 0.16]}>
        <boxGeometry args={[0.56, 0.86, 0.32]} />
        <primitive object={titaniumMaterial} attach="material" />
      </mesh>

      {/* Temple Gold Rivets */}
      <mesh position={[-0.92, 0.58, 0.32]} rotation={[0, Math.PI / 2, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.12, 16]} />
        <primitive object={brassMaterial} attach="material" />
      </mesh>
      <mesh position={[0.92, 0.58, 0.32]} rotation={[0, Math.PI / 2, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.12, 16]} />
        <primitive object={brassMaterial} attach="material" />
      </mesh>

      {/* ═══════════════════════════════════════════════════════
          3. ICONIC 5-SLAT RESPIRATOR / MOUTH RADIATOR
          ═══════════════════════════════════════════════════════ */}
      {/* Grille Dark Cavity */}
      <mesh position={[0, -0.4, 0.36]}>
        <boxGeometry args={[1.06, 0.62, 0.26]} />
        <primitive object={darkIronMaterial} attach="material" />
      </mesh>

      {/* Internal Reactor Glow Behind Slats */}
      <pointLight
        ref={coreGlowLight}
        position={[0, -0.4, 0.45]}
        color="#1effa0"
        intensity={2.5}
        distance={3.0}
      />

      {/* Grille Upper Titanium Rim Bar */}
      <mesh position={[0, -0.1, 0.52]}>
        <boxGeometry args={[1.05, 0.08, 0.12]} />
        <primitive object={titaniumMaterial} attach="material" />
      </mesh>
      {/* Grille Lower Titanium Rim Bar */}
      <mesh position={[0, -0.68, 0.52]}>
        <boxGeometry args={[0.96, 0.08, 0.12]} />
        <primitive object={titaniumMaterial} attach="material" />
      </mesh>

      {/* The 5 Signature Vertical Titanium Slats */}
      {[-0.36, -0.18, 0, 0.18, 0.36].map((xPos, idx) => (
        <mesh key={`mask-slat-${idx}`} position={[xPos, -0.39, 0.54]}>
          <boxGeometry args={[0.085, 0.5, 0.1]} />
          <primitive object={titaniumMaterial} attach="material" />
        </mesh>
      ))}

      {/* Chiseled Titanium Chin Wedge */}
      <mesh position={[0, -0.88, 0.44]} rotation={[0.18, 0, 0]}>
        <boxGeometry args={[0.78, 0.36, 0.38]} />
        <primitive object={titaniumMaterial} attach="material" />
      </mesh>
    </group>
  )
}

/**
 * Responsive scale and scroll trajectory calibration:
 * - Desktop (>= 1024px): 100% scale (1.0), deep z-travel (up to 3.2), full parallax
 * - Tablet (768px - 1023px): 75% scale (0.75), medium z-travel (up to 2.0)
 * - Mobile (< 768px): 54% scale (0.54), gentle z-travel (up to 1.0)
 * - Small Mobile (< 480px / phone preview): 46% scale (0.46), tight z-travel (up to 0.75)
 */
function getResponsiveSettings(width) {
  if (width < 480) {
    return {
      scale: 0.46,
      maxZ: 0.75,
      zRate: 2.0,
      yMultiplier: 3.6,
      yBase: 0.25,
      isMobile: true,
    }
  }
  if (width < 768) {
    return {
      scale: 0.54,
      maxZ: 1.0,
      zRate: 2.8,
      yMultiplier: 4.0,
      yBase: 0.3,
      isMobile: true,
    }
  }
  if (width < 1024) {
    return {
      scale: 0.75,
      maxZ: 2.0,
      zRate: 5.5,
      yMultiplier: 4.5,
      yBase: 0.35,
      isMobile: false,
    }
  }
  return {
    scale: 1.0,
    maxZ: 3.2,
    zRate: 8.5,
    yMultiplier: 5.0,
    yBase: 0.4,
    isMobile: false,
  }
}

/**
 * 3D Gyroscopic Chrono-Astrolabe & Armillary Spheres
 * Multi-axis revolutions with razor-sharp mechanical detailing and neon circuits.
 */
function DoomsdayAstrolabe({ scrollOffsetRef }) {
  const { size } = useThree()
  const initialSettings = useMemo(() => getResponsiveSettings(size.width), [size.width])
  const targetScaleVec = useMemo(
    () => new THREE.Vector3(initialSettings.scale, initialSettings.scale, initialSettings.scale),
    [initialSettings.scale]
  )

  const group = useRef()
  const maskGroup = useRef()

  const ring1Ref = useRef()
  const ring2Ref = useRef()
  const ring3Ref = useRef()
  const ring4Ref = useRef()
  const ring5Ref = useRef()
  const singularityMesh = useRef()

  // Radiant Gold Metal (Gleaming 24K specular highlights)
  const astrolabeGold = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#ffc83b',
        metalness: 0.98,
        roughness: 0.1,
        emissive: '#664400',
        emissiveIntensity: 0.35,
      }),
    []
  )

  // Polished Titanium Chrome Ring
  const chronoTitanium = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#dbe4ed',
        metalness: 0.98,
        roughness: 0.08,
        emissive: '#092518',
        emissiveIntensity: 0.25,
      }),
    []
  )

  // Hyper-Luminescent Emerald Circuit Wireframe
  const circuitNeon = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#1effa0',
        wireframe: true,
      }),
    []
  )

  // Polished Dark Obsidian Gunmetal
  const obsidianMetal = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#11151a',
        metalness: 0.95,
        roughness: 0.15,
        emissive: '#0b7a4e',
        emissiveIntensity: 0.3,
      }),
    []
  )

  // Pulsing Singularity Energy Material
  const singularityMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#0b7a4e',
        emissive: '#1effa0',
        emissiveIntensity: 3.5,
        roughness: 0.08,
        metalness: 0.9,
      }),
    []
  )

  useFrame((state, delta) => {
    if (!group.current) return
    const offset = scrollOffsetRef.current
    const time = state.clock.elapsedTime
    const settings = getResponsiveSettings(state.size.width)

    // Smoothly adapt group scale for responsive viewports and preview resizing
    targetScaleVec.set(settings.scale, settings.scale, settings.scale)
    group.current.scale.lerp(targetScaleVec, 0.15)

    // Multi-axis orbital revolutions
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x += delta * 0.38 + offset * 0.08
      ring1Ref.current.rotation.y += delta * 0.3
      ring1Ref.current.rotation.z += delta * 0.15
    }

    if (ring2Ref.current) {
      ring2Ref.current.rotation.y -= delta * 0.44 + offset * 0.1
      ring2Ref.current.rotation.x -= delta * 0.24
      ring2Ref.current.rotation.z += delta * 0.2
    }

    if (ring3Ref.current) {
      ring3Ref.current.rotation.x += delta * 0.52
      ring3Ref.current.rotation.z -= delta * 0.34
      ring3Ref.current.rotation.y += delta * 0.16
    }

    if (ring4Ref.current) {
      ring4Ref.current.rotation.y += delta * 0.62
      ring4Ref.current.rotation.x -= delta * 0.4
      ring4Ref.current.rotation.z += delta * 0.28
    }

    if (ring5Ref.current) {
      ring5Ref.current.rotation.z -= delta * 0.48
      ring5Ref.current.rotation.y += delta * 0.36
      ring5Ref.current.rotation.x += delta * 0.26
    }

    // Singularity pulsating core
    if (singularityMesh.current) {
      const scale = 1 + Math.sin(time * 3.5) * 0.18
      singularityMesh.current.scale.set(scale, scale, scale)
      singularityMesh.current.rotation.y += delta * 1.1
      singularityMesh.current.rotation.x += delta * 0.7
    }

    // Doctor Doom 3D head survey and presence
    if (maskGroup.current) {
      maskGroup.current.rotation.y = Math.sin(time * 0.7) * 0.34
      maskGroup.current.rotation.x = -0.04 + Math.sin(time * 0.55) * 0.12
      maskGroup.current.rotation.z = Math.cos(time * 0.6) * 0.06
    }

    // Scroll parallax position calibrated per device tier
    group.current.position.y = -offset * settings.yMultiplier + settings.yBase
    group.current.position.z = Math.min(offset * settings.zRate, settings.maxZ)
  })

  return (
    <group ref={group} scale={initialSettings.scale}>
      <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.65}>
        {/* Core Radiance: Illuminates all inner ring bevels */}
        <pointLight
          position={[0, 0, 0]}
          color="#1effa0"
          intensity={4.5}
          distance={10}
        />

        {/* ═══════════════════════════════════════════════════════
            RING 1: GRAND CELESTIAL ASTROLABE (Polished Gold Gear)
            ═══════════════════════════════════════════════════════ */}
        <group ref={ring1Ref} rotation={[0.55, 0.3, 0]}>
          <mesh>
            <torusGeometry args={[3.45, 0.075, 20, 100]} />
            <primitive object={astrolabeGold} attach="material" />
          </mesh>
          {/* 16 Radial Cog Teeth */}
          {[...Array(16)].map((_, i) => {
            const angle = (i / 16) * Math.PI * 2
            return (
              <mesh
                key={`r1-cog-${i}`}
                position={[Math.cos(angle) * 3.54, Math.sin(angle) * 3.54, 0]}
                rotation={[0, 0, angle]}
              >
                <boxGeometry args={[0.09, 0.36, 0.14]} />
                <primitive object={astrolabeGold} attach="material" />
              </mesh>
            )
          })}
        </group>

        {/* ═══════════════════════════════════════════════════════
            RING 2: CHRONO MERIDIAN RING (Titanium & Neon Circuit)
            ═══════════════════════════════════════════════════════ */}
        <group ref={ring2Ref} rotation={[-0.45, 0.8, 0.35]}>
          <mesh>
            <torusGeometry args={[2.85, 0.065, 20, 90]} />
            <primitive object={chronoTitanium} attach="material" />
          </mesh>
          {/* Glowing neon circuit track */}
          <mesh scale={1.025}>
            <torusGeometry args={[2.85, 0.045, 8, 60]} />
            <primitive object={circuitNeon} attach="material" />
          </mesh>
          {/* 4 Cardinal Gold Reticles */}
          {[0, Math.PI / 2, Math.PI, (Math.PI * 3) / 2].map((angle, idx) => (
            <mesh
              key={`r2-cardinal-${idx}`}
              position={[Math.cos(angle) * 2.85, Math.sin(angle) * 2.85, 0]}
              rotation={[0, 0, angle]}
            >
              <boxGeometry args={[0.12, 0.34, 0.16]} />
              <primitive object={astrolabeGold} attach="material" />
            </mesh>
          ))}
        </group>

        {/* ═══════════════════════════════════════════════════════
            RING 3: POLAR LATITUDE RING (Obsidian with Emerald Orbs)
            ═══════════════════════════════════════════════════════ */}
        <group ref={ring3Ref} rotation={[Math.PI / 2.3, 0.2, -0.4]}>
          <mesh>
            <torusGeometry args={[2.35, 0.055, 18, 70]} />
            <primitive object={obsidianMetal} attach="material" />
          </mesh>
          {/* 10 Glowing Quantum Nodes along the perimeter */}
          {[...Array(10)].map((_, i) => {
            const angle = (i / 10) * Math.PI * 2
            return (
              <mesh
                key={`r3-quantum-node-${i}`}
                position={[Math.cos(angle) * 2.35, Math.sin(angle) * 2.35, 0]}
              >
                <sphereGeometry args={[0.09, 16, 16]} />
                <primitive object={singularityMaterial} attach="material" />
              </mesh>
            )
          })}
        </group>

        {/* ═══════════════════════════════════════════════════════
            RING 4: DIAGONAL GYRO GIMBAL (Gold & Neon Energy)
            ═══════════════════════════════════════════════════════ */}
        <group ref={ring4Ref} rotation={[0.75, -0.65, 0.5]}>
          <mesh>
            <torusGeometry args={[1.92, 0.05, 18, 70]} />
            <primitive object={astrolabeGold} attach="material" />
          </mesh>
          <mesh scale={1.03}>
            <torusGeometry args={[1.92, 0.035, 8, 48]} />
            <primitive object={circuitNeon} attach="material" />
          </mesh>
        </group>

        {/* ═══════════════════════════════════════════════════════
            RING 5: ORBITAL QUANTUM SATELLITES TRACK
            ═══════════════════════════════════════════════════════ */}
        <group ref={ring5Ref} rotation={[-0.6, -0.5, 0.8]}>
          <mesh>
            <torusGeometry args={[3.85, 0.025, 8, 90]} />
            <primitive object={circuitNeon} attach="material" />
          </mesh>
          {[0, Math.PI / 2, Math.PI, (Math.PI * 3) / 2].map((angle, idx) => (
            <group
              key={`r5-satellite-${idx}`}
              position={[Math.cos(angle) * 3.85, Math.sin(angle) * 3.85, 0]}
            >
              <mesh>
                <dodecahedronGeometry args={[0.16, 0]} />
                <primitive object={singularityMaterial} attach="material" />
              </mesh>
              <pointLight color="#1effa0" intensity={2.0} distance={3.5} />
            </group>
          ))}
        </group>

        {/* ── Singularity Core (Pulsating icosahedron) ── */}
        <mesh ref={singularityMesh} position={[0, 0, -0.55]} scale={1.15}>
          <icosahedronGeometry args={[0.92, 0]} />
          <primitive object={singularityMaterial} attach="material" />
        </mesh>

        {/* ── Brilliant Floating Quantum Sparkles ── */}
        <Sparkles
          count={120}
          scale={9.5}
          size={6.0}
          speed={0.6}
          opacity={0.85}
          color="#1effa0"
        />

        {/* ── Doctor Doom Titanium Cyber-Mask ── */}
        <DoctorDoomMask maskRef={maskGroup} />
      </Float>
    </group>
  )
}

function Rig() {
  const { camera } = useThree()

  useFrame((state) => {
    const isMobile = state.size.width < 768
    const swayX = isMobile ? 0.6 : 2.8
    const swayY = isMobile ? 0.5 : 2.2

    camera.position.x = THREE.MathUtils.lerp(
      camera.position.x,
      state.pointer.x * swayX,
      0.05
    )
    camera.position.y = THREE.MathUtils.lerp(
      camera.position.y,
      state.pointer.y * swayY,
      0.05
    )
    camera.lookAt(0, 0, 0)
  })
  return null
}

export default function DoomsdayCanvas() {
  const scrollOffsetRef = useRef(0)

  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const maxScroll = Math.max(
            document.documentElement.scrollHeight - window.innerHeight,
            1
          )
          scrollOffsetRef.current = Math.min(
            Math.max(window.scrollY / maxScroll, 0),
            1
          )
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
        dpr={[1, 2]}
        camera={{ position: [0, 0, 13], fov: 45 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.4,
        }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 13]} fov={45} />
        <color attach="background" args={['#050709']} />

        {/* ── High-Contrast Multi-Directional Tactical Studio Lighting ── */}
        <ambientLight intensity={1.1} />

        {/* Primary Cool-White Key Directional Light: Specular glints across titanium facets */}
        <directionalLight position={[6, 9, 10]} intensity={4.8} color="#f0fdf4" />

        {/* Intense Neon Emerald Rim Light from rear edge: Defines sharp 3D contours */}
        <directionalLight position={[-8, 3, -4]} intensity={5.5} color="#1effa0" />

        {/* Brilliant Top Cyan Accent */}
        <pointLight position={[0, 8, 4]} intensity={4.0} color="#00e5ff" distance={15} />

        {/* Sovereign Gold Specular Fill Light */}
        <pointLight position={[6, -6, 5]} intensity={3.5} color="#ffbe1a" distance={15} />

        {/* Deep Space Atmospherics (Pushed way back so the foreground model is razor sharp) */}
        <fog attach="fog" args={['#050709', 35, 80]} />
        <Stars
          radius={70}
          depth={35}
          count={1200}
          factor={3.5}
          saturation={0}
          fade
          speed={0.6}
        />

        {/* The 3D Gyroscopic Chrono-Astrolabe & Doctor Doom Mask */}
        <DoomsdayAstrolabe scrollOffsetRef={scrollOffsetRef} />
        <Rig />
      </Canvas>
    </div>
  )
}
