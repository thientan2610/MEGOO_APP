import {observer} from 'mobx-react';
import {FC} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {
  Asset,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import Modal from 'react-native-modal';

import {Colors} from '../../../constants/color.const';

interface IImageSelectionOptionModalProps {
  title: string;
  isModalOpen: boolean;
  setIsModalOpen: (state: boolean) => void;
  fnUpdateSelectedImage: (image: string) => void; //set selected image from parent component
}

const AddImageModal: FC<IImageSelectionOptionModalProps> = ({
  title,
  isModalOpen,
  setIsModalOpen,
  fnUpdateSelectedImage,
}) => {
  return (
    <Modal isVisible={isModalOpen}>
      <View
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          backgroundColor: Colors.background.white,
          borderRadius: 10,
          padding: 20,
          gap: 15,
        }}>
        <Text
          style={{
            fontSize: 20,
            color: Colors.title.orange,
            fontWeight: 'bold',
          }}>
          {title}
        </Text>

        <View
          style={{
            width: '100%',
            display: 'flex',
            gap: 15,
          }}>
          <TouchableOpacity
            onPress={() => {
              launchCamera(
                {
                  mediaType: 'photo',
                  cameraType: 'back',
                  includeBase64: true,
                  quality: 1,
                },
                response => {
                  if (response.didCancel) {
                    console.log('User cancelled image picker');
                  } else if (response.errorMessage) {
                    console.log('ImagePicker Error: ', response.errorMessage);
                  } else {
                    const source: Asset[] = response.assets as Asset[];

                    if (
                      source?.[0]?.uri &&
                      fnUpdateSelectedImage &&
                      source?.[0]?.base64
                    ) {
                      const fileExtension = source[0].uri.split('.').pop();
                      const base64String = `data:image/${fileExtension};base64,${source[0].base64}`;

                      fnUpdateSelectedImage(base64String);

                      console.log(
                        'take pic base64String:',
                        base64String.slice(0, 100),
                      );
                    }
                    setIsModalOpen(false);
                  }
                },
              );
            }}>
            <Text
              style={{
                fontSize: 16,
                textAlign: 'justify',
                color: Colors.text.grey,
                fontWeight: 'bold',
              }}>
              Chụp hình
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={async () => {
              await launchImageLibrary(
                // If need base64String, include this option:
                // includeBase64: true
                {mediaType: 'photo', includeBase64: true, selectionLimit: 1},
                response => {
                  // console.log('Response = ', response);
                  if (response.didCancel) {
                    console.log('User cancelled image picker');
                  } else if (response.errorMessage) {
                    console.log('ImagePicker Error: ', response.errorMessage);
                  } else {
                    let source: Asset[] = response.assets as Asset[];
                    if (
                      source?.[0]?.uri &&
                      fnUpdateSelectedImage &&
                      source?.[0]?.base64
                    ) {
                      const fileExtension = source[0].uri.split('.').pop();
                      const base64String = `data:image/${fileExtension};base64,${source[0].base64}`;

                      fnUpdateSelectedImage(base64String);
                    }
                    setIsModalOpen(false);
                  }
                },
              );
            }}>
            <Text
              style={{
                fontSize: 16,
                textAlign: 'justify',
                color: Colors.text.grey,
                fontWeight: 'bold',
              }}>
              Chọn từ thư viện
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => {
            console.log('Clicked');
            setIsModalOpen(!isModalOpen);
          }}>
          <Text
            style={{
              fontSize: 16,
              textAlign: 'right',
              color: Colors.text.grey,
            }}>
            Đóng
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

// const AddImageModal = ({title, isOpen}: {title: string; isOpen: boolean}) => {
//   return (
//     <Modal isVisible={isOpen}>
//       <View
//         style={{
//           width: '100%',
//           // display: 'flex',
//           // justifyContent: 'center',
//           backgroundColor: Colors.background.white,
//           // borderRadius: 10,
//           // padding: 20,
//           // gap: 15,
//         }}>
//         <Text
//           style={{
//             fontSize: 20,
//             color: Colors.title.orange,
//             fontWeight: 'bold',
//           }}>
//           {title}
//         </Text>
//         {/*
//         <View
//           style={{
//             width: '100%',
//             display: 'flex',
//             gap: 15,
//           }}>
//           <TouchableOpacity>
//             <Text
//               style={{
//                 fontSize: 16,
//                 textAlign: 'justify',
//                 color: Colors.text.grey,
//                 fontWeight: 'bold',
//               }}>
//               Chụp hình
//             </Text>
//           </TouchableOpacity>
//           <TouchableOpacity>
//             <Text
//               style={{
//                 fontSize: 16,
//                 textAlign: 'justify',
//                 color: Colors.text.grey,
//                 fontWeight: 'bold',
//               }}>
//               Chọn từ thư viện
//             </Text>
//           </TouchableOpacity>
//         </View> */}

//         <TouchableOpacity
//           onPress={() => {
//             console.log('Clicked');

//             // fnOpenModal(!isOpen);
//           }}>
//           <Text
//             style={{
//               fontSize: 16,
//               textAlign: 'right',
//               color: Colors.text.grey,
//             }}>
//             Đóng
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </Modal>
//   );
// };
export default observer(AddImageModal);
