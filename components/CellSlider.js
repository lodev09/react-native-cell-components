import React from 'react';

import Cell from './Cell';
import theme from '../lib/theme';

import {
	Slider,
	View,
	Text,
	StyleSheet
} from 'react-native';

class CellSlider extends React.Component {

	render() {
		let margins = null;

		if (this.props.renderMinView && this.props.renderMaxView) {
			margins = { marginHorizontal: theme.margin };
		} else if (this.props.renderMinView) {
			margins = { marginLeft: theme.margin };
		} else if (this.props.renderMaxView) {
			margins = { marginRight: theme.margin };
		}

		return (
			<Cell>
				<View style={styles.container}>
					{
						this.props.renderMinView &&
						this.props.renderMinView()
					}

					<Slider style={[{ flex: 1 }, margins ]} {...this.props} />

					{
						this.props.renderMaxView &&
						this.props.renderMaxView()
					}
				</View>
			</Cell>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'row'
	},
	titleContainer: {
		justifyContent: 'center'
	}
});

export default CellSlider;