'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

const BG_IMAGE_1 = 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260609_195923_b0ba8ace-1d1d-4f2c-9a28-1ab84b330680.png&w=1280&q=85'
const BG_IMAGE_2 = 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260609_201152_bba90a12-bf12-459f-91f0-51f237dbaf3b.png&w=1280&q=85'
const SPOTLIGHT_R = 260

function RevealLayer({ image, cursorX, cursorY }: { image: string; cursorX: number; cursorY: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const revealRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    const onResize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const reveal = revealRef.current
    if (!canvas || !reveal) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    const grad = ctx.createRadialGradient(cursorX, cursorY, 0, cursorX, cursorY, SPOTLIGHT_R)
    grad.addColorStop(0, 'rgba(255,255,255,1)')
    grad.addColorStop(0.4, 'rgba(255,255,255,1)')
    grad.addColorStop(0.6, 'rgba(255,255,255,0.75)')
    grad.addColorStop(0.75, 'rgba(255,255,255,0.4)')
    grad.addColorStop(0.88, 'rgba(255,255,255,0.12)')
    grad.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.arc(cursorX, cursorY, SPOTLIGHT_R, 0, Math.PI * 2)
    ctx.fill()
    const url = canvas.toDataURL()
    reveal.style.maskImage = `url(${url})`
    reveal.style.webkitMaskImage = `url(${url})`
    reveal.style.maskSize = '100% 100%'
    reveal.style.webkitMaskSize = '100% 100%'
  }, [cursorX, cursorY])

  return (
    <>
      <canvas ref={canvasRef} style={{ display: 'none', position: 'absolute', inset: 0, pointerEvents: 'none' }} />
      <div ref={revealRef} className="absolute inset-0 bg-center bg-cover bg-no-repeat pointer-events-none" style={{ zIndex: 30, backgroundImage: `url(${image})` }} />
    </>
  )
}

