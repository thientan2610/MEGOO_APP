import {useEffect, useState} from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';

import {RouteProp, useRoute} from '@react-navigation/native';

import {
  changePackageStatusToVietnamese,
  dateFormat,
} from '../../../../common/handle.string';
import groupStore from '../../../../common/store/group.store';
import {getPkgsByGroupId} from './services/packages.service';
import styles from './styles/style';

const OtherPackages = ({navigation}: {navigation: any}) => {
  const [packages, setPackages] = useState<
    {
      pkgId: string;
      pkgName: string;
      pkgPrice: string;
      pkgDuration: number;
      pkgNoOfMember: number;
      pkgDescription: string;
      pkgStartDate: string;
      pkgEndDate: string;
      pkgStatus: string;
    }[]
  >([]);

  const getPkgs = async () => {
    // Get all user's groups
    const groupsRes = await getPkgsByGroupId(groupStore.id);
    // console.log('getPkgsRes:', groupsRes.group.packages);
    // Filter out active package
    const otherPkgs = groupsRes.group.packages.filter(
      (pkgItem: any) => pkgItem.status !== 'Active',
    );
    // console.log('otherPkgs:', otherPkgs);
    if (otherPkgs.length !== 0) {
      // Set packages list
      setPackages(
        otherPkgs.map((pkgItem: any) => {
          return {
            pkgId: pkgItem.package._id ? pkgItem.package._id : '',
            pkgName: pkgItem.package.name ? pkgItem.package.name : '',
            pkgPrice: pkgItem.package.price ? pkgItem.package.price : '',
            pkgDuration: pkgItem.package.duration
              ? pkgItem.package.duration
              : 0,
            pkgNoOfMember: pkgItem.package.noOfMember
              ? pkgItem.package.noOfMember
              : 0,
            pkgDescription: pkgItem.package.description
              ? pkgItem.package.description
              : '',
            pkgStartDate: pkgItem.startDate
              ? dateFormat(pkgItem.startDate)
              : '',
            pkgEndDate: pkgItem.endDate ? dateFormat(pkgItem.endDate) : '',
            pkgStatus: pkgItem.status ? pkgItem.status : '',
          };
        }),
      );
    } else {
      setPackages([]);
    }
  };

  useEffect(() => {
    console.log('groupId:', groupStore.id);

    getPkgs();
  }, []);

  const renderPackageItem = () => {
    if (packages.length !== 0) {
      return packages.map((pkgItem: any, index) => {
        const viStatus = changePackageStatusToVietnamese(pkgItem.pkgStatus);
        return (
          <View key={index} style={styles.packageContainer}>
            <View style={styles.packageContent}>
              <View style={styles.packageInfo}>
                <Text style={styles.text}>Tên gói: </Text>
                <Text style={[styles.text, {fontWeight: 'bold'}]}>
                  {pkgItem.pkgName}
                </Text>
              </View>
              <View style={styles.packageInfo}>
                <Text style={styles.text}>Thời hạn: </Text>
                <Text style={[styles.text, {fontWeight: 'bold'}]}>
                  {pkgItem.pkgDuration} tháng
                </Text>
              </View>
              <View style={styles.packageInfo}>
                <Text style={styles.text}>Số lượng thành viên: </Text>
                <Text style={[styles.text, {fontWeight: 'bold'}]}>
                  {pkgItem.pkgNoOfMember}
                </Text>
              </View>
              <View style={styles.packageInfo}>
                <Text style={styles.text}>Ngày bắt đầu: </Text>
                <Text style={[styles.text, {fontWeight: 'bold'}]}>
                  {pkgItem.pkgStartDate}
                </Text>
              </View>
              <View style={styles.packageInfo}>
                <Text style={styles.text}>Ngày hết hạn: </Text>
                <Text style={[styles.text, {fontWeight: 'bold'}]}>
                  {pkgItem.pkgEndDate}
                </Text>
              </View>
              <View style={styles.packageInfo}>
                <Text style={styles.text}>Mô tả: </Text>
                <Text style={[styles.text, {fontWeight: 'bold'}]}>
                  {pkgItem.pkgDescription}
                </Text>
              </View>
              <View style={styles.packageInfo}>
                <Text style={styles.text}>Trạng thái: </Text>
                <Text style={[styles.text, {fontWeight: 'bold'}]}>
                  {viStatus}
                </Text>
              </View>
            </View>
          </View>
        );
      });
    } else {
      return null;
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {renderPackageItem()}
    </ScrollView>
  );
};

export default OtherPackages;
