import { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Html, PresentationControls, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RotateCcw, ZoomIn, ZoomOut, Box, Layers, Battery, Cpu, ExternalLink, Building } from "lucide-react";

interface FuelCellStackProps {
  position: [number, number, number];
  color: string;
  label: string;
  onClick?: () => void;
  isHighlighted?: boolean;
}

function FuelCellStack({ position, color, label, onClick, isHighlighted }: FuelCellStackProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const numPlates = 12;

  useFrame((state) => {
    if (groupRef.current && isHighlighted) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.08;
    }
  });

  const active = hovered || isHighlighted;
  const mainColor = active ? "#3b82f6" : color;

  return (
    <group position={position} ref={groupRef}>
      <group
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={active ? 1.02 : 1}
      >
        <RoundedBox args={[0.75, 0.08, 0.55]} radius={0.01} position={[0, 0.56, 0]}>
          <meshPhysicalMaterial color="#1e293b" metalness={0.9} roughness={0.15} clearcoat={0.3} />
        </RoundedBox>
        <RoundedBox args={[0.75, 0.08, 0.55]} radius={0.01} position={[0, -0.56, 0]}>
          <meshPhysicalMaterial color="#1e293b" metalness={0.9} roughness={0.15} clearcoat={0.3} />
        </RoundedBox>
        
        {[...Array(numPlates)].map((_, i) => (
          <group key={i} position={[0, -0.48 + i * 0.08, 0]}>
            <RoundedBox args={[0.7, 0.02, 0.5]} radius={0.005}>
              <meshPhysicalMaterial 
                color={i % 2 === 0 ? "#475569" : mainColor} 
                metalness={0.85} 
                roughness={0.2}
                clearcoat={0.2}
              />
            </RoundedBox>
            <mesh position={[0.32, 0, 0]}>
              <boxGeometry args={[0.04, 0.025, 0.45]} />
              <meshPhysicalMaterial color="#0f172a" metalness={0.9} roughness={0.1} />
            </mesh>
            <mesh position={[-0.32, 0, 0]}>
              <boxGeometry args={[0.04, 0.025, 0.45]} />
              <meshPhysicalMaterial color="#0f172a" metalness={0.9} roughness={0.1} />
            </mesh>
          </group>
        ))}
        
        {[[-0.32, -0.32], [-0.32, 0.32], [0.32, -0.32], [0.32, 0.32]].map(([x, z], i) => (
          <mesh key={i} position={[x, 0, z]}>
            <cylinderGeometry args={[0.018, 0.018, 1.2, 8]} />
            <meshPhysicalMaterial color="#71717a" metalness={0.95} roughness={0.1} />
          </mesh>
        ))}
        
        <group position={[0.25, 0.62, 0]}>
          <mesh>
            <cylinderGeometry args={[0.035, 0.035, 0.08, 12]} />
            <meshPhysicalMaterial color="#dc2626" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.05, 0]}>
            <cylinderGeometry args={[0.025, 0.025, 0.04, 8]} />
            <meshPhysicalMaterial color="#fbbf24" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>
        <group position={[-0.25, 0.62, 0]}>
          <mesh>
            <cylinderGeometry args={[0.035, 0.035, 0.08, 12]} />
            <meshPhysicalMaterial color="#1e40af" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.05, 0]}>
            <cylinderGeometry args={[0.025, 0.025, 0.04, 8]} />
            <meshPhysicalMaterial color="#fbbf24" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>
        
        <group position={[0, 0.62, 0.2]}>
          <mesh>
            <cylinderGeometry args={[0.02, 0.02, 0.06, 8]} />
            <meshPhysicalMaterial color="#374151" metalness={0.85} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.04, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 0.08, 6]} />
            <meshPhysicalMaterial color="#374151" metalness={0.8} roughness={0.25} />
          </mesh>
        </group>
        <group position={[0, 0.62, -0.2]}>
          <mesh>
            <cylinderGeometry args={[0.02, 0.02, 0.06, 8]} />
            <meshPhysicalMaterial color="#374151" metalness={0.85} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.04, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 0.08, 6]} />
            <meshPhysicalMaterial color="#374151" metalness={0.8} roughness={0.25} />
          </mesh>
        </group>
        
        {active && (
          <mesh position={[0, 0, 0.26]}>
            <planeGeometry args={[0.65, 0.4]} />
            <meshBasicMaterial color="#3b82f6" transparent opacity={0.08} />
          </mesh>
        )}
      </group>
      
      {active && (
        <Html center position={[0, 0.9, 0]} style={{ pointerEvents: "none" }}>
          <div className="bg-slate-900/95 backdrop-blur px-3 py-2 rounded-lg shadow-xl border border-slate-700 text-xs whitespace-nowrap">
            <div className="font-semibold text-white">{label}</div>
            <div className="text-slate-400 text-[10px] mt-0.5">PEM Stack - {numPlates} cells</div>
          </div>
        </Html>
      )}
    </group>
  );
}

