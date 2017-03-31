import React from 'react';

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

DEFAULT_PLACEHOLDER = 'No data';

class SelectList extends React.Component {

  static defaultProps = {
    onItemPress: (obj, selected) => {},
    visible: false,
    modal: false,
    realm: false,
    itemSelectedIcon: 'check',
    placeholder: DEFAULT_PLACEHOLDER,
    cancelText: 'Close'
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
    onOpen: React.PropTypes.func,
    placeholder: React.PropTypes.string,
    cancelText: React.PropTypes.string
  }

  constructor(props) {
    super(props);

    this.ListView = this.props.realm ? NativeListView : RealmListView;

    const dsOptions = {
      rowHasChanged: (oldRow, newRow) => oldRow !== newRow
    };

    if (this.props.section) {
      dsOptions.sectionHeaderHasChanged = (s1, s2) => s1 !== s2;
    }

    const datasource = new this.ListView.DataSource(dsOptions);

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

  close(callback) {
    if (this.props.modal === true) {
      this._actionSheet.close(callback);
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
        value={(!selected && this.props.itemValue) && this.renderValue(obj)}
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
        <Text style={styles.sectionHeaderText} >{section}</Text>
      </View>
    );
  }

  renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
    return <View key={'separator-' + sectionID + '-' + rowID} style={styles.separator} />;
  }

  renderHeader = () => {
    if (this.props.section && !this.props.renderHeader) return;

    if (this.props.renderHeader) {
      return this.props.renderHeader;
    }

    return (
      <View style={{ ...theme.border.top, ...theme.border.bottom, height: 5, backgroundColor: theme.color.light }} >
        <View blurType="xlight" />
      </View>
    );
  }

  renderFooter = () => {
    return (
      <View>
        {this.props.renderFooter()}
        <View style={styles.separator} />
      </View>
    );
  }

  renderListView() {
    if (!this.props.data) {
      return (
        <View>
          {this.renderHeader()}
          <Cell>
            <Text style={styles.placeholder}>{this.props.placeholder ? this.props.placeholder : DEFAULT_PLACEHOLDER }</Text>
          </Cell>
          <View style={styles.separator} />
          {this.props.renderFooter && this.renderFooter()}
        </View>
      );
    }

    return (
      <this.ListView
        keyboardShouldPersistTaps="handled"
        enableEmptySections

        {...this.props}

        renderFooter={this.props.renderFooter && this.renderFooter}
        renderHeader={this.renderHeader}
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
          cancelText={this.props.cancelText}
          mode="list"
        >
          <View>
            {this.renderListView()}
          </View>
        </ActionSheet>
      );
    } else {
      return (
        this.state.visible &&
        <View style={styles.container} >
          {this.renderListView()}
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
    backgroundColor: theme.color.light,
    zIndex: 10
  },
  placeholder: {
    flex: 1,
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