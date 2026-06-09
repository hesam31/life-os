'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginInput } from '../schemas/auth.schemas'
import { useAuth } from '../hooks/useAuth'

function SedoraCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let W = window.innerWidth, H = window.innerHeight
    canvas.width = W; canvas.height = H
    window.addEventListener('resize', () => {
      W = window.innerWidth; H = window.innerHeight
      canvas.width = W; canvas.height = H
    })

    // ── Particles (soil dust) ─────────────────────────────────
    const particles: { x:number;y:number;vx:number;vy:number;r:number;a:number;da:number }[] = []
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: W/2 + (Math.random()-0.5)*200,
        y: H*0.72 + (Math.random()-0.5)*40,
        vx: (Math.random()-0.5)*0.3,
        vy: -Math.random()*0.15,
        r: Math.random()*2+0.5,
        a: Math.random(),
        da: (Math.random()-0.5)*0.003
      })
    }

    // ── Branch system ─────────────────────────────────────────
    type Seg = { x1:number;y1:number;x2:number;y2:number;w:number;prog:number;speed:number;children:Seg[];done:boolean;delay:number;age:number }
    const allSegs: Seg[] = []

    function makeSeg(x1:number,y1:number,angle:number,len:number,w:number,delay:number): Seg {
      return {
        x1,y1,
        x2: x1+Math.cos(angle)*len,
        y2: y1+Math.sin(angle)*len,
        w, prog:0, speed:0.012+Math.random()*0.008,
        children:[], done:false, delay, age:0
      }
    }

    function spawnChildren(s:Seg, depth:number) {
      if (depth <= 0) return
      const ex = s.x1+(s.x2-s.x1)
      const ey = s.y1+(s.y2-s.y1)
      const baseAngle = Math.atan2(s.y2-s.y1, s.x2-s.x1)
      const spread = 0.32+Math.random()*0.28
      const len = Math.hypot(s.x2-s.x1,s.y2-s.y1)*(0.58+Math.random()*0.18)
      const nw = s.w*0.62
      if (nw < 0.3) return
      const c1 = makeSeg(ex,ey,baseAngle-spread,len,nw, 0)
      const c2 = makeSeg(ex,ey,baseAngle+spread*0.8,len*0.9,nw*0.9, 15)
      s.children.push(c1,c2)
      allSegs.push(c1,c2)
      c1.done=false; c2.done=false
      setTimeout(()=>{ spawnChildren(c1,depth-1) }, 900+Math.random()*400)
      setTimeout(()=>{ spawnChildren(c2,depth-1) }, 1200+Math.random()*400)
    }

    // trunk
    const trunk = makeSeg(W/2, H*0.68, -Math.PI/2, H*0.22, 7, 0)
    allSegs.push(trunk)
    setTimeout(()=>spawnChildren(trunk, 7), 1400)

    // ── Leaves ────────────────────────────────────────────────
    type Leaf = {x:number;y:number;size:number;angle:number;opacity:number;grow:number;sway:number;swaySpeed:number}
    const leaves: Leaf[] = []
    function addLeaf(x:number,y:number) {
      leaves.push({ x,y, size:0, angle:Math.random()*Math.PI*2, opacity:0, grow:0.12+Math.random()*0.08, sway:0, swaySpeed:(Math.random()-0.5)*0.02 })
    }

    let frame = 0
    let raf: number

    function drawStone(cx:number,cy:number) {
      // main stone
      ctx.save()
      ctx.beginPath()
      ctx.ellipse(cx, cy+18, 72, 38, 0, 0, Math.PI*2)
      const sg = ctx.createRadialGradient(cx-10,cy,5,cx,cy+18,72)
      sg.addColorStop(0,'#5a4e3c')
      sg.addColorStop(0.5,'#3d3328')
      sg.addColorStop(1,'#1e1810')
      ctx.fillStyle = sg
      ctx.fill()
      // stone texture lines
      ctx.strokeStyle='rgba(255,255,255,0.04)'
      ctx.lineWidth=1
      for(let i=0;i<5;i++){
        ctx.beginPath()
        ctx.ellipse(cx+(Math.random()-0.5)*10, cy+14+i*4, 60-i*8, 8-i, -0.1+Math.random()*0.2, 0, Math.PI)
        ctx.stroke()
      }
      // crack
      ctx.beginPath()
      ctx.moveTo(cx-4,cy-8)
      ctx.bezierCurveTo(cx+2,cy+2,cx-2,cy+10,cx+3,cy+20)
      ctx.strokeStyle='rgba(0,0,0,0.35)'
      ctx.lineWidth=1.5
      ctx.stroke()
      // moss on stone
      for(let i=0;i<8;i++){
        const mx=cx-55+i*14+Math.random()*6
        const my=cy+10+Math.random()*8
        ctx.beginPath()
        ctx.ellipse(mx,my,4+Math.random()*3,2+Math.random()*2,Math.random(),0,Math.PI*2)
        ctx.fillStyle=`rgba(62,90,35,${0.3+Math.random()*0.3})`
        ctx.fill()
      }
      // soil/ground
      const gg = ctx.createLinearGradient(cx-80,cy+50,cx+80,cy+70)
      gg.addColorStop(0,'rgba(42,32,18,0)')
      gg.addColorStop(0.5,'rgba(42,32,18,0.9)')
      gg.addColorStop(1,'rgba(42,32,18,0)')
      ctx.beginPath()
      ctx.ellipse(cx,cy+52,80,18,0,0,Math.PI*2)
      ctx.fillStyle=gg
      ctx.fill()
      ctx.restore()
    }

    function drawSeg(s:Seg, t:number) {
      if(s.delay>0){s.delay--;return}
      if(s.prog < 1) s.prog = Math.min(1, s.prog+s.speed)
      s.age++
      const px = s.x1+(s.x2-s.x1)*s.prog
      const py = s.y1+(s.y2-s.y1)*s.prog
      ctx.beginPath()
      ctx.moveTo(s.x1,s.y1)
      ctx.lineTo(px,py)
      const age01 = Math.min(s.age/120,1)
      const green = Math.floor(55+age01*35)
      ctx.strokeStyle=`rgba(${30+s.w*3},${green+s.w*4},${15+s.w*2},${0.7+s.w*0.04})`
      ctx.lineWidth=s.w
      ctx.lineCap='round'
      ctx.stroke()
      if(s.prog>=1 && !s.done){
        s.done=true
        if(s.w<1.5 && Math.random()>0.4) addLeaf(s.x2,s.y2)
      }
      s.children.forEach(c=>drawSeg(c,t))
    }

    function drawLeaf(l:Leaf) {
      l.sway += l.swaySpeed
      if(l.size < 7) l.size += l.grow
      l.opacity = Math.min(1, l.opacity+0.02)
      ctx.save()
      ctx.translate(l.x,l.y)
      ctx.rotate(l.angle+Math.sin(l.sway)*0.15)
      ctx.beginPath()
      ctx.moveTo(0,0)
      ctx.bezierCurveTo(l.size*0.5,-l.size*1.2,l.size*1.2,-l.size*0.5,l.size*1.4,0)
      ctx.bezierCurveTo(l.size*1.2,l.size*0.5,l.size*0.5,l.size*1.2,0,0)
      const lg = ctx.createRadialGradient(0,0,0,0,0,l.size*1.4)
      lg.addColorStop(0,`rgba(120,180,60,${l.opacity*0.9})`)
      lg.addColorStop(0.6,`rgba(72,130,30,${l.opacity*0.8})`)
      lg.addColorStop(1,`rgba(40,85,15,${l.opacity*0.5})`)
      ctx.fillStyle=lg
      ctx.fill()
      ctx.restore()
    }

    function loop() {
      ctx.clearRect(0,0,W,H)

      // bg gradient
      const bg = ctx.createRadialGradient(W/2,H*0.5,50,W/2,H*0.5,H)
      bg.addColorStop(0,'#1c1408')
      bg.addColorStop(0.5,'#120e06')
      bg.addColorStop(1,'#0a0804')
      ctx.fillStyle=bg
      ctx.fillRect(0,0,W,H)

      // ambient glow around plant
      const glow = ctx.createRadialGradient(W/2,H*0.45,0,W/2,H*0.45,H*0.35)
      glow.addColorStop(0,'rgba(60,100,20,0.07)')
      glow.addColorStop(1,'rgba(0,0,0,0)')
      ctx.fillStyle=glow
      ctx.fillRect(0,0,W,H)

      // particles
      particles.forEach(p=>{
        p.x+=p.vx; p.y+=p.vy; p.a+=p.da
        if(p.a<=0)p.a=0; if(p.a>=0.6)p.da*=-1
        ctx.beginPath()
        ctx.arc(p.x,p.y,p.r,0,Math.PI*2)
        ctx.fillStyle=`rgba(180,150,90,${p.a*0.4})`
        ctx.fill()
      })

      drawStone(W/2, H*0.72)
      allSegs.filter(s=>!s.children.length||s===trunk).forEach(s=>{
        if(allSegs.indexOf(s)===0) drawSeg(s, frame)
      })
      // draw all segs
      allSegs.forEach(s=>{ if(s!==trunk) drawSeg(s,frame) })
      drawSeg(trunk, frame)
      leaves.forEach(drawLeaf)

      frame++
      raf=requestAnimationFrame(loop)
    }
    loop()
    return ()=>cancelAnimationFrame(raf)
  },[])

  return <canvas ref={canvasRef} style={{position:'fixed',top:0,left:0,width:'100%',height:'100%',pointerEvents:'none',zIndex:0}}/>
}

