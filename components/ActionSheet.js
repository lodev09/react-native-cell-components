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

const ANIM_OPEN_DURATION = 250;
const ANIM_CLOSE_DURATION = 400;

class ActionSheet extends React.Component {
  constructor(props) {
    super(props);

    this.windowHeight = Dimensions.get('window').height;

    this.state = {
      visible: false,
      animatedY: new Animated.Value(this.windowHeight)
    };
  }

  animateToValue(toValue, callback) {
    Animated.timing(this.state.animatedY, {
      toValue: toValue,
      duration: toValue === 0 ? ANIM_OPEN_DURATION : ANIM_CLOSE_DURATION,
      useNativeDriver: true
    }).start(() => {
      if (callback) callback();
    });
  }

  getActionsContainerStyle() {
    return [
      styles.actionsContainer,
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
          inputRange: [0, this.windowHeight],
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
    this.animateToValue(this.windowHeight, () => {
      this.setState({
        visible: false
      });

      // https://github.com/facebook/react-native/issues/10471
      setTimeout(() => {
        if (callback) callback();
      }, 10);
    });
  }

  handleContainerOnPress = () => {
    this.close();
  }

  renderActionItems() {
    return React.Children.map(this.props.children, (item, i) => {
      if (item.type !== ActionItem) return item;

      const title = item.props.destructive ? <Text style={styles.actionDestructiveText} >{item.props.title.toUpperCase()}</Text> : item.props.title;

      const itemOnPress = () => {
        this.close(item.props.onPress);
      };

      const isFirstChild = i === 0;
      const isLastChild = i === this.props.children.length -1;

      return (
        <View key={'action-item-' + i}>
          <Cell
            title={title}
            onPress={itemOnPress}
            icon={item.props.icon}
            style={[
              isFirstChild ? styles.borderTopRadius : null,
              isLastChild ? styles.borderBottomRadius : null,
              item.props.destructive ? styles.actionDestructive : null
            ]}
          />
          {!isLastChild && <View style={{ ...theme.separator }} />}
        </View>
        
      );
    });
  }

  handleModalOnShow = () => {
    this.animateToValue(0);
  }

  render() {
    return (
      <Modal
        transparent
        visible={this.state.visible}
        onShow={this.handleModalOnShow}
        {...this.props}
      >
        <TouchableWithoutFeedback onPress={this.handleContainerOnPress}>
          <View style={{ flex: 1 }} >
            <Animated.View style={this.getBackdropStyle()} />
            <Animated.View style={this.getActionsContainerStyle()} >
              <View
                style={styles.actions}
              >
                {this.renderActionItems()}
              </View>
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

  actionsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end'
  },

  actions: {
    margin: theme.margin,
    backgroundColor: theme.color.white,
    borderRadius: theme.radius
  },

  actionDestructive: {
    backgroundColor: theme.color.light
  },
  actionDestructiveText: {
    textAlign: 'center',
    fontSize: theme.font.small,
    fontWeight: '600',
    color: theme.color.muted
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