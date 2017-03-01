import React from 'react';
import Zocial from 'react-native-vector-icons/Zocial'
import Octicons from 'react-native-vector-icons/Octicons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Foundation from 'react-native-vector-icons/Foundation'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Entypo from 'react-native-vector-icons/Entypo'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'

import {
  TouchableOpacity
} from 'react-native';

const getIconSource = function(source = 'octicons') {
  switch (source.toLowerCase()) {
    case 'zocial':
      return Zocial
    case 'octicons':
      return Octicons
    case 'material':
      return MaterialIcons
    case 'material-community-icons':
      return MaterialCommunityIcons
    case 'ionicons':
      return Ionicons
    case 'foundation':
      return Foundation
    case 'evilicons':
      return EvilIcons
    case 'entypo':
      return Entypo
    case 'font-awesome':
      return FontAwesome
    case 'simple-line-icon':
      return SimpleLineIcons
    default:
      return Octicons
  }
}

class Icon extends React.Component {
  constructor(props) {
    super(props);

    this.Icon = getIconSource(this.props.source);
  }

  render() {
    if (typeof this.props.onPress === 'function') {
      return (
        <TouchableOpacity onPress={this.props.onPress} >
          <this.Icon name={this.props.name} size={this.props.size} style={this.props.style} />
        </TouchableOpacity>
      );

    } else {
      return <this.Icon {...this.props} />;
    }
  }
}

export default Icon;