export function LoginForm() {
  const { signIn } = useAuth()
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState:{errors} } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (d: LoginInput) => {
    setLoading(true)
    await signIn(d.email, d.password)
    setLoading(false)
  }

  return (
    <div style={{minHeight:'100vh',background:'#0a0804',display:'flex',alignItems:'center',justifyContent:'center',position:'relative',overflow:'hidden',fontFamily:"'Georgia',serif"}}>
      <SedoraCanvas/>
      <style>{`
        @keyframes riseIn{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        .s-input{width:100%;background:rgba(255,255,255,0.04);border:1px solid rgba(160,130,70,0.2);border-radius:10px;padding:11px 15px;color:#c8a96e;font-size:14px;font-family:Georgia,serif;outline:none;transition:border-color .3s,background .3s;box-sizing:border-box}
        .s-input:focus{border-color:rgba(160,130,70,0.55);background:rgba(255,255,255,0.07)}
        .s-input::placeholder{color:rgba(140,110,60,0.4)}
        .s-btn{width:100%;padding:13px;background:transparent;border:1px solid rgba(160,130,70,0.35);border-radius:10px;color:#c8a96e;font-size:10px;letter-spacing:3.5px;text-transform:uppercase;cursor:pointer;font-family:Georgia,serif;transition:border-color .3s,background .3s}
        .s-btn:hover{border-color:rgba(100,160,50,0.6);background:rgba(60,100,20,0.12)}
        .s-btn:disabled{opacity:0.5;cursor:not-allowed}
      `}</style>

      <div style={{position:'relative',zIndex:10,width:'100%',maxWidth:'380px',padding:'44px 36px',background:'rgba(12,9,4,0.82)',border:'1px solid rgba(160,130,70,0.18)',borderRadius:'18px',backdropFilter:'blur(16px)',animation:'riseIn .8s ease both',boxShadow:'0 8px 60px rgba(0,0,0,0.7)'}}>

        <div style={{textAlign:'center',marginBottom:'28px'}}>
          <p style={{fontSize:'9px',color:'rgba(140,110,60,0.6)',letterSpacing:'5px',textTransform:'uppercase',marginBottom:'10px'}}>
            Est. in hardship
          </p>
          <h1 style={{fontSize:'26px',fontWeight:400,color:'#c8a96e',letterSpacing:'4px',margin:'0 0 6px'}}>
            Sedora Life
          </h1>
          <p style={{fontSize:'10px',color:'rgba(120,95,50,0.7)',letterSpacing:'2px',fontStyle:'italic',margin:0}}>
            grow through it
          </p>
        </div>

        <div style={{width:'30px',height:'1px',background:'rgba(160,130,70,0.25)',margin:'0 auto 26px'}}/>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{marginBottom:'13px'}}>
            <label style={{display:'block',fontSize:'9px',color:'rgba(140,110,60,0.7)',letterSpacing:'3px',textTransform:'uppercase',marginBottom:'7px'}}>Email</label>
            <input className="s-input" type="email" placeholder="you@example.com" {...register('email')}/>
            {errors.email && <p style={{color:'#b07040',fontSize:'11px',marginTop:'4px'}}>{errors.email.message}</p>}
          </div>
          <div style={{marginBottom:'20px'}}>
            <label style={{display:'block',fontSize:'9px',color:'rgba(140,110,60,0.7)',letterSpacing:'3px',textTransform:'uppercase',marginBottom:'7px'}}>Password</label>
            <input className="s-input" type="password" placeholder="••••••••" {...register('password')}/>
            {errors.password && <p style={{color:'#b07040',fontSize:'11px',marginTop:'4px'}}>{errors.password.message}</p>}
          </div>
          <button className="s-btn" type="submit" disabled={loading}>
            {loading ? 'entering...' : 'enter'}
          </button>
        </form>

        <div style={{display:'flex',justifyContent:'space-between',marginTop:'16px'}}>
          <Link href="/reset-password" style={{fontSize:'10px',color:'rgba(120,95,50,0.6)',textDecoration:'none',letterSpacing:'1px'}}>forgot?</Link>
          <Link href="/signup" style={{fontSize:'10px',color:'rgba(140,110,60,0.8)',textDecoration:'none',letterSpacing:'1px'}}>create account →</Link>
        </div>

        <p style={{textAlign:'center',fontSize:'9px',color:'rgba(80,65,35,0.5)',letterSpacing:'1.5px',marginTop:'26px',fontStyle:'italic'}}>
          like the sedora — resilient in every season
        </p>
      </div>
    </div>
  )
}
