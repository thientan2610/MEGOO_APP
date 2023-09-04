import moment from 'moment';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
// import {Calendar} from 'react-native-big-calendar';
import {
  AgendaList,
  Calendar,
  CalendarProvider,
  ExpandableCalendar,
  LocaleConfig,
  WeekCalendar,
} from 'react-native-calendars';
import {MarkedDates} from 'react-native-calendars/src/types';
import Modal from 'react-native-modal';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {RouteProp, useFocusEffect, useRoute} from '@react-navigation/native';

import groupStore from '../../../../../common/store/group.store';
import {Colors} from '../../../../../constants/color.const';
import RouteNames from '../../../../../constants/route-names.const';
import {getTaskList} from './services/task.service';

// Define the type for the route params
type GroupRouteParams = {
  groupId: string;
};

// Specify the type for the route
type GroupRouteProp = RouteProp<Record<string, GroupRouteParams>, string>;

const events = [
  {
    title: 'Meeting',
    start: new Date(2023, 6, 16, 10, 0),
    end: new Date(2023, 6, 16, 10, 30),
  },
  {
    title: 'Meeting 2',
    start: new Date(2023, 6, 16, 10, 30),
    end: new Date(2023, 6, 16, 11, 30),
  },
  {
    title: 'Meeting 2',
    start: new Date(2023, 6, 16, 10, 30),
    end: new Date(2023, 6, 16, 11, 30),
  },
  {
    title: 'Meeting 2',
    start: new Date(2023, 6, 16, 10, 30),
    end: new Date(2023, 6, 16, 11, 30),
  },
  {
    title: 'Meeting 2',
    start: new Date(2023, 6, 16, 10, 30),
    end: new Date(2023, 6, 16, 11, 30),
  },
  {
    title: 'Coffee break',
    start: new Date(2023, 6, 17, 15, 45),
    end: new Date(2023, 6, 17, 16, 30),
  },
];

LocaleConfig.locales['vi'] = {
  monthNames: [
    'Tháng 1',
    'Tháng 2',
    'Tháng 3',
    'Tháng 4',
    'Tháng 5',
    'Tháng 6',
    'Tháng 7',
    'Tháng 8',
    'Tháng 9',
    'Tháng 10',
    'Tháng 11',
    'Tháng 12',
  ],
  monthNamesShort: [
    'TH1',
    'TH2',
    'TH3',
    'TH4',
    'TH5',
    'TH6',
    'TH7',
    'TH8',
    'TH9',
    'TH10',
    'TH11',
    'TH12',
  ],
  dayNames: ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'],
  dayNamesShort: ['CN', 'T.2', 'T.3', 'T.4', 'T.5', 'T.6', 'T.7'],
  today: 'Hôm nay',
};

LocaleConfig.defaultLocale = 'vi';