export default function SedoraLanding() {
  const mouseRef = useRef({ x: -999, y: -999 })
  const smoothRef = useRef({ x: -999, y: -999 })
  const rafRef = useRef(0)
  const [cursorPos, setCursorPos] = useState({ x: -999, y: -999 })
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onMove = (e: MouseEvent) => { mouseRef.current = { x: e.clientX, y: e.clientY } }
    window.addEventListener('mousemove', onMove)
    const tick = () => {
      smoothRef.current.x += (mouseRef.current.x - smoothRef.current.x) * 0.1
      smoothRef.current.y += (mouseRef.current.y - smoothRef.current.y) * 0.1
      setCursorPos({ x: smoothRef.current.x, y: smoothRef.current.y })
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(rafRef.current) }
  }, [])

  const navLinks = ['Purpose', 'The Method', 'Growth', 'Begin']

  return (
    <div className="min-h-screen bg-black" style={{ fontFamily: "'Inter',sans-serif", letterSpacing: '-0.02em' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@1,400;1,500;1,600&display=swap');
        .font-playfair { font-family: 'Playfair Display', serif; }
        @keyframes heroReveal { 0%{opacity:0;transform:translateY(28px);filter:blur(12px)} 100%{opacity:1;transform:translateY(0);filter:blur(0)} }
        @keyframes heroFadeUp { 0%{opacity:0;transform:translateY(20px)} 100%{opacity:1;transform:translateY(0)} }
        @keyframes heroZoom { 0%{transform:scale(1.12)} 100%{transform:scale(1)} }
        .hero-anim { opacity:0; animation-fill-mode:forwards; animation-timing-function:cubic-bezier(0.16,1,0.3,1); }
        .hero-reveal { animation-name:heroReveal; animation-duration:1.1s; }
        .hero-fade { animation-name:heroFadeUp; animation-duration:1s; }
        .hero-zoom { animation:heroZoom 1.8s cubic-bezier(0.16,1,0.3,1) forwards; }
        @media (prefers-reduced-motion:reduce){ .hero-anim,.hero-zoom{ animation:none; opacity:1; } }
      `}</style>

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between p-4 sm:p-5">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 12l4 4 6-6 6 6 4-4L12 2z" fill="rgba(160,220,100,0.9)" />
            <path d="M6 16l6 6 6-6" stroke="rgba(160,220,100,0.6)" strokeWidth="1.5" fill="none" />
          </svg>
          <span className="font-playfair italic text-white text-xl" style={{ letterSpacing: '0.02em' }}>Sedora</span>
        </div>

        {/* Center pill */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-1 rounded-full px-2 py-2 border" style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', borderColor: 'rgba(255,255,255,0.25)' }}>
          {navLinks.map((l, i) => (
            <button key={l} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${i === 0 ? 'bg-white text-gray-900' : 'text-white/80 hover:bg-white/20 hover:text-white'}`}>{l}</button>
          ))}
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <Link href="/login" className="hidden md:block bg-white text-gray-900 text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-gray-100 transition-colors" style={{ textDecoration: 'none' }}>
            Enter App
          </Link>
          <button className="md:hidden w-9 h-9 flex items-center justify-center rounded-full border border-white/30 text-white" style={{ background: 'rgba(255,255,255,0.15)' }} onClick={() => setMenuOpen(v => !v)}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-[90] flex flex-col pt-20 px-6 gap-4" style={{ background: 'rgba(5,12,4,0.97)', backdropFilter: 'blur(20px)' }}>
          {navLinks.map(l => <button key={l} className="text-2xl font-semibold text-white/90 py-4 border-b text-left" style={{ borderColor: 'rgba(255,255,255,0.1)' }} onClick={() => setMenuOpen(false)}>{l}</button>)}
          <Link href="/signup" className="mt-4 text-center bg-white text-gray-900 text-sm font-semibold px-6 py-3 rounded-full" style={{ textDecoration: 'none' }} onClick={() => setMenuOpen(false)}>Begin Growing</Link>
        </div>
      )}

      {/* Hero */}
      <section className="relative w-full overflow-hidden" style={{ height: '100dvh' }}>

        {/* Base image */}
        <div className="hero-zoom absolute inset-0 bg-center bg-cover bg-no-repeat" style={{ zIndex: 10, backgroundImage: `url(${BG_IMAGE_1})` }} />

        {/* Dark overlay */}
        <div className="absolute inset-0" style={{ zIndex: 20, background: 'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.5) 100%)' }} />

        {/* Reveal spotlight */}
        <RevealLayer image={BG_IMAGE_2} cursorX={cursorPos.x} cursorY={cursorPos.y} />

        {/* Heading */}
        <div className="absolute top-[14%] left-0 right-0 flex flex-col items-center text-center px-5 pointer-events-none" style={{ zIndex: 50 }}>
          <h1 className="text-white leading-[0.95]">
            <span className="hero-anim hero-reveal block font-playfair italic font-normal text-5xl sm:text-7xl md:text-8xl" style={{ letterSpacing: '-0.05em', animationDelay: '0.25s' }}>
              Grown through
            </span>
            <span className="hero-anim hero-reveal block font-normal text-5xl sm:text-7xl md:text-8xl -mt-1" style={{ letterSpacing: '-0.08em', animationDelay: '0.42s' }}>
              every storm
            </span>
          </h1>
        </div>

        {/* Bottom-left */}
        <div className="hidden sm:block absolute bottom-14 left-10 md:left-14 max-w-[260px]" style={{ zIndex: 50 }}>
          <div className="hero-anim hero-fade" style={{ animationDelay: '0.7s' }}>
            <p className="text-sm text-white/80 leading-relaxed" style={{ fontFamily: "'Inter',sans-serif" }}>
              Like the Sedora — a rare plant that grows through stone and drought — your life can flourish in the harshest conditions. This is your system for doing that.
            </p>
          </div>
        </div>

        {/* Bottom-right */}
        <div className="absolute bottom-10 sm:bottom-24 left-5 right-5 sm:left-auto sm:right-10 md:right-14 max-w-full sm:max-w-[260px] flex flex-col items-start gap-4 sm:gap-5" style={{ zIndex: 50 }}>
          <div className="hero-anim hero-fade" style={{ animationDelay: '0.85s' }}>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed" style={{ fontFamily: "'Inter',sans-serif" }}>
              Track your habits, set your goals, and build momentum — one day at a time. Sedora Life is your personal operating system for intentional growth.
            </p>
            <div className="mt-5 flex items-center gap-3 flex-wrap">
              <Link href="/signup" className="text-white text-sm font-medium px-7 py-3 rounded-full transition-all hover:scale-[1.03] active:scale-95" style={{ background: '#3a8c28', textDecoration: 'none', boxShadow: '0 4px 20px rgba(58,140,40,0.35)' }}>
                Start Growing
              </Link>
              <Link href="/login" className="text-white/80 text-sm font-medium hover:text-white transition-colors" style={{ textDecoration: 'none' }}>
                Sign in →
              </Link>
            </div>
          </div>
        </div>

      </section>
    </div>
  )
}