interface CabinetProps {
  position: [number, number, number];
  dimensions: [number, number, number];
  color: string;
  opacity?: number;
}

function Cabinet({ position, dimensions, color, opacity = 0.3 }: CabinetProps) {
  const [w, h, d] = dimensions;
  return (
    <group position={position}>
      <RoundedBox args={[w, h, d]} radius={0.03}>
        <meshPhysicalMaterial
          color={color}
          transparent
          opacity={opacity}
          side={THREE.DoubleSide}
          metalness={0.3}
          roughness={0.6}
        />
      </RoundedBox>
      <RoundedBox args={[w - 0.05, h - 0.05, 0.02]} radius={0.02} position={[0, 0, d / 2 + 0.01]}>
        <meshPhysicalMaterial color="#334155" metalness={0.7} roughness={0.3} transparent opacity={0.6} />
      </RoundedBox>
      {[-0.4, 0, 0.4].map((y, i) => (
        <mesh key={i} position={[0, y, d / 2 + 0.025]}>
          <boxGeometry args={[w * 0.7, 0.04, 0.01]} />
          <meshPhysicalMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}
      {[[-w / 2 + 0.05, -h / 2 + 0.05], [w / 2 - 0.05, -h / 2 + 0.05]].map(([x, y], i) => (
        <mesh key={i} position={[x, y, 0]}>
          <boxGeometry args={[0.08, 0.08, d]} />
          <meshPhysicalMaterial color="#0f172a" metalness={0.5} roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

interface BatteryRackProps {
  position: [number, number, number];
  rows: number;
  cols: number;
  onClick?: () => void;
  isHighlighted?: boolean;
}

function BatteryRack({ position, rows, cols, onClick, isHighlighted }: BatteryRackProps) {
  const [hovered, setHovered] = useState(false);
  const active = hovered || isHighlighted;

  const batteries = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const xPos = c * 0.32 - (cols * 0.32) / 2 + 0.16;
      const yPos = r * 0.22 - (rows * 0.22) / 2 + 0.11;
      batteries.push(
        <group key={`${r}-${c}`} position={[xPos, yPos, 0]}>
          <RoundedBox args={[0.28, 0.18, 0.35]} radius={0.015}>
            <meshPhysicalMaterial
              color={active ? "#22c55e" : "#1e293b"}
              metalness={0.6}
              roughness={0.35}
              clearcoat={0.2}
            />
          </RoundedBox>
          <mesh position={[0.1, 0.095, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.02, 8]} />
            <meshPhysicalMaterial color="#dc2626" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[-0.1, 0.095, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.02, 8]} />
            <meshPhysicalMaterial color="#1e40af" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.02, 0.176]}>
            <planeGeometry args={[0.2, 0.08]} />
            <meshBasicMaterial color={active ? "#86efac" : "#475569"} />
          </mesh>
        </group>
      );
    }
  }

  const rackWidth = cols * 0.32 + 0.12;
  const rackHeight = rows * 0.22 + 0.12;

  return (
    <group
      position={position}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <RoundedBox args={[rackWidth, rackHeight, 0.04]} radius={0.01} position={[0, 0, -0.2]}>
        <meshPhysicalMaterial color="#0f172a" metalness={0.7} roughness={0.25} />
      </RoundedBox>
      {[[-rackWidth / 2 + 0.02, -rackHeight / 2 + 0.02], [rackWidth / 2 - 0.02, -rackHeight / 2 + 0.02]].map(([x, y], i) => (
        <mesh key={i} position={[x, y, -0.1]}>
          <boxGeometry args={[0.04, 0.04, 0.2]} />
          <meshPhysicalMaterial color="#374151" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}
      {batteries}
      {[...Array(cols - 1)].map((_, i) => (
        <mesh key={i} position={[(i + 1) * 0.32 - (cols * 0.32) / 2, 0, 0.1]}>
          <boxGeometry args={[0.008, rackHeight * 0.8, 0.02]} />
          <meshPhysicalMaterial color="#fbbf24" metalness={0.6} roughness={0.3} />
        </mesh>
      ))}
      {active && (
        <Html center position={[0, rackHeight / 2 + 0.15, 0]} style={{ pointerEvents: "none" }}>
          <div className="bg-slate-900/95 backdrop-blur px-3 py-2 rounded-lg shadow-xl border border-slate-700 text-xs whitespace-nowrap">
            <div className="font-semibold text-white">Lithium Battery Bank</div>
            <div className="text-slate-400 text-[10px] mt-0.5">{rows * cols} x 48V LiFePO4 modules</div>
          </div>
        </Html>
      )}
    </group>
  );
}

interface ControlUnitProps {
  position: [number, number, number];
  onClick?: () => void;
  isHighlighted?: boolean;
}

function ControlUnit({ position, onClick, isHighlighted }: ControlUnitProps) {
  const [hovered, setHovered] = useState(false);
  const active = hovered || isHighlighted;

  return (
    <group
      position={position}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <RoundedBox args={[0.55, 0.65, 0.32]} radius={0.02}>
        <meshPhysicalMaterial
          color={active ? "#6366f1" : "#0f172a"}
          metalness={0.7}
          roughness={0.25}
          clearcoat={0.4}
        />
      </RoundedBox>
      
      <RoundedBox args={[0.48, 0.58, 0.01]} radius={0.015} position={[0, 0, 0.165]}>
        <meshPhysicalMaterial color="#1e293b" metalness={0.6} roughness={0.3} />
      </RoundedBox>
      
      <RoundedBox args={[0.38, 0.22, 0.01]} radius={0.01} position={[0, 0.14, 0.175]}>
        <meshPhysicalMaterial color="#0c4a6e" metalness={0.3} roughness={0.5} />
      </RoundedBox>
      <mesh position={[0, 0.14, 0.182]}>
        <planeGeometry args={[0.34, 0.18]} />
        <meshBasicMaterial color={active ? "#38bdf8" : "#0284c7"} />
      </mesh>
      
      {[[-0.12, -0.08], [0, -0.08], [0.12, -0.08]].map(([x, y], i) => (
        <group key={i} position={[x, y, 0.17]}>
          <mesh>
            <circleGeometry args={[0.022, 16]} />
            <meshPhysicalMaterial 
              color={i === 0 ? "#22c55e" : i === 1 ? "#fbbf24" : "#ef4444"} 
              emissive={i === 0 ? "#22c55e" : i === 1 ? "#fbbf24" : "#ef4444"} 
              emissiveIntensity={active ? 0.8 : 0.4}
            />
          </mesh>
        </group>
      ))}
      
      {[[-0.16, -0.22], [-0.08, -0.22], [0, -0.22], [0.08, -0.22], [0.16, -0.22]].map(([x, y], i) => (
        <RoundedBox key={i} args={[0.05, 0.08, 0.02]} radius={0.008} position={[x, y, 0.16]}>
          <meshPhysicalMaterial color="#374151" metalness={0.8} roughness={0.2} />
        </RoundedBox>
      ))}
      
      {[[-0.2, 0.26], [0.2, 0.26]].map(([x, y], i) => (
        <mesh key={i} position={[x, y, 0.165]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 0.03, 8]} />
          <meshPhysicalMaterial color="#71717a" metalness={0.9} roughness={0.1} />
        </mesh>
      ))}
      
      {[[-0.22, -0.28], [0.22, -0.28]].map(([x, y], i) => (
        <group key={i} position={[x, y, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.025, 0.025, 0.34, 8]} />
            <meshPhysicalMaterial color="#374151" metalness={0.85} roughness={0.2} />
          </mesh>
        </group>
      ))}
      
      {active && (
        <Html center position={[0, 0.5, 0]} style={{ pointerEvents: "none" }}>
          <div className="bg-slate-900/95 backdrop-blur px-3 py-2 rounded-lg shadow-xl border border-slate-700 text-xs whitespace-nowrap">
            <div className="font-semibold text-white">Integrated Controller</div>
            <div className="text-slate-400 text-[10px] mt-0.5">BMS + MPPT + Modbus/SNMP</div>
          </div>
        </Html>
      )}
    </group>
  );
}

interface HydrogenTankProps {
  position: [number, number, number];
  onClick?: () => void;
  isHighlighted?: boolean;
}

function HydrogenTank({ position, onClick, isHighlighted }: HydrogenTankProps) {
  const [hovered, setHovered] = useState(false);
  const active = hovered || isHighlighted;

  return (
    <group
      position={position}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.22, 0.9, 12, 24]} />
        <meshPhysicalMaterial
          color={active ? "#10b981" : "#047857"}
          metalness={0.4}
          roughness={0.3}
          clearcoat={0.6}
          clearcoatRoughness={0.2}
        />
      </mesh>
      
      {[-0.35, -0.15, 0.05, 0.25].map((x, i) => (
        <mesh key={i} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.23, 0.012, 8, 32]} />
          <meshPhysicalMaterial color="#0f172a" metalness={0.95} roughness={0.1} />
        </mesh>
      ))}
      
      <mesh rotation={[0, 0, Math.PI / 2]} position={[0.1, 0, 0]}>
        <cylinderGeometry args={[0.24, 0.24, 0.15, 24]} />
        <meshPhysicalMaterial color="#fbbf24" metalness={0.2} roughness={0.6} />
      </mesh>
      
      <group position={[0.58, 0, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.07, 0.05, 0.14, 12]} />
          <meshPhysicalMaterial color="#1e293b" metalness={0.9} roughness={0.15} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]} position={[0.08, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.06, 8]} />
          <meshPhysicalMaterial color="#374151" metalness={0.85} roughness={0.2} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]} position={[0.12, 0, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 0.04, 6]} />
          <meshPhysicalMaterial color="#fbbf24" metalness={0.7} roughness={0.25} />
        </mesh>
        <mesh position={[0.04, 0.06, 0]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.08, 6]} />
          <meshPhysicalMaterial color="#374151" metalness={0.8} roughness={0.25} />
        </mesh>
        <mesh position={[0.04, 0.1, 0]}>
          <sphereGeometry args={[0.025, 12, 12]} />
          <meshPhysicalMaterial color="#ef4444" metalness={0.3} roughness={0.5} />
        </mesh>
      </group>
      
      <group position={[-0.52, 0.15, 0]}>
        <mesh>
          <boxGeometry args={[0.08, 0.06, 0.04]} />
          <meshPhysicalMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0, 0.025]}>
          <planeGeometry args={[0.06, 0.04]} />
          <meshBasicMaterial color={active ? "#22c55e" : "#064e3b"} />
        </mesh>
      </group>
      
      {active && (
        <Html center position={[0, 0.45, 0]} style={{ pointerEvents: "none" }}>
          <div className="bg-slate-900/95 backdrop-blur px-3 py-2 rounded-lg shadow-xl border border-slate-700 text-xs whitespace-nowrap">
            <div className="font-semibold text-white">H2 Storage Cylinder</div>
            <div className="text-slate-400 text-[10px] mt-0.5">Type IV Composite - 350 bar / 5 kg</div>
          </div>
        </Html>
      )}
    </group>
  );
}

