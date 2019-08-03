import React from 'react';
import PropTypes from 'prop-types';

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

import theme from './theme';

import {
  TouchableOpacity
} from 'react-native';

export const sources = {
  ZOCIAL: 'zocial',
  OCTICONS: 'octicons',
  MATERIAL: 'material',
  MATERIAL_COMMUNITY_ICONS: 'material-community-icons',
  IONICONS: 'ionicons',
  DYNAMIC: 'dynamic',
  FOUNDATION: 'foundation',
  EVILICONS: 'evilicons',
  ENTYPO: 'entypo',
  FONT_AWESOME: 'font-awesome',
  SIMPLE_LINE_ICON: 'simple-line-icon'
}

class Icon extends React.Component {
  static defaultProps = {
    source: sources.DYNAMIC
  }

  static propTypes = {
    source: PropTypes.string
  }

  getSource() {
    switch (this.props.source) {
      case sources.ZOCIAL:
        return Zocial;

      case sources.OCTICONS:
        return Octicons;

      case sources.MATERIAL:
        return MaterialIcons;

      case sources.MATERIAL_COMMUNITY_ICONS:
        return MaterialCommunityIcons;

      case sources.IONICONS:
      case sources.DYNAMIC:
        return Ionicons;

      case sources.FOUNDATION:
        return Foundation;

      case sources.EVILICONS:
        return EvilIcons;

      case sources.ENTYPO:
        return Entypo;

      case sources.FONT_AWESOME:
        return FontAwesome;

      case sources.SIMPLE_LINE_ICON:
        return SimpleLineIcons;

      default:
        return MaterialIcons;
    }
  }

  constructor(props) {
    super(props);
    this.Icon = this.getSource();
  }

  render() {
    let name = this.props.name;
    if (this.props.source === sources.DYNAMIC) {
      name = theme.value('ios', 'md') + '-' + this.props.name;
    }

    if (typeof this.props.onPress === 'function') {
      return (
        <TouchableOpacity onPress={this.props.onPress} >
          <this.Icon name={name} size={this.props.size} style={this.props.style} />
        </TouchableOpacity>
      );

    } else {
      return <this.Icon {...this.props} name={name} />;
    }
  }
}

export default Icon;
