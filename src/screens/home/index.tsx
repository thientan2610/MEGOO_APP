import {observer} from 'mobx-react';
import {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import Carousel from 'react-native-reanimated-carousel';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Slider from '@react-native-community/slider';
import {useFocusEffect} from '@react-navigation/native';

import appStore from '../../common/store/app.store';
import {Colors} from '../../constants/color.const';
import RouteNames from '../../constants/route-names.const';
import {getUserGroup} from '../../services/group.service';
import {getAllPackage} from '../package/screens/PackageScreen/services/package.service';
import TodoItem from './screens/components/Todo/TodoItem';
import styles from './screens/styles/styles';
import {getTodosList} from './screens/todos/TodosListScreen/services/todos.list.service';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const HomeScreen = ({navigation}: {navigation: any}) => {
  const [loading, setLoading] = useState(true);

  const [extentions, setExtentions] = useState<
    {
      id: string;
      iconName: string;
      iconSize: number;
      name: string;
      routeName: string;
    }[]
  >([
    // {
    //   id: '1',
    //   iconName: 'scissors-cutting',
    //   iconSize: 26,
    //   name: 'Quản lý nợ',
    //   routeName: RouteNames.BILL_LIST_STACK,
    // },
    // {
    //   id: '2',
    //   iconName: 'piggy-bank-outline',
    //   iconSize: 26,
    //   name: 'Quản lý quỹ',
    //   routeName: RouteNames.FUND_LIST_STACK,
    // },
    {
      id: '3',
      iconName: 'checkbox-outline',
      iconSize: 24,
      name: 'Việc cần làm',
      routeName: RouteNames.TODOS_LIST_STACK,
    },
    {
      id: '4',
      iconName: 'calendar-outline',
      iconSize: 24,
      name: 'Lịch biểu',
      routeName: RouteNames.TASK_LIST_STACK,
    },
    // {
    //   id: '5',
    //   iconName: 'percent-outline',
    //   iconSize: 24,
    //   name: 'Lãi suất',
    //   routeName: RouteNames.BANK_INTEREST_RATE,
    // },
  ]);

  const [packages, setPackages] = useState([]);
  const [groups, setGroups] = useState<
    {
      _id: string;
    }[]
  >([]);
  const [todos, setTodos] = useState<any[]>([]);

  const [modalVisible, setModalVisible] = useState(false);

  const getPackages = async () => {
    const pkgs = await getAllPackage();
    setPackages(pkgs.data);
  };

  const getGroups = async () => {
    const groups = await getUserGroup();

    setGroups(
      groups?.groups?.map((groupItem: any) => {
        return {
          _id: groupItem._id ? groupItem._id : '',
        };
      }),
    );
  };

  const getTodos = async () => {
    if (groups && groups.length > 0) {
      let newTodosArray: any[] = [];
      for (const group of groups) {
        console.log('groupId:', group._id);

        const todosList = await getTodosList(group._id);
        // console.log('todos:', JSON.stringify(todosList.group.todos, null, 2));

        // Create a new array to store the todos
        const updatedTodos = todosList.group.todos.map((todosItem: any) => {
          return {
            groupId: group._id,
            _id: todosItem._id,
            summary: todosItem.summary,
            todos: todosItem.todos.map((todoItem: any) => {
              return {
                _id: todoItem._id,
                todo: todoItem.todo,
                description: todoItem.description,
                isCompleted: todoItem.isCompleted,
              };
            }),
            state: todosItem.state,
          };
        });

        // console.log('updatedTodos:', JSON.stringify(updatedTodos, null, 2));

        const todosNotFullCompleted = updatedTodos.filter(
          (todos: {
            groupId: string;
            _id: string;
            summary: string;
            todos: {
              _id: string;
              todo: string;
              description: string;
              isCompleted: boolean;
            }[];
            state: string;
          }) => {
            return todos.todos.some(
              (todoItem: {
                _id: string;
                todo: string;
                description: string;
                isCompleted: boolean;
              }) => {
                return !todoItem.isCompleted;
              },
            );
          },
        );

        // console.log('todosNotFullCompleted:', todosNotFullCompleted);

        newTodosArray = newTodosArray.concat(todosNotFullCompleted);
        // console.log(newTodosArray);
        setTodos(newTodosArray);
      }
    }
  };

  useEffect(() => {
    // if (appStore.isLoggedIn) {
    //   getGroups();
    // } else {
    //   getPackages();
    // }

    getGroups();
    getPackages();

    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  // useFocusEffect(
  //   useCallback(() => {
  //     // if (appStore.isLoggedIn) {
  //     //   getGroups();
  //     // } else {
  //     //   getPackages();
  //     // }

  //     getGroups();
  //     getPackages();

  //     return () => {
  //       // Code to clean up the effect when the screen is unfocused
  //     };
  //   }, []),
  // );

  useEffect(() => {
    getTodos();
  }, [groups]);

  // useEffect(() => {
  //   console.log('todos:', JSON.stringify(todos, null, 2));
  // }, [todos]);

  const renderPackageItem = ({item}: {item: any}) => {
    const [noOfMemb, setNoOfMemb] = useState(item.noOfMember);
    const [duration, setDuration] = useState(item.duration);
    const [totalPrice, setTotalPrice] = useState(item.price);

    const calculatePrice = () => {
      if (item.name === 'Family Package') {
        let price = (item.price + item.noOfMember * item.duration * 0) * 0.7;

        setTotalPrice(price);
      } else if (item.name === 'Customized Package') {
        let price =
          duration >= 12
            ? (item.price + (noOfMemb - 2) * duration * item.coefficient) * 0.7
            : item.price + (noOfMemb - 2) * duration * item.coefficient;

        let roundPrice = Math.round(price);

        setTotalPrice(roundPrice);
      } else if (item.name === 'Annual Package') {
        let price =
          (item.price + (noOfMemb - 2) * item.duration * item.coefficient) *
          0.7;

        let roundPrice = Math.round(price);

        setTotalPrice(roundPrice);
      } else if (item.name === 'Experience Package') {
        let price =
          item.price + (noOfMemb - 2) * item.duration * item.coefficient;

        setTotalPrice(price);
      }
    };

    useEffect(() => {
      calculatePrice();
    }, [noOfMemb, duration]);

    return (
      <View style={styles.carouselItemContainer} key={item._id}>
        <View style={styles.carouselItem}>
          <View>
            <Text style={styles.pkgTitle} numberOfLines={2}>
              {item.name}
            </Text>

            <View style={styles.infoRow}>
              <Text style={styles.text}>Thời hạn:</Text>
              <Text style={[styles.text, {fontWeight: 'bold'}]}>
                {duration !== item.duration ? duration : item.duration} tháng
              </Text>
            </View>
            {item.name === 'Customized Package' ? (
              <Slider
                style={{width: '100%', height: 30}}
                step={1}
                value={duration !== item.duration ? duration : item.duration}
                minimumValue={0}
                maximumValue={12}
                lowerLimit={1}
                thumbTintColor={Colors.text.orange}
                minimumTrackTintColor={Colors.text.orange}
                maximumTrackTintColor={Colors.text.lightgrey}
                onValueChange={value => {
                  setDuration(value);
                }}
              />
            ) : null}

            <View
              style={
                // styles.infoRow
                {
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 20,
                }
              }>
              <Text style={styles.text}>Số lượng thành viên:</Text>
              <Text style={[styles.text, {fontWeight: 'bold'}]}>
                {noOfMemb !== item.noOfMember ? noOfMemb : item.noOfMember}{' '}
                người
              </Text>
            </View>
            {item.name !== 'Family Package' ? (
              <Slider
                style={{width: '100%', height: 30}}
                step={1}
                value={
                  noOfMemb !== item.noOfMember ? noOfMemb : item.noOfMember
                }
                minimumValue={0}
                maximumValue={10}
                thumbTintColor={Colors.text.orange}
                minimumTrackTintColor={Colors.text.orange}
                maximumTrackTintColor={Colors.text.lightgrey}
                lowerLimit={2}
                onValueChange={value => {
                  console.log('slider noofmemb value', value);

                  setNoOfMemb(value);
                }}
              />
            ) : null}

            <View
              style={
                // styles.infoRow
                {
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 20,
                }
              }>
              <Text style={styles.text}>Giá tiền: </Text>
              <Text style={[styles.text, {fontSize: 24, fontWeight: 'bold'}]}>
                {totalPrice} VNĐ
              </Text>
            </View>

            <View
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 20,
              }}>
              <Text style={styles.text}>Mô tả:</Text>
              <Text
                style={[
                  styles.text,
                  {textAlign: 'center', fontWeight: 'bold'},
                ]}>
                {item.description}
              </Text>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setModalVisible(true);
              }}>
              <Text style={styles.buttonText} numberOfLines={2}>
                Mua ngay
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setModalVisible(true);
              }}>
              <Text style={styles.buttonText} numberOfLines={2}>
                Thêm vào {'\n'}giỏ hàng
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderTodoItem = () => {
    if (todos && todos.length > 0) {
      return todos.map(
        (todo: {
          _id: string;
          summary: string;
          todos: {
            _id: string;
            todo: string;
            description: string;
            isCompleted: boolean;
          }[];
        }) => {
          return <TodoItem todosItem={todo} key={todo._id} />;
        },
      );
    } else {
      return null;
    }
  };

  const renderExtensions = () => {
    return extentions.map(item => {
      return (
        <View
          style={{
            width: 170,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 5,
            marginHorizontal: 5,
          }}
          key={item.id}>
          <TouchableOpacity
            style={styles.utility}
            onPress={() => {
              appStore.isLoggedIn
                ? navigation.navigate(item.routeName, {})
                : setModalVisible(true);
            }}>
            {/* <Text style={styles.utilityText}>Quản lý chi tiêu</Text> */}
            <MaterialCommunityIcons
              name={item.iconName}
              size={item.iconSize}
              color={Colors.icon.orange}
            />
          </TouchableOpacity>
          <Text
            style={{
              color: Colors.text.grey,
              fontSize: 14,
            }}>
            {item.name}
          </Text>
        </View>
      );
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {loading ? (
        <ActivityIndicator
          size="large"
          color="orange"
          style={{
            flex: 1,
            justifyContent: 'center',
          }}
        />
      ) : (
        <>
          {appStore.isLoggedIn ? null : (
            <View style={[styles.utilitiesContainer]}>
              <Text style={[styles.title, {width: '100%'}]}>
                Gói người dùng
              </Text>
              {/* <ScrollView
                style={{flex: 1, height: 150}}
                horizontal={true}
                showsHorizontalScrollIndicator={true}>
                {packages.map((item: any) => renderPackageItem(item))}
              </ScrollView> */}
              <Carousel
                loop={false}
                mode="parallax"
                modeConfig={{
                  parallaxScrollingScale: 1,
                  parallaxScrollingOffset: 50,
                }}
                width={width * 0.9}
                height={height * 0.6}
                // autoPlay={true}
                data={packages}
                scrollAnimationDuration={1000}
                onSnapToItem={index => console.log('current index:', index)}
                renderItem={renderPackageItem}
              />
            </View>
          )}

          <View style={styles.utilitiesContainer}>
            <Text style={[styles.title, {width: '100%'}]}>
              Tiện ích và chức năng
            </Text>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                // height: 40,
                marginBottom: 10,
                paddingVertical: 10,
                // backgroundColor: 'pink',
                width: '100%',
                justifyContent: 'space-between',
              }}>
              {renderExtensions()}
            </View>
            {/* <Carousel
                loop={false}
                mode="parallax"
                modeConfig={{
                  parallaxScrollingScale: 1,
                  parallaxScrollingOffset: 250,
                }}
                width={width * 0.9}
                height={height * 0.1}
                // autoPlay={true}
                data={extentions}
                scrollAnimationDuration={1000}
                onSnapToItem={index => console.log('current index:', index)}
                renderItem={renderExtensions}
              /> */}
          </View>

          {appStore.isLoggedIn ? (
            <View style={[styles.utilitiesContainer, {marginTop: -10}]}>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>Việc cần làm</Text>

                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate(RouteNames.TODOS_LIST_STACK, {})
                  }>
                  {todos.length > 0 ? (
                    <Text style={styles.subTitle}>Xem tất cả</Text>
                  ) : (
                    <Ionicons
                      name="add-circle-outline"
                      color={Colors.icon.orange}
                      size={24}
                    />
                  )}
                </TouchableOpacity>
              </View>
              {renderTodoItem()}
            </View>
          ) : null}
        </>
      )}
      <Modal isVisible={modalVisible}>
        <View
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            backgroundColor: Colors.background.white,
            borderRadius: 10,
            padding: 10,
          }}>
          <TouchableOpacity
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'flex-end',
            }}
            onPress={() => {
              setModalVisible(false);
            }}>
            <Ionicons name="close" color={Colors.text.grey} size={24} />
          </TouchableOpacity>
          <View
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 10,
            }}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
              }}>
              <Text
                style={{
                  fontSize: 18,
                  textAlign: 'center',
                  color: Colors.text.grey,
                }}>
                Vui lòng{' '}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  navigation.navigate(RouteNames.LOGIN, {});
                }}>
                <Text
                  style={{
                    fontSize: 18,
                    textAlign: 'center',
                    color: Colors.text.orange,
                  }}>
                  đăng nhập/đăng ký
                </Text>
              </TouchableOpacity>
            </View>
            <Text
              style={{
                fontSize: 18,
                textAlign: 'center',
                color: Colors.text.grey,
              }}>
              để sử dụng chức năng này
            </Text>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default observer(HomeScreen);
