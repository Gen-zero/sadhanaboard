import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useTexture, Sphere, Text } from '@react-three/drei';
import * as THREE from 'three';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Flame, Shield, Eye, Wind, Compass, Skull } from 'lucide-react';

// Pratyangira Yantra 3D Model Component
const PratyangiraYantra = () => {
  // Load textures
  const textures = useTexture({
    map: '/icons/pratyangira-yantra-copper/textures/Object001_diffuse.jpeg',
    normalMap: '/icons/pratyangira-yantra-copper/textures/Object001_normal.jpg',
    roughnessMap: '/icons/pratyangira-yantra-copper/textures/Object001_specular.jpeg',
  });

  const meshRef = useRef<THREE.Mesh>(null);

  // Add subtle rotation animation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} scale={[0.5, 0.5, 0.5]}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial
        {...textures}
        metalness={0.8}
        roughness={0.3}
      />
    </mesh>
  );
};

// Floating particle component for background
const FloatingParticle = ({ delay }: { delay: number }) => {
  return (
    <motion.div
      className="absolute text-2xl opacity-20"
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
      }}
      animate={{
        y: [0, -20, 0],
        rotate: [0, 180, 360],
      }}
      transition={{
        duration: 5 + Math.random() * 5,
        repeat: Infinity,
        delay,
      }}
    >
      ☠
    </motion.div>
  );
};

const PratyangiraPage = () => {
  const [sankalpa, setSankalpa] = useState('');
  const [isEntering, setIsEntering] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const testimonials = [
    {
      name: "Priya M.",
      text: "The Pratyangira yantra helped me overcome a major obstacle in my career. The protective energy was palpable.",
      role: "Business Professional"
    },
    {
      name: "Ravi K.",
      text: "After meditating with this yantra, I felt a profound sense of inner strength and courage to face my fears.",
      role: "Spiritual Seeker"
    },
    {
      name: "Anjali S.",
      text: "The transformative power of Pratyangira removed negative influences from my life and brought clarity.",
      role: "Yoga Instructor"
    }
  ];

  const features = [
    {
      title: "The Destroyer's Path 🗡️",
      description: "Shatter illusions and ego attachments through mindful practice. Transform your weaknesses into strengths through the power of destruction and renewal.",
      icon: Skull,
      color: "from-red-800 to-red-900"
    },
    {
      title: "The Sacred Fire 🔥",
      description: "Ignite your inner fire through disciplined practice. Burn away negative patterns and emerge transformed like gold purified in flame.",
      icon: Flame,
      color: "from-orange-700 to-red-800"
    },
    {
      title: "The Shield of Protection 🛡️",
      description: "Build an impenetrable shield of divine protection. Ward off negative energies and cultivate inner strength.",
      icon: Shield,
      color: "from-amber-800 to-orange-900"
    },
    {
      title: "The Wind of Change 💨",
      description: "Let the winds of transformation carry away what no longer serves you. Embrace impermanence and find freedom in letting go.",
      icon: Wind,
      color: "from-gray-700 to-gray-900"
    },
    {
      title: "The Yantra of Power ⚡",
      description: "Channel divine feminine energy through sacred geometry. Create powerful yantras for protection, transformation, and spiritual awakening.",
      icon: Compass,
      color: "from-purple-800 to-indigo-900"
    }
  ];

  const handleEnterSankalpa = () => {
    setIsEntering(true);
    // Simulate entering sankalpa
    setTimeout(() => {
      console.log("Entering with sankalpa:", sankalpa);
      setIsEntering(false);
    }, 1000);
  };

  return (
    <Layout>
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 via-red-900 to-black">
        {/* Ambient particles */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <FloatingParticle key={i} delay={i * 0.5} />
          ))}
        </div>

        {/* Hero Section */}
        <section className="relative py-20 px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-orange-500 to-red-600 mb-6">
                Pratyangira Yantra
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto">
                Harness the fierce protective energy of the Lion-Faced Goddess for courage, strength, and spiritual transformation
              </p>
            </motion.div>

            <div className="relative h-96 w-full max-w-2xl mx-auto mb-12 rounded-xl overflow-hidden border-2 border-amber-500/30 shadow-2xl shadow-amber-500/20">
              <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#f97316" />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ef4444" />
                <PratyangiraYantra />
                <OrbitControls 
                  enableZoom={true}
                  enablePan={false}
                  autoRotate
                  autoRotateSpeed={0.5}
                />
                <Sphere args={[2, 32, 32]} visible={false}>
                  <meshBasicMaterial transparent opacity={0} />
                </Sphere>
              </Canvas>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-black/50 backdrop-blur-sm border border-amber-500/30 rounded-xl p-6 max-w-2xl mx-auto"
            >
              <h2 className="text-2xl font-bold text-amber-400 mb-4">Set Your Intention</h2>
              <p className="text-gray-300 mb-4">
                Focus your mind on the yantra and declare your sankalpa (intention) to align with Pratyangira's protective energy
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="text"
                  value={sankalpa}
                  onChange={(e) => setSankalpa(e.target.value)}
                  placeholder="I intend to overcome my fears and find inner strength..."
                  className="flex-1 px-4 py-3 rounded-lg bg-gray-800/50 border border-amber-500/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <Button
                  onClick={handleEnterSankalpa}
                  disabled={isEntering || !sankalpa.trim()}
                  className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
                >
                  {isEntering ? 'Entering...' : 'Activate Yantra'}
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 bg-black/30">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-amber-400 mb-4">Pratyangira's Sacred Powers</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Experience the transformative energy of this powerful yantra through focused meditation and intention
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="h-full bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-amber-500/20 backdrop-blur-sm hover:border-amber-500/40 transition-all duration-300 group">
                      <CardHeader>
                        <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${feature.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        <CardTitle className="text-xl text-amber-400">{feature.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-gray-300">
                          {feature.description}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-amber-400 mb-4">Transformative Experiences</h2>
              <p className="text-xl text-gray-300">
                Hear from practitioners who have worked with Pratyangira's energy
              </p>
            </motion.div>

            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-amber-500/30 rounded-2xl p-8 backdrop-blur-sm">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <div className="text-5xl text-amber-500 mb-6">"</div>
                <p className="text-xl text-gray-200 mb-8 italic">
                  {testimonials[activeTestimonial].text}
                </p>
                <div>
                  <p className="text-2xl font-bold text-amber-400">{testimonials[activeTestimonial].name}</p>
                  <p className="text-gray-400">{testimonials[activeTestimonial].role}</p>
                </div>
              </motion.div>

              <div className="flex justify-center mt-8 space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === activeTestimonial 
                        ? 'bg-amber-500 w-8' 
                        : 'bg-gray-600 hover:bg-gray-500'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-amber-900/30 to-orange-900/30">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold text-amber-400 mb-6">Begin Your Transformation</h2>
              <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                Connect with the fierce protective energy of Pratyangira and unlock your inner strength
              </p>
              <Button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-lg px-8 py-4 rounded-full font-bold transition-all duration-300 transform hover:scale-105 shadow-lg shadow-amber-500/30">
                Activate Your Yantra
              </Button>
            </motion.div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default PratyangiraPage;