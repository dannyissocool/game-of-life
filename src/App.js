import { useState, useCallback, useRef } from 'react';
import produce from 'immer'
import './App.css';



const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0]
]



function App() {
  const [numRows, setNumRows] = useState(50);
  const [numCols, setNumCols] = useState(50);

  const generateEmptyGrid = () => {
    const rows = [];
    for (let i = 0; i < numRows; i++) {
      rows.push(Array.from(Array(numCols), () => 0))
    }

    return rows;
  }

  const [grid, setGrid] = useState(() => {
    return generateEmptyGrid()
  })

  const [running, setRunning] = useState(false)

  const runningRef = useRef(running);
  runningRef.current = running;

   const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }

    setGrid(g => {
      return produce(g, gridCopy => {
        for (let i = 0; i < numRows; i++) {
          for (let k = 0; k < numCols; k++) {
            let neighbors = 0;
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newK = k + y;
              if (newI >= 0 && newI < numRows && newK >= 0 && newK < numCols) {
                neighbors += g[newI][newK];
              }
            });

            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][k] = 0;
            } else if (g[i][k] === 0 && neighbors === 3) {
              gridCopy[i][k] = 1;
            }
          }
        }
      });
    });

    setTimeout(runSimulation, 100);
  }, [numRows, numCols]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if((Number(e.target[0].value) === undefined || 0 ) || 
      (Number(e.target[1].value) === undefined || 0 ))       
      return;
    else {
      setRunning(false);
      runningRef.current = false;      

      console.log('Col value = ' + e.target[0].value)
      console.log('Row value = ' + e.target[1].value)
      setNumCols(Number(e.target[0].value))
      setNumRows(Number(e.target[1].value))
      console.log('numCols = ' + numCols)
      console.log('numRows = ' + numRows)
      setGrid(generateEmptyGrid());
    }
    
  }

  return (
    <div className='app' style={{ backgroundColor: '#111'}}>
      <nav style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }} >
          <button 
          onClick={() => {
            setRunning(!running);
            if(!running) {
              runningRef.current = true;
              runSimulation();
            }
          
          }}>
            {running ? 'Stop' : 'Start' }
        </button>
        <button onClick={() => {
          setGrid(generateEmptyGrid())
        }}>
          Clear
        </button>
        <button onClick={() => {
          const rows = [];
          for (let i = 0; i < numRows; i++) {
            rows.push(Array.from(Array(numCols), () => (Math.random() > 0.5 ? 1 : 0)))
          }
      
          setGrid(rows);
        }}>
          Random
        </button>

        <form className='form' onSubmit={handleSubmit}>
          <input type='number' placeholder='Columns' name='cols' />
          <input type='number' placeholder='Rows' name='rows' />
          <button>Submit</button>
        </form>
       
      </nav>
     
      <div className='grid'
        style={{
        display:'grid',        
        gridTemplateColumns: `repeat(${numCols}, 20px)`,
        gridTemplateRows: `repeat(${numRows}, 20px)`
      }}>
        {grid.map((rows, i) => 
          rows.map((col, k) => 
          <div
            onClick={() => {
              const newGrid = produce(grid, gridCopy => {
                gridCopy[i][k] = gridCopy[i][k] ? 0: 1;
              })
              setGrid(newGrid)
            }}
            key={`${i}-${k}`} 
            style={{ 
            cursor:'pointer',
            width: 20, 
            height: 20, 
            backgroundColor: grid[i][k] ? 'limegreen' : 'black',
            border: 'solid 1px #999'
            }}
          />
          )
        )}
      </div>
    </div>
  );
}

export default App;