interface ConfigurationSceneProps {
  config: "standalone" | "rack" | "hybrid";
  selectedComponent: string | null;
  onSelectComponent: (component: string | null) => void;
}

function StandaloneFuelCellScene({ selectedComponent, onSelectComponent }: Omit<ConfigurationSceneProps, "config">) {
  return (
    <group>
      <Cabinet position={[0, 0.9, 0]} dimensions={[2, 1.8, 1]} color="#64748b" opacity={0.15} />
      
      <FuelCellStack
        position={[-0.5, 0.6, 0]}
        color="#1e40af"
        label="PEM Fuel Cell Stack (5kW)"
        onClick={() => onSelectComponent(selectedComponent === "stack" ? null : "stack")}
        isHighlighted={selectedComponent === "stack"}
      />
      
      <ControlUnit
        position={[0.5, 0.6, 0]}
        onClick={() => onSelectComponent(selectedComponent === "control" ? null : "control")}
        isHighlighted={selectedComponent === "control"}
      />
      
      <BatteryRack
        position={[0, 1.4, 0]}
        rows={2}
        cols={4}
        onClick={() => onSelectComponent(selectedComponent === "battery" ? null : "battery")}
        isHighlighted={selectedComponent === "battery"}
      />
      
      <HydrogenTank
        position={[0, -0.3, 0]}
        onClick={() => onSelectComponent(selectedComponent === "tank" ? null : "tank")}
        isHighlighted={selectedComponent === "tank"}
      />
    </group>
  );
}

