
import { useState, useEffect } from 'react'
import { languages } from './languages'
import clsx from 'clsx'
import { getFarewellText, getWord } from './utils'

import Confetti from 'react-confetti'


function App() {
  // State values
  const [currentWord, setCurrentWord] = useState<string>(():string => getWord())
  const [guessedLetters, setGuessedLetters] = useState<string[]>([])
  const [farewellText, setFarewellText] = useState("")
  //console.log(guessedLetters)

  // Derived values
  const wrongGuessCount = guessedLetters.filter(letter => !currentWord.includes(letter)).length

  //check if the last guessed letter is wrong to show the farewell message
  const lastGuessedLetter = guessedLetters[guessedLetters.length - 1]
  const isLastGuessedLetterWrong = lastGuessedLetter && !currentWord.includes(lastGuessedLetter)
  //console.log(wrongGuessCount)

  //check if gameover
  const isGameWon = [...currentWord].every(l => guessedLetters.includes(l))
  const isGameLost = wrongGuessCount >= languages.length
  const isGameOver = isGameWon || isGameLost
  //console.log(isGameOver, isGameWon, isGameLost)
  // Static values
  const alphabet = "abcdefghijklmnopqrstuvwxyz"


  function handleNewGame(): void {
    setCurrentWord(getWord())
    setGuessedLetters([])
  }


  useEffect(() => {
    if (isLastGuessedLetterWrong) {
      const lang = languages[wrongGuessCount - 1].name
      setFarewellText(getFarewellText(lang))
    }
  }, [wrongGuessCount])


  function handleGussedLetters(letter:string): void {
    setGuessedLetters((prevLetters: string[]): string [] =>

      //avoiding duplicates using includes
      prevLetters.includes(letter) ?
        prevLetters :
        [...prevLetters, letter]


      //or using a set to avoid duplicates
      // Array.from(new Set([...prevLetters, letter])
    )
  }

  //Mapping through languages array to create each language box 
  const languagesElements = languages.map((lang, index) => {
    // const className = clsx("language-box", index < wrongGuessCount ? "lost":"")
    return (<span
      className={`language-box ${index < wrongGuessCount ? "lost" : ""}`}
      key={lang.name}
      style={{ backgroundColor: lang.backgroundColor, color: lang.color }}>
      {lang.name}
    </span>)
  })
  //mapping through each letter of the current word to create word letter boxes
  //To conver str to array use arr.split('') or [...str]
  const wordElements = [...currentWord].map((letter, index) =>
    <span className='letter-box' key={index}>
      {isGameLost || guessedLetters.includes(letter) ? letter.toUpperCase() : ""}
      {/* if gamelost & not guessed letter& in word letter, then show the letter */}
      {/* {isGameLost &&!guessedLetters.includes(letter) &&currentWord.includes(letter)? letter.toUpperCase():""} */}
    </span>)


  //Creating alphabet buttons
  const alphabetElements = [...alphabet].map((letter, index) => {
    const isGuessed = guessedLetters.includes(letter)
    const isCorrect = isGuessed && currentWord.includes(letter)
    const isWrong = isGuessed && !currentWord.includes(letter)
    //if letter correct--> green, if letter is wrong--> red, if gamelost and letter is in word and not guessed, then show wrong class to indicate that the player missed this letter
    const className = clsx(isCorrect && 'right', isWrong && 'wrong', isGameLost && !isGuessed && currentWord.includes(letter) && 'wrong')

    return <button
      key={index}
      onClick={() => handleGussedLetters(letter)}
      className={className}
      //disabled={gussedLetters.includes(letter) || isGameOver} //disable button if letter is already guessed or game is over
      disabled={isGameOver}
      aria-label={`letter is ${letter}, ${isCorrect ? "correct" : isWrong ? "wrong" : "not guessed yet"}`}
      aria-disabled={guessedLetters.includes(letter) || isGameOver}
    >

      {letter.toLocaleUpperCase()}
    </button>
  }

  )

  //game status section classes and content
  const gameStatusClass = clsx("game-status", isGameWon && "won", isGameLost && "lost", !isGameOver && isLastGuessedLetterWrong && "farewell")
  //const {width, height } = useWindowSize()

  const gameStatuscontent = isGameOver ? (isGameWon ?
    (<>
      <h2>You win!</h2>
      <p>Well done!🎉</p>


    </>
    ) :
    (<>
      <h2>Game over!</h2>
      <p>You lose! Better luck next time😭</p>
    </>
    )
  )
    : isLastGuessedLetterWrong && (<p className="farewell-message">{farewellText}</p>)


  return (
    <main>
     {isGameWon && <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
      />}
      <header>
        <h1>Word Guessing Game</h1>
        <p>Guess the word within 8 attempts to keep the programming world safe!</p>
      </header>
      <section className={gameStatusClass} aria-live="polite" role="status">
        {gameStatuscontent}

      </section>

      <section className='languages-container'>
        {languagesElements}
      </section>
      <section className='word-container'>
        {wordElements}
      </section>


      {/* sr-only section for screen readers to announce the current game status and word state */}
      <section className='sr-only' araia-live="polite" role="status">
        <p>
          {currentWord.includes(lastGuessedLetter) ? `Correct guess: ${lastGuessedLetter}` : `Wrong guess: ${lastGuessedLetter}`}
          You have made {wrongGuessCount} wrong guesses out of {languages.length}.
        </p>

        <p>Current word: {currentWord.split("").map(letter =>
          guessedLetters.includes(letter) ? letter + "." : "blank.")
          .join(" ")}</p>
      </section>

      <section className='alphabet-container'>
        {alphabetElements}
      </section>
      {isGameOver && <button className="new-game" onClick={handleNewGame}>New Game</button>}


    </main>
  )
}

export default App
