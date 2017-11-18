import React from 'react';
import PropTypes from 'prop-types';

import {
    View,
    Text,
    StyleSheet
} from 'react-native';

class CellFooter extends React.Component
{
    static propTypes = {
        text: PropTypes.any,
        textStyle: PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.number
        ])
    };

    renderFooterContent()
    {
        if (!this.props.text) return null;

        switch(typeof this.props.text) {
            case 'function':
                return this.props.text();
                break;
            case 'string':
                return <Text style={[styles.footerText, this.props.textStyle && this.props.textStyle]}>
                    {this.props.text}
                </Text>;
                break;
            default:
                return this.props.text;
                break;
        }
    }

    render()
    {
        if (this.props.text === false) return null;

        return (
            <View style={[styles.footer, this.props.style && this.props.stlye]}>
                {this.renderFooterContent()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    footer: {
        paddingVertical: theme.value(theme.padding, theme.padding / 2),
        paddingHorizontal: theme.padding * 1.5
    },
    footerText: {
        color: theme.color.muted,
        fontSize: theme.font.xsmall
    }
});

export default CellFooter;