const TaskListScreen = ({navigation}: {navigation: any}) => {
  const route = useRoute<GroupRouteProp>();
  const groupId = groupStore.id;

  const [selectedEvent, setSelectedEvent] = useState({
    _id: '',
    title: '',
    start: '',
    end: '',
  });
  const [selected, setSelected] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [markedDates, setMarkedDates] = useState({});

  const [tasks, setTasks] = useState<
    {
      _id: string;
      summary: string;
      description: string;
      isRepeated: boolean;
      recurrence?: {};
      startDate: string;
      state: string;
      members?: {
        _id: string;
        name: string;
        email: string;
        avatar: string;
      }[];
    }[]
  >([]);

  const [taskItems, setTaskItems] = useState<
    {
      title: string;
      data: {
        _id: string;

        startTime: string;
        title: string;
        description: string;
      }[];
    }[]
  >([]);

  const getTasks = async () => {
    const response = await getTaskList(groupId);
    // console.log('Task list:', response.group.task);

    if (!response.group) {
      setTasks([]);
    } else {
      setTasks(
        response?.group?.task?.map((task: any) => {
          return {
            _id: task._id,
            summary: task.summary,
            description: task.description,
            isRepeated: task.isRepeated,
            state: task.state,
            recurrence: task?.recurrence,
            startDate: task.startDate,
            members: task?.members?.map((member: any) => ({
              _id: member._id,
              name: member.name,
              email: member.email,
              avatar: member.avatar,
            })),
          };
        }),
      );
    }
  };

  const handleEventPress = (event: any) => {
    setSelectedEvent(event);
    setIsModalVisible(true);
    console.log('event:', event);
  };

  const handleDayPress = (day: any) => {
    console.log('day:', day);

    const selectedDate = day.dateString;
    const updatedMarkedDates = {
      // ...markedDates,
      [selectedDate]: {
        selected: true,
        selectedColor: Colors.background.orange,
      },
    };
    setMarkedDates(updatedMarkedDates);
  };

  useEffect(() => {
    console.log('groupId:', groupId);
    getTasks();
  }, []);

  useFocusEffect(
    useCallback(() => {
      getTasks();
    }, []),
  );

  useEffect(() => {
    setTaskItems(
      tasks.map((task: any) => {
        return {
          title: moment(task.startDate).format('YYYY-MM-DD').toString(),
          data: [
            {
              _id: task._id,

              startTime: moment(task.startDate).format('HH:mm'),
              title: task.summary,
              description: task.description,
            },
          ],
        };
      }),
    );
  }, [tasks]);

  // useEffect(() => {
  //   console.log('taskItems:', JSON.stringify(taskItems, null, 2));
  // }, [taskItems]);

  const combinedTaskItems = taskItems.reduce((acc: any, taskItem) => {
    const existingItemIndex = acc.findIndex(
      (item: any) => item.title === taskItem.title,
    );

    if (existingItemIndex !== -1) {
      // If the date already exists in the accumulator, combine the data
      acc[existingItemIndex].data.push(...taskItem.data);
    } else {
      // If the date does not exist in the accumulator, add a new entry
      acc.push({title: taskItem.title, data: taskItem.data});
    }

    return acc;
  }, []);

  // Sort combinedTaskItems by startTime within each entry
  const sortedCombinedTaskItems = combinedTaskItems.map((item: any) => {
    const sortedData = item.data.sort((a: any, b: any) => {
      const startTimeA = moment(a.startTime, 'HH:mm:ss');
      const startTimeB = moment(b.startTime, 'HH:mm:ss');
      return startTimeA.diff(startTimeB);
    });

    return {...item, data: sortedData};
  });

  function getMarkedDates() {
    const marked: MarkedDates = {};

    sortedCombinedTaskItems.forEach((item: any) => {
      // NOTE: only mark dates with data
      if (item.data && item.data.length > 0) {
        marked[item.title] = {marked: true};
      } else {
        marked[item.title] = {disabled: true};
      }
    });
    return marked;
  }

  const marked = getMarkedDates();

  const sortedTasks = sortedCombinedTaskItems.sort((a: any, b: any) => {
    const dateA = new Date(a.title); // Convert the title to a Date object
    const dateB = new Date(b.title); // Convert the title to a Date object

    // Compare the dates
    if (dateA < dateB) {
      return -1;
    } else if (dateA > dateB) {
      return 1;
    } else {
      return 0;
    }
  });

  // useEffect(() => {
  //   console.log(
  //     'sortedCombinedTaskItems:',
  //     JSON.stringify(sortedCombinedTaskItems, null, 2),
  //   );
  // }, [sortedCombinedTaskItems]);

  const renderItem = useCallback(({item}: any) => {
    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => {
          console.log('task id:', item._id);
          navigation.navigate(RouteNames.TASK, {
            taskId: item._id,
          });
        }}>
        <Text style={styles.itemTime}>{item.startTime}</Text>
        <Text style={styles.itemTitle}>{item.title}</Text>
      </TouchableOpacity>
    );
  }, []);

  return (
    <View style={styles.container}>
      {/* <Calendar
        locale="vi"
        headerContainerStyle={{backgroundColor: 'white', paddingTop: 10}}
        // weekDayHeaderHighlightColor={Colors.title.orange}
        // dayHeaderHighlightColor={Colors.title.orange}
        // dayHeaderStyle={{backgroundColor: 'white'}}
        headerComponentStyle={{
          backgroundColor: 'white',
        }}
        mode="month"
        showAllDayEventCell={true}
        bodyContainerStyle={{
          width: Dimensions.get('window').width,
          height: '100%',
          backgroundColor: 'white',
        }}
        eventCellStyle={{
          backgroundColor: 'pink',
        }}
        events={events}
        height={600}
        eventMinHeightForMonthView={20}
        hei
        onPressEvent={handleEventPress}
      /> */}

      {/* <Calendar
        // Customize the appearance of the calendar
        style={{
          width: Dimensions.get('window').width,
          height: '100%',
        }}
        theme={{
          arrowColor: 'orange',
          todayTextColor: Colors.text.orange,
          dayTextColor: Colors.text.grey,
        }}
        // Specify the current date
        current={new Date().toDateString()}
        // Callback that gets called when the user selects a day
        onDayPress={handleDayPress}
        enableSwipeMonths={true}
        // Mark specific dates as marked
        // markedDates={{
        //   '2023-07-16': {selected: true, marked: true, selectedColor: 'orange'},
        //   '2023-07-14': {marked: true, dotColor: 'orange'},
        //   '2023-07-26': {selected: true, marked: true, selectedColor: 'orange'},
        // }}
        markedDates={markedDates}
      /> */}

      <CalendarProvider
        date={new Date().toDateString()}
        style={{width: '100%', marginBottom: 20}}>
        <ExpandableCalendar
          // markingType="multi-period"
          markedDates={marked}
          theme={{
            calendarBackground: 'white',
            arrowColor: 'orange',
            todayTextColor: Colors.text.orange,
            dayTextColor: Colors.text.grey,
            dotColor: Colors.text.orange,
            selectedDayBackgroundColor: Colors.background.orange,
            monthTextColor: Colors.text.grey,
          }}
        />

        <TouchableOpacity
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 20,
            marginTop: 20,
            gap: 5,
          }}
          onPress={() => {
            navigation.navigate(RouteNames.CREATE_TASK, {
              groupId: groupId,
            });
          }}>
          <Ionicons
            name="add-circle-outline"
            size={24}
            color={Colors.icon.orange}
          />
          <Text
            style={{
              color: Colors.text.orange,
              fontSize: 18,
              fontWeight: 'bold',
            }}>
            Thêm sự kiện
          </Text>
        </TouchableOpacity>

        <AgendaList
          sections={sortedTasks}
          renderItem={renderItem}
          // scrollToNextEvent
          sectionStyle={{
            color: Colors.text.orange,
            fontSize: 18,
            paddingTop: 20,
            paddingBottom: 0,
          }}
          style={{
            height: '100%',
            marginVertical: 0,
          }}
          // dayFormat={'yyyy-MM-d'}
        />
      </CalendarProvider>

      <Modal isVisible={isModalVisible}>
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={{
              width: '100%',
              backgroundColor: 'pink',
              display: 'flex',
              alignItems: 'center',
            }}>
            <Text style={styles.modalTitle}>{selectedEvent?.title}</Text>
            <Text style={styles.modalText}>
              {selectedEvent?.start.toString()} -{' '}
              {selectedEvent?.end.toString()}
            </Text>
          </TouchableOpacity>
          {/* Add more event information as needed */}
          <TouchableOpacity onPress={() => setIsModalVisible(false)}>
            <Text>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    // justifyContent: 'center',
    width: Dimensions.get('window').width,
    minHeight: '100%',
    backgroundColor: Colors.background.white,
  },
  modalContainer: {
    height: 400,
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: Colors.background.white,
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    color: Colors.text.grey,
    fontWeight: 'bold',
  },
  modalText: {
    width: '100%',
    fontSize: 14,
    color: Colors.text.grey,
    textAlign: 'left',
  },
  modalButtonContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 30,
  },
  itemContainer: {
    display: 'flex',
    flexDirection: 'column',
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  itemTime: {
    color: Colors.text.lightgrey,
    fontSize: 14,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.grey,
  },
});

export default TaskListScreen;
