import React from 'react';
import { BlurView } from 'react-native-blur';

import theme from '../lib/theme';

import Cell from './Cell';
import ActionSheet from './ActionSheet';

import RealmListView from '../lib/RealmListView';

import {
  ListView as NativeListView,
  View,
  Text,
  StyleSheet
} from 'react-native';

let ListView = NativeListView;

class SelectList extends React.Component {

  static defaultProps = {
    onItemPress: (obj, selected) => {},
    visible: false,
    modal: false,
    realm: false,
    itemSelectedIcon: 'check'
  }

  static propTypes = {
    data: React.PropTypes.any,
    selected: React.PropTypes.any,
    section: React.PropTypes.any,
    itemTitle: React.PropTypes.any,
    itemValue: React.PropTypes.any,
    itemSelectedValidator: React.PropTypes.any.isRequired,
    itemSubtitle: React.PropTypes.any,
    itemSelectedIcon: React.PropTypes.any,
    icon: React.PropTypes.any,
    visible: React.PropTypes.bool,
    modal: React.PropTypes.bool,
    realm: React.PropTypes.bool,
    onItemPress: React.PropTypes.func,
    onClose: React.PropTypes.func,
    onOpen: React.PropTypes.func
  }

  constructor(props) {
    super(props);

    if (this.props.realm) {
      ListView = RealmListView;
    }

    const dsOptions = {
      rowHasChanged: (oldRow, newRow) => oldRow !== newRow
    };

    if (this.props.section) {
      dsOptions.sectionHeaderHasChanged = (s1, s2) => s1 !== s2;
    }

    const datasource = new ListView.DataSource(dsOptions);

    this.state = {
      visible: this.props.visible === true,
      datasource
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.visible !== nextProps.visible) {
      if (nextProps.visible) this.open();
      else this.close();
    }
  }

  setVisibilityState(visible) {
    this.setState({
      visible
    });
  }

  close() {
    if (this.props.modal === true) {
      this._actionSheet.close();
    } else {
      this.setVisibilityState(false);
    }
  }

  open() {
    if (this.props.modal === true) {
      this._actionSheet.open();
    } else {
      this.setVisibilityState(true);
    }
  }

  renderValue(obj) {
    switch (typeof this.props.itemValue) {
      case 'function':
        return this.props.itemValue(obj);
      default:
        return obj[this.props.itemValue];
    }
  }

  renderTitle(obj) {
    switch (typeof this.props.itemTitle) {
      case 'function':
        return this.props.itemTitle(obj);
      default:
        return obj[this.props.itemTitle];
    }
  }

  renderSubtitle(obj) {
    switch (typeof this.props.itemSubtitle) {
      case 'function':
        return this.props.itemSubtitle(obj);
      default:
        return obj[this.props.itemSubtitle];
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

    const selectedIcon = Object.assign({},
      { name: 'check' },
      typeof this.props.itemSelectedIcon === 'string' ?
      { name: this.props.itemSelectedIcon } :
      this.props.itemSelectedIcon || {}
    );

    return (
      <Cell
        onPress={onItemPress}
        title={this.props.itemTitle && this.renderTitle(obj)}
        value={this.props.itemValue && this.renderValue(obj)}
        subtitle={this.props.itemSubtitle && this.renderSubtitle(obj)}
        disclosure={selected && selectedIcon}
        icon={this.props.icon}
      />
    );
  }

  getDataSource() {
    if (this.props.section) {
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

  renderHeader = () => {
    if (this.props.section) return;
    return (
      <View style={{ ...theme.border.top, ...theme.border.bottom, height: 5, backgroundColor: theme.color.light }} >
        <View blurType="xlight" />
      </View>
    );
  }

  renderListView() {
    if (!this.props.data) {
      const title = <Text style={styles.placeholder}>Sorry, we have nothing :(</Text>;
      return (
        <Cell title={title} />
      );
    }

    return (
      <ListView
        keyboardShouldPersistTaps="handled"
        enableEmptySections
        renderHeader={this.renderHeader}
        {...this.props}

        dataSource={this.getDataSource()}
        renderRow={this.props.renderRow || this.renderRow}
        renderSectionHeader={this.props.section && (this.props.renderSectionHeader || this.renderSectionHeader)}
        renderSeparator={this.props.renderSeparator || this.renderSeparator}
      />
    );
  }

  render() {
    if (this.props.modal === true) {
      return (
        <ActionSheet
          ref={component => this._actionSheet = component}
          onClose={this.props.onClose}
          onOpen={this.props.onOpen}
          mode="list"
        >
          <BlurView blurType="xlight" >
            {this.renderListView()}
          </BlurView>
        </ActionSheet>
      );
    } else {
      return (
        this.state.visible &&
        <View style={styles.container} >
          <BlurView blurType="xlight" style={{ flex: 1 }} >
            {this.renderListView()}
          </BlurView>
        </View>
      );
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
  placeholder: {
    flex: 1,
    textAlign: 'center',
    fontSize: theme.font.small,
    fontWeight: '500',
    color: theme.color.muted
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
    backgroundColor: 'transparent'
  },
  separator: {
    ...theme.separator
  }
});

export default SelectList;