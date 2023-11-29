import React, { useState, useEffect } from 'react';
import { PlaneGeometry, Color, MeshBasicMaterial, TextureLoader } from "three";
import { Chess } from 'chess.js'
import { Chessboard } from 'react-chessboard';

function ChessBoard({ blocks, colorWhite, colorBlack }) {
    return (
        <>
            {blocks.map((block, index) => (
                <group
                    key={index}
                    position={[Number(block.positionX), Number(block.positionY), Number(block.positionZ)]}
                    rotation={[-Math.PI / 2, 0, 0]}
                >
                    <mesh>
                        <planeGeometry args={[Number(block.height), Number(block.width)]} />
                        <meshBasicMaterial color={ block.color === 0xFFFFFF ? new Color(colorWhite) : new Color(colorBlack) } side={2} />
                    </mesh>
                </group>
            ))}
        </>
    );
}

function ChessPiece({ piece }) {

    return (
        <group
            position={[Number(piece.positionX), Number(piece.positionY), Number(piece.positionZ)]}
        >
            <mesh>
                <planeGeometry args={[Number(piece.height), Number(piece.width)]} />
                <meshBasicMaterial transparent color={new Color(piece.color)} side={2} map={new TextureLoader().load(piece.piece_texture)} />
            </mesh>
        </group>
    );
}

