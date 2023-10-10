import React, {useState} from 'react';

import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';

import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import RNTextDetector from 'rn-text-detector';

import {Colors} from 'react-native/Libraries/NewAppScreen';

function App(): JSX.Element {
  const [extractedText, setExtractedText] = useState(null);
  const [imageURI, setImageURI] = useState(null);

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  function onPress(type: 'capture' | 'library') {
    type === 'capture'
      ? launchCamera({mediaType: 'image'}, onImageSelect)
      : launchImageLibrary({mediaType: 'image'}, onImageSelect);
  }

  async function onImageSelect(media: {assets: [{uri: string}]}) {
    if (!!media && media.assets) {
      const file = media.assets[0].uri;
      const recognition = await RNTextDetector.detectFromUri(file);
      const textRecognition = recognition[0]?.text;

      setImageURI(file);

      if (textRecognition) {
        setExtractedText(textRecognition.split('\n'));
      }
    }
  }

  return (
    <SafeAreaView style={backgroundStyle}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <View>
            <Text style={styles.sectionTitle}>Detector de Texto</Text>
            <View>
              <TouchableOpacity
                style={styles.button}
                onPress={() => onPress('capture')}>
                <Text>Tirar foto</Text>
              </TouchableOpacity>
              <View>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => onPress('library')}>
                  <Text>Carregar foto</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.imageContainer}>
                {imageURI && (
                  <Image source={{uri: imageURI}} style={styles.image} />
                )}
              </View>
              <View style={styles.sectionTitle}>
                {extractedText &&
                  extractedText?.map((text, index) => {
                    return <Text style={styles.itemsText} key={`${text}-${index}`}>{text}</Text>;
                  })}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  itemsText: {
    fontSize: 15,
    color: '#000',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
    padding: 10,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
    margin: 10,
  },
  button: {
    backgroundColor: '#4CAF50',
    color: '#fff',
    fontWeight: 'bold',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  image: {
    width: 300,
    height: 200,
    borderRadius: 5,
    resizeMode: 'cover',
  },
});

export default App;
