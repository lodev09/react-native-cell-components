import React from 'react';

import Cell from './Cell';
import SelectList from './SelectList';

import {
  View,
  StyleSheet
} from 'react-native';

export const CellListItem = function(props) {
  return <View {...props} />;
}

class CellListProvider extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      source: null,
      selecting: false
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.selecting !== prevState.selecting) {
      if (this.state.source && this.state.selecting === true) {
        this._selectList.open();
      }
    }
  }

  handleCellListOnPress = (props) => {
    this.setState({
      selecting: true,
      source: { ...props } // notice: not mutating props
    });
  }

  renderChildren(children) {
    return React.Children.map(children, (component, i) => {
      // null child
      if (!component) return component;

      if (component.type !== CellListItem) {
        if (React.Children.count(component.props.children) === 0) return component;
        else {
          return React.cloneElement(
            component,
            {},
            this.renderChildren(component.props.children)
          );
        }
      }

      return (
        <Cell
          onPress={() => this.handleCellListOnPress(component.props)}
          {...component.props}
        />
      );
    });
  }

  handleSelectListItemOnPress = (selectedItem, onPressCallback) => {
    if (!this.state.source) return;
    
    this._selectList.close(() => {
      onPressCallback(selectedItem);
      this.setState({
        selecting: false,
        source: null
      });
    });
  }

  renderSelectList() {
    if (!this.state.source) return;

    const {
      listData,
      listItemTitle,
      listItemIcon,
      listItemValidator,
      listSection,
      listSelected,
      listItemOnPress
    } = this.state.source;

    return (
      <SelectList
        modal
        ref={component => this._selectList = component}
        data={listData}
        itemTitle={listItemTitle}
        icon={listItemIcon}
        itemSelectedValidator={listItemValidator}
        isRealm
        onItemPress={item => this.handleSelectListItemOnPress(item, listItemOnPress)}
        section={listSection}
        selected={listSelected}

        {...this.props}
      />
    );
  }

  render() {
    return (
      <View style={styles.container} >
        {this.renderSelectList()}
        {this.renderChildren(this.props.children)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default CellListProvider;