import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TextInput, Button, Image, ScrollView, TouchableOpacity, AsyncStorageStatic } from 'react-native';
// import { AsyncStorage } from '@react-native-community';

// import { CardList } from './activities/CardList.js';

import * as SQLite from 'expo-sqlite';
import { useState, useEffect } from 'react';

import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
import * as Linking from 'expo-linking';


const prefix = Linking.createURL('/');
export default function App() {
  const linking = {
    prefixes: [prefix],
  }
  return (
    <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
      <Stack.Navigator>
        <Stack.Screen name="CardsListActivity" component={CardsListActivity} />
        <Stack.Screen name="MainActivity" component={MainActivity} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

function MainActivity() {
  

  const fiveImage = require('./assets/five.jpg')
  const crossImage = require('./assets/cross.jpg')
  const magnetImage = require('./assets/magnet.jpg')
  const barcodeImage = require('./assets/barcode.jpg')
  const cameraImage = require('./assets/camera.png')

  const cardsListActivity = require('./activities/CardList.js')

  const [ cardsInDB, setCardsInDB ] = useState([])
  // const cardsDB = useState([])
  // const cardsInDB = cardsDB[0]
  // const setCardsInDB = cardsDB[1]

  const [ password, setPassword ] = useState('')
  // const [ newCardName, setnewCardName ] = useState('')
  // const [ newBarCode, setNewBarCode ] = useState('')
  
  const state = {
    password: '',
    inputCardName: '',
    inputBarCode: ''
  }

  const db = SQLite.openDatabase('smartcardspickerdb.db')
  const needPassword = true
  db.transaction(transaction => {
    let sqlStatement = "SELECT * FROM passwords;"
    transaction.executeSql(sqlStatement, null, (tx, receivedPasswords) => {
      if(receivedPasswords.rows.length >= 1){
        needPassword = false
      }
    })
  })


  var cards = []
  cards = [
    {
      id: 1,
      cardName: "Пятёрка",
      cardType: "five",
    },
    {
      id: 2,
      cardName: "Крест",
      cardType: "cross",
    },
    {
      id: 3,
      cardName: "Магнито",
      cardType: "magnet",
    },
    {
      id: 4,
      cardName: "Магнет",
      cardType: "magnet",
    }
  ]

  var cardsForOut = []

  const imageURI = 'http://books.google.com/books/content?id=PCDengEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api'
  
  db.transaction(transaction => {

    let sqlStatement = "CREATE TABLE IF NOT EXISTS smartcards (_id INTEGER PRIMARY KEY AUTOINCREMENT, cardname TEXT, barcode TEXT, cardtype TEXT);"
    transaction.executeSql(sqlStatement, null, (tx, receivedTable) => {
      console.log(`tablecreate: ${receivedTable}`)
    })

    // let sqlStatement = "INSERT INTO \"smartcards\"(cardname, barcode, cardtype) VALUES (\"" + smartCardName.getText().toString() + "\", \"" + barCode.getText().toString() + "\", \"" + cardType + "\");"
    sqlStatement = "SELECT * FROM smartcards;"
    
    transaction.executeSql(sqlStatement, null, (tx, receivedCards) => {
      cards = Array.from(receivedCards.rows)
      // console.log(`cards: ${Object.values(Object.values(cards)[0])}`)
      
      // console.log(`cards: ${cards}`)
      // console.log(`receivedCards: ${Object.values(receivedCards.rows.item(0))}`)
      
      let cardIdx = 0
      // for(let cardRow of receivedCards){
      //   for(let cardColumn of cardRow){
      //     console.log(cardColumn[0])
      //     cardsForOut = [
      //       ...cardsForOut,
      //       {
      //         _id: cardColumn[0],
      //         cardname: cardColumn[1],
      //         barcode: cardColumn[2],
      //         cardtype: cardColumn[3]
      //       }
      //     ]
      //   }
      //   cardIdx++ 
      // }

      Array.from(receivedCards.rows).forEach((cardRow, cardRowIdx) => {
        console.log(`cardRow: ${Object.values(receivedCards.rows.item(cardRowIdx))[0]}`)
        Object.values(receivedCards.rows.item(cardRowIdx)).map((cardColumn, cardColumnIdx) => {
          console.log(`cardColumn: ${cardColumn}`)
        })
        cardsForOut = [
          ...cardsForOut,
          {
            _id: Object.values(receivedCards.rows.item(cardRowIdx))[0],
            cardname: Object.values(receivedCards.rows.item(cardRowIdx))[1],
            barcode: Object.values(receivedCards.rows.item(cardRowIdx))[2],
            cardtype: Object.values(receivedCards.rows.item(cardRowIdx))[3]
          }
        ]

        // setCardsInDB([
        //   ...cardsInDB,
        //   {
        //     _id: Object.values(receivedCards.rows.item(cardRowIdx))[0],
        //     cardname: Object.values(receivedCards.rows.item(cardRowIdx))[1],
        //     barcode: Object.values(receivedCards.rows.item(cardRowIdx))[2],
        //     cardtype: Object.values(receivedCards.rows.item(cardRowIdx))[3]
        //   }
        // ])

        // setCardsInDB(cardsForOut)

        
        // useEffect(() => setCardsInDB([
        //     ...cardsInDB,
        //     {
        //       _id: Object.values(receivedCards.rows.item(cardRowIdx))[0],
        //       cardname: Object.values(receivedCards.rows.item(cardRowIdx))[1],
        //       barcode: Object.values(receivedCards.rows.item(cardRowIdx))[2],
        //       cardtype: Object.values(receivedCards.rows.item(cardRowIdx))[3]
        //     }
          // ]), [])
        
      })

      // useEffect(() => setCardsInDB(cardsForOut), [])
      setCardsInDB(cardsForOut)

      // console.log(`cardsForOut: ${cardsForOut[0].}`)

      cardsForOut.forEach(cardForOut => {
        console.log(`cardForOut: ${Object.values(cardForOut)[0]}`)
        console.log(`cardForOut: ${Object.values(cardForOut)[1]}`)
        console.log(`cardForOut: ${Object.values(cardForOut)[2]}`)
        console.log(`cardForOut: ${Object.values(cardForOut)[3]}`)
        
      })
      
    }, (tx) => {
      console.log(`error`)
    })

  })


  function checkPassword(num) {
    console.log(`набираем пароль`)
    if(password.length <= 3){
      setPassword(password + num)
      console.log(`текущий пароль: ${password}`)
      if (password.length >= 4) {
        if(needPassword){
          console.log("Создаем пароль")
          db.transaction(transaction => {
            let sqlStatement = `INSERT INTO \"passwords\"(password) VALUES (\"${password}\");`
            transaction.executeSql(sqlStatement, null, (tx, receivedPassword) => {
              console.log("успешное создание пароля")
            }, (tx) => {
              console.log("ошибка создание пароля")
              console.log("errorOfInsertPassword")
            })

          })
        } else if(!needPassword){
          console.log("пароль уже создан")
          db.transaction(transaction => {
            let sqlStatement = "CREATE TABLE IF NOT EXISTS passwords (_id INTEGER PRIMARY KEY AUTOINCREMENT, password TEXT);"
            transaction.executeSql(sqlStatement, null, (tx, receivedTable) => {
              console.log(`tablecreate: ${receivedTable}`)
            })
            sqlStatement = "SELECT * FROM passwords;"
            transaction.executeSql(sqlStatement, null, (tx, receivedPasswords) => {
              if(password.includes(receivedPasswords.rows.item(0)[1])){
                console.log("пароль совпадают")
                //загружаем окно списка прикреплённых карт
              } else if(!password.includes(receivedPasswords.rows.item(0)[1])){
                console.log("пароль не совпадают")
                
              }
            })
          })
        }
      }
    }
  }

  return (
    <View>
      
      <View style={styles.container}>
        <View style={styles.numberRow}>
          <Text style={styles.login}>Войти</Text>
        </View>
        <View style={styles.numberRow}>
          <TextInput
            secureTextEntry={true}
            style={styles.password}
            value={password}
            onChangeText={(currentPassword) => {
              state.password = currentPassword
              console.log(`Введёный пароль: ${state.password}`);
            }}
          />
        </View>
        <View style={styles.numberRow}>
          <TouchableOpacity onPress={() => {
            checkPassword("1")
          }}>
            <Text style={styles.numberCell}>1</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            checkPassword("2")
          }}>
          <Text style={styles.numberCell}>2</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            checkPassword("3")
          }}>
          <Text style={styles.numberCell}>3</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.numberRow}>
          <TouchableOpacity onPress={() => {
            checkPassword("4")
          }}>
            <Text style={styles.numberCell}>4</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            checkPassword("5")
          }}>
            <Text style={styles.numberCell}>5</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            checkPassword("6")
          }}>
            <Text style={styles.numberCell}>6</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.numberRow}>
          <TouchableOpacity onPress={() => {
            checkPassword("7")
          }}>
            <Text style={styles.numberCell}>7</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            checkPassword("8")
          }}>
            <Text style={styles.numberCell}>8</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            checkPassword("9")
          }}>
            <Text style={styles.numberCell}>9</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.numberRow}>
          <TouchableOpacity onPress={() => {
            setPassword(password.slice(0, password.length - 1)) 
          }}>
            <Text style={styles.numberCell}>C</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* <CardList></CardList> */}
    
      <View style={{
        alignItems: 'center', flexDirection: 'column'
      }}>
        
        {
          cardsInDB.map(card => {
            return (
              Object.values(card)[3].includes("five") ?
                <Image key={Object.values(card)[0]} style={{ marginTop: '15px', width: '650px', height: '250px' }} source={ fiveImage } />
                : Object.values(card)[3].includes("cross") ?
                  <Image key={Object.values(card)[0]} style={{ marginTop: '15px', width: '650px', height: '250px' }} source={ crossImage } />
                :
                  <Image key={Object.values(card)[0]} style={{ marginTop: '15px', width: '650px', height: '250px' }} source={ magnetImage } />
            )
          })
        }
        
        {/* <Image source={ require('./assets/five.jpg') } /> */}

        <View style={ styles.addCardBtnAlign }>
          <View style={ styles.addCardBtnLayout }>
            <Button color="rgb(255, 0, 0)" style={ styles.addCardBtn } title="+"
              onPress={ () => {
                console.log("Перейти в окно выбора типа карты")
              } }
            />
          </View>
        </View>
      </View>

      <View style={{
        alignItems: 'center', flexDirection: 'column'
      }}>
        <ScrollView style={styles.scrollView}>
          <TouchableOpacity onPress={() => {
            console.log("переходим в окно добавления карты")
          }}>
            <Image style={{ width: '650px', height: '250px' }} source={ fiveImage } />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            console.log("переходим в окно добавления карты")
          }}>
            <Image style={{ width: '650px', height: '250px' }} source={ crossImage } />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            console.log("переходим в окно добавления карты")
          }}>
            <Image style={{ width: '650px', height: '250px' }} source={ magnetImage } />
          </TouchableOpacity>
        </ScrollView>
      </View>
      
      <View style={ styles.cardDetail }>
        
        <Image style={{ width: '650px', height: '250px' }} source={ fiveImage } />
        
        <Text style={{
          fontSize: '36px',
          marginTop: '65px',
          marginBottom: '65px',
        }}>Пятёрочка</Text>
        
        <Image style={{ width: '250px', height: '100px' }} source={ barcodeImage } />
        
        <Text>123465789123</Text>
      </View>

      <View style={ styles.bindingCard }>
      
        <Image style={{ width: '650px', height: '250px' }} source={ fiveImage } />
        {/* <Image source={ require('./assets/magnet.jpg') } /> */}
        
        <Text>Введите название карты</Text>
        <TextInput
            style={styles.inputLabel}
            onChangeText={(currentCardName) => {
              state.inputCardName = currentCardName
              console.log(`Введённое имя карты: ${state.inputCardName}`);
            }}
          />
        <Text>Введите штрихкод</Text>
        
        <View style={{ alignItems: 'center', flexDirection: 'row' }}>
          <TextInput
            style={styles.inputLabel}
            onChangeText={(currentBarCode) => {
              state.inputBarCode = currentBarCode
              console.log(`Введённое штрих-код карты: ${state.inputBarCode}`);
            }}
          />
            <TouchableOpacity onPress={() => {
              console.log("открываем камеру")
            }}>
              <Image style={{ margin: '15px', width: '30px', height: '30px' }} source={ cameraImage } />
            </TouchableOpacity>
          
          </View>

          <View style={ styles.addCardBtnLayout }>
            <Button color="rgb(255, 0, 0)" style={ styles.addCardBtn } title="Прикрепить карту" 
              onPress={ () => {
                console.log("Добавить карту")
                let transaction = db.transaction(transaction => {

                  // let sqlStatement = "INSERT INTO \"smartcards\"(cardname, barcode, cardtype) VALUES (\"five\", \"123456789\", \"five\");"
                  let sqlStatement = `INSERT INTO \"smartcards\"(cardname, barcode, cardtype) VALUES (\"${state.inputCardName}\", \"${state.inputBarCode}\", \"cross\");`
                  
                  transaction.executeSql(sqlStatement, null, (tx, card) => {
                    console.log("successOfInsert")
                  }, (tx) => {
                    console.log("errorOfInsert")
                  })

                })
                
              } }
            />
          </View>
      </View>
    
    </View>
  );

}

