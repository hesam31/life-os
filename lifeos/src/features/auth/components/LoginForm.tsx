'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginInput } from '../schemas/auth.schemas'
import { useAuth } from '../hooks/useAuth'

function BranchCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    type BranchType = {
      x: number; y: number; angle: number
      targetLen: number; currentLen: number
      depth: number; width: number
      color: string; speed: number; delay: number
      grown: boolean
      children: BranchType[]
    }

    const branches: BranchType[] = []

    function endX(b: BranchType) { return b.x + Math.cos(b.angle) * b.currentLen }
    function endY(b: BranchType) { return b.y + Math.sin(b.angle) * b.currentLen }

    function makeBranch(x: number, y: number, angle: number, len: number, depth: number, delay = 0): BranchType {
      return {
        x, y, angle, targetLen: len, currentLen: 0,
        depth, width: Math.max(0.4, depth * 0.55),
        color: `rgba(${55 + depth * 7},${85 + depth * 6},${25 + depth * 4},${0.25 + depth * 0.04})`,
        speed: 0.7 + Math.random() * 0.5,
        delay, grown: false, children: []
      }
    }

    function growBranch(b: BranchType) {
      if (b.delay > 0) { b.delay--; return }
      if (b.currentLen < b.targetLen) {
        b.currentLen += b.speed
      } else if (!b.grown) {
        b.grown = true
        if (b.depth > 1) {
          const spread = 0.28 + Math.random() * 0.38
          const c1 = makeBranch(endX(b), endY(b), b.angle - spread, b.targetLen * (0.58 + Math.random() * 0.2), b.depth - 1, 8)
          const c2 = makeBranch(endX(b), endY(b), b.angle + spread * 0.7, b.targetLen * (0.52 + Math.random() * 0.2), b.depth - 1, 20)
          b.children.push(c1, c2)
          branches.push(c1, c2)
        }
      }
      b.children.forEach(growBranch)
    }

    function drawBranch(b: BranchType) {
      if (b.currentLen < 1) return
      ctx.beginPath()
      ctx.moveTo(b.x, b.y)
      ctx.lineTo(endX(b), endY(b))
      ctx.strokeStyle = b.color
      ctx.lineWidth = b.width
      ctx.lineCap = 'round'
      ctx.stroke()
      if (b.depth === 1 && b.currentLen > b.targetLen * 0.8) {
        ctx.beginPath()
        ctx.ellipse(endX(b), endY(b), 3.5, 5.5, b.angle, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(74,120,42,0.22)'
        ctx.fill()
      }
      b.children.forEach(drawBranch)
    }

    const w = canvas.width, h = canvas.height
    const corners = [
      { x: 0,   y: h, angle: -Math.PI / 4.5 },
      { x: w,   y: h, angle: -Math.PI + Math.PI / 4.5 },
      { x: 0,   y: 0, angle: Math.PI / 4.5 },
      { x: w,   y: 0, angle: Math.PI - Math.PI / 4.5 },
    ]
    corners.forEach(c => {
      const root = makeBranch(c.x, c.y, c.angle, 75 + Math.random() * 30, 6)
      branches.push(root)
    })

    let raf: number
    function loop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      branches.forEach(b => { growBranch(b); drawBranch(b) })
      raf = requestAnimationFrame(loop)
    }
    loop()

    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}
    />
  )
}

export function LoginForm() {
  const { signIn } = useAuth()
  const [loading, setLoading] = useState(false)
  const [hovered, setHovered] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (data: LoginInput) => {
    setLoading(true)
    await signIn(data.email, data.password)
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh', width: '100%',
      background: '#1a1208',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden', fontFamily: "'Georgia', serif"
    }}>
      <BranchCanvas />

      <div style={{
        position: 'relative', zIndex: 10,
        background: 'rgba(26,18,8,0.78)',
        border: '1px solid rgba(139,115,71,0.28)',
        borderRadius: '20px',
        padding: '48px 40px',
        width: '100%', maxWidth: '400px',
        backdropFilter: 'blur(14px)',
        boxShadow: '0 0 80px rgba(0,0,0,0.55)',
        animation: 'fadeUp 0.7s ease both'
      }}>
        <style>{`
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(18px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes leafSpread {
            from { transform: translateX(-50%) scale(0); opacity: 0; }
            to   { transform: translateX(-50%) scale(1); opacity: 1; }
          }
          .sedora-input {
            width: 100%;
            background: rgba(255,255,255,0.04);
            border: 1px solid rgba(139,115,71,0.22);
            border-radius: 10px;
            padding: 12px 16px;
            color: #d4b483;
            font-size: 14px;
            font-family: Georgia, serif;
            outline: none;
            transition: border-color 0.3s, background 0.3s;
            box-sizing: border-box;
          }
          .sedora-input:focus {
            border-color: rgba(139,115,71,0.6);
            background: rgba(255,255,255,0.07);
          }
          .sedora-input::placeholder { color: rgba(122,106,74,0.45); }
        `}</style>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ fontSize: '30px', marginBottom: '8px' }}>🌿</div>
          <h1 style={{ fontSize: '24px', fontWeight: 400, color: '#d4b483', letterSpacing: '3px', margin: 0 }}>
            Sedora Life
          </h1>
          <p style={{ fontSize: '10px', color: '#6a5c3a', letterSpacing: '3.5px', textTransform: 'uppercase', marginTop: '6px' }}>
            grow through it
          </p>
        </div>

        <div style={{ width: '36px', height: '1px', background: 'rgba(139,115,71,0.35)', margin: '0 auto 28px' }} />

        {/* Fields */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '10px', color: '#6a5c3a', letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: '8px' }}>
              Email
            </label>
            <input className="sedora-input" type="email" placeholder="you@example.com" {...register('email')} />
            {errors.email && <p style={{ color: '#c17a4a', fontSize: '11px', marginTop: '4px' }}>{errors.email.message}</p>}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '10px', color: '#6a5c3a', letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: '8px' }}>
              Password
            </label>
            <input className="sedora-input" type="password" placeholder="••••••••" {...register('password')} />
            {errors.password && <p style={{ color: '#c17a4a', fontSize: '11px', marginTop: '4px' }}>{errors.password.message}</p>}
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
              width: '100%', padding: '13px',
              background: 'transparent',
              border: `1px solid rgba(139,115,71,${hovered ? 0.85 : 0.4})`,
              borderRadius: '10px',
              color: '#d4b483',
              fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'Georgia, serif',
              position: 'relative', overflow: 'hidden',
              transition: 'border-color 0.3s',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {hovered && (
              <span style={{
                position: 'absolute', bottom: '-60px', left: '50%',
                width: '160px', height: '160px', marginLeft: '-80px',
                background: 'rgba(74,120,42,0.12)',
                borderRadius: '50%',
                animation: 'leafSpread 0.4s ease both',
                pointerEvents: 'none',
              }} />
            )}
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
          <Link href="/reset-password" style={{ fontSize: '11px', color: '#5a4e35', textDecoration: 'none', letterSpacing: '1px' }}>
            Forgot password?
          </Link>
          <Link href="/signup" style={{ fontSize: '11px', color: '#8b7343', textDecoration: 'none', letterSpacing: '1px' }}>
            Create account →
          </Link>
        </div>

        <p style={{ textAlign: 'center', fontSize: '10px', color: '#3a3020', letterSpacing: '1px', marginTop: '28px', fontStyle: 'italic' }}>
          Like the Sedora — resilient in every season
        </p>
      </div>
    </div>
  )
}