function RackMountScene({ selectedComponent, onSelectComponent }: Omit<ConfigurationSceneProps, "config">) {
  return (
    <group>
      <mesh position={[0, 0, -0.3]}>
        <boxGeometry args={[1.8, 2.4, 0.08]} />
        <meshStandardMaterial color="#1f2937" metalness={0.7} roughness={0.3} />
      </mesh>
      
      {[-0.85, 0.85].map((x) => (
        <mesh key={x} position={[x, 0, 0]}>
          <boxGeometry args={[0.05, 2.4, 0.5]} />
          <meshStandardMaterial color="#374151" metalness={0.6} roughness={0.3} />
        </mesh>
      ))}
      
      <ControlUnit
        position={[0, 1, 0.1]}
        onClick={() => onSelectComponent(selectedComponent === "control" ? null : "control")}
        isHighlighted={selectedComponent === "control"}
      />
      
      <group position={[0, 0.3, 0.1]}>
        <mesh
          onClick={() => onSelectComponent(selectedComponent === "inverter" ? null : "inverter")}
        >
          <boxGeometry args={[1.5, 0.4, 0.3]} />
          <meshStandardMaterial
            color={selectedComponent === "inverter" ? "#ec4899" : "#0f172a"}
            metalness={0.5}
            roughness={0.3}
          />
        </mesh>
        {selectedComponent === "inverter" && (
          <Html center position={[0, 0.4, 0]} style={{ pointerEvents: "none" }}>
            <div className="bg-background/95 backdrop-blur px-3 py-1.5 rounded-md shadow-lg border text-xs whitespace-nowrap">
              DC/DC Converter 48V
            </div>
          </Html>
        )}
      </group>
      
      <BatteryRack
        position={[0, -0.5, 0.1]}
        rows={3}
        cols={4}
        onClick={() => onSelectComponent(selectedComponent === "battery" ? null : "battery")}
        isHighlighted={selectedComponent === "battery"}
      />
      
      <FuelCellStack
        position={[0, -1, 0.1]}
        color="#1e40af"
        label="Fuel Cell Module (2.5kW)"
        onClick={() => onSelectComponent(selectedComponent === "stack" ? null : "stack")}
        isHighlighted={selectedComponent === "stack"}
      />
    </group>
  );
}

