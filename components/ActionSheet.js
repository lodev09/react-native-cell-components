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
  Dimensions,
  Easing
} from 'react-native';

const AnimatdCellGroup = Animated.createAnimatedComponent(CellGroup);

export const ActionItem = function(props) {
  return <View {...props} />
}

const BORDER_RADIUS = theme.isIOS ? theme.radius : 0;
const MARGIN = theme.isIOS ? theme.margin : 0;

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
      animatedY: new Animated.Value(this._windowHeight)
    };
  }

  animateToValue(toValue, callback) {
    if (this.props.animated) {
      Animated.timing(this.state.animatedY, {
        toValue,
        duration: toValue === 0 ? 400 : 350,
        easing: Easing.bezier(.36,.66,.04,1),
        // useNativeDriver: true
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
      this.props.mode !== 'default' && {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
      },
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
        callback && callback();
        this.props.onClose && this.props.onClose();
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

  handleModalOnRequestClose = () => {
    this.close();
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

        const tintColor = item.props.destructive ? theme.color.danger : item.props.tintColor;

        return (
          <View key={'action-item-' + i}>
            <Cell
              {...item.props}
              onPress={item.props.onPress ? itemOnPress : null}
              style={[
                item.props.backgroundColor && { backgroundColor: item.props.backgroundColor },
                isFirstChild && styles.borderTopRadius,
                !this.props.cancelText && styles.borderBottomRadius
              ]}
              tintColor={tintColor}
            />
            {(this.props.cancelText || !isLastChild) && separator}
          </View>
        );
      }
    });
  }

  renderCancelCell() {
    return (
      <Cell
        style={[ styles.cancelCell, this.props.mode === 'default' && styles.borderBottomRadius ]}
        onPress={this.handleCancelOnPress}
      >
        <Text style={styles.cancelText} >{this.props.cancelText.toUpperCase()}</Text>
      </Cell>
    );
  }

  renderActionContainer() {
    return (
      <Animated.View style={this.getActionsContainerStyle()} >
        <View style={[ this.props.mode === 'default' ? styles.actionItemsDefault : this.props.cancelText && styles.actionItemsList, this.props.style ]} >
          {this.renderActionItems()}
        </View>
        {this.props.cancelText && this.renderCancelCell()}
      </Animated.View>
    );
  }

  render() {
    return (
      <Modal
        transparent
        visible={this.state.visible}
        onShow={this.handleModalOnShow}
        onRequestClose={this.handleModalOnRequestClose}
      >
        <TouchableWithoutFeedback onPress={this.handleContainerOnPress}>
          <View style={{ flex: 1 }} >
            <Animated.View style={this.getBackdropStyle()} />
          </View>
        </TouchableWithoutFeedback>

        {
          this.props.mode === 'default' ?
          this.renderActionContainer() :

          <TouchableWithoutFeedback onPress={this.handleContainerOnPress}>
            {this.renderActionContainer()}
          </TouchableWithoutFeedback>
        }

      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  cancelCell: {
    backgroundColor: theme.color.light
  },
  titleContainer: {
    padding: theme.padding,
    backgroundColor: theme.color.white
  },
  title: {
    fontSize: theme.isIOS ? theme.font.xsmall : theme.font.small,
    color: theme.color.muted
  },
  actionsContainer: {
    position: 'absolute',
    left: MARGIN,
    right: MARGIN,
    bottom: MARGIN,
    justifyContent: 'flex-end'
  },
  actionItemsDefault: {
    borderTopRightRadius: BORDER_RADIUS,
    borderTopLeftRadius: BORDER_RADIUS,
    backgroundColor: theme.color.white
  },
  actionItemsList: {
    marginTop: theme.isIOS ? 68 : 48
  },
  cancelText: {
    textAlign: 'center',
    fontSize: theme.font.small,
    fontWeight: '600',
    color: theme.color.muted,
    flex: 1
  },
  borderTopRadius: {
    borderTopRightRadius: BORDER_RADIUS,
    borderTopLeftRadius: BORDER_RADIUS,
  },
  borderBottomRadius: {
    borderBottomRightRadius: BORDER_RADIUS,
    borderBottomLeftRadius: BORDER_RADIUS
  }
});

export default ActionSheet;