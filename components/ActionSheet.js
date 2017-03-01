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

const ANIM_OPEN_DURATION = 200;
const ANIM_CLOSE_DURATION = 250;
const TOP_OFFSET = 20;

class ActionSheet extends React.Component {
  static defaultProps = {
    animated: true,
    mode: 'default'
  }

  static propTypes = {
    onClose: React.PropTypes.func,
    onOpen: React.PropTypes.func,
    animated: React.PropTypes.bool,
    mode: React.PropTypes.oneOf([
      'default', // default
      'list'
    ])
  }

  constructor(props) {
    super(props);

    this.windowHeight = Dimensions.get('window').height;

    this.state = {
      visible: false,
      animatedY: new Animated.Value(this.windowHeight),
      openCallback: null
    };
  }

  animateToValue(toValue, callback) {
    if (this.props.animated) {
      Animated.timing(this.state.animatedY, {
        toValue: toValue,
        duration: toValue === 0 ? ANIM_OPEN_DURATION : ANIM_CLOSE_DURATION,
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

  renderActionItems() {
    return React.Children.map(this.props.children, (item, i) => {
      // null child
      if (!item) return item;
      if (React.isValidElement(item) === false) return item;

      const isFirstChild = i === 0;
      const isLastChild = i === React.Children.count(this.props.children) -1;

      const separator = !isLastChild && <View style={{ ...theme.separator }} />;

      if (item.type !== ActionItem) {
        return (
          <View key={'action-item-' + i}
            style={[
              { backgroundColor: item.props.backgroundColor },
              isFirstChild ? styles.borderTopRadius : null,
              isLastChild ? styles.borderBottomRadius : null
            ]}
          >
            {item}
            {separator}
          </View>
        );
      } else {
        const title = item.props.destructive ? <Text style={styles.actionDestructiveText} >{item.props.title.toUpperCase()}</Text> : item.props.title;

        const itemOnPress = () => {
          this.close(item.props.onPress);
        };

        return (
          <View key={'action-item-' + i}>
            <Cell
              {...item.props}
              title={item.props.destructive ? null : title}
              value={item.props.destructive ? title : null}
              onPress={item.props.destructive || item.props.onPress ? itemOnPress : null}
              style={[
                item.props.destructive ? styles.actionDestructive : item.props.backgroundColor && { backgroundColor: item.props.backgroundColor },
                isFirstChild ? styles.borderTopRadius : null,
                isLastChild ? styles.borderBottomRadius : null
              ]}
            />
            {separator}
          </View>
        );
      }
    });
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
                style={this.props.mode === 'default' && styles.actionsItems}
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
    top: TOP_OFFSET,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end'
  },

  actionsItems: {
    margin: theme.margin,
    borderRadius: theme.radius,
    backgroundColor: theme.color.white
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