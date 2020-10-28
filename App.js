import React, { useState, useEffect } from 'react'
import './App.css'

var fig = localStorage.getItem('figures')
export default function App() {
    const [figures, setFigures] = useState(fig?JSON.parse(fig): [])
    return (
        <div className='cover'>
            <Inpu figures={figures} setFigures={(arr)=>setFigures(arr)} />
            <div className='draw'>
                {figures.map((i,k)=><Draw shape={i} key={k} />)}
            </div>
        </div>
    )
}

function Inpu(props){
    const [shapes, setShapes]=useState([])
    const [value, setValue] = useState("")
    const [length, setLength] = useState(50)
    const [color, setColor] = useState('green')

    useEffect(()=>{
        setShapes(filt(props.figures))
    },[])

    const filt=(arr)=>{
        let poly={'triangle':3, 'pentagon':5,'hexagon':6,'heptagon':7,'octagon':8,'nonagon':9,'decagon':10}
        return arr.filter(i=>i.shape.toLowerCase().trim()=='circle'||i.shape.toLowerCase().trim()=='rectangle'||i.shape.toLowerCase().trim()=='square'||i.shape.toLowerCase().trim()=='rect'|| Object.keys(poly).includes(i.shape.toLowerCase().trim()) )
    }
    const remove=(k)=>{
        let shape = shapes
        shape.splice(k,1)
        localStorage.setItem('figures', JSON.stringify(shape))
        props.setFigures([...shape])
        setShapes(shape)
    }
    const verify=(e)=>{
        let lengt = e.target.value
        switch(true){
            case lengt=="" || lengt=="0" || lengt==0:
                setLength("")
                break;
            case !Number(lengt):
                alert('input not a number')
                break;
            case Number(lengt) > 99 :
                alert('Number length too big, highest of 99')
                break;
            case Number(lengt) < 1:
                alert('Number length too big, lowest of 1')
                break;
            default:
                setLength(lengt)
                break;
        }
    }
    const submit=(e)=>{
        e.preventDefault()
        if(Number(length) < 10){
            alert('Number length too small, shouldn\'t be lower than 10')
        }else if(Number(length) && value !== ""){
            let newt = [...shapes, {'shape': value, 'length': length, 'color':color}]
            if(filt(newt).length == newt.length){
                localStorage.setItem('figures', JSON.stringify(filt(newt)))
                props.setFigures(filt(newt))
                setShapes(filt(newt))
                setValue("")
            }else{
                alert('Given shape cannot be drawn or is mispelt, only triangle, circle, rectangle, and pentagon to decagon can be drawn')
            }
            
        }else{
            alert('length or shapes input is empty ')
        }
    }
    return(
        <form className='input-form' onSubmit={submit}>
            <h3>Enter the shape you want to draw below</h3>
            <div className='input-cover'>
                <div className='bobs'>{shapes.map((i,k)=><Bob key={k} value={i.shape} remove={()=>remove(k)}/>)}</div>
                <input className='shape' onChange={(e)=>setValue(e.target.value)} value={value} placeholder="Only triangles, circles, rectangles, and pentagons to decagons are allowed" />
            </div>
            <h3 className='h'>Enter the length or radius of the shape</h3>
            <input className='numbers' placeholder='no' value={length} onChange={(e)=>verify(e)} />
            <h3 className='h'>Choose a color for your shape</h3>
            <input className='colors' type='color' value={color} onChange={(e)=>setColor(e.target.value)} />
            <button type='submit'>Draw</button>
        </form>
    )
}

const Draw=(props)=>{
    const [coords, setCoords]=useState("")
    const [err,setErr] = useState(false)

    useEffect(()=>{
        let poly={'triangle':3, 'pentagon':5,'hexagon':6,'heptagon':7,'octagon':8,'nonagon':9,'decagon':10}
        let sha = props.shape.shape.toLowerCase().trim()

        if(sha == 'circle'){
            setCoords(<circle cx="100" cy="100" r={props.shape.length} className='shapes' style={{'fill':props.shape.color}} />)
        }else if(sha == 'rectangle' || sha == 'rect' || sha == 'square'){
            setCoords(<rect x={(200-props.shape.length)/2} y={(200-props.shape.length)/2} width={props.shape.length} height={props.shape.length} className='shapes' style={{'fill':props.shape.color||'green'}} />)
        }else if(Object.keys(poly).includes(sha)){
            let num = poly[sha]
            let arr = generate(num, props.shape.length)
            arr = arr.map(i=> `${i.x},${i.y}`)
            let inp = arr.join(" ")
            setCoords(<polygon points={inp} className='shapes' style={{'fill':props.shape.color}} />)
        }else{
            alert('One of the shapes given cannot be drawn or is mispelt')
            setErr(true)
        }
        
    },[props])

    const positions=(num, length, i)=>{
        let angle = 360/num *i
        let x = length * Math.cos(rad(angle))
        let y = length * Math.sin(rad(angle))
        return [x,y]
    }
    const rad=(angle)=>{
        return (Math.PI*angle)/180
    }
    const generate=(num, length)=>{
        let coord=[]
        for(let i=0; i<num; i++){
            let [x,y] = positions(num, length, i)
            let ex = x+ 100
            let ey = y+ 100
            coord.push({x:ex, y:ey})
        }
        return coord
    }
    return(
        <>
        {!err?
            <svg className='svg' height='200' width='200'>
            {coords}
        </svg>:
        <></>
        }
        </>
        
    )
}

const Bob=(props)=>{
    return(
        <div className='bobby'><p>{props.value}</p> <p className='back' onClick={()=>props.remove()}>X</p></div>
    )
}