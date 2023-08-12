import React from 'react';
import { useState } from 'react';

function Square({ winner, value, onSquareClick }) {
  const classToUse = winner ? "square winner" : "square"
  return (
    <button className={classToUse} onClick={onSquareClick}>
      {value}
    </button>
  );
}

export function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    }
    else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares)
  let status;
  if (winner) {
    status = "Winner: " + squares[winner[0]];
  }
  else {
    const draw = calculateDraw(squares)
    if (!draw) {
      status = "Next Player: " + (xIsNext ? 'X' : "O");
    }
    else {
      status = "Draw";
    }
  }

  let rows = 3
  let columns = 3

  return (
    <React.Fragment>
      <div className="status">{status}</div>
      {
        Array.from({ length: rows }).map((item, rowIndex) => (
          <div key={rowIndex} className='board-row'>
            {
              Array.from({ length: columns }).map((item, columnIndex) => {
                const index = rowIndex * columns + columnIndex;
                let winnerSquare = false
                if (winner) {
                  winnerSquare = winner.includes(index)
                }
                return (
                  <Square key={index} winner={winnerSquare} value={squares[index]} onSquareClick={() => handleClick(index)} />
                )
              })
            }
          </div>))
      }
    </React.Fragment >

  );
}
function findDiffIndex(arr1, arr2) {
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return i;
    }
  }
  return -1; // No difference found
}
function calculateDraw(squares) {
  let draw = true;
  squares.forEach(element => {
    if (element == null) {
      draw = false;
      return draw
    }
  });
  return draw;
}
function calculateWinner(squares) {
  let lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i];
    }
  }
  return null;
}

export function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [ascendingOrder, setAscendingOrder] = useState(true);
  const currentSquares = history[currentMove];
  const xIsNext = currentMove % 2 === 0;

  function handlePlay(nextSquares) {
    // when click happens we set the history to add and jump to will set current move
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]
    setHistory(nextHistory)
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }
  function toggleMoves() {
    setAscendingOrder(!ascendingOrder)
  }

  const moves = history.map((squares, move) => {
    let description;
    let currentMove = history.length - 1
    if (move === currentMove) {
      description = `${xIsNext ? 'X' : 'O'}, you are at move ${move + 1}`;
      return <li key={move}>{description}</li>
    }
    else {
      if (move > 0) {
        const prevSquares = history[move - 1];
        const diffIndex = findDiffIndex(prevSquares, squares);
        const row = Math.floor(diffIndex / 3);
        const col = diffIndex % 3;
        description = `Go to move # ${move + 1} (${row}, ${col})`;
      }
      else {
        description = 'Go to game start';
      }
      return <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    }
  });
  let movesOrder = ascendingOrder ? moves : moves.reverse();
  return (
    <div className='game'>
      <div className='game-board'>
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className='game-info'>
        <button onClick={toggleMoves}>Toggle Moves</button>
        <ol>{movesOrder}</ol>
      </div>
    </div>
  );
}

function ProductTable({ products }) {
  const rows = []
  let lastCategory = null;

  products.forEach((product) => {
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow category={product.category} key={product.category} />
      )
    }
    rows.push(
      <ProductRow product={product} key={product.name} />
    )
    lastCategory = product.category
  })
  return <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Price</th>
      </tr>
    </thead>
    <tbody>{rows}</tbody>
  </table>
}
function ProductCategoryRow({ category }) {
  return (
    <tr>
      <th colSpan="2">
        {category}
      </th>
    </tr>
  )
}
function ProductRow({ product }) {
  const name = product.stocked ? product.name :
    <span style={{ color: 'red' }}>
      {product.name}
    </span>
  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}
function SearchBar({ filterText, inStockOnly, onFilterTextChange, onInStockOnlyChange }) {
  return (
    <form>
      <input
        type="text"
        placeholder='Search...'
        value={filterText}
        onChange={(e) => onFilterTextChange(e.target.value)}
      />
      <div>
        <label>
          <input
            type="checkbox"
            value={inStockOnly}
            onChange={(e) => onInStockOnlyChange(e.target.checked)}
          />
          {' '}
          Only show products in stock
        </label>
      </div>
    </form>
  )
}
function FilteredProductTable({ products }) {
  const [filterText, setFilterText] = useState("")
  const [inStockOnly, setInStockOnly] = useState(false)

  let filteredProducts = []
  // Search Filter
  if (filterText !== "") {
    filteredProducts = products.filter(product =>
      product.name.toLowerCase().includes(filterText.toLowerCase())
    )
  }
  else {
    filteredProducts = products
  }

  let inStockFilteredProducts = []
  if (inStockOnly) {
    inStockFilteredProducts = filteredProducts.filter(product => product.stocked)
  }
  else {
    inStockFilteredProducts = filteredProducts
  }

  return (
    <div>
      <SearchBar
        filterText={filterText}
        inStockOnly={inStockOnly}
        onFilterTextChange={setFilterText}
        onInStockOnlyChange={setInStockOnly}
      />
      <ProductTable
        products={inStockFilteredProducts}
      />
    </div>
  );
}

const PRODUCTS = [
  { category: "Fruits", price: "$1", stocked: true, name: "Apple" },
  { category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit" },
  { category: "Fruits", price: "$2", stocked: false, name: "Passionfruit" },
  { category: "Vegetables", price: "$2", stocked: true, name: "Spinach" },
  { category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin" },
  { category: "Vegetables", price: "$1", stocked: true, name: "Peas" }
]
export default function App() {
  return <FilteredProductTable products={PRODUCTS} />
}