function ThreeCustomBlockRender() {
	const [chessInstance, setChessBlocks] = useState([]);

	useEffect(() => {
		let blocksArray = [];
		window.threeApp.forEach((item) => {
			if (item.className === "three-object-three-app-three-chess-block") {
				const block = {
					positionX: item.querySelector("p.three-chess-block-positionX").innerText,
					positionY: item.querySelector("p.three-chess-block-positionY").innerText,
					positionZ: item.querySelector("p.three-chess-block-positionZ").innerText,
					rotationX: item.querySelector("p.three-chess-block-rotationX").innerText,
					rotationY: item.querySelector("p.three-chess-block-rotationY").innerText,
					rotationZ: item.querySelector("p.three-chess-block-rotationZ").innerText,
					colorWhite: item.querySelector("p.three-chess-block-colorWhite").innerText,
					colorBlack: item.querySelector("p.three-chess-block-colorBlack").innerText
				};
				blocksArray.push(block);
			}
		});

		setChessBlocks(blocksArray);

		console.log("chessInstance", chessInstance);

	}, []);

    const [capturedPieces, setCapturedPieces] = useState([]);
    const [blocks, setBlocks] = useState([]);
    const [pieces, setPieces] = useState([]);
    const [game, setGame] = useState(window.chessGame);
    const [fen, setFen] = useState(null);
    const [currentMessage, setCurrentMessage] = useState("");

	// Function to make a move and update the game state
	const makeAMove = (move) => {
		const moveResult = game.move(move);
		if (moveResult) {
			setGame(new Chess(game.fen())); 
			setFen(game.fen());
		}
		return moveResult;
	};
	const makeRandomMove = () => {
		console.log("are we moving?");
		const possibleMoves = game.moves();
		console.log("possible", possibleMoves);
		if (possibleMoves.length === 0) return;
	
		const randomIndex = Math.floor(Math.random() * possibleMoves.length);
		const moveNotation = possibleMoves[randomIndex];
	
		console.log("Attempting move: ", moveNotation);
	
		// Assuming that if the move is 2 characters long, it's a pawn move.
		if (moveNotation.length === 2) {
			// Find the pawn that can move to the destination square.
			const fromSquare = findPawnMove(moveNotation, game);
			if (fromSquare) {
				makeAMove({ from: fromSquare, to: moveNotation });
			} else {
				console.error('Could not find from square for pawn move:', moveNotation);
			}
		} else if (moveNotation.length === 4) {
			makeAMove({ from: moveNotation.slice(0, 2), to: moveNotation.slice(2, 4) });
		} else {
			console.error('Move not in expected format:', moveNotation);
		}
	};
	function findPawnMove(toSquare, game) {
		// Find the color of the current player to move
		const color = game.turn();
	
		// Calculate rank and file for destination square
		const rank = toSquare[1];
		const file = toSquare[0];
	
		// Pawns can only move straight forward or capture diagonally one square forward.
		// Determine where the pawn could have come from:
		let fromSquare;
		if (color === 'w') { // White's turn
			// Check if the pawn moved up one square
			if (game.get(file + (rank - 1)) && game.get(file + (rank - 1)).type === 'p' && game.get(file + (rank - 1)).color === 'w') {
				fromSquare = file + (rank - 1);
			}
			// Check if the pawn moved up two squares from the starting position (rank 2 to rank 4)
			else if (rank === '4' && game.get(file + '2') && game.get(file + '2').type === 'p' && game.get(file + '2').color === 'w') {
				fromSquare = file + '2';
			}
		} else { // Black's turn
			// Check if the pawn moved down one square
			if (game.get(file + (parseInt(rank) + 1)) && game.get(file + (parseInt(rank) + 1)).type === 'p' && game.get(file + (parseInt(rank) + 1)).color === 'b') {
				fromSquare = file + (parseInt(rank) + 1);
			}
			// Check if the pawn moved down two squares from the starting position (rank 7 to rank 5)
			else if (rank === '5' && game.get(file + '7') && game.get(file + '7').type === 'p' && game.get(file + '7').color === 'b') {
				fromSquare = file + '7';
			}
		}
	
		return fromSquare;
	}
	async function gptMakeMove() {
		const moveHistory = game.history({ verbose: true });
		console.log('Verbose Move History:', moveHistory[0].after);
		const possibleMoves = game.moves();
		// convert possibleMoves to string
		var stringMoves = possibleMoves.toString();
		console.log("avail", stringMoves);
		console.log("last move", moveHistory[0]);
		if( moveHistory[0].color === "w" ) {

			try {
				const response = await fetch('/wp-json/myplugin/v1/chess-move', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-WP-Nonce': threeCustomBlock.nonce,
				},
				body: JSON.stringify({
					currentMove: moveHistory[0].san, // send the latest move
					movesHistory: moveHistory[0].after, // send the entire game history
					availableMoves: stringMoves, // avail moves
				}),
				});
			
				if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
				}
			
				const data = await response.json();
			
				// Check if the necessary properties are present
				if (!data || typeof data !== 'object' || !data.wittyComment || !data.suggestedMove) {
				throw new Error('The response data is not in the expected format or is missing.');
				}
			
				console.log("DATA", data);
				const { wittyComment, suggestedMove, gameStatus } = data;
				console.log("suggestd move", suggestedMove);
				const suggestedMoveObject = JSON.parse(suggestedMove);
				const moveFrom = suggestedMoveObject.moveFrom;
				const moveTo = suggestedMoveObject.moveTo;
				setCurrentMessage(suggestedMoveObject.gameStatus);

				const moveResult = game.move(moveTo);
				if (moveResult) {
					setGame(new Chess(game.fen()));
					setFen(game.fen());
				}
				
			} catch (error) {
				console.error('Failed to get a move from the AI:', error);
			}
		}
	}

    // Monitor changes to window.chessGame
    useEffect(() => {
		window.chessGame = new Chess();
		window.messages = [];

        const handleChessGameChange = () => {
            setGame(window.chessGame);
        };

        window.addEventListener('chessGameReady', handleChessGameChange);

        return () => {
            window.removeEventListener('chessGameReady', handleChessGameChange);
        };
    }, []);

	useEffect(() => {
		if(window.chessGame) {
			window.dispatchEvent(new Event('chessGameReady'));
			console.log("chess game", window.chessGame);
			setFen(window.chessGame.fen()); // Set the initial FEN string
		}
	}, []);

	const onPieceDrop = (sourceSquare, targetSquare) => {
		const move = makeAMove({
		  from: sourceSquare,
		  to: targetSquare,
		  promotion: "q"
		});
	  
		if (move === null) return false; // Illegal move
		setTimeout(gptMakeMove, 2000);
		return true;
	};
	  
    useEffect(() => {
		if(fen){
			const chessboardDiv = document.createElement('div');
			chessboardDiv.style.position = 'fixed';
			chessboardDiv.style.right = '0px';
			chessboardDiv.style.bottom = '0px';
			chessboardDiv.style.width = '200px';
			chessboardDiv.style.zIndex = '9999';
			chessboardDiv.style.border = '1px solid #ccc';
			chessboardDiv.style.borderRadius = '4px';
			chessboardDiv.style.boxShadow = '0px 0px 8px 0px #ccc';
			chessboardDiv.style.padding = '4px';
			chessboardDiv.style.backgroundColor = '#fff';
			chessboardDiv.style.display = 'flex';
			chessboardDiv.style.flexDirection = 'column';
			chessboardDiv.style.alignItems = 'center';
			chessboardDiv.style.justifyContent = 'center';
			chessboardDiv.style.fontFamily = 'Arial, sans-serif';
			chessboardDiv.style.fontSize = '14px';
			document.body.appendChild(chessboardDiv);

			ReactDOM.render(
				<Chessboard 
				  position={fen} // Use FEN state for the position
				  onPieceDrop={(sourceSquare, targetSquare) => onPieceDrop(sourceSquare, targetSquare)}
				/>, 
				chessboardDiv
			);
				
			return () => {
				document.body.removeChild(chessboardDiv);
			};
		}
    }, [fen]);

	useEffect(() => {
		const messageDiv = document.createElement('div');
		// Apply styles to messageDiv
		Object.assign(messageDiv.style, {
		  position: 'fixed',
		  right: '10px',
		  bottom: '220px',
		  width: '180px',
		  zIndex: '9999',
		  border: '1px solid #ccc',
		  borderRadius: '4px',
		  boxShadow: '0px 0px 8px 0px #ccc',
		  padding: '4px',
		  backgroundColor: '#fff',
		  fontFamily: 'Arial, sans-serif',
		  fontSize: '14px',
		  textAlign: 'center',
		  margin: '10px'
		});
	  
		// Use ReactDOM to render the message inside the message container
		ReactDOM.render(
		  <span>{currentMessage}</span>,
		  messageDiv
		);
	  
		// Append the message container to the body
		document.body.appendChild(messageDiv);
	  
		return () => {
		  ReactDOM.unmountComponentAtNode(messageDiv);
		  document.body.removeChild(messageDiv);
		};
	  }, [currentMessage]);
			
	useEffect(() => {
		const updateBoard = () => {
			if (!game) return;

			const letters = ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a'];
			let blocksArray = [];

			for (let i = 0; i < 8; i++) {
				for (let j = 0; j < 8; j++) {
					const blockColor = (i + j) % 2 === 0 ? 0xFFFFFF : 0x000000;
					const name = letters[i] + (j + 1).toString();

					blocksArray.push({
						positionX: i,
						positionY: 0,
						positionZ: j,
						height: 1,
						width: 1,
						color: blockColor,
						name: name
					});
				}
			}

			let piecesArray = [];
			blocksArray.forEach(block => {
				const piece = game.get(block.name);
				if (piece) {
					const pieceColor = 0xFFFFFF;
					const pieceType = piece.type;
					const pieceColorCode = piece.color;
					let piece_texture;
					
					switch (pieceType) {
						case 'p':
							piece_texture = pieceColorCode === 'w' ? 'white_pawn.png' : 'black_pawn.png';
							break;
						case 'r':
							piece_texture = pieceColorCode === 'w' ? 'white_rook.png' : 'black_rook.png';
							break;
						case 'n':
							piece_texture = pieceColorCode === 'w' ? 'white_knight.png' : 'black_knight.png';
							break;
						case 'b':
							piece_texture = pieceColorCode === 'w' ? 'white_bishop.png' : 'black_bishop.png';
							break;
						case 'q':
							piece_texture = pieceColorCode === 'w' ? 'white_queen.png' : 'black_queen.png';
							break;
						case 'k':
							piece_texture = pieceColorCode === 'w' ? 'white_king.png' : 'black_king.png';
							break;
						default:
							break;
					}

					const textureUrl = `${threeCustomBlock.pluginDirPath}/images/${piece_texture}`;

					piecesArray.push({
						positionX: block.positionX,
						positionY: 0.4,
						positionZ: block.positionZ,
						height: 0.8,
						width: 0.8,
						color: pieceColor,
						name: 'piece_' + block.name,
						piece_texture: textureUrl
					});
				}
			});

			setBlocks(blocksArray);
			setPieces(piecesArray);
			const history = game.history({ verbose: true });

			const newCapturedPieces = history
			.filter(move => move.captured)
			.map((move, index) => {
				const isWhite = move.color === 'b';
				const pieceName = {
					'p': 'pawn',
					'r': 'rook',
					'n': 'knight',
					'b': 'bishop',
					'q': 'queen',
					'k': 'king'
				}[move.captured];
	
				return {
					positionX: isWhite ? 9 : -2,
					positionY: 0.4,
					positionZ: index,
					height: 0.8,
					width: 0.8,
					color: 0xFFFFFF,
					name: 'captured_' + index,
					piece_texture: `${threeCustomBlock.pluginDirPath}/images/${isWhite ? 'white' : 'black'}_${pieceName}.png`
				};
			});
		

			setCapturedPieces(newCapturedPieces);
		};

		if (game) {
			updateBoard();
		}
	
		const handleMessage = () => {
			const latestMessage = window.messages?.slice(-1)[0];
			const move = game?.move(latestMessage);
	
			if (move) {
				updateBoard();
			}
		};
	
		if (game && window.messages && window.messages.length > 0) {
			window.messages.forEach(msg => {
				game.move(msg);
			});
			updateBoard();
		}
	
		window.addEventListener('message', handleMessage);
	
		return () => {
			window.removeEventListener('message', handleMessage);
		};
	}, [game]);

    useEffect(() => {
        const handlePieceDrop = (event) => {
            onDrop(event.detail.source, event.detail.target);
        };

        window.addEventListener('pieceDrop', handlePieceDrop);

        return () => {
            window.removeEventListener('pieceDrop', handlePieceDrop);
        };
    }, [game]);


    return (
        <>
			{chessInstance.map((chessInstance, index) => (
				<group
					key={index}
					position={[Number(chessInstance.positionX), Number(chessInstance.positionY), Number(chessInstance.positionZ)]}
					rotation={[Number(chessInstance.rotationX), Number(chessInstance.rotationY), Number(chessInstance.rotationZ)]}
				>
					<ChessBoard blocks={blocks} colorWhite={chessInstance.colorWhite} colorBlack={chessInstance.colorBlack} />
					{pieces.map((piece, index) => <ChessPiece key={index} piece={piece} />)}
					{capturedPieces.map((piece, index) => <ChessPiece key={index} piece={piece} />)}
				</group>
			))}
        </>
    );
}

window.addEventListener('registerFrontPluginReady', function () {
    window.registerFrontPlugin(<ThreeCustomBlockRender />);
});
