'use client'
import { useEffect, useRef, useState } from 'react'

const SECTIONS = [
  {
    id: 0,
    title: 'In the deepest dark',
    sub: 'A stone sits in silence. Unmoved. Unbroken.',
    progress: 0,
  },
  {
    id: 1,
    title: 'The first crack',
    sub: 'Pressure builds. Something stirs beneath the surface.',
    progress: 0.25,
  },
  {
    id: 2,
    title: 'A single sprout',
    sub: 'Against all odds — life finds its way.',
    progress: 0.5,
  },
  {
    id: 3,
    title: 'Growth',
    sub: 'Root by root. Leaf by leaf. Day by day.',
    progress: 0.75,
  },
  {
    id: 4,
    title: 'The tree stands',
    sub: 'What once was stone is now a forest.',
    progress: 1,
  },
]

function lerp(a: number, b: number, t: number) { return a + (b - a) * t }
function clamp(v: number, min: number, max: number) { return Math.max(min, Math.min(max, v)) }
function easeInOut(t: number) { return t < 0.5 ? 2*t*t : -1+(4-2*t)*t }

export default function SedoraLanding() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const scrollRef = useRef(0)
  const targetScrollRef = useRef(0)
  const frameRef = useRef(0)
  const [activeSection, setActiveSection] = useState(0)
  const [textOpacity, setTextOpacity] = useState(1)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let W = window.innerWidth, H = window.innerHeight
    const resize = () => {
      W = window.innerWidth; H = window.innerHeight
      canvas.width = W; canvas.height = H
    }
    resize()
    window.addEventListener('resize', resize)

    // ── Particles ─────────────────────────────────────────────
    const particles: {x:number;y:number;vx:number;vy:number;r:number;a:number;hue:number}[] = []
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random()*1000, y: Math.random()*800,
        vx: (Math.random()-0.5)*0.2, vy: -Math.random()*0.3-0.1,
        r: Math.random()*1.5+0.3,
        a: Math.random()*0.5,
        hue: 100+Math.random()*40
      })
    }

    // ── Branch system ─────────────────────────────────────────
    type Seg = {
      x1:number;y1:number;x2:number;y2:number
      w:number;prog:number;done:boolean
      children:Seg[];delay:number;age:number
      leafed:boolean
    }
    const allSegs:Seg[] = []
    const leaves:{x:number;y:number;size:number;angle:number;opacity:number;sway:number}[] = []

    function makeSeg(x1:number,y1:number,angle:number,len:number,w:number,delay=0):Seg {
      return { x1,y1,x2:x1+Math.cos(angle)*len,y2:y1+Math.sin(angle)*len,
        w,prog:0,done:false,children:[],delay,age:0,leafed:false }
    }

    function buildTree(cx:number, cy:number) {
      allSegs.length=0; leaves.length=0
      const trunk = makeSeg(cx, cy, -Math.PI/2, H*0.28, 9)
      allSegs.push(trunk)
      function addChildren(s:Seg, depth:number, d:number) {
        if(depth<=0) return
        const ex=s.x2,ey=s.y2
        const ba=Math.atan2(s.y2-s.y1,s.x2-s.x1)
        const sp=0.3+Math.random()*0.35
        const len=Math.hypot(s.x2-s.x1,s.y2-s.y1)*(0.6+Math.random()*0.15)
        const nw=s.w*0.62
        if(nw<0.25) return
        const c1=makeSeg(ex,ey,ba-sp,len,nw,d)
        const c2=makeSeg(ex,ey,ba+sp*0.85,len*0.88,nw*0.92,d+12)
        s.children.push(c1,c2); allSegs.push(c1,c2)
        addChildren(c1,depth-1,d+8)
        addChildren(c2,depth-1,d+18)
      }
      addChildren(trunk,8,0)
    }
    buildTree(W/2, H*0.72)

    function endX(s:Seg){return s.x1+(s.x2-s.x1)*s.prog}
    function endY(s:Seg){return s.y1+(s.y2-s.y1)*s.prog}

    // ── Draw functions ─────────────────────────────────────────
    function drawBg(p:number) {
      // sky gradient changes with progress
      const skyTop = p < 0.5
        ? `rgb(${lerp(8,15,p*2)},${lerp(12,25,p*2)},${lerp(8,12,p*2)})`
        : `rgb(${lerp(15,20,p*2-1)},${lerp(25,45,p*2-1)},${lerp(12,20,p*2-1)})`
      const skyBot = p < 0.5
        ? `rgb(${lerp(15,25,p*2)},${lerp(22,40,p*2)},${lerp(12,18,p*2)})`
        : `rgb(${lerp(25,35,p*2-1)},${lerp(40,65,p*2-1)},${lerp(18,28,p*2-1)})`
      const grad = ctx.createLinearGradient(0,0,0,H)
      grad.addColorStop(0, skyTop)
      grad.addColorStop(1, skyBot)
      ctx.fillStyle=grad; ctx.fillRect(0,0,W,H)
    }

    function drawGround(cy:number, p:number) {
      const alpha = clamp(p*3,0,1)
      // ground layer
      const gg = ctx.createLinearGradient(0,cy,0,H)
      gg.addColorStop(0,`rgba(${lerp(20,35,p)},${lerp(35,55,p)},${lerp(15,22,p)},${alpha})`)
      gg.addColorStop(0.4,`rgba(${lerp(12,22,p)},${lerp(22,38,p)},${lerp(8,15,p)},${alpha})`)
      gg.addColorStop(1,`rgba(8,12,6,${alpha})`)
      ctx.fillStyle=gg; ctx.fillRect(0,cy,W,H-cy)
      // moss / grass details
      if(p>0.15) {
        const mossAlpha=clamp((p-0.15)*4,0,1)
        for(let i=0;i<20;i++){
          const mx=W*0.05+i*(W*0.9/19)
          const my=cy+10+Math.sin(i*1.3)*8
          ctx.beginPath()
          ctx.ellipse(mx,my,18+Math.sin(i)*6,6+Math.cos(i)*3,Math.sin(i*0.5)*0.3,0,Math.PI*2)
          ctx.fillStyle=`rgba(${30+i*2},${55+i*3},${18+i},${mossAlpha*0.6})`
          ctx.fill()
        }
      }
    }

    function drawStone(cx:number, cy:number, p:number) {
      ctx.save()
      // main stone body
      const sg=ctx.createRadialGradient(cx-15,cy-10,5,cx,cy,75)
      sg.addColorStop(0,'#4a4035'); sg.addColorStop(0.6,'#2e2820'); sg.addColorStop(1,'#1a1510')
      ctx.beginPath(); ctx.ellipse(cx,cy+10,75,42,0,0,Math.PI*2)
      ctx.fillStyle=sg; ctx.fill()
      // stone shading
      ctx.beginPath(); ctx.ellipse(cx-5,cy-5,70,38,0,0,Math.PI*2)
      ctx.strokeStyle='rgba(255,255,255,0.04)'; ctx.lineWidth=1; ctx.stroke()
      // crack — grows with progress
      if(p>0.05) {
        const crackP=clamp((p-0.05)*8,0,1)
        ctx.beginPath()
        ctx.moveTo(cx-3,cy-15*crackP)
        ctx.bezierCurveTo(cx+4,cy-8*crackP,cx-2,cy,cx+5,cy+18*crackP)
        ctx.strokeStyle=`rgba(0,0,0,${crackP*0.6})`; ctx.lineWidth=2.5; ctx.stroke()
        // glow in crack
        if(p>0.15) {
          const glowA=clamp((p-0.15)*5,0,1)
          const cg=ctx.createLinearGradient(cx,cy-15,cx,cy+18)
          cg.addColorStop(0,`rgba(80,200,60,${glowA*0.4})`)
          cg.addColorStop(1,'rgba(80,200,60,0)')
          ctx.beginPath()
          ctx.moveTo(cx-3,cy-15*crackP)
          ctx.bezierCurveTo(cx+4,cy-8*crackP,cx-2,cy,cx+5,cy+18*crackP)
          ctx.strokeStyle=cg; ctx.lineWidth=4; ctx.stroke()
        }
        // secondary cracks
        const c2a=clamp((p-0.1)*6,0,1)
        ctx.beginPath()
        ctx.moveTo(cx-3,cy-10*crackP); ctx.lineTo(cx-18*crackP,cy+5*crackP)
        ctx.strokeStyle=`rgba(0,0,0,${c2a*0.35})`; ctx.lineWidth=1.2; ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(cx+5,cy); ctx.lineTo(cx+20*crackP,cy-8*crackP)
        ctx.strokeStyle=`rgba(0,0,0,${c2a*0.3})`; ctx.lineWidth=1; ctx.stroke()
      }
      // moss on stone
      if(p>0.4) {
        const mossA=clamp((p-0.4)*4,0,1)
        for(let i=0;i<6;i++){
          ctx.beginPath()
          ctx.ellipse(cx-40+i*14,cy+22+Math.sin(i)*4,5+Math.random()*3,3,Math.random()*0.4,0,Math.PI*2)
          ctx.fillStyle=`rgba(50,90,25,${mossA*0.7})`;ctx.fill()
        }
      }
      ctx.restore()
    }

    function drawTree(p:number, cx:number, cy:number) {
      if(p < 0.2) return
      const treeP = clamp((p-0.2)*1.25,0,1)
      const totalSegs = Math.floor(allSegs.length * easeInOut(treeP))

      for(let i=0;i<Math.min(totalSegs,allSegs.length);i++){
        const s = allSegs[i]!
        if(s.prog < 1) s.prog = Math.min(1, s.prog + 0.025)
        s.age++

        const age01 = Math.min(s.age/80,1)
        const r=20+Math.floor(age01*15), g=55+Math.floor(age01*45), b=10+Math.floor(age01*10)
        ctx.beginPath(); ctx.moveTo(s.x1,s.y1); ctx.lineTo(endX(s),endY(s))
        ctx.strokeStyle=`rgba(${r},${g},${b},${0.5+s.w*0.06})`
        ctx.lineWidth=s.w; ctx.lineCap='round'; ctx.stroke()

        if(s.prog>=1 && !s.leafed && s.w<1.8 && p>0.45) {
          s.leafed=true
          leaves.push({x:s.x2,y:s.y2,size:0,angle:Math.random()*Math.PI*2,opacity:0,sway:Math.random()*Math.PI*2})
        }
      }

      // leaves
      const leafTarget = leaves.length * clamp((p-0.45)*4,0,1)
      for(let i=0;i<Math.min(leafTarget,leaves.length);i++){
        const l=leaves[i]!
        l.sway+=0.008; if(l.size<8) l.size+=0.15; l.opacity=Math.min(0.9,l.opacity+0.03)
        ctx.save(); ctx.translate(l.x,l.y); ctx.rotate(l.angle+Math.sin(l.sway)*0.12)
        ctx.beginPath(); ctx.moveTo(0,0)
        ctx.bezierCurveTo(l.size*0.5,-l.size*1.3,l.size*1.3,-l.size*0.5,l.size*1.5,0)
        ctx.bezierCurveTo(l.size*1.3,l.size*0.5,l.size*0.5,l.size*1.3,0,0)
        const lg=ctx.createRadialGradient(0,0,0,0,0,l.size*1.5)
        lg.addColorStop(0,`rgba(130,200,60,${l.opacity})`)
        lg.addColorStop(0.6,`rgba(70,140,25,${l.opacity*0.85})`)
        lg.addColorStop(1,`rgba(35,85,12,${l.opacity*0.5})`)
        ctx.fillStyle=lg; ctx.fill(); ctx.restore()
      }

      // ambient glow around tree
      if(p>0.5){
        const gA=clamp((p-0.5)*3,0,1)
        const glow=ctx.createRadialGradient(cx,cy-H*0.15,0,cx,cy,H*0.45)
        glow.addColorStop(0,`rgba(60,120,20,${gA*0.12})`)
        glow.addColorStop(1,'rgba(0,0,0,0)')
        ctx.fillStyle=glow; ctx.fillRect(0,0,W,H)
      }
    }

    function drawFog(p:number, t:number) {
      // fog dissipates as tree grows
      const fogA = clamp(1-p*1.2,0,0.85)
      if(fogA<=0) return
      for(let i=0;i<3;i++){
        const fg=ctx.createLinearGradient(0,H*(0.3+i*0.1),0,H*(0.7+i*0.1))
        fg.addColorStop(0,'rgba(0,0,0,0)')
        fg.addColorStop(0.5,`rgba(15,22,12,${fogA*(0.3-i*0.08)})`)
        fg.addColorStop(1,'rgba(0,0,0,0)')
        const xOff = Math.sin(t*0.0003+i*2)*40
        ctx.fillStyle=fg
        ctx.fillRect(xOff,0,W,H)
      }
    }

    function drawParticles(p:number, cx:number, cy:number) {
      if(p<0.15) return
      const pA=clamp((p-0.15)*5,0,1)
      particles.forEach(pt => {
        pt.x+=pt.vx; pt.y+=pt.vy
        if(pt.y<cy-H*0.4) { pt.y=cy+10; pt.x=cx+(Math.random()-0.5)*200 }
        ctx.beginPath(); ctx.arc(pt.x,pt.y,pt.r,0,Math.PI*2)
        ctx.fillStyle=`hsla(${pt.hue},60%,55%,${pt.a*pA*0.6})`; ctx.fill()
      })
    }

    // ── Camera / scroll ────────────────────────────────────────
    let t = 0
    function loop() {
      t++
      // smooth scroll
      const sp = scrollRef.current
      const raw = targetScrollRef.current
      scrollRef.current = lerp(sp, raw, 0.06)

      const p = clamp(scrollRef.current, 0, 1)

      // update active section
      let sec = 0
      for(let i=0;i<SECTIONS.length;i++){
        if(p >= SECTIONS[i]!.progress) sec = i
      }

      // camera zoom effect via canvas transform
      const zoom = 1 + p*0.08
      const camX = lerp(0, W*0.05, p)
      const camY = lerp(0, -H*0.04, p)

      ctx.save()
      ctx.translate(W/2+camX, H/2+camY)
      ctx.scale(zoom, zoom)
      ctx.translate(-W/2, -H/2)

      drawBg(p)
      const cy = H*0.72
      const cx = W/2
      drawGround(cy, p)
      drawParticles(p, cx, cy)
      drawStone(cx, cy, p)
      drawTree(p, cx, cy)
      drawFog(p, t)

      ctx.restore()

      // update react state sparingly
      if(t%6===0) {
        setActiveSection(sec)
        const sectionP = SECTIONS[sec]!
        const nextP = SECTIONS[sec+1]?.progress ?? 1
        const within = (p - sectionP.progress) / ((nextP - sectionP.progress) || 1)
        const fade = within < 0.15 ? within/0.15 : within > 0.75 ? 1-(within-0.75)/0.25 : 1
        setTextOpacity(fade)
      }

      frameRef.current = requestAnimationFrame(loop)
    }
    loop()

    const onWheel = (e:WheelEvent) => {
      e.preventDefault()
      targetScrollRef.current = clamp(targetScrollRef.current + e.deltaY/2000, 0, 1)
    }
    window.addEventListener('wheel', onWheel, { passive:false })

    // touch
    let lastTouch = 0
    const onTouchStart = (e:TouchEvent) => { lastTouch = e.touches[0]!.clientY }
    const onTouchMove = (e:TouchEvent) => {
      const dy = lastTouch - e.touches[0]!.clientY
      lastTouch = e.touches[0]!.clientY
      targetScrollRef.current = clamp(targetScrollRef.current + dy/window.innerHeight*0.5, 0, 1)
    }
    window.addEventListener('touchstart', onTouchStart)
    window.addEventListener('touchmove', onTouchMove)

    return () => {
      cancelAnimationFrame(frameRef.current)
      window.removeEventListener('resize', resize)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
    }
  }, [])

  const section = SECTIONS[activeSection]!

  return (
    <div ref={containerRef} style={{ position:'fixed', inset:0, overflow:'hidden', background:'#080c06' }}>
      <canvas ref={canvasRef} style={{ position:'absolute', inset:0, width:'100%', height:'100%' }}/>

      {/* nav */}
      <nav style={{ position:'absolute', top:0, left:0, right:0, padding:'24px 36px', display:'flex', justifyContent:'space-between', alignItems:'center', zIndex:20, background:'linear-gradient(to bottom,rgba(0,0,0,0.3),transparent)' }}>
        <span style={{ color:'rgba(180,220,120,0.9)', fontSize:'14px', letterSpacing:'3px', fontFamily:'Georgia,serif', fontWeight:400 }}>
          Sedora Life
        </span>
        <a href="/login" style={{ padding:'9px 22px', background:'rgba(60,100,25,0.35)', border:'1px solid rgba(100,160,50,0.4)', borderRadius:'24px', color:'rgba(180,220,120,0.9)', fontSize:'12px', letterSpacing:'2px', textDecoration:'none', fontFamily:'Georgia,serif', backdropFilter:'blur(8px)', transition:'all .3s' }}>
          Enter App
        </a>
      </nav>

      {/* section text */}
      <div style={{ position:'absolute', bottom:'12%', left:'50%', transform:'translateX(-50%)', textAlign:'center', zIndex:20, opacity:textOpacity, transition:'opacity .1s', width:'90%', maxWidth:'560px', pointerEvents:'none' }}>
        <p style={{ fontSize:'11px', color:'rgba(120,180,60,0.7)', letterSpacing:'4px', textTransform:'uppercase', fontFamily:'Georgia,serif', marginBottom:'14px' }}>
          Sedora Life
        </p>
        <h2 style={{ fontSize:'clamp(28px,5vw,52px)', fontWeight:300, color:'rgba(210,240,160,0.92)', letterSpacing:'1px', fontFamily:'Georgia,serif', margin:'0 0 14px', textShadow:'0 2px 30px rgba(0,0,0,0.8)' }}>
          {section.title}
        </h2>
        <p style={{ fontSize:'14px', color:'rgba(150,200,90,0.6)', fontFamily:'Georgia,serif', letterSpacing:'1px', lineHeight:1.7, textShadow:'0 1px 12px rgba(0,0,0,0.9)' }}>
          {section.sub}
        </p>
      </div>

      {/* scroll indicator */}
      <div style={{ position:'absolute', bottom:'5%', left:'50%', transform:'translateX(-50%)', zIndex:20, display:'flex', flexDirection:'column', alignItems:'center', gap:'8px', opacity: scrollRef.current > 0.05 ? 0 : 0.6, transition:'opacity .5s' }}>
        <span style={{ fontSize:'9px', color:'rgba(140,190,70,0.8)', letterSpacing:'3px', textTransform:'uppercase', fontFamily:'Georgia,serif' }}>scroll</span>
        <div style={{ width:'1px', height:'32px', background:'linear-gradient(to bottom,rgba(140,190,70,0.8),transparent)' }}/>
      </div>

      {/* progress dots */}
      <div style={{ position:'absolute', right:'36px', top:'50%', transform:'translateY(-50%)', zIndex:20, display:'flex', flexDirection:'column', gap:'10px' }}>
        {SECTIONS.map((s,i) => (
          <div key={i} onClick={()=>{ targetScrollRef.current = s.progress }}
            style={{ width: i===activeSection ? '6px' : '4px', height: i===activeSection ? '6px' : '4px', borderRadius:'50%', background: i===activeSection ? 'rgba(140,200,60,0.9)' : 'rgba(140,200,60,0.25)', cursor:'pointer', transition:'all .3s', border: i===activeSection ? '1px solid rgba(140,200,60,0.5)' : 'none' }}
          />
        ))}
      </div>
    </div>
  )
}
