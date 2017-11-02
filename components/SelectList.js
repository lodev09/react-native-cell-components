import React from 'react';
import PropTypes from 'prop-types';

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
BACKGROUND_COLOR = theme.color.light;

class SelectList extends React.Component {

  static defaultProps = {
    onItemPress: () => null,
    visible: false,
    modal: false,
    realm: false,
    itemSelectedIcon: 'check',
    placeholder: DEFAULT_PLACEHOLDER,
    cancelText: 'Close'
  }

  static propTypes = {
    data: PropTypes.any,
    selected: PropTypes.any,
    section: PropTypes.any,
    itemTitle: PropTypes.any,
    itemValue: PropTypes.any,
    itemValidator: PropTypes.string.isRequired,
    itemIcon: PropTypes.any,
    itemSubtitle: PropTypes.any,
    itemSelectedIcon: PropTypes.any,
    icon: PropTypes.any,
    visible: PropTypes.bool,
    modal: PropTypes.bool,
    realm: PropTypes.bool,
    onItemPress: PropTypes.func,
    onClose: PropTypes.func,
    onOpen: PropTypes.func,
    placeholder: PropTypes.string,
    cancelText: PropTypes.string
  }

  _previousSelected = [];
  _selected = [];

  constructor(props) {
    super(props);

    this.ListView = this.props.realm ? NativeListView : RealmListView;
    this.setSelected(this.props.selected);

    const dsOptions = {
      rowHasChanged: (r1, r2) => {
        const v1 = r1[this.props.itemValidator];
        const v2 = r2[this.props.itemValidator];

        const v1PreviousSelected = this._previousSelected.some(s => {
          return typeof s === 'object' ? s[this.props.itemValidator] === v1 : s === v1;
        }) ? true : false;

        const v2Selected = this._selected.some(s => {
          return typeof s === 'object' ? s[this.props.itemValidator] === v2 : s === v2;
        }) ? true : false;

        return v1 !== v2 || (!v1PreviousSelected && v2Selected) || (v1PreviousSelected && !v2Selected)
      }
    };

    if (this.props.section) {
      dsOptions.sectionHeaderHasChanged = (s1, s2) => s1 !== s2;
    }

    const dataSource = new this.ListView.DataSource(dsOptions);
    this.state = {
      visible: this.props.visible === true,
      dataSource: this.getDataSource(dataSource, this.props.data)
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.data !== nextProps.data) {
      this.setState({
        dataSource: this.getDataSource(this.state.dataSource, nextProps.data)
      });
    }

    if (this.props.selected !== nextProps.selected) {
      this.setSelected(nextProps.selected);
      this.setState({
        dataSource: this.getDataSource(this.state.dataSource, nextProps.data)
      });
    }

    if (this.props.visible !== nextProps.visible) {
      if (nextProps.visible) this.open();
      else this.close();
    }
  }

  setSelected(selectedProp) {
    this._previousSelected = this._selected;
    if (selectedProp) {
      this._selected = Array.isArray(selectedProp) ? selectedProp : [ selectedProp ];
    } else {
      this._selected = [];
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
      callback && callback();
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

  renderIcon(obj) {
    switch (typeof this.props.itemIcon) {
      case 'function':
        return () => this.props.itemIcon(obj);
      default:
        return this.props.itemIcon;
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
    const selected = this._selected && this._selected.some((o) => {
      return typeof o === 'object' ? o[this.props.itemValidator] === obj[this.props.itemValidator] : o === obj[this.props.itemValidator];
    });

    const onItemPress = () => {
      this.props.onItemPress(obj, !selected);
    };

    const itemIcon = () => {
      const icon = this.props.itemIcon || this.props.icon;
      if (typeof icon === 'function') {
        return icon(obj);
      } else {
        return icon;
      }
    }

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
        icon={this.props.itemIcon ? this.renderIcon(obj) : this.props.icon}
      />
    );
  }

  getDataSource(dataSource, propsData) {
    if (this.props.section) {
      const data = {};

      if (propsData) {
        for (var i in propsData) {
          var obj = propsData[i];

          const section = typeof this.props.section === 'function' ? this.props.section(obj) : obj[this.props.section];
          if (!data[section]) {
            data[section] = [];
          }

          data[section].push(obj);
        }
      }

      return dataSource.cloneWithRowsAndSections(data);

    } else {
      return dataSource.cloneWithRows(propsData || []);
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
      <View style={styles.separator} />
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
    if (!this.props.data || (this.props.realm && this.props.data && this.props.data.length === 0)) {
      return (
        <View>
          {this.renderHeader()}
          <Cell
            subtitle={this.props.placeholder || DEFAULT_PLACEHOLDER }
            tintColor={theme.color.muted}
          />
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
        dataSource={this.state.dataSource}
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
    backgroundColor: BACKGROUND_COLOR,
    elevation: 5
  },
  headerText: {
    fontSize: theme.font.xsmall,
    color: theme.color.mutedLighten,
    textAlign: 'center'
  },
  sectionHeaderText: {
    color: theme.color.mutedDarken,
    paddingHorizontal: theme.padding,
    paddingVertical: theme.padding / 2,
  },
  sectionHeader: {
    backgroundColor: BACKGROUND_COLOR
  },
  separator: {
    ...theme.separator
  }
});

export default SelectList;