function HybridSystemScene({ selectedComponent, onSelectComponent }: Omit<ConfigurationSceneProps, "config">) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <group>
      <mesh position={[-1.2, 0.8, 0]} rotation={[Math.PI / 6, 0, 0]}>
        <boxGeometry args={[1.2, 0.05, 0.8]} />
        <meshStandardMaterial color="#1e3a8a" metalness={0.3} roughness={0.5} />
      </mesh>
      {[...Array(6)].map((_, i) => (
        <mesh
          key={i}
          position={[-1.2 + (i % 3) * 0.35 - 0.35, 0.85 + Math.floor(i / 3) * 0.1, -0.25 + Math.floor(i / 3) * 0.35]}
          rotation={[Math.PI / 6, 0, 0]}
          onPointerOver={() => setHovered("solar")}
          onPointerOut={() => setHovered(null)}
          onClick={() => onSelectComponent(selectedComponent === "solar" ? null : "solar")}
        >
          <boxGeometry args={[0.3, 0.02, 0.35]} />
          <meshStandardMaterial
            color={hovered === "solar" || selectedComponent === "solar" ? "#60a5fa" : "#0ea5e9"}
            metalness={0.1}
            roughness={0.3}
          />
        </mesh>
      ))}
      {(hovered === "solar" || selectedComponent === "solar") && (
        <Html center position={[-1.2, 1.3, 0]} style={{ pointerEvents: "none" }}>
          <div className="bg-background/95 backdrop-blur px-3 py-1.5 rounded-md shadow-lg border text-xs whitespace-nowrap">
            Solar Array (2kWp)
          </div>
        </Html>
      )}
      
      <Cabinet position={[0.5, 0.6, 0]} dimensions={[1.5, 1.2, 0.8]} color="#64748b" opacity={0.2} />
      
      <BatteryRack
        position={[0.5, 0.8, 0]}
        rows={2}
        cols={3}
        onClick={() => onSelectComponent(selectedComponent === "battery" ? null : "battery")}
        isHighlighted={selectedComponent === "battery"}
      />
      
      <ControlUnit
        position={[0.5, 0.2, 0]}
        onClick={() => onSelectComponent(selectedComponent === "control" ? null : "control")}
        isHighlighted={selectedComponent === "control"}
      />
      
      <FuelCellStack
        position={[1.8, 0.4, 0]}
        color="#1e40af"
        label="Backup Fuel Cell (3kW)"
        onClick={() => onSelectComponent(selectedComponent === "stack" ? null : "stack")}
        isHighlighted={selectedComponent === "stack"}
      />
      
      <HydrogenTank
        position={[1.8, -0.4, 0]}
        onClick={() => onSelectComponent(selectedComponent === "tank" ? null : "tank")}
        isHighlighted={selectedComponent === "tank"}
      />
    </group>
  );
}

