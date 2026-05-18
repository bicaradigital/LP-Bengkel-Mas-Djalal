"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination, Autoplay, EffectCoverflow } from "swiper/modules"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, MapPin, Phone, Wrench, Clock, Star, CheckCircle, Volume2, VolumeX } from "lucide-react"

// Import Swiper styles
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/effect-coverflow"

export default function BengkelMotorPage() {
  const [formData, setFormData] = useState({
    nama: "",
    motor: "",
    keluhan: "",
  })

  const [isVisible, setIsVisible] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(false)
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Initialize Web Audio API
  const initializeAudio = () => {
    if (!audioContext && typeof window !== "undefined") {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
      setAudioContext(ctx)
    }
  }

  // Create engine sound using Web Audio API
  const playEngineSound = (type: "start" | "idle" | "rev") => {
    if (!soundEnabled || !audioContext) return

    try {
      // Create multiple oscillators for richer motorcycle sound
      const oscillators: OscillatorNode[] = []
      const gainNodes: GainNode[] = []

      // Main engine sound
      const mainOsc = audioContext.createOscillator()
      const mainGain = audioContext.createGain()

      // Secondary harmonics for realistic motorcycle sound
      const harmonic1 = audioContext.createOscillator()
      const harmonic1Gain = audioContext.createGain()

      const harmonic2 = audioContext.createOscillator()
      const harmonic2Gain = audioContext.createGain()

      // Noise for exhaust sound
      const noiseBuffer = audioContext.createBuffer(1, audioContext.sampleRate * 0.5, audioContext.sampleRate)
      const noiseData = noiseBuffer.getChannelData(0)
      for (let i = 0; i < noiseData.length; i++) {
        noiseData[i] = (Math.random() * 2 - 1) * 0.1
      }

      const noiseSource = audioContext.createBufferSource()
      const noiseGain = audioContext.createGain()
      const noiseFilter = audioContext.createBiquadFilter()

      noiseSource.buffer = noiseBuffer
      noiseFilter.type = "bandpass"
      noiseFilter.frequency.value = 800

      // Connect noise chain
      noiseSource.connect(noiseFilter)
      noiseFilter.connect(noiseGain)
      noiseGain.connect(audioContext.destination)

      // Connect oscillator chains
      mainOsc.connect(mainGain)
      harmonic1.connect(harmonic1Gain)
      harmonic2.connect(harmonic2Gain)

      mainGain.connect(audioContext.destination)
      harmonic1Gain.connect(audioContext.destination)
      harmonic2Gain.connect(audioContext.destination)

      const currentTime = audioContext.currentTime

      if (type === "start") {
        // Motorcycle engine start sequence
        mainOsc.type = "sawtooth"
        harmonic1.type = "square"
        harmonic2.type = "triangle"

        // Engine cranking sound (low frequency)
        mainOsc.frequency.setValueAtTime(45, currentTime)
        mainOsc.frequency.linearRampToValueAtTime(55, currentTime + 0.3)
        mainOsc.frequency.linearRampToValueAtTime(85, currentTime + 0.6)
        mainOsc.frequency.exponentialRampToValueAtTime(180, currentTime + 1.2)

        // Harmonics
        harmonic1.frequency.setValueAtTime(90, currentTime)
        harmonic1.frequency.exponentialRampToValueAtTime(360, currentTime + 1.2)

        harmonic2.frequency.setValueAtTime(135, currentTime)
        harmonic2.frequency.exponentialRampToValueAtTime(540, currentTime + 1.2)

        // Volume envelope for engine start
        mainGain.gain.setValueAtTime(0.15, currentTime)
        mainGain.gain.linearRampToValueAtTime(0.25, currentTime + 0.3)
        mainGain.gain.linearRampToValueAtTime(0.35, currentTime + 0.8)
        mainGain.gain.exponentialRampToValueAtTime(0.01, currentTime + 1.5)

        harmonic1Gain.gain.setValueAtTime(0.08, currentTime)
        harmonic1Gain.gain.exponentialRampToValueAtTime(0.01, currentTime + 1.5)

        harmonic2Gain.gain.setValueAtTime(0.05, currentTime)
        harmonic2Gain.gain.exponentialRampToValueAtTime(0.01, currentTime + 1.5)

        // Exhaust noise
        noiseGain.gain.setValueAtTime(0.1, currentTime)
        noiseGain.gain.exponentialRampToValueAtTime(0.01, currentTime + 1.5)

        // Start all sounds
        mainOsc.start(currentTime)
        harmonic1.start(currentTime)
        harmonic2.start(currentTime)
        noiseSource.start(currentTime)

        // Stop all sounds
        mainOsc.stop(currentTime + 1.5)
        harmonic1.stop(currentTime + 1.5)
        harmonic2.stop(currentTime + 1.5)
        noiseSource.stop(currentTime + 1.5)
      } else if (type === "idle") {
        // Motorcycle idle sound
        mainOsc.type = "sawtooth"
        harmonic1.type = "square"

        // Steady idle frequency with slight variation
        const idleFreq = 95 + Math.random() * 10
        mainOsc.frequency.setValueAtTime(idleFreq, currentTime)
        mainOsc.frequency.linearRampToValueAtTime(idleFreq + 5, currentTime + 0.1)
        mainOsc.frequency.linearRampToValueAtTime(idleFreq - 3, currentTime + 0.2)

        harmonic1.frequency.setValueAtTime(idleFreq * 2, currentTime)
        harmonic1.frequency.linearRampToValueAtTime(idleFreq * 2 + 10, currentTime + 0.2)

        // Gentle volume for idle
        mainGain.gain.setValueAtTime(0.08, currentTime)
        mainGain.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.3)

        harmonic1Gain.gain.setValueAtTime(0.04, currentTime)
        harmonic1Gain.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.3)

        // Light exhaust sound
        noiseGain.gain.setValueAtTime(0.03, currentTime)
        noiseGain.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.3)

        mainOsc.start(currentTime)
        harmonic1.start(currentTime)
        noiseSource.start(currentTime)

        mainOsc.stop(currentTime + 0.3)
        harmonic1.stop(currentTime + 0.3)
        noiseSource.stop(currentTime + 0.3)
      } else if (type === "rev") {
        // Motorcycle rev sound
        mainOsc.type = "sawtooth"
        harmonic1.type = "square"
        harmonic2.type = "triangle"

        // Rev up sound
        mainOsc.frequency.setValueAtTime(120, currentTime)
        mainOsc.frequency.exponentialRampToValueAtTime(400, currentTime + 0.4)
        mainOsc.frequency.exponentialRampToValueAtTime(150, currentTime + 0.8)

        harmonic1.frequency.setValueAtTime(240, currentTime)
        harmonic1.frequency.exponentialRampToValueAtTime(800, currentTime + 0.4)
        harmonic1.frequency.exponentialRampToValueAtTime(300, currentTime + 0.8)

        harmonic2.frequency.setValueAtTime(360, currentTime)
        harmonic2.frequency.exponentialRampToValueAtTime(1200, currentTime + 0.4)
        harmonic2.frequency.exponentialRampToValueAtTime(450, currentTime + 0.8)

        // Volume envelope for rev
        mainGain.gain.setValueAtTime(0.2, currentTime)
        mainGain.gain.linearRampToValueAtTime(0.4, currentTime + 0.4)
        mainGain.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.8)

        harmonic1Gain.gain.setValueAtTime(0.1, currentTime)
        harmonic1Gain.gain.linearRampToValueAtTime(0.2, currentTime + 0.4)
        harmonic1Gain.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.8)

        harmonic2Gain.gain.setValueAtTime(0.06, currentTime)
        harmonic2Gain.gain.linearRampToValueAtTime(0.12, currentTime + 0.4)
        harmonic2Gain.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.8)

        // Strong exhaust sound for rev
        noiseGain.gain.setValueAtTime(0.15, currentTime)
        noiseGain.gain.linearRampToValueAtTime(0.25, currentTime + 0.4)
        noiseGain.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.8)

        mainOsc.start(currentTime)
        harmonic1.start(currentTime)
        harmonic2.start(currentTime)
        noiseSource.start(currentTime)

        mainOsc.stop(currentTime + 0.8)
        harmonic1.stop(currentTime + 0.8)
        harmonic2.stop(currentTime + 0.8)
        noiseSource.stop(currentTime + 0.8)
      }
    } catch (error) {
      console.log("Audio playback failed:", error)
    }
  }

  const handleSoundToggle = () => {
    if (!soundEnabled) {
      initializeAudio()
    }
    setSoundEnabled(!soundEnabled)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
  }

  const sendToWhatsApp = (e: React.FormEvent) => {
    e.preventDefault()
    playEngineSound("start")
    const { nama, motor, keluhan } = formData
    const pesan = `Hai kak, saya ingin booking servis motor:%0A%0ANama: ${nama}%0AJenis Motor: ${motor}%0AKeluhan: ${keluhan}`
    const url = `https://wa.me/628993992095?text=${pesan}`
    alert("Terima kasih! Anda akan diarahkan ke WhatsApp untuk menyelesaikan booking.")
    window.open(url, "_blank")
  }

  const galleryImages = [
    {
      src: "/images/bengkel-exterior.png",
      alt: "Bengkel Motor Mas Djalal - Tampak Depan Semarang",
      title: "Lokasi Bengkel",
      description: "Bengkel kami yang strategis dan mudah dijangkau di Gajahmungkur Semarang",
    },
    {
      src: "/images/servis-ringan.png",
      alt: "Servis Ringan Motor di Bengkel Mas Djalal",
      title: "Servis Ringan",
      description: "Perawatan rutin motor untuk performa optimal dengan teknisi berpengalaman",
    },
    {
      src: "/images/ganti-oli.png",
      alt: "Ganti Oli Motor Berkualitas Semarang",
      title: "Ganti Oli",
      description: "Penggantian oli berkualitas dengan harga terjangkau dan oli original",
    },
    {
      src: "/images/tune-up.png",
      alt: "Tune-up Mesin Motor Profesional",
      title: "Tune-Up Mesin",
      description: "Optimalisasi performa mesin motor dengan peralatan modern",
    },
    {
      src: "/images/servis-elektrik-headlamp.png",
      alt: "Servis Elektrik dan Headlamp Motor",
      title: "Servis Elektrik & Headlamp",
      description: "Perbaikan sistem kelistrikan dan lampu motor oleh teknisi ahli",
    },
    {
      src: "/images/servis-mesin.png",
      alt: "Servis Mesin Motor Detail Semarang",
      title: "Servis Mesin",
      description: "Perbaikan dan perawatan mesin motor secara detail dan menyeluruh",
    },
    {
      src: "/images/rem-kampas.png",
      alt: "Servis Rem dan Kampas Motor Aman",
      title: "Servis Rem & Kampas",
      description: "Perawatan sistem rem untuk keamanan berkendara dengan spare part original",
    },
    {
      src: "/images/workshop-interior.png",
      alt: "Interior Bengkel Motor Modern Semarang",
      title: "Fasilitas Bengkel",
      description: "Peralatan lengkap dan modern untuk servis terbaik motor Anda",
    },
    {
      src: "/images/tuneup-detail.png",
      alt: "Detail Tune-up Motor Profesional",
      title: "Tune-Up Detail",
      description: "Proses tune-up menyeluruh untuk performa maksimal motor Anda",
    },
    {
      src: "/images/servis-rutin.png",
      alt: "Servis Rutin Motor Berkala Semarang",
      title: "Servis Rutin",
      description: "Perawatan berkala untuk menjaga kondisi motor tetap prima",
    },
  ]

  const services = [
    { icon: <Wrench className="h-6 w-6" />, title: "Servis Ringan", desc: "Perawatan rutin harian motor Anda" },
    { icon: <CheckCircle className="h-6 w-6" />, title: "Ganti Oli", desc: "Oli berkualitas terjamin original" },
    { icon: <Star className="h-6 w-6" />, title: "Tune-Up", desc: "Optimalisasi performa mesin" },
    { icon: <MessageCircle className="h-6 w-6" />, title: "Servis Elektrik", desc: "Perbaikan sistem kelistrikan" },
    { icon: <Clock className="h-6 w-6" />, title: "Konsultasi Gratis", desc: "Bisa konsultasi kondisi kendaraan" },
  ]

  const testimonials = [
    {
      text: "Motor saya sekarang jauh lebih enak dipakai setelah tune-up di Mas Jalal. Pengerjaannya cepat dan hasilnya memuaskan!",
      author: "Andi Prasetyo",
      location: "Semarang Barat",
      rating: 5,
    },
    {
      text: "Langganan ganti oli di sini, harga jujur dan pelayanan ramah. Teknisinya juga berpengalaman.",
      author: "Sari Wulandari",
      location: "Gajahmungkur",
      rating: 5,
    },
    {
      text: "Waktu darurat mogok di jalan, langsung dibantu servis di tempat. Keren banget pelayanannya!",
      author: "Budi Santoso",
      location: "Tembalang",
      rating: 5,
    },
    {
      text: "Pelayanan yg memuaskan, bisa konsultasi dulu, hasil nya bagus, ga nyesel service di sini. Recommended!",
      author: "Guntur Wijaya",
      location: "Sampangan",
      rating: 5,
    },
    {
      text: "Spesial bongkar mesin servis memuaskan harga teman, dijamin puas. Teknisinya ahli banget.",
      author: "Prasetyo Adi",
      location: "Gajahmungkur",
      rating: 5,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/5 via-transparent to-red-500/5 animate-pulse"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/bengkel-exterior.png')] bg-cover bg-center opacity-10"></div>
      </div>

      {/* Sound Control */}
      <button
        onClick={handleSoundToggle}
        className="fixed top-4 right-4 z-50 bg-gray-800/80 hover:bg-gray-700/80 text-white p-3 rounded-full transition-all duration-300 shadow-lg"
        title={soundEnabled ? "Matikan Suara" : "Nyalakan Suara"}
      >
        {soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
      </button>

      {/* Header */}
      <header
        className={`relative bg-black/90 backdrop-blur-sm text-center py-8 md:py-12 px-4 transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"}`}
      >
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-4 bg-yellow-400 text-black hover:bg-yellow-300 text-xs md:text-sm">
            ⭐ Bengkel Terpercaya Sejak 2005
          </Badge>
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
            Bengkel Motor Mas Djalal
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-gray-300 max-w-2xl mx-auto">
            Servis Motor Terbaik & Terpercaya di Semarang
          </p>
          <div className="flex justify-center items-center mt-6 space-x-4 md:space-x-6 text-yellow-400 flex-wrap">
            <div className="flex items-center mb-2 md:mb-0">
              <Star className="h-4 w-4 md:h-5 md:w-5 fill-current mr-1" />
              <span className="font-semibold text-sm md:text-base">4.9/5</span>
            </div>
            <div className="flex items-center mb-2 md:mb-0">
              <Clock className="h-4 w-4 md:h-5 md:w-5 mr-1" />
              <span className="text-sm md:text-base">Buka 08:00-17:00</span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-3 md:py-4">
          <div className="flex justify-center space-x-4 md:space-x-8 flex-wrap">
            {["galeri", "layanan", "testimoni", "booking", "lokasi"].map((item) => (
              <a
                key={item}
                href={`#${item}`}
                className="text-yellow-400 hover:text-yellow-300 font-bold px-2 md:px-4 py-2 rounded-lg hover:bg-yellow-400/10 transition-all duration-300 capitalize text-sm md:text-base"
                onMouseEnter={() => playEngineSound("idle")}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-12 md:py-20 px-4 overflow-hidden">
        <div className="max-w-6xl mx-auto text-center">
          <div className="bg-gradient-to-r from-yellow-400/90 to-orange-500/90 text-black rounded-2xl md:rounded-3xl p-8 md:p-12 shadow-2xl">
            <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold mb-4 md:mb-6">Perawatan Motor Harian Anda</h2>
            <p className="text-base md:text-lg lg:text-xl mb-6 md:mb-8 max-w-2xl mx-auto">
              Layanan servis ringan, tune-up, dan ganti oli dengan teknisi berpengalaman. Booking mudah via WhatsApp!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                asChild
                size="lg"
                className="bg-red-600 hover:bg-red-700 text-white px-6 md:px-8 py-3 md:py-4 text-base md:text-lg rounded-xl shadow-lg w-full sm:w-auto"
                onMouseEnter={() => playEngineSound("rev")}
              >
                <a href="https://wa.me/628993992095" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2 h-5 w-5 md:h-6 md:w-6" />
                  Booking via WhatsApp
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-2 border-black text-black hover:bg-black hover:text-white px-6 md:px-8 py-3 md:py-4 text-base md:text-lg rounded-xl w-full sm:w-auto"
              >
                <a href="#galeri">Lihat Galeri Kami</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Automotive Banner Section */}
      <section className="relative py-12 md:py-20 px-4 overflow-hidden bg-gradient-to-r from-gray-900 via-black to-gray-900">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Gear Animation */}
          <div className="absolute top-10 left-4 md:left-10 w-16 h-16 md:w-20 md:h-20 opacity-20">
            <div className="w-full h-full border-3 md:border-4 border-yellow-400 rounded-full animate-spin-slow relative">
              <div className="absolute inset-2 border-2 border-yellow-400 rounded-full">
                <div className="absolute inset-2 bg-yellow-400 rounded-full"></div>
              </div>
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1.5 h-4 md:w-2 md:h-6 bg-yellow-400 -top-2 md:-top-3 left-1/2 transform -translate-x-1/2 origin-bottom"
                  style={{ transform: `translateX(-50%) rotate(${i * 45}deg)` }}
                ></div>
              ))}
            </div>
          </div>

          {/* Multiple Gears */}
          <div className="absolute top-32 right-10 md:right-20 w-12 h-12 md:w-16 md:h-16 opacity-15">
            <div className="w-full h-full border-2 md:border-3 border-red-500 rounded-full animate-spin-reverse relative">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-3 md:w-1.5 md:h-4 bg-red-500 -top-1.5 md:-top-2 left-1/2 transform -translate-x-1/2 origin-bottom"
                  style={{ transform: `translateX(-50%) rotate(${i * 60}deg)` }}
                ></div>
              ))}
            </div>
          </div>

          <div className="absolute bottom-20 left-1/4 w-8 h-8 md:w-12 md:h-12 opacity-10">
            <div className="w-full h-full border-2 border-yellow-400 rounded-full animate-spin-slow"></div>
          </div>

          {/* Motorcycle Silhouette - Hidden on mobile */}
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 opacity-5 hidden md:block">
            <svg width="300" height="150" viewBox="0 0 300 150" className="text-yellow-400">
              <path
                fill="currentColor"
                d="M50 100c-15 0-25 10-25 25s10 25 25 25 25-10 25-25-10-25-25-25zm200 0c-15 0-25 10-25 25s10 25 25 25 25-10 25-25-10-25-25-25zM75 100h150M100 80h100l-20-20h-60l-20 20zM150 60v20M120 40h60v20h-60z"
              />
            </svg>
          </div>

          {/* Floating Particles */}
          <div className="absolute inset-0">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-yellow-400 rounded-full opacity-30 animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${3 + Math.random() * 2}s`,
                }}
              ></div>
            ))}
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center bg-gradient-to-r from-yellow-400/20 to-red-500/20 rounded-full px-4 md:px-6 py-2 mb-4 md:mb-6">
                <Wrench className="h-4 w-4 md:h-5 md:w-5 text-yellow-400 mr-2" />
                <span className="text-yellow-400 font-semibold text-sm md:text-base">
                  Teknisi Berpengalaman 15+ Tahun
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 md:mb-6">
                <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                  Solusi Terpercaya
                </span>
                <br />
                <span className="text-white">Untuk Motor Anda</span>
              </h2>

              <p className="text-lg md:text-xl text-gray-300 mb-6 md:mb-8 leading-relaxed">
                Dari servis rutin hingga perbaikan kompleks, kami siap menangani semua kebutuhan motor Anda dengan
                <span className="text-yellow-400 font-semibold"> teknologi modern</span> dan
                <span className="text-yellow-400 font-semibold"> harga terjangkau</span>.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-yellow-400 mb-1 md:mb-2">1000+</div>
                  <div className="text-gray-400 text-xs md:text-sm">Motor Diperbaiki</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-yellow-400 mb-1 md:mb-2">15+</div>
                  <div className="text-gray-400 text-xs md:text-sm">Tahun Pengalaman</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-yellow-400 mb-1 md:mb-2">4.9</div>
                  <div className="text-gray-400 text-xs md:text-sm">Rating Pelanggan</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold px-6 md:px-8 py-3 md:py-4 rounded-xl shadow-lg w-full sm:w-auto"
                  onMouseEnter={() => playEngineSound("rev")}
                >
                  <a href="#booking">
                    <MessageCircle className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                    Booking Sekarang
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black px-6 md:px-8 py-3 md:py-4 rounded-xl w-full sm:w-auto"
                >
                  <a href="tel:+628993992095">
                    <Phone className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                    Hubungi Kami
                  </a>
                </Button>
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative">
              {/* Main Visual Container */}
              <div className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl md:rounded-3xl p-6 md:p-8 backdrop-blur-sm border border-gray-700">
                {/* Service Icons Grid */}
                <div className="grid grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
                  <div
                    className="bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-xl md:rounded-2xl p-4 md:p-6 text-center hover:scale-105 transition-transform duration-300 cursor-pointer"
                    onMouseEnter={() => playEngineSound("idle")}
                  >
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                      <Wrench className="h-5 w-5 md:h-6 md:w-6 text-black" />
                    </div>
                    <h3 className="text-white font-bold mb-1 md:mb-2 text-sm md:text-base">Servis Terpercaya</h3>
                    <p className="text-gray-400 text-xs md:text-sm">Dipercaya lebih dari 500+ klien</p>
                  </div>

                  <div
                    className="bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-xl md:rounded-2xl p-4 md:p-6 text-center hover:scale-105 transition-transform duration-300 cursor-pointer"
                    onMouseEnter={() => playEngineSound("idle")}
                  >
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                      <CheckCircle className="h-5 w-5 md:h-6 md:w-6 text-white" />
                    </div>
                    <h3 className="text-white font-bold mb-1 md:mb-2 text-sm md:text-base">Harga Terbaik</h3>
                    <p className="text-gray-400 text-xs md:text-sm">Harga kompetitif</p>
                  </div>

                  <div
                    className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl md:rounded-2xl p-4 md:p-6 text-center hover:scale-105 transition-transform duration-300 cursor-pointer"
                    onMouseEnter={() => playEngineSound("idle")}
                  >
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                      <Star className="h-5 w-5 md:h-6 md:w-6 text-white" />
                    </div>
                    <h3 className="text-white font-bold mb-1 md:mb-2 text-sm md:text-base">Kualitas</h3>
                    <p className="text-gray-400 text-xs md:text-sm">Spare part ori</p>
                  </div>

                  <div
                    className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl md:rounded-2xl p-4 md:p-6 text-center hover:scale-105 transition-transform duration-300 cursor-pointer"
                    onMouseEnter={() => playEngineSound("idle")}
                  >
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                      <Clock className="h-5 w-5 md:h-6 md:w-6 text-white" />
                    </div>
                    <h3 className="text-white font-bold mb-1 md:mb-2 text-sm md:text-base">Buka 7 Hari</h3>
                    <p className="text-gray-400 text-xs md:text-sm">08:00 - 17:00</p>
                  </div>
                </div>

                {/* Bottom CTA */}
                <div className="bg-gradient-to-r from-yellow-400/10 to-red-500/10 rounded-xl md:rounded-2xl p-4 md:p-6 text-center border border-yellow-400/20">
                  <h4 className="text-lg md:text-xl font-bold text-white mb-2">Konsultasi Gratis!</h4>
                  <p className="text-gray-300 mb-3 md:mb-4 text-sm md:text-base">
                    Tanyakan kondisi motor Anda sebelum servis
                  </p>
                  <Badge className="bg-yellow-400 text-black hover:bg-yellow-300 cursor-pointer">
                    <MessageCircle className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                    Chat WhatsApp
                  </Badge>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-2 md:-top-4 -right-2 md:-right-4 w-6 h-6 md:w-8 md:h-8 bg-yellow-400 rounded-full animate-bounce"></div>
              <div
                className="absolute -bottom-2 md:-bottom-4 -left-2 md:-left-4 w-4 h-4 md:w-6 md:h-6 bg-red-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.5s" }}
              ></div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section id="layanan" className="py-12 md:py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8 md:mb-12 bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
            🔧 Layanan Kami
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {services.map((service, index) => (
              <Card
                key={index}
                className="bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 transition-all duration-300 hover:scale-105 cursor-pointer"
                onMouseEnter={() => playEngineSound("idle")}
              >
                <CardContent className="p-4 md:p-6 text-center">
                  <div className="text-yellow-400 mb-3 md:mb-4 flex justify-center">{service.icon}</div>
                  <h3 className="text-lg md:text-xl font-bold mb-2 text-white">{service.title}</h3>
                  <p className="text-gray-300 text-sm md:text-base">{service.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="galeri" className="py-12 md:py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8 md:mb-12 bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
            🖼️ Galeri Bengkel
          </h2>
          <Swiper
            modules={[Pagination, Autoplay, EffectCoverflow]}
            effect="coverflow"
            grabCursor={true}
            centeredSlides={true}
            slidesPerView="auto"
            coverflowEffect={{
              rotate: 50,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: true,
            }}
            pagination={{ clickable: true }}
            autoplay={{ delay: 4000 }}
            className="gallery-swiper"
            breakpoints={{
              320: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              640: {
                slidesPerView: "auto",
                spaceBetween: 30,
              },
            }}
          >
            {galleryImages.map((image, index) => (
              <SwiperSlide key={index} className="!w-72 md:!w-80 !h-80 md:!h-96">
                <Card className="h-full bg-gray-800/50 border-gray-700 overflow-hidden hover:scale-105 transition-transform duration-300">
                  <div className="relative h-48 md:h-64">
                    <img src={image.src || "/placeholder.svg"} alt={image.alt} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  </div>
                  <CardContent className="p-3 md:p-4">
                    <h3 className="text-base md:text-lg font-bold text-yellow-400 mb-1 md:mb-2">{image.title}</h3>
                    <p className="text-gray-300 text-xs md:text-sm">{image.description}</p>
                  </CardContent>
                </Card>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimoni" className="py-12 md:py-16 px-4 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8 md:mb-12 bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
            💬 Testimoni Pelanggan
          </h2>
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000 }}
            breakpoints={{
              640: { slidesPerView: 1, spaceBetween: 20 },
              768: { slidesPerView: 2, spaceBetween: 30 },
              1024: { slidesPerView: 3, spaceBetween: 30 },
            }}
            className="testimonial-swiper"
          >
            {testimonials.map((testimonial, index) => (
              <SwiperSlide key={index}>
                <Card className="bg-gray-800/50 border-gray-700 h-full">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex mb-3 md:mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 md:h-5 md:w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <blockquote className="text-base md:text-lg mb-3 md:mb-4 italic text-gray-300">
                      "{testimonial.text}"
                    </blockquote>
                    <div className="border-t border-gray-600 pt-3 md:pt-4">
                      <p className="text-yellow-400 font-semibold text-sm md:text-base">{testimonial.author}</p>
                      <p className="text-gray-400 text-xs md:text-sm">{testimonial.location}</p>
                    </div>
                  </CardContent>
                </Card>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* Booking Section */}
      <section id="booking" className="py-12 md:py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-gray-800/50 border-gray-700 shadow-2xl">
            <CardContent className="p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-6 md:mb-8 bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
                📅 Booking Jadwal Servis
              </h2>
              <p className="text-center mb-6 md:mb-8 text-gray-300 text-base md:text-lg">
                Isi formulir berikut dan kami akan menghubungi Anda via WhatsApp
              </p>
              <form onSubmit={sendToWhatsApp} className="space-y-4 md:space-y-6">
                <div>
                  <label htmlFor="nama" className="block text-sm font-medium text-gray-300 mb-2">
                    Nama Lengkap
                  </label>
                  <Input
                    type="text"
                    id="nama"
                    placeholder="Masukkan nama Anda"
                    value={formData.nama}
                    onChange={handleInputChange}
                    required
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 h-10 md:h-12"
                  />
                </div>
                <div>
                  <label htmlFor="motor" className="block text-sm font-medium text-gray-300 mb-2">
                    Jenis Motor
                  </label>
                  <Input
                    type="text"
                    id="motor"
                    placeholder="Contoh: Honda Beat, Yamaha Mio, dll"
                    value={formData.motor}
                    onChange={handleInputChange}
                    required
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 h-10 md:h-12"
                  />
                </div>
                <div>
                  <label htmlFor="keluhan" className="block text-sm font-medium text-gray-300 mb-2">
                    Keluhan / Jenis Servis
                  </label>
                  <Input
                    type="text"
                    id="keluhan"
                    placeholder="Contoh: Ganti oli, tune-up, servis rem, dll"
                    value={formData.keluhan}
                    onChange={handleInputChange}
                    required
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 h-10 md:h-12"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-3 md:py-4 text-base md:text-lg rounded-xl shadow-lg"
                >
                  <MessageCircle className="mr-2 h-5 w-5 md:h-6 md:w-6" />
                  Kirim via WhatsApp
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Location Section */}
      <section id="lokasi" className="py-12 md:py-16 px-4 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8 md:mb-12 bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
            📍 Lokasi Bengkel
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-6 md:p-8">
                <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-yellow-400">Informasi Lokasi</h3>
                <div className="space-y-3 md:space-y-4">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 md:h-6 md:w-6 text-red-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-base md:text-lg font-semibold text-white">Alamat Lengkap</p>
                      <p className="text-gray-300 text-sm md:text-base">
                        Jl. Ngaglik Baru No.09, Bendungan, Gajahmungkur, Semarang
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 md:h-6 md:w-6 text-yellow-400 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-base md:text-lg font-semibold text-white">Jam Operasional</p>
                      <p className="text-gray-300 text-sm md:text-base">Senin - Sabtu: 08:00 - 17:00</p>
                      <p className="text-gray-300 text-sm md:text-base">Minggu: 08:00 - 15:00</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 md:h-6 md:w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-base md:text-lg font-semibold text-white">Kontak</p>
                      <a
                        href="https://wa.me/628993992095"
                        className="text-yellow-400 hover:text-yellow-300 text-sm md:text-base"
                      >
                        +62 899-3992-095
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gray-800/50 border-gray-700 overflow-hidden">
              <CardContent className="p-0">
                <iframe
                  src="https://www.google.com/maps?q=Jl.+Ngaglik+Baru+No.09,+Bendungan,+Semarang&output=embed"
                  height="300"
                  width="100%"
                  allowFullScreen
                  className="border-0 rounded-lg md:h-96"
                  title="Lokasi Bengkel Motor Mas Djalal"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/90 text-center py-8 md:py-12 px-4 border-t border-gray-700">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 md:mb-8">
            <h3 className="text-xl md:text-2xl font-bold text-yellow-400 mb-3 md:mb-4">Bengkel Motor Mas Djalal</h3>
            <p className="text-gray-300 mb-4 md:mb-6 text-sm md:text-base">
              Servis Motor Terbaik & Terpercaya di Semarang
            </p>
            <div className="flex justify-center items-center space-x-6 md:space-x-8 text-base md:text-lg">
              <a href="https://wa.me/628993992095" className="text-yellow-400 hover:text-yellow-300 flex items-center">
                <Phone className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                +62 899-3992-095
              </a>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-6 md:pt-8">
            <p className="text-gray-400 text-sm md:text-base">
              &copy; 2025 Bengkel Motor Mas Djalal. Semua hak dilindungi.
            </p>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/628993992095"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full w-12 h-12 md:w-16 md:h-16 flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 z-50 animate-pulse"
        title="Chat via WhatsApp"
        onMouseEnter={() => playEngineSound("rev")}
      >
        <MessageCircle className="h-6 w-6 md:h-8 md:w-8" />
      </a>
    </div>
  )
}
