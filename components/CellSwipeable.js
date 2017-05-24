import React from 'react';

import Cell from './Cell';

import {
	View,
	StyleSheet
} from 'react-native';

import SwipeableRow from 'SwipeableRow';

class CellSwipeable extends React.Component {
	static defaultProps = {
		onOpen: () => {},
	    onClose: () => {},
	    onSwipeEnd: () => {},
	    onSwipeStart: () => {},
	    isOpen: false,
	    swipeThreshold: 30,
	    shouldBounceOnMount: false
	}

	static propTypes = {
		...Cell.propTypes,
		isOpen: React.PropTypes.bool,
		onOpen: React.PropTypes.func,
	    onClose: React.PropTypes.func,
	    onSwipeEnd: React.PropTypes.func,
	    onSwipeStart: React.PropTypes.func,
	    swipeThreshold: React.PropTypes.number,
	    shouldBounceOnMount: React.PropTypes.bool
	}

	constructor(props) {
		super(props);

		this.state = {
			swiping: false
		};
	}

	handleOnOpen = () => {
		this.setState({
			swiping: true
		});

		this.props.onOpen();
	}

	handleOnClose = () => {
		this.setState({
			swiping: false
		});

		this.props.onClose();
	}

	render() {
		return (
			<SwipeableRow
				slideoutView={this.props.children}
				shouldBounceOnMount={this.props.shouldBounceOnMount}
				maxSwipeDistance={this.props.maxSwipeDistance}
				onOpen={this.handleOnOpen}
				onClose={this.handleOnClose}
				onSwipeEnd={this.props.onSwipeEnd}
				onSwipeStart={this.props.onSwipeStart}
				swipeThreshold={this.props.swipeThreshold}
				isOpen={this.props.isOpen}
			>
				<Cell {...this.props} >
		          {null /* set null so value prop retains. */ }
		        </Cell>
			</SwipeableRow>
		);
	}
}

export default CellSwipeable;