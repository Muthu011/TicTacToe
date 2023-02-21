import React, {useState, useEffect, useRef} from 'react';
import {
  ImageBackground,
  SafeAreaView,
  ScrollView,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Alert,
  TouchableOpacity,
} from 'react-native';
import Cell from '../../components/Cell';
import Confetti from 'react-native-confetti';

const Home = () => {
  const [gameMap, setGameMap] = useState([
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
  ]);
  const [gameMode, setGameMode] = useState('BOT_MEDIUM'); // LOCAL, BOT_EASY, BOT_MEDIUM;

  const [currentTurn, setCurrentTurn] = useState('x');
  const confettiRef = useRef();

  useEffect(() => {
    setTimeout(() => {
      if (currentTurn === 'o' && gameMode !== 'LOCAL') {
        botTurn();
      }
    }, 1000);

    return () => {};
  }, [currentTurn, gameMode]);

  useEffect(() => {
    const winner = getWinner(gameMap);

    if (winner) {
      setTimeout(() => {
        gameWon(winner);
      }, 5000);
    } else {
      setTimeout(() => {
        checkTieState();
      }, 5000);
    }

    return () => {};
  }, [gameMap]);

  const onPress = (rowIndex, columnIndex) => {
    if (gameMap[rowIndex][columnIndex] !== '') {
      Alert.alert('Position Already Occupied');
      return;
    }

    setGameMap(existingMap => {
      const updatedMap = [...existingMap];
      updatedMap[rowIndex][columnIndex] = currentTurn;
      return updatedMap;
    });

    setCurrentTurn(currentTurn === 'x' ? 'o' : 'x');
  };

  const onClickReset = () => {
    setGameMap([
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ]);

    setCurrentTurn('x');
  };

  const gameWon = player => {
    Alert.alert('Hurray', `Player ${player.toUpperCase()} won`, [
      {text: 'Restart', onPress: onClickReset},
    ]);

    triggerConfetti();
  };

  const getWinner = winnerMap => {
    //check rows
    for (let i = 0; i < 3; i++) {
      const isRowXWinning = winnerMap[i].every(cell => cell === 'x');
      const isRowOWinning = winnerMap[i].every(cell => cell === 'o');

      if (isRowXWinning) {
        return 'x';
      }

      if (isRowOWinning) {
        return 'o';
      }
    }

    //Check Columns

    for (let col = 0; col < 3; col++) {
      let isColXWinning = true;
      let isColOWinning = true;
      for (let row = 0; row < 3; row++) {
        if (winnerMap[row][col] !== 'x') {
          isColXWinning = false;
        }
        if (winnerMap[row][col] !== 'o') {
          isColOWinning = false;
        }
      }

      if (isColXWinning) {
        return 'x';
        break;
      }

      if (isColOWinning) {
        return 'o';
        break;
      }
    }

    //Diagonal Check

    let isDiagonal1OWinning = true;
    let isDiagonal1XWinning = true;
    let isDiagonal2OWinning = true;
    let isDiagonal2XWinning = true;

    for (let i = 0; i < 3; i++) {
      if (winnerMap[i][i] !== 'o') {
        isDiagonal1OWinning = false;
      }
      if (winnerMap[i][i] !== 'x') {
        isDiagonal1XWinning = false;
      }
      if (winnerMap[i][2 - i] !== 'o') {
        isDiagonal2OWinning = false;
      }

      if (winnerMap[i][2 - i] !== 'x') {
        isDiagonal2XWinning = false;
      }
    }

    if (isDiagonal1OWinning || isDiagonal2OWinning) {
      return 'o';
    }

    if (isDiagonal1XWinning || isDiagonal2XWinning) {
      return 'x';
    }
  };

  const checkTieState = () => {
    if (!gameMap.some(row => row.some(cell => cell === ''))) {
      Alert.alert('Its a tie', `tie`, [
        {text: 'Restart', onPress: onClickReset},
      ]);
    }
  };

  const botTurn = () => {
    const possiblePositions = [];
    gameMap.forEach((row, rowIndex) => {
      row.map((cell, columnIndex) => {
        if (cell === '') {
          possiblePositions.push({row: rowIndex, col: columnIndex});
        }
      });
    });

    console.log('possiblePositions ', possiblePositions);

    let chosenOption;

    if (gameMode === 'BOT_MEDIUM') {
      //Attack
      possiblePositions.forEach(pos => {
        const mapCopy = copyMap(gameMap);
        mapCopy[pos.row][pos.col] = 'o';
        const winner = getWinner(mapCopy);
        if (winner === 'o') {
          chosenOption = pos;
        }
      });

      if (!chosenOption) {
        //Defend
        possiblePositions.forEach(pos => {
          const mapCopy = copyMap(gameMap);
          mapCopy[pos.row][pos.col] = 'x';

          const winner = getWinner(mapCopy);
          if (winner === 'x') {
            chosenOption = pos;
          }
        });

        console.log('chosenOption', copyMap(gameMap));
      }
    }
    // choose random
    if (!chosenOption) {
      chosenOption =
        possiblePositions[Math.floor(Math.random() * possiblePositions.length)];
    }
    if (chosenOption) {
      onPress(chosenOption.row, chosenOption.col);
    }
  };

  const triggerConfetti = () => {
    confettiRef?.current?.startConfetti();

    setTimeout(() => {
      confettiRef?.current?.stopConfetti();
    }, 5000);
  };

  const copyMap = arr => {
    return JSON.parse(JSON.stringify(arr));
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={onClickReset}>
        <View
          style={[
            {
              backgroundColor: '#4F5686',
              width: 120,
              height: 40,
              justifyContent: 'center',
              alignItems: 'center',
            },
          ]}>
          <Text style={{fontSize: 16, color: '#fff', fontWeight: '600'}}>
            Reset
          </Text>
        </View>
      </TouchableOpacity>
      <ImageBackground
        style={styles.backImg}
        source={require('../../assets/images/bg.jpeg')}
        resizeMode={'contain'}>
        <Confetti ref={confettiRef} />

        <Text
          style={{
            fontSize: 24,
            color: 'white',

            position: 'absolute',
            top: 50,
          }}>
          Current Turn : {currentTurn.toUpperCase()}
        </Text>
        <View style={styles.map}>
          {gameMap.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
              {row.map((cell, columnIndex) => (
                <Cell
                  cell={cell}
                  key={columnIndex}
                  onPress={() => {
                    if (gameMode !== 'Local' && currentTurn === 'o') {
                      return;
                    }
                    onPress(rowIndex, columnIndex);
                  }}
                />
              ))}
            </View>
          ))}
        </View>
        <View style={styles.buttons}>
          <Text
            onPress={() => setGameMode('LOCAL')}
            style={[
              styles.button,
              {backgroundColor: gameMode === 'LOCAL' ? '#4F5686' : '#191F24'},
            ]}>
            Local
          </Text>
          <Text
            onPress={() => setGameMode('BOT_EASY')}
            style={[
              styles.button,
              {
                backgroundColor:
                  gameMode === 'BOT_EASY' ? '#4F5686' : '#191F24',
              },
            ]}>
            Easy Bot
          </Text>
          <Text
            onPress={() => setGameMode('BOT_MEDIUM')}
            style={[
              styles.button,
              {
                backgroundColor:
                  gameMode === 'BOT_MEDIUM' ? '#4F5686' : '#191F24',
              },
            ]}>
            Medium Bot
          </Text>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#242D34',
  },
  backImg: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 15,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  map: {
    width: '80%',
    aspectRatio: 1,
    // padding: 5,
  },
  buttons: {
    position: 'absolute',
    bottom: 50,
    flexDirection: 'row',
  },
  button: {
    color: 'white',
    margin: 10,
    fontSize: 16,
    backgroundColor: '#191F24',
    padding: 10,
    paddingHorizontal: 15,
  },
});

export default Home;
