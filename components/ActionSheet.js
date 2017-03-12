import React from 'react';

import Cell from './Cell';
import CellGroup from './CellGroup';

import theme from '../lib/theme';

import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Animated,
  Dimensions
} from 'react-native';

const AnimatdCellGroup = Animated.createAnimatedComponent(CellGroup);

export const ActionItem = function(props) {
  return <View {...props} />
}

const TOP_OFFSET = 70;

class ActionSheet extends React.Component {
  static defaultProps = {
    animated: true,
    mode: 'default',
    cancelText: 'Cancel',
    destructive: false,
    separator: true
  }

  static propTypes = {
    onClose: React.PropTypes.func,
    onOpen: React.PropTypes.func,
    animated: React.PropTypes.bool,
    mode: React.PropTypes.oneOf([
      'default', // default
      'list'
    ]),
    title: React.PropTypes.any,
    cancelText: React.PropTypes.string,
    onCancelPress: React.PropTypes.func,
    destructive: React.PropTypes.bool,
    separator: React.PropTypes.bool
  }

  constructor(props) {
    super(props);

    this._windowHeight = Dimensions.get('window').height;

    this.state = {
      visible: false,
      animatedY: new Animated.Value(this._windowHeight),
      openCallback: null
    };
  }

  animateToValue(toValue, callback) {
    if (this.props.animated) {
      Animated.timing(this.state.animatedY, {
        toValue: toValue,
        duration: toValue === 0 ? 200 : 250,
        useNativeDriver: true
      }).start(() => {
        if (callback) callback();
      });
    } else {
      this.state.animatedY.setValue(toValue);
    }
  }

  getActionsContainerStyle() {
    return [
      styles.actionsContainer,
      { top: this.props.cancelText ? TOP_OFFSET : TOP_OFFSET - 50 },
      {
        transform: [
          {
            translateY: this.state.animatedY
          }
        ]
      }
    ];
  }

  getBackdropStyle() {
    return [
      styles.container,
      {
        opacity: this.state.animatedY.interpolate({
          inputRange: [0, this._windowHeight],
          outputRange: [1, 0]
        })
      }
    ];
  }

  open() {
    this.setState({
      visible: true
    });
  }

  close(callback) {
    this.animateToValue(this._windowHeight, () => {
      this.setState({
        visible: false
      });

      setTimeout(() => {
        if (callback) callback();
        if (this.props.onClose) this.props.onClose();
      }, 10);
    });
  }

  handleContainerOnPress = () => {
    this.close();
  }

  handleModalOnShow = () => {
    // animated open
    this.animateToValue(0, this.props.onOpen);
  }

  handleCancelOnPress = () => {
    this.close(this.props.onCancelPress);
  }

  renderActionItems() {
    const children = React.Children.toArray(this.props.children);

    if (this.props.title) {
      const title = (
        <View style={[ styles.titleContainer, this.props.mode === 'default' && styles.borderTopRadius ]} >
          <Text style={styles.title} >{this.props.title}</Text>
        </View>
      );

      children.unshift(title);
    }

    return children.map((item, i) => {

      const isFirstChild = i === 0;
      const isLastChild = i === children.length - 1;

      const separator = this.props.separator === true && <View style={{ ...theme.separator }} />;

      if (item.type !== ActionItem) {
        return (
          <View key={'action-item-' + i}
            style={[
              { backgroundColor: item.props.backgroundColor },
              isFirstChild && styles.borderTopRadius,
              !this.props.cancelText && styles.borderBottomRadius
            ]}
          >
            {item}
            {!isLastChild && separator}
          </View>
        );
      } else {
        const itemOnPress = () => {
          this.close(item.props.onPress);
        };

        return (
          <View key={'action-item-' + i}>
            <Cell
              {...item.props}
              onPress={item.props.onPress && itemOnPress}
              style={[
                item.props.backgroundColor && { backgroundColor: item.props.backgroundColor },
                isFirstChild && styles.borderTopRadius,
                !this.props.cancelText && styles.borderBottomRadius
              ]}
              tintColor={item.props.destructive && theme.color.danger}
            />
            {(this.props.cancelText || !isLastChild) && separator}
          </View>
        );
      }
    });
  }

  renderCancelCell() {
    return (
      <View style={this.props.mode === 'default' && styles.cancelContainer} >
        <Cell
          style={[ styles.cancelCell, this.props.mode === 'default' && styles.borderBottomRadius ]}
          onPress={this.handleCancelOnPress}
        >
          <Text style={styles.cancelText} >{this.props.cancelText.toUpperCase()}</Text>
        </Cell>
      </View>
    );
  }

  render() {
    return (
      <Modal
        transparent
        visible={this.state.visible}
        onShow={this.handleModalOnShow}
      >
        <TouchableWithoutFeedback onPress={this.handleContainerOnPress}>
          <View style={{ flex: 1 }} >
            <Animated.View style={this.getBackdropStyle()} />
            <Animated.View style={this.getActionsContainerStyle()} >
              <View
                onStartShouldSetResponder={e => true}
                style={[ this.props.mode === 'default' && styles.actionsItems, this.props.style ]}
              >
                {this.renderActionItems()}
              </View>
              {this.props.cancelText && this.renderCancelCell()}
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  cancelContainer: {
    marginHorizontal: theme.margin,
    marginBottom: theme.margin
  },
  cancelCell: {
    backgroundColor: theme.color.light
  },
  titleContainer: {
    padding: theme.padding * 1.5,
    backgroundColor: theme.color.white
  },
  title: {
    fontSize: theme.font.xsmall,
    color: theme.color.muted
  },
  actionsContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end'
  },
  actionsItems: {
    marginHorizontal: theme.margin,
    marginTop: theme.margin,
    borderTopRightRadius: theme.radius,
    borderTopLeftRadius: theme.radius,
    backgroundColor: theme.color.white
  },
  cancelText: {
    textAlign: 'center',
    fontSize: theme.font.small,
    fontWeight: '600',
    color: theme.color.muted,
    flex: 1
  },
  borderTopRadius: {
    borderTopRightRadius: theme.radius,
    borderTopLeftRadius: theme.radius,
  },
  borderBottomRadius: {
    borderBottomRightRadius: theme.radius,
    borderBottomLeftRadius: theme.radius
  }
});

export default ActionSheet;