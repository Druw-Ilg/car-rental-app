import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, Image } from 'react-native';
import { Searchbar, Card, Title } from 'react-native-paper';
import Header from './Header';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const CustomSearchIcon = () => (
  <View style={{ marginRight: 10 }}>
   
    <Icon name="magnify" size={40} color="white" />
  </View>
);

const HomeScreen = () => {

  return (
    <SafeAreaView style={styles.container}>
      
      <View style={styles.blueWrapper}>
        
        <Header/>
        
        <Searchbar
          style={styles.searchBar}
          placeholder="Une marque ou un concessionnaire"
          placeholderTextColor="#fff"
          inputStyle={{color: 'white'}}
          icon={() => <CustomSearchIcon/>}
        />

        {/* Welcome text */}
        <Text style={styles.headerText}>Louer un véhicule n&apos;a jamais été aussi facile.</Text>

        {/* Cards at the bottom */}
        <View style={styles.cardsContainer}>
            <Card style={styles.card}>
              <Card.Content>
              <Image
                  // eslint-disable-next-line no-undef
                  source={require('../../assets/blue-sedan.jpg')}
                  style={styles.cardImage}
                />
                <Title style={styles.carTypes}>Sedan</Title>
              </Card.Content>
            </Card>

            <Card style={styles.card}>
              <Card.Content>
              <Image
                  // eslint-disable-next-line no-undef
                  source={require('../../assets/blue-suv.jpg')}
                  style={styles.cardImage}
                />
                <Title style={styles.carTypes}>SUV</Title>
              </Card.Content>
            </Card>
          </View>
      </View>
      
      <View style={styles.sectionPopulaire}>
          <Title style={styles.titleSection}>Populaire</Title>
          <Title style={styles.subTitleSection}>Tout voir</Title>

          <View>
            <Card>
          <Card.Title title="Card Title" subtitle="Card Subtitle"  />
          <Card.Content>
            <Text variant="titleLarge">Card title</Text>
            <Text variant="bodyMedium">Card content</Text>
          </Card.Content>
          <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
          <Card.Actions>
          </Card.Actions>
        </Card>
          </View>
        </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  blueWrapper: {
    backgroundColor: 'rgb(40 52 74)',
    alignItems: 'center',
    marginBottom: 100
  },
  
  searchBar: {
    width:'80%',
    backgroundColor: 'transparent',
    marginTop: 30,
    marginBottom: 30,
    borderColor:'#f2f2f3',
    borderBottomWidth:1,
    borderRadius:0,
    opacity: 0.6
  },
  headerText:{
    color: '#f3f3f3',
    fontSize: 30,
    textAlign: 'center'
  },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 80,
    marginBottom: -70
  },
  card: {
    width: '45%',
    margin: 5,
    padding: 5,
    backgroundColor: 'white',
  },
  cardImage: {
    width: '100%',
    height: 85,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  carTypes:{
    textAlign:'center',
    
  },
  sectionPopulaire:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10
  },
  titleSection:{
    fontWeight:'800',
    fontSize:26,
    textDecorationLine: 'underline',
    color: 'rgb(40 52 74)'
  },
  subTitleSection:{
    fontSize: 20,
    fontWeight: 400,
    color: 'rgb(40 52 74)',
  }
});

export default HomeScreen;
