import {cloneDeep} from 'lodash';
import React, {useMemo, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Button, CheckBox} from 'react-native-elements';
import Modal from 'react-native-modal';
import {RadioGroup} from 'react-native-radio-buttons-group';

import groupStore from '../../../../../common/store/group.store';
import {Colors} from '../../../../../constants/color.const';
import PurchaseLocationDropdownPicker from '../../../components/PurchaseLocationDropdownPicker';
import StorageLocationDropdownPicker from '../../../components/StorageLocationDropdownPicker';
import {IGetNewGroupProductsPaginatedReq} from '../../../interfaces/new-group-products';

interface FilterModalProps {
  curReqDto: IGetNewGroupProductsPaginatedReq;

  isVisible: boolean;
  onClose: () => void;
  onSortByChange: (value: string | null) => void;
  onStockStatusChange: (value: string | null) => void;
  onBestBeforeDateChange: (value: string | null) => void;
  onStorageLocationChange: (value: string | null) => void;
  onPurchaseLocationChange: (value: string | null) => void;
}
const FilterMenu: React.FC<FilterModalProps> = props => {
  interface IRadioItem {
    id: string;
    label: string;
    value: string;
    color: string;
    labelStyle: object;
  }

  const sortByRadioButtons = useMemo<IRadioItem[]>(
    () => [
      {
        id: 'groupProduct.name:ASC',
        label: 'Tên tăng dần (A-Z)',
        value: 'Tên tăng dần (A-Z)',
        color: Colors.text.grey,
        labelStyle: {},
      },
      {
        id: 'groupProduct.name:DESC',
        label: 'Tên giảm dần (Z-A)',
        value: 'Tên giảm dần (Z-A)',
        color: Colors.text.grey,
        labelStyle: {},
      },
      {
        id: '3',
        label: 'Bổ sung NYP: gần nhất đến xa nhất',
        value: 'Từ gần nhất đến xa nhất',
        color: Colors.text.grey,
        labelStyle: {},
      },
      {
        id: '4',
        label: 'Bổ sung NYP: xa nhất đến gần nhất',
        value: 'Từ xa nhất đến gần nhất',
        color: Colors.text.grey,
        labelStyle: {},
      },
    ],
    [],
  );
  const [sortBySelectedId, setSortBySelectedId] = useState<string>(
    props.curReqDto.sortBy?.includes('name:DESC')
      ? 'groupProduct.name:DESC'
      : 'groupProduct.name:ASC',
  );

  interface ICheckBoxItem {
    type: string;
    text: string;
    checked: boolean;
  }

  const [bestBeforeDateOptions, setBestBeforeDateOptions] = useState<
    ICheckBoxItem[]
  >([
    {
      type: 'good',
      text: 'Còn HSD',
      checked: true,
    },
    {
      type: 'expiringSoon',
      text: 'Sắp hết HSD',
      checked: true,
    },
    {
      type: 'expired',
      text: 'Đã hết HSD',
      checked: true,
    },
  ]);

  return (
    <Modal
      isVisible={props.isVisible}
      animationIn="slideInRight"
      animationOut="slideOutRight"
      hasBackdrop={true}
      onBackdropPress={props.onClose}
      onBackButtonPress={props.onClose}
      style={styles.modal}>
      <View style={styles.menuContainer}>
        <Text style={styles.title}>Sắp xếp và lọc</Text>

        <ScrollView contentContainerStyle={[styles.scrollContainer]}>
          <View>
            <Text style={styles.label}>Sắp xếp theo</Text>
            <RadioGroup
              radioButtons={sortByRadioButtons}
              onPress={id => {
                setSortBySelectedId(id);
                props.onSortByChange(id);
              }}
              selectedId={sortBySelectedId}
              containerStyle={{
                display: 'flex',
                // flexDirection: 'column',
                alignItems: 'flex-start',
              }}
            />
          </View>

          <Text style={styles.label}>Hạn sử dụng</Text>
          <View>
            {bestBeforeDateOptions.map((opt, idx) => {
              return (
                <CheckBox
                  key={opt.type}
                  title={opt.text}
                  checked={opt.checked}
                  checkedColor={Colors.checkBox.black}
                  containerStyle={styles.checkBoxContainer}
                  textStyle={styles.checkBoxTextStyle}
                  onPress={() => {
                    setBestBeforeDateOptions(opt => {
                      opt[idx].checked = !opt[idx].checked;

                      return cloneDeep(opt);
                    });
                  }}
                />
              );
            })}
          </View>
        </ScrollView>
        <View style={[styles.buttonGroup]}>
          <TouchableOpacity
            style={[styles.buttonGroupItem, styles.applyButton]}
            onPress={() => {
              /* Apply filters */
            }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: Colors.text.white,
              }}>
              Apply
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.buttonGroupItem, styles.resetButton]}
            onPress={() => {
              /* Reset filters */
            }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: Colors.text.orange,
              }}>
              Reset
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0, // This is the important style you need to set
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    minHeight: '100%',
    position: 'relative',
  },
  menuContainer: {
    position: 'relative',
    width: '90%',
    backgroundColor: Colors.background.white,
    paddingVertical: 10,
    paddingHorizontal: 20,
    // borderColor: Colors.border.lightgrey,
    // borderWidth: 1,
    display: 'flex',
    flexDirection: 'column',
  },

  // scrollContainer
  scrollContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingBottom: 120,
  },

  buttonGroup: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    right: 20,
    display: 'flex',
    flexDirection: 'column',
    height: 110,
    justifyContent: 'space-between',
    backgroundColor: Colors.background.white,
    paddingBottom: 20,
  },

  buttonGroupItem: {
    borderWidth: 1,
    borderRadius: 5,
    height: 40,
    backgroundColor: Colors.background.white,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  applyButton: {
    backgroundColor: Colors.background.orange,
    borderColor: Colors.border.orange,
  },

  resetButton: {
    backgroundColor: Colors.background.white,
    borderColor: Colors.border.orange,
  },

  title: {
    // width: '90%',
    textAlign: 'left',
    color: Colors.title.orange,
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.lightgrey,
    paddingBottom: 10,
    marginVertical: 10,
  },

  label: {
    // width: '90%',
    textAlign: 'left',
    color: Colors.title.orange,
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
  },

  checkBoxContainer: {
    backgroundColor: 'white',
    borderColor: 'white',
    padding: 0,
    fontWeight: 'normal',
  },

  checkBoxTextStyle: {
    fontWeight: 'normal',
    color: Colors.text.grey,
  },
});

export default FilterMenu;
