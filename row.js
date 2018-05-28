import React, { Component } from 'react';
import { CheckBox } from 'native-base';
import { View, Text, StyleSheet} from 'react-native';

class Row extends Component {
  constructor(props) {
    super(props);
    this.state = { checked: false };
  }

  render() {
    return (
      <View style={styles.container}>
        <CheckBox
          onPress={() => this.setState({
            checked: !this.state.checked
          })}
          checked={this.state.checked}
        />
        <Text style={styles.text}>
          { props.data }
        </Text>
      </View>
    );
  }
}

export default Row;
