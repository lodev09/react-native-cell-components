import React from 'react';
import Icon from 'react-native-vector-icons/Octicons';
import { BlurView } from 'react-native-blur';

import theme from '../lib/theme';

import Cell from './Cell';

import {
  ListView as RealmListView
} from 'realm/react-native';

import {
  ListView as NativeListView,
  View,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Modal
} from 'react-native';

const ANIM_DURATION = 200;

class SelectList extends React.Component {
  static defaultProps = {
    onItemPress: (obj, selected) => {},
    isRealm: false,
    visible: false,
    animated: true,
    data: [],
    modal: false
  }

  static propTypes = {
    data: React.PropTypes.any.isRequired,
    selected: React.PropTypes.any,
    onItemPress: React.PropTypes.func,
    section: React.PropTypes.any,
    itemTitle: React.PropTypes.any.isRequired,
    itemSelectedValidator: React.PropTypes.any.isRequired,
    itemSubtitle: React.PropTypes.any,
    isRealm: React.PropTypes.bool,
    icon: React.PropTypes.any,
    visible: React.PropTypes.bool,
    animated: React.PropTypes.bool,
    modal: React.PropTypes.bool
  }

  constructor(props) {
    super(props);

    const windowHeight = Dimensions.get('window').height;

    const ListView = this.props.isRealm ? RealmListView : NativeListView;
    const withSections = this.props.section ? true : false;
    const dsOptions = {
      rowHasChanged: (oldRow, newRow) => oldRow !== newRow
    };

    if (withSections) {
      dsOptions.sectionHeaderHasChanged = (s1, s2) => s1 !== s2;
    }

    const datasource = new ListView.DataSource(dsOptions);

    this.state = {
      animatedY: new Animated.Value(this.props.visible ? 0 : windowHeight),
      animated: this.props.animated,
      visible: this.props.visible === true,
      datasource,
      withSections,
      windowHeight
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.visible !== nextProps.visible) {
      if (nextProps.visible) this.open();
      else this.close();
    }
  }

  close(callback, animated = this.props.animated) {
    if (this.props.modal) {
      this.animateToValue({
        animated,
        value: this.state.windowHeight,
      }, () => {
        this.setState({
          visible: false
        });

        setTimeout(() => {
          if (callback) callback();
        }, 10);
      });
    } else {
      this.setState({
        visible: false
      });

      if (callback) callback();
    }
    
  }

  open(animated = this.props.animated) {
    this.setState({
      visible: true,
      animated
    });
  }

  animateToValue({ animated, value }, callback) {
    if (animated) {
      Animated.timing(this.state.animatedY, {
        toValue: value,
        duration: ANIM_DURATION,
        useNativeDriver: true
      }).start(() => {
        if (callback) callback();
      });
    } else {
      if (callback) callback();
    }
  }

  getContainerStyle() {
    if (!this.props.modal) return styles.container;

    return [
      styles.container,
      {
        transform: [
          {
            translateY: this.state.animatedY
          }
        ]
      }
    ];
  }

  renderTitle(obj) {
    switch (typeof this.props.itemTitle) {
      case 'string':
        return obj[this.props.itemTitle];
      case 'function':
        return this.props.itemTitle(obj);
        break;
      default:
        return <Text style={styles.title}>XXX</Text>;
        break;
    }
  }

  renderSubtitle(obj) {
    switch (typeof this.props.itemSubtitle) {
      case 'string':
        return obj[this.props.itemSubtitle];
        break;
      case 'function':
        return this.props.itemSubtitle(obj);
        break;
    }
  }

  renderSelectedIcon(selected) {
    return selected ? 'check' : null;
  }

  renderRow = (obj) => {
    const validator = typeof this.props.itemSelectedValidator === 'function' ?
      this.props.itemSelectedValidator :
      (o) => {
        if (!o) return false;

        if (typeof o === 'object') return o[this.props.itemSelectedValidator] === obj[this.props.itemSelectedValidator];
        else return o === obj[this.props.itemSelectedValidator];
      };

    let selected = false;
    if (this.props.selected) {
      selected = Array.isArray(this.props.selected) ? this.props.selected.find(validator) : validator(this.props.selected);
    }

    const onItemPress = () => {
      this.props.onItemPress(obj, !selected);
    };

    return (
      <Cell
        onPress={onItemPress}
        title={this.renderTitle(obj)}
        subtitle={this.renderSubtitle(obj)}
        disclosure={selected ? 'check' : null}
        disclosureColor={theme.color.info}
        icon={this.props.icon}
      />
    );
  }

  getDataSource() {
    if (this.state.withSections) {
      const data = {};

      if (this.props.data) {
        this.props.data.forEach((obj) => {
          const section = typeof this.props.section === 'function' ? this.props.section(obj) : obj[this.props.section];
          if (!data[section]) {
            data[section] = [];
          }

          data[section].push(obj);
        });
      }

      return this.state.datasource.cloneWithRowsAndSections(data);

    } else {
      return this.state.datasource.cloneWithRows(this.props.data || []);
    }
    
  }

  renderSectionHeader = (sdata, section) => {
    return (
      <View style={styles.sectionHeader}>
        <BlurView blurType="xlight">
          <Text style={styles.sectionHeaderText} >{section}</Text>
        </BlurView>
      </View>
    );
  }

  renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
    return <View key={'separator-' + sectionID + '-' + rowID} style={styles.separator} />;
  }

  renderContent() {
    const ListView = this.props.isRealm ? RealmListView : NativeListView;
    return (
      <Animated.View style={this.getContainerStyle()} >
        { this.props.modal && <View style={{ height: 20, backgroundColor: 'transparent' }} /> }
        <BlurView blurType="xlight" style={{ flex: 1 }} >
          <ListView
            dataSource={this.getDataSource()}
            renderRow={this.props.renderRow || this.renderRow}
            renderSectionHeader={this.state.withSections ? this.props.renderSectionHeader || this.renderSectionHeader : null}
            renderSeparator={this.props.renderSeparator || this.renderSeparator}
            keyboardShouldPersistTaps="handled"
            enableEmptySections
            {...this.props}
          />
        </BlurView>
      </Animated.View>
    );
  }

  handleModalOnShow = () => {
    this.animateToValue({
      animated: this.props.animated && this.state.animated,
      value: 0
    });
  }

  render() {
    if (this.props.modal === true) {
      return (
        <Modal
          transparent
          visible={this.state.visible}
          onShow={this.handleModalOnShow}
        >
          {this.renderContent()}
        </Modal>
      );
    } else {
      return this.state.visible ? this.renderContent() : null;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    zIndex: 10
  },
  headerControl: {
    flex: 1,
    margin: theme.margin
  },
  headerText: {
    fontSize: theme.font.xsmall,
    color: theme.color.mutedLighten,
    textAlign: 'center'
  },
  sectionHeaderText: {
    color: theme.color.mutedDarken,
    backgroundColor: 'transparent',
    paddingHorizontal: theme.padding,
    paddingVertical: theme.padding / 2,
  },
  sectionHeader: {
    backgroundColor: 'transparent',
    // ...theme.border.bottom,
    // ...theme.border.top
  },
  separator: {
    ...theme.separator
  }
});

export default SelectList;