import {useCallback, useEffect, useState} from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {RouteProp, useFocusEffect, useRoute} from '@react-navigation/native';

import {
  changeBillStatusToVietnamese,
  dateFormat,
} from '../../../../../common/handle.string';
import groupStore from '../../../../../common/store/group.store';
import {Colors} from '../../../../../constants/color.const';
import RouteNames from '../../../../../constants/route-names.const';
import {getBillList} from './services/bill-list.service';
import styles from './styles/style';

// Define the type for the route params
type GroupRouteParams = {
  groupId: string;
};

// Specify the type for the route
type GroupRouteProp = RouteProp<Record<string, GroupRouteParams>, string>;

const BillListScreen = ({navigation}: {navigation: any}) => {
  const route = useRoute<GroupRouteProp>();
  const groupId = groupStore.id;

  const [billList, setBillList] = useState([]);
  const getBills = async () => {
    const bills = await getBillList(groupId);
    // console.log('bills', JSON.stringify(bills, null, 2));
    if (
      !bills.group.billing ||
      !bills?.group?.billing.length ||
      bills?.group?.billing.length === 0
    ) {
      setBillList([]);
    } else {
      setBillList(bills.group.billing);
    }
  };
  useEffect(() => {
    console.log('groupId', groupId);
    getBills();
  }, []);

  useFocusEffect(
    useCallback(() => {
      getBills();
      return () => {
        // Code to clean up the effect when the screen is unfocused
      };
    }, []),
  );

  const renderBillList = () => {
    return billList.map((bill: any, index) => {
      const viStatus = changeBillStatusToVietnamese(bill.status);
      return (
        <TouchableOpacity
          key={index}
          style={styles.billItemContainer}
          onPress={() => {
            navigation.navigate(RouteNames.BILL_INFO, {
              billId: bill._id,
            });
          }}>
          <View style={styles.infoRow}>
            <Text style={styles.headingText}>Tên khoản chi tiêu: </Text>
            <Text style={styles.infoText}>{bill.summary}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.headingText}>Ngày: </Text>
            <Text style={styles.infoText}>{dateFormat(bill.date)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.headingText}>Mô tả: </Text>
            <Text numberOfLines={3} style={styles.infoText}>
              {bill.description}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.headingText}>Trạng thái: </Text>
            <Text style={styles.infoText}>{viStatus}</Text>
            {/* <Text style={styles.infoText}>Đang chờ thanh toán</Text> */}
          </View>
        </TouchableOpacity>
      );
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Danh sách phân chia chi tiêu</Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate(RouteNames.BILL, {
              groupId: groupId,
            });
          }}>
          <Ionicons
            name="add-circle-outline"
            size={24}
            color={Colors.icon.orange}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.billListContainer}>{renderBillList()}</View>
    </ScrollView>
  );
};

export default BillListScreen;
