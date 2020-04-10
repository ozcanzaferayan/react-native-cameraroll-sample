import React, {useState} from 'react';
import {
  Platform,
  PermissionsAndroid,
  SafeAreaView,
  Button,
  FlatList,
  Image,
} from 'react-native';

import CameraRoll, {PhotoIdentifier} from '@react-native-community/cameraroll';

const App = () => {
  const [images, setImages] = useState<PhotoIdentifier[]>([]);

  const requestStoragePermision = () => {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      {
        title: 'Fotoğraf izni',
        message:
          'Fotoğraf görüntüleme için dosya okuma izni vermeniz gereklidir.',
        buttonNeutral: 'Daha sonra sor',
        buttonNegative: 'İptal',
        buttonPositive: 'Tamam',
      },
    )
      .then((granted) => {
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('İzin verildi');
          getPhotos();
        } else {
          console.log('İzin verilmedi');
        }
      })
      .catch((e) => console.log(e));
  };
  const handleButtonPress = () => {
    if (Platform.OS === 'android') requestStoragePermision();
    else getPhotos();
  };
  const getPhotos = () => {
    CameraRoll.getPhotos({
      first: 25,
      assetType: 'Photos',
    })
      .then((r) => {
        console.log(r);
        setImages(r.edges);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <SafeAreaView>
      {images.length === 0 && (
        <Button title="Galeriyi aç" onPress={handleButtonPress} />
      )}
      <FlatList
        data={images}
        keyExtractor={(data) => data.node.image.uri}
        numColumns={3}
        renderItem={(data) => (
          <Image
            style={{height: 200, flex: 1}}
            source={{uri: data.item.node.image.uri}}
          />
        )}
      />
    </SafeAreaView>
  );
};

export default App;