function ConfigurationScene({ config, selectedComponent, onSelectComponent }: ConfigurationSceneProps) {
  switch (config) {
    case "standalone":
      return <StandaloneFuelCellScene selectedComponent={selectedComponent} onSelectComponent={onSelectComponent} />;
    case "rack":
      return <RackMountScene selectedComponent={selectedComponent} onSelectComponent={onSelectComponent} />;
    case "hybrid":
      return <HybridSystemScene selectedComponent={selectedComponent} onSelectComponent={onSelectComponent} />;
    default:
      return <StandaloneFuelCellScene selectedComponent={selectedComponent} onSelectComponent={onSelectComponent} />;
  }
}

const componentInfo: Record<string, { title: string; description: string; specs: string[] }> = {
  stack: {
    title: "PEM Fuel Cell Stack",
    description: "Proton Exchange Membrane fuel cell converts hydrogen and oxygen into electricity through electrochemical reaction.",
    specs: ["Output: 2.5-10 kW", "Efficiency: 40-60%", "Voltage: 24-48V DC", "Lifetime: 20,000+ hours"],
  },
  battery: {
    title: "Battery Bank",
    description: "Energy storage buffer that provides instant power during load transients and fuel cell startup.",
    specs: ["Capacity: 10-100 Ah", "Type: VRLA/Li-ion", "Voltage: 48V nominal", "Cycles: 500-5000"],
  },
  control: {
    title: "Control Unit & BMS",
    description: "Integrated controller managing power distribution, battery charging, and system monitoring.",
    specs: ["MPPT charging", "Remote monitoring", "Load management", "Fault protection"],
  },
  tank: {
    title: "Hydrogen Storage",
    description: "High-pressure vessel storing hydrogen fuel for extended runtime operation.",
    specs: ["Pressure: 350 bar", "Capacity: 2-10 kg H2", "Material: Type IV composite", "Refill: Swappable"],
  },
  inverter: {
    title: "DC/DC Converter",
    description: "Power electronics converting fuel cell output to system bus voltage.",
    specs: ["Input: 20-60V DC", "Output: 48V DC", "Efficiency: 95%+", "Galvanic isolation"],
  },
  solar: {
    title: "Solar Array",
    description: "Photovoltaic panels providing primary power generation in hybrid configurations.",
    specs: ["Output: 1-5 kWp", "Type: Monocrystalline", "Efficiency: 20%+", "Warranty: 25 years"],
  },
};

function CanvasLoader() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading 3D viewer...</p>
      </div>
    </div>
  );
}

function Scene3DLoader() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-2 bg-background/90 backdrop-blur p-4 rounded-lg border shadow-lg">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground whitespace-nowrap">Loading 3D scene...</p>
      </div>
    </Html>
  );
}