function CardsListActivity() {
  

  const fiveImage = require('./assets/five.jpg')
  const crossImage = require('./assets/cross.jpg')
  const magnetImage = require('./assets/magnet.jpg')
  const barcodeImage = require('./assets/barcode.jpg')
  const cameraImage = require('./assets/camera.png')

  const [ cardsInDB, setCardsInDB ] = useState([])
  
  
  const db = SQLite.openDatabase('smartcardspickerdb.db')
  
  var cards = []
  cards = [
    {
      id: 1,
      cardName: "Пятёрка",
      cardType: "five",
    },
    {
      id: 2,
      cardName: "Крест",
      cardType: "cross",
    },
    {
      id: 3,
      cardName: "Магнито",
      cardType: "magnet",
    },
    {
      id: 4,
      cardName: "Магнет",
      cardType: "magnet",
    }
  ]

  var cardsForOut = []

  db.transaction(transaction => {

    let sqlStatement = "CREATE TABLE IF NOT EXISTS smartcards (_id INTEGER PRIMARY KEY AUTOINCREMENT, cardname TEXT, barcode TEXT, cardtype TEXT);"
    transaction.executeSql(sqlStatement, null, (tx, receivedTable) => {
      console.log(`tablecreate: ${receivedTable}`)
    })

    sqlStatement = "SELECT * FROM smartcards;"
    
    transaction.executeSql(sqlStatement, null, (tx, receivedCards) => {
      cards = Array.from(receivedCards.rows)
      let cardIdx = 0
      Array.from(receivedCards.rows).forEach((cardRow, cardRowIdx) => {
        console.log(`cardRow: ${Object.values(receivedCards.rows.item(cardRowIdx))[0]}`)
        Object.values(receivedCards.rows.item(cardRowIdx)).map((cardColumn, cardColumnIdx) => {
          console.log(`cardColumn: ${cardColumn}`)
        })
        cardsForOut = [
          ...cardsForOut,
          {
            _id: Object.values(receivedCards.rows.item(cardRowIdx))[0],
            cardname: Object.values(receivedCards.rows.item(cardRowIdx))[1],
            barcode: Object.values(receivedCards.rows.item(cardRowIdx))[2],
            cardtype: Object.values(receivedCards.rows.item(cardRowIdx))[3]
          }
        ]
      })
      setCardsInDB(cardsForOut)
      cardsForOut.forEach(cardForOut => {
        console.log(`cardForOut: ${Object.values(cardForOut)[0]}`)
        console.log(`cardForOut: ${Object.values(cardForOut)[1]}`)
        console.log(`cardForOut: ${Object.values(cardForOut)[2]}`)
        console.log(`cardForOut: ${Object.values(cardForOut)[3]}`)
        
      })
    }, (tx) => {
      console.log(`error`)
    })
  })
  return (
    <View>
      <View style={{
        alignItems: 'center', flexDirection: 'column'
      }}>
        
        {
          cardsInDB.map(card => {
            return (
              Object.values(card)[3].includes("five") ?
                <Image key={Object.values(card)[0]} style={{ marginTop: '15px', width: '650px', height: '250px' }} source={ fiveImage } />
                : Object.values(card)[3].includes("cross") ?
                  <Image key={Object.values(card)[0]} style={{ marginTop: '15px', width: '650px', height: '250px' }} source={ crossImage } />
                :
                  <Image key={Object.values(card)[0]} style={{ marginTop: '15px', width: '650px', height: '250px' }} source={ magnetImage } />
            )
          })
        }
        
        {/* <Image source={ require('./assets/five.jpg') } /> */}

        <View style={ styles.addCardBtnAlign }>
          <View style={ styles.addCardBtnLayout }>
            <Button color="rgb(255, 0, 0)" style={ styles.addCardBtn } title="+"
              onPress={ () => {
                console.log("Перейти в окно выбора типа карты")
              } }
            />
          </View>
        </View>
      </View>
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%'
  },
  numberRow: {
    textAlign: 'center',
    flexDirection: 'row',  
  },
  numberCell: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    margin: '35px',
    width: '50px',
    height: '50px',
    borderRadius: '15px',
    backgroundColor: 'rgb(255, 0, 0)'
  },
  password: {
    marginTop: '15px',
    padding: '15px',
    border: '1px solid black',
    borderRadius: '10px',
    textAlign: 'center'
  },
  login: {
    fontSize: '24px'
  },
  addCardBtn: {
    borderRadius: '135px'
  },
  addCardBtn: {
    
  },
  addCardBtnLayout: {
    borderRadius: '100%',
    width: '150px',
    height: '150px',   
  },
  addCardBtnAlign: {
    alignItems: 'center'
  },
  cardDetail: {
    alignItems: 'center'
  },
  bindingCard: {
    alignItems: 'center'
  },
  inputLabel: {
    borderBottomColor: 'black',
    borderBottomWidth: '1px'
  }
});
