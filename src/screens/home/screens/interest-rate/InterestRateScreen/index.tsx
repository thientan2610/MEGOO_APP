import moment from 'moment';
import {useEffect, useState} from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {Dropdown} from 'react-native-element-dropdown';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import FoundationIcon from 'react-native-vector-icons/Foundation';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Slider from '@react-native-community/slider';

import {dateFormat, splitString} from '../../../../../common/handle.string';
import {Colors} from '../../../../../constants/color.const';
import styles from './styles/style';

const InterestRateScreen = () => {
  const [sliderAmount, setSliderAmount] = useState(50000000);
  const [amount, setAmount] = useState<string>(sliderAmount.toString());
  const [date, setDate] = useState(new Date());

  const [oldInterest, setOldInterest] = useState<{
    rate: string;
    nonTermRate: string;
    date: string;
    maturityDate: string;
    period: string;
    interest: number;
    nonTermInterest: number;
    totalAmount: number;
    openPicker: boolean;
  }>({
    rate: '',
    nonTermRate: '1',
    date: dateFormat(date.toISOString()),
    maturityDate: '',
    period: '',
    interest: 0,
    nonTermInterest: 0,
    totalAmount: 0,
    openPicker: false,
  });

  const [newInterest, setNewInterest] = useState<{
    rate: string;
    date: string;
    maturityDate: string;
    period: string;
    interest: number;
    interestUntilWithdrawalDate: number;
    totalAmount: number;
    openPicker: boolean;
  }>({
    rate: '',
    // date: dateFormat(date.toISOString()),
    date: '',
    maturityDate: '',
    period: '',
    interest: 0,
    interestUntilWithdrawalDate: 0,
    totalAmount: 0,
    openPicker: false,
  });

  const [oldSelectedDate, setOldSelectedDate] = useState(date);
  const [newSelectedDate, setNewSelectedDate] = useState(date);
  const [newMinimumSelectedDate, setNewMinimumSelectedDate] = useState(date);

  const [isFocus, setIsFocus] = useState(false);
  const [items, setItems] = useState<
    {
      label: string;
      value: string;
    }[]
  >([
    {
      label: '1 tháng',
      value: '1',
    },
    {
      label: '2 tháng',
      value: '2',
    },
    {
      label: '3 tháng',
      value: '3',
    },
    {
      label: '4 tháng',
      value: '4',
    },
    {
      label: '5 tháng',
      value: '5',
    },
    {
      label: '6 tháng',
      value: '6',
    },
    {
      label: '7 tháng',
      value: '7',
    },
    {
      label: '8 tháng',
      value: '8',
    },
    {
      label: '9 tháng',
      value: '9',
    },
    {
      label: '10 tháng',
      value: '10',
    },
    {
      label: '11 tháng',
      value: '11',
    },
    {
      label: '12 tháng',
      value: '12',
    },
    {
      label: '15 tháng',
      value: '15',
    },
    {
      label: '18 tháng',
      value: '18',
    },
    {
      label: '24 tháng',
      value: '24',
    },
    {
      label: '36 tháng',
      value: '36',
    },
  ]);

  const [isNonTermInterestRate, setIsNonTermInterestRate] = useState(false);

  const [differenceAmount, setDifferenceAmount] = useState(0);

  const handleRateChange = (value: string, type: string) => {
    // Remove non-digit characters from the input value
    const numericValue = value.replace(/[^\d.]/g, '');

    // Validate the input to allow only decimal with 2 digits after the comma
    const decimalRegex = /^\d+(\.\d{0,2})?$/;
    if (decimalRegex.test(numericValue) || numericValue === '') {
      if (type === 'old') {
        setOldInterest(oldInterest => {
          return {
            ...oldInterest,
            rate: numericValue,
          };
        });
      } else {
        setNewInterest(newInterest => {
          return {
            ...newInterest,
            rate: numericValue,
          };
        });
      }
    }
  };
  const handleNonTermRateChange = (value: string) => {
    // Remove non-digit characters from the input value
    const numericValue = value.replace(/[^\d.]/g, '');

    // Validate the input to allow only decimal with 2 digits after the comma
    const decimalRegex = /^\d+(\.\d{0,2})?$/;
    if (decimalRegex.test(numericValue) || numericValue === '') {
      setOldInterest(oldInterest => {
        return {
          ...oldInterest,
          nonTermRate: numericValue,
        };
      });
    }
  };

  useEffect(() => {
    const date = moment(oldInterest.date, 'DD/MM/YYYY').toDate();

    setNewMinimumSelectedDate(date);
  }, [oldInterest.date]);

  useEffect(() => {
    setAmount(sliderAmount.toString());
  }, [sliderAmount]);

  useEffect(() => {
    const amountInt = parseInt(amount);
    if (amountInt >= 50000000) {
      setSliderAmount(amountInt);
    }
  }, [amount]);

  // Old interest
  useEffect(() => {
    // Check if both send date and period are valid
    if (oldInterest.date && oldInterest.period) {
      // Parse the send date using moment
      const parsedSendDate = moment(oldInterest.date, 'D/M/YYYY');

      // Calculate the maturity date by adding the period to the send date
      const calculatedMaturityDate = parsedSendDate.add(
        parseInt(oldInterest.period),
        'months',
      );

      // Format the calculated maturity date as "D/M/YYYY" and set it to state
      // Format the calculated maturity date as "D/M/YYYY" and convert it to string
      const formattedMaturityDate = calculatedMaturityDate.format('DD/MM/YYYY');

      // Set the formatted maturity date to the state
      setOldInterest(oldInterest => {
        return {
          ...oldInterest,
          maturityDate: formattedMaturityDate,
        };
      });
    }
  }, [oldInterest.date, oldInterest.period]);

  // Calculate interest of oldInterest
  useEffect(() => {
    if (amount && oldInterest.rate && oldInterest.period) {
      const sendDate = moment(oldInterest.date, 'DD/MM/YYYY').toISOString();

      const maturityDate = moment(
        oldInterest.maturityDate,
        'DD/MM/YYYY',
      ).toISOString();

      const numberOfDaysSent = moment(maturityDate).diff(
        moment(sendDate),
        'days',
      );

      const interestAmount =
        (parseInt(amount) *
          (parseFloat(oldInterest.rate) / 100) *
          numberOfDaysSent) /
        365;

      setOldInterest(oldInterest => {
        return {
          ...oldInterest,
          interest: interestAmount,
        };
      });
    } else {
      setOldInterest(oldInterest => {
        return {
          ...oldInterest,
          interest: 0,
        };
      });
    }
  }, [amount, oldInterest.rate, oldInterest.period]);

  // Calculate total amount of oldInterest
  useEffect(() => {
    if (amount && oldInterest.interest) {
      setOldInterest(oldInterest => {
        return {
          ...oldInterest,
          totalAmount: parseInt(amount) + oldInterest.interest,
        };
      });
    } else {
      setOldInterest(oldInterest => {
        return {
          ...oldInterest,
          totalAmount: 0,
        };
      });
    }
  }, [oldInterest.interest]);

  // New interest
  useEffect(() => {
    // Check if both send date and period are valid
    if (newInterest.date && newInterest.period) {
      // Parse the send date using moment
      const parsedSendDate = moment(newInterest.date, 'D/M/YYYY');

      // Calculate the maturity date by adding the period to the send date
      const calculatedMaturityDate = parsedSendDate.add(
        parseInt(newInterest.period),
        'months',
      );

      // Format the calculated maturity date as "D/M/YYYY" and set it to state
      // Format the calculated maturity date as "D/M/YYYY" and convert it to string
      const formattedMaturityDate = calculatedMaturityDate.format('DD/MM/YYYY');

      // Set the formatted maturity date to the state
      setNewInterest(newInterest => {
        return {
          ...newInterest,
          maturityDate: formattedMaturityDate,
        };
      });
    }
  }, [newInterest.date, newInterest.period]);

  // Calculate interest of newInterest
  useEffect(() => {
    if (amount && newInterest.rate && newInterest.period) {
      const sendDate = moment(newInterest.date, 'DD/MM/YYYY').toISOString();

      const oldMaturityDate = moment(
        oldInterest.maturityDate,
        'DD/MM/YYYY',
      ).toISOString();

      const newMaturityDate = moment(
        newInterest.maturityDate,
        'DD/MM/YYYY',
      ).toISOString();

      const totalDaysSent = moment(newMaturityDate).diff(
        moment(sendDate),
        'days',
      );

      if (isNonTermInterestRate) {
        const totalDaysSentUntilWithdrawal = moment(oldMaturityDate).diff(
          moment(sendDate),
          'days',
        );

        console.log(
          'totalDaysSentUntilWithdrawal',
          totalDaysSentUntilWithdrawal,
        );
        const interestAmountUntilWithdrawal =
          (parseInt(amount) *
            (parseFloat(newInterest.rate) / 100) *
            totalDaysSentUntilWithdrawal) /
          365;

        setNewInterest(newInterest => {
          return {
            ...newInterest,
            interestUntilWithdrawalDate: interestAmountUntilWithdrawal,
          };
        });
      }

      console.log('totalDaysSent', totalDaysSent);

      const interestAmount =
        (parseInt(amount) *
          (parseFloat(newInterest.rate) / 100) *
          totalDaysSent) /
        365;

      setNewInterest(newInterest => {
        return {
          ...newInterest,
          interest: interestAmount,
        };
      });
    } else {
      setNewInterest(newInterest => {
        return {
          ...newInterest,
          interest: 0,
          interestUntilWithdrawalDate: 0,
        };
      });
    }
  }, [amount, newInterest.rate, newInterest.period]);

  // Calculate total amount of newInterest
  useEffect(() => {
    if (amount && newInterest.interest) {
      setNewInterest(newInterest => {
        return {
          ...newInterest,
          totalAmount: parseInt(amount) + newInterest.interest,
        };
      });
    } else {
      setNewInterest(newInterest => {
        return {
          ...newInterest,
          totalAmount: 0,
        };
      });
    }
  }, [newInterest.interest]);

  // State to display non-term interest rate input
  useEffect(() => {
    const newDateISO = moment(newInterest.date, 'DD/MM/YYYY').toISOString();

    const oldDateISO = moment(
      oldInterest.maturityDate,
      'DD/MM/YYYY',
    ).toISOString();

    if (moment(newDateISO).isBefore(oldDateISO)) {
      setIsNonTermInterestRate(true);
    } else if (
      moment(newDateISO).isAfter(oldDateISO) ||
      moment(newDateISO).isSame(oldDateISO)
    ) {
      setIsNonTermInterestRate(false);
    } else if (newInterest.date === '') {
      setIsNonTermInterestRate(false);
    }
  }, [newInterest.date, oldInterest.maturityDate]);

  // Calculate non-term interest rate
  useEffect(() => {
    if (amount && oldInterest.date && isNonTermInterestRate) {
      const oldInterestDate = moment(
        oldInterest.date,
        'DD/MM/YYYY',
      ).toISOString();

      const newInterestDate = moment(
        newInterest.date,
        'DD/MM/YYYY',
      ).toISOString();

      const numberOfDaysSent = moment(newInterestDate).diff(
        moment(oldInterestDate),
        'days',
      );

      const interestAmount =
        (parseInt(amount) *
          (parseFloat(oldInterest.nonTermRate) / 100) *
          numberOfDaysSent) /
        365;

      // console.log('non term interest amount', interestAmount);

      setOldInterest(oldInterest => {
        return {
          ...oldInterest,
          nonTermInterest: interestAmount,
        };
      });
    } else {
      setOldInterest(oldInterest => {
        return {
          ...oldInterest,
          nonTermInterest: 0,
        };
      });
    }
  }, [isNonTermInterestRate, amount]);

  useEffect(() => {
    console.log('oldInterest.interest', oldInterest.interest);
    console.log('oldInterest.nonTermInterest', oldInterest.nonTermInterest);
    console.log(
      'newInterest.interestUntilWithdrawalDate',
      newInterest.interestUntilWithdrawalDate,
    );

    let difference = 0;
    if (
      oldInterest.interest !== 0 &&
      newInterest.interestUntilWithdrawalDate !== 0
    ) {
      if (oldInterest.nonTermInterest !== 0) {
        difference =
          Math.round(oldInterest.interest) -
          Math.round(
            oldInterest.nonTermInterest +
              newInterest.interestUntilWithdrawalDate,
          );
      } else {
        difference =
          Math.round(oldInterest.interest) -
          Math.round(newInterest.interestUntilWithdrawalDate);
      }
    } else {
      difference =
        Math.round(oldInterest.interest) - Math.round(newInterest.interest);
    }
    setDifferenceAmount(Math.abs(difference));
  }, [
    oldInterest.interest,
    oldInterest.nonTermInterest,
    newInterest.interestUntilWithdrawalDate,
    newInterest.interest,
  ]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Số tiền gửi</Text>
        <Text>VNĐ</Text>
      </View>
      <View
        style={[
          styles.inputContainer,
          {borderBottomWidth: 0, marginBottom: -5},
        ]}>
        <TextInput
          keyboardType="number-pad"
          style={styles.inputText}
          value={splitString(amount)}
          onChangeText={value => {
            const numericValue = value.replace(/\D/g, '');
            setAmount(numericValue);
          }}
        />
      </View>
      <View
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          // backgroundColor: 'pink',
          paddingHorizontal: 3,
        }}>
        <Slider
          style={{
            width: '100%',
            height: 30,
          }}
          step={500000}
          value={sliderAmount}
          minimumValue={5000000}
          maximumValue={3000000000}
          lowerLimit={1000000}
          thumbTintColor={Colors.text.orange}
          minimumTrackTintColor={Colors.text.orange}
          maximumTrackTintColor={Colors.text.lightgrey}
          onValueChange={value => {
            setSliderAmount(value);
          }}
        />
      </View>
      <View
        style={{
          width: '90%',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Text>50 triệu</Text>
        <Text>3 tỷ</Text>
      </View>
      <View
        style={{
          width: '90%',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginTop: 10,
          // backgroundColor: 'yellow',
        }}>
        <View
          style={{
            width: '45%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text style={[styles.title, {marginTop: 0, width: '100%'}]}>
            Ngày gửi
          </Text>
          <View style={[styles.inputContainer, {width: '100%'}]}>
            <TextInput
              editable={false}
              style={styles.inputText}
              value={oldInterest.date}
              placeholder={'Chọn ngày đáo hạn'}
              placeholderTextColor={Colors.text.lightgrey}
            />

            <DatePicker
              modal
              open={oldInterest.openPicker}
              date={oldSelectedDate}
              mode={'date'}
              locale={'vi'}
              title={'Chọn ngày'}
              confirmText={'Chọn'}
              cancelText={'Huỷ'}
              onDateChange={value => {
                setOldSelectedDate(value);
              }}
              onConfirm={value => {
                console.log('Selected date:', value);
                setOldSelectedDate(value);
                setOldInterest(oldInterest => {
                  return {
                    ...oldInterest,
                    openPicker: false,
                  };
                });

                setNewSelectedDate(value);
                // setNewInterest(newInterest => {
                //   return {
                //     ...newInterest,
                //     date: dateFormat(value.toISOString()),
                //   };
                // });

                // setDateString(dateFormat(value.toString()));
                setOldInterest(oldInterest => {
                  return {
                    ...oldInterest,
                    date: dateFormat(value.toISOString()),
                  };
                });
              }}
              onCancel={() => {
                setOldInterest(oldInterest => {
                  return {
                    ...oldInterest,
                    openPicker: false,
                  };
                });
              }}
            />

            <View
              style={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              {oldInterest.date && (
                <Ionicons
                  onPress={() =>
                    setOldInterest(oldInterest => {
                      return {
                        ...oldInterest,
                        date: '',
                      };
                    })
                  }
                  name={'close'}
                  style={[styles.inputIcon, {marginRight: 5}]}
                />
              )}
              <Ionicons
                onPress={() => {
                  setOldInterest(oldInterest => {
                    return {
                      ...oldInterest,
                      openPicker: true,
                    };
                  });
                }}
                name={'calendar'}
                style={styles.inputIcon}
              />
            </View>
          </View>

          <Text style={[styles.title, {width: '100%'}]}>Kỳ hạn hiện tại</Text>
          <Dropdown
            style={{
              width: '100%',
            }}
            data={items}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={!isFocus ? 'Chọn thời hạn gửi' : '...'}
            placeholderStyle={{
              color: Colors.text.lightgrey,
            }}
            value={oldInterest.period}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={item => {
              setOldInterest(oldInterest => {
                return {
                  ...oldInterest,
                  period: item.value,
                };
              });
              setIsFocus(false);
            }}
          />

          <Text style={[styles.title, {width: '100%'}]}>Ngày đáo hạn</Text>
          <Text
            style={{
              color: Colors.text.grey,
              width: '100%',
              marginVertical: 3,
            }}>
            {oldInterest.maturityDate}
          </Text>

          <Text style={[styles.title, {width: '100%'}]}>Lãi suất tiền gửi</Text>
          <View style={[styles.inputContainer, {width: '100%'}]}>
            <TextInput
              keyboardType="numeric"
              style={styles.inputText}
              value={oldInterest.rate}
              maxLength={5}
              placeholder={'Nhập lãi suất'}
              placeholderTextColor={Colors.text.lightgrey}
              onChangeText={(value: string) => {
                handleRateChange(value, 'old');
              }}
            />
            <Text>
              {'%'} {'/'} năm
            </Text>
          </View>

          {isNonTermInterestRate && (
            <>
              <Text style={[styles.title, {width: '100%'}]}>
                Lãi suất không kỳ hạn
              </Text>
              <View style={[styles.inputContainer, {width: '100%'}]}>
                <TextInput
                  keyboardType="number-pad"
                  style={styles.inputText}
                  value={oldInterest.nonTermRate}
                  maxLength={5}
                  placeholder={'Nhập lãi suất'}
                  placeholderTextColor={Colors.text.lightgrey}
                  onChangeText={(value: string) => {
                    handleNonTermRateChange(value);
                  }}
                />
                <Text>
                  {'%'} {'/'} năm
                </Text>
              </View>
            </>
          )}

          <Text style={[styles.title, {width: '100%'}]}>Số tiền lãi</Text>
          <Text style={styles.amountText}>
            {splitString(Math.round(oldInterest.interest).toString())} VNĐ
          </Text>

          <Text style={[styles.title, {width: '100%'}]}>
            Số tiền khi đến hạn
          </Text>
          <Text style={styles.amountText}>
            {splitString(Math.round(oldInterest.totalAmount).toString())} VNĐ
          </Text>
        </View>

        <View
          style={{
            height: '100%',
            borderLeftWidth: 0.5,
            borderLeftColor: Colors.border.lightgrey,
          }}
        />

        <View
          style={{
            width: '45%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text style={[styles.title, {marginTop: 0, width: '100%'}]}>
            Ngày gửi mới
          </Text>
          <View style={[styles.inputContainer, {width: '100%'}]}>
            <TextInput
              editable={false}
              style={styles.inputText}
              value={newInterest.date}
              placeholder={'Chọn ngày gửi'}
              placeholderTextColor={Colors.text.lightgrey}
            />

            <DatePicker
              modal
              open={newInterest.openPicker}
              date={newSelectedDate}
              minimumDate={newMinimumSelectedDate}
              mode={'date'}
              locale={'vi'}
              title={'Chọn ngày'}
              confirmText={'Chọn'}
              cancelText={'Huỷ'}
              onDateChange={value => {
                setNewSelectedDate(value);
              }}
              onConfirm={value => {
                console.log('Selected date:', value);
                setNewSelectedDate(value);
                // setNewInterest(newInterest => {
                //   return {
                //     ...newInterest,
                //     openPicker: false,
                //   };
                // });
                setNewInterest(newInterest => {
                  return {
                    ...newInterest,
                    date: dateFormat(value.toISOString()),
                    openPicker: false,
                  };
                });
              }}
              onCancel={() => {
                setOldInterest(oldInterest => {
                  return {
                    ...oldInterest,
                    openPicker: false,
                  };
                });
              }}
            />
            <View
              style={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              {newInterest.date && (
                <Ionicons
                  onPress={() =>
                    setNewInterest(newInterest => {
                      return {
                        ...newInterest,
                        date: '',
                      };
                    })
                  }
                  name={'close'}
                  style={[styles.inputIcon, {marginRight: 5}]}
                />
              )}
              <Ionicons
                onPress={() => {
                  setNewInterest(newInterest => {
                    return {
                      ...newInterest,
                      openPicker: true,
                    };
                  });
                }}
                name={'calendar'}
                style={styles.inputIcon}
              />
            </View>
          </View>

          <Text style={[styles.title, {width: '100%'}]}>Kỳ hạn mới</Text>
          <Dropdown
            style={{
              width: '100%',
            }}
            data={items}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={!isFocus ? 'Chọn kỳ hạn gửi' : '...'}
            placeholderStyle={{
              color: Colors.text.lightgrey,
            }}
            value={newInterest.period}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={item => {
              setNewInterest(newInterest => {
                return {
                  ...newInterest,
                  period: item.value,
                };
              });
              setIsFocus(false);
            }}
          />

          <Text style={[styles.title, {width: '100%'}]}>Ngày đáo hạn</Text>
          <Text
            style={{
              color: Colors.text.grey,
              width: '100%',
              marginVertical: 3,
            }}>
            {newInterest.maturityDate}
          </Text>

          <Text style={[styles.title, {width: '100%'}]}>Lãi suất mới</Text>
          <View style={[styles.inputContainer, {width: '100%'}]}>
            <TextInput
              keyboardType="number-pad"
              style={styles.inputText}
              value={newInterest.rate}
              maxLength={5}
              placeholder={'Nhập lãi suất'}
              placeholderTextColor={Colors.text.lightgrey}
              onChangeText={(value: string) => {
                handleRateChange(value, 'new');
              }}
            />
            <Text>
              {'%'} {'/'} năm
            </Text>
          </View>

          {isNonTermInterestRate && (
            <>
              <Text
                style={{
                  color: Colors.background.white,
                  fontSize: 16,
                  marginTop: 10,
                }}>
                Lãi suất không kỳ hạn
              </Text>
              <View
                style={[
                  styles.inputContainer,
                  {width: '100%', borderBottomWidth: 0},
                ]}>
                <TextInput
                  editable={false}
                  keyboardType="numeric"
                  style={[styles.inputText, {color: Colors.background.white}]}
                  value={''}
                  placeholder={'Nhập lãi suất'}
                  placeholderTextColor={Colors.background.white}
                />
              </View>
            </>
          )}

          <Text style={[styles.title, {width: '100%'}]}>Số tiền lãi</Text>
          <Text style={styles.amountText}>
            {splitString(Math.round(newInterest.interest).toString())} VNĐ
          </Text>

          <Text style={[styles.title, {width: '100%'}]}>
            Số tiền khi đến hạn
          </Text>
          <Text style={styles.amountText}>
            {splitString(Math.round(newInterest.totalAmount).toString())} VNĐ
          </Text>
        </View>
      </View>

      <View
        style={{
          width: '90%',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          marginVertical: 10,
        }}>
        <View
          style={{
            width: '45%',
            display: 'flex',
            flexDirection: 'column',
            // alignItems: 'center',
          }}>
          <Text style={styles.title}>Số tiền chênh lệch</Text>
          {isNonTermInterestRate ? (
            <Text
              style={{
                fontSize: 12,
                fontStyle: 'italic',
                color: Colors.text.lightgrey,
              }}>
              Tính đến ngày {oldInterest.maturityDate}
            </Text>
          ) : (
            false
          )}
        </View>
        <View
          style={{
            width: '45%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
          }}>
          {oldInterest.interest !== 0 &&
          newInterest.interest !== 0 &&
          newInterest.interestUntilWithdrawalDate !== 0
            ? oldInterest.interest >
                newInterest.interestUntilWithdrawalDate +
                  oldInterest.nonTermInterest && (
                <FoundationIcon
                  name="arrow-down"
                  size={24}
                  color={'red'}
                  style={{
                    paddingTop: 12,
                  }}
                />
              )
            : oldInterest.interest <
                newInterest.interestUntilWithdrawalDate +
                  oldInterest.nonTermInterest && (
                <FoundationIcon
                  name="arrow-up"
                  size={24}
                  color={'green'}
                  style={{
                    paddingTop: 12,
                  }}
                />
              )}

          <Text
            style={[
              styles.amountText,
              oldInterest.interest !== 0 &&
              newInterest.interest !== 0 &&
              newInterest.interestUntilWithdrawalDate !== 0
                ? oldInterest.interest >
                  newInterest.interestUntilWithdrawalDate +
                    oldInterest.nonTermInterest
                  ? {color: 'red', paddingTop: 12}
                  : {color: 'green', paddingTop: 12}
                : {color: Colors.text.grey},
              {fontSize: 20},
            ]}>
            {splitString(differenceAmount.toString())} VNĐ
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default InterestRateScreen;