export function FuelCell3DViewer() {
  const [activeConfig, setActiveConfig] = useState<"standalone" | "rack" | "hybrid">("standalone");
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleZoomIn = () => {
    if (controlsRef.current) {
      const newZoom = Math.min(zoomLevel + 0.2, 2);
      setZoomLevel(newZoom);
      controlsRef.current.object.position.multiplyScalar(0.8);
      controlsRef.current.update();
    }
  };

  const handleZoomOut = () => {
    if (controlsRef.current) {
      const newZoom = Math.max(zoomLevel - 0.2, 0.5);
      setZoomLevel(newZoom);
      controlsRef.current.object.position.multiplyScalar(1.2);
      controlsRef.current.update();
    }
  };

  const configs = {
    standalone: {
      title: "Standalone Outdoor Cabinet",
      description: "Self-contained weatherproof enclosure housing PEM fuel cell stack, lithium battery bank, hydrogen storage cylinders, and integrated BMS/controller. Designed for telecom tower backup with 48V DC output, -40C to +50C operation, and 72+ hour autonomy.",
      icon: Box,
      referenceUrl: "https://www.ballard.com/fuel-cell-solutions/backup-power",
      specs: ["Power: 1-10 kW", "Autonomy: 24-168 hrs", "IP65 rated", "H2: 350 bar cylinders"],
      manufacturer: "Ballard, Plug Power, SFC Energy"
    },
    rack: {
      title: "19\" Rack Mount Indoor",
      description: "Modular 2U-6U components for data center and telecom shelter installation. Includes hot-swappable fuel cell modules, rack-mounted battery shelves, DC/DC converters, and remote-manageable controller with SNMP/Modbus interface.",
      icon: Layers,
      referenceUrl: "https://www.plugpower.com/fuel-cell-power/stationary/",
      specs: ["Power: 2-25 kW", "Form: 19\" EIA rack", "Hot-swap modules", "N+1 redundancy"],
      manufacturer: "Plug Power, Intelligent Energy, Nedstack"
    },
    hybrid: {
      title: "Solar-Fuel Cell Hybrid",
      description: "Integrated renewable system combining photovoltaic array with hydrogen fuel cell for extended off-grid operation. Solar provides primary power during daylight; fuel cell activates during night/cloudy periods. Ideal for remote sites with limited grid access.",
      icon: Battery,
      referenceUrl: "https://www.sfc-defense.com/products/efoy-pro",
      specs: ["Solar: 1-5 kWp", "FC Backup: 0.5-5 kW", "MPPT charging", "Zero emissions"],
      manufacturer: "SFC Energy, Horizon, PowerCell"
    },
  };

  return (
    <Card className="overflow-hidden" data-testid="card-3d-viewer">
      <CardHeader>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="w-5 h-5" />
              Interactive 3D Configuration Viewer
            </CardTitle>
            <CardDescription>
              Explore fuel cell system configurations - click components for details
            </CardDescription>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              size="icon"
              onClick={handleZoomIn}
              data-testid="button-zoom-in"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleZoomOut}
              data-testid="button-zoom-out"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAutoRotate(!autoRotate)}
              data-testid="button-toggle-rotate"
            >
              <RotateCcw className={`w-4 h-4 mr-2 ${autoRotate ? "animate-spin" : ""}`} />
              {autoRotate ? "Stop" : "Rotate"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedComponent(null)}
              data-testid="button-reset-view"
            >
              Reset
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs value={activeConfig} onValueChange={(v) => { setActiveConfig(v as typeof activeConfig); setSelectedComponent(null); }}>
          <div className="px-6 pb-2">
            <TabsList className="grid w-full grid-cols-3" data-testid="tabs-config-list">
              {(Object.keys(configs) as (keyof typeof configs)[]).map((key) => {
                const config = configs[key];
                const Icon = config.icon;
                return (
                  <TabsTrigger key={key} value={key} data-testid={`tab-config-${key}`}>
                    <Icon className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">{config.title}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>

          <div className="grid md:grid-cols-3 gap-0">
            <div className="md:col-span-2 h-[400px] bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900" data-testid="canvas-3d-viewer">
              {isMounted ? (
                <Canvas
                  camera={{ position: [4, 3, 4], fov: 45 }}
                  dpr={[1, 2]}
                  gl={{ antialias: true, alpha: true }}
                  shadows
                >
                  <Suspense fallback={<Scene3DLoader />}>
                    <ambientLight intensity={0.5} />
                    <directionalLight 
                      position={[8, 10, 5]} 
                      intensity={1.2} 
                      castShadow 
                      shadow-mapSize={[1024, 1024]}
                      shadow-bias={-0.0001}
                    />
                    <directionalLight position={[-5, 5, -5]} intensity={0.4} />
                    <pointLight position={[0, 6, 0]} intensity={0.3} color="#e0f2fe" />
                    <spotLight 
                      position={[5, 8, 3]} 
                      angle={0.4} 
                      penumbra={0.5} 
                      intensity={0.6}
                      color="#ffffff"
                    />
                    
                    <PresentationControls
                      global
                      rotation={[0, 0, 0]}
                      polar={[-Math.PI / 4, Math.PI / 4]}
                      azimuth={[-Math.PI / 4, Math.PI / 4]}
                      config={{ mass: 2, tension: 400 }}
                      snap={{ mass: 4, tension: 400 }}
                    >
                      <group position={[0, -0.5, 0]}>
                        <ConfigurationScene
                          config={activeConfig}
                          selectedComponent={selectedComponent}
                          onSelectComponent={setSelectedComponent}
                        />
                      </group>
                    </PresentationControls>
                    
                    <ContactShadows 
                      position={[0, -1.5, 0]} 
                      opacity={0.5} 
                      scale={12} 
                      blur={2.5} 
                      far={4}
                      color="#1e293b"
                    />
                    <OrbitControls
                      ref={controlsRef}
                      enablePan={false}
                      enableZoom={true}
                      autoRotate={autoRotate}
                      autoRotateSpeed={1}
                      minDistance={3}
                      maxDistance={10}
                    />
                  </Suspense>
                </Canvas>
              ) : (
                <CanvasLoader />
              )}
            </div>

            <div className="p-4 border-t md:border-t-0 md:border-l bg-muted/30 overflow-y-auto max-h-[400px]">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2" data-testid="text-config-title">{configs[activeConfig].title}</h4>
                  <p className="text-sm text-muted-foreground mb-3" data-testid="text-config-description">
                    {configs[activeConfig].description}
                  </p>
                  <div className="space-y-2 mb-3">
                    <div className="flex flex-wrap gap-1">
                      {configs[activeConfig].specs.map((spec, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Building className="w-3 h-3" />
                      <span>{configs[activeConfig].manufacturer}</span>
                    </div>
                  </div>
                  <a 
                    href={configs[activeConfig].referenceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                    data-testid="link-config-reference"
                  >
                    <ExternalLink className="w-3 h-3" />
                    View product reference
                  </a>
                </div>

                {selectedComponent && componentInfo[selectedComponent] ? (
                  <div className="p-3 rounded-lg bg-background border" data-testid="panel-component-info">
                    <h5 className="font-medium text-sm mb-1" data-testid="text-component-title">
                      {componentInfo[selectedComponent].title}
                    </h5>
                    <p className="text-xs text-muted-foreground mb-2" data-testid="text-component-description">
                      {componentInfo[selectedComponent].description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {componentInfo[selectedComponent].specs.map((spec, i) => (
                        <Badge key={i} variant="secondary" className="text-xs" data-testid={`badge-spec-${selectedComponent}-${i}`}>
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-lg bg-background/50 border border-dashed" data-testid="panel-component-hint">
                    <p className="text-xs text-muted-foreground text-center">
                      Click on a component in the 3D view to see details
                    </p>
                  </div>
                )}

                <div>
                  <h5 className="text-xs font-medium text-muted-foreground mb-2">Components</h5>
                  <div className="flex flex-wrap gap-1">
                    {Object.keys(componentInfo).map((key) => (
                      <Badge
                        key={key}
                        variant={selectedComponent === key ? "default" : "outline"}
                        className="cursor-pointer text-xs"
                        onClick={() => setSelectedComponent(selectedComponent === key ? null : key)}
                        data-testid={`button-component-${key}`}
                      >
                        {componentInfo[key].title.split(" ")[0]}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}
