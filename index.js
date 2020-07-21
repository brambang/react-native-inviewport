'use strict';

/*************************************************************
	MY CUSTOM PROPS
	
	onChange		=> callback		(required)
	delay				=> number in miliseconds (default: 100)
	viewScreen	=> percentage	(default: 1)
	didUpdate		=> boolean		(default: true)
*************************************************************/

import React, { Component } from 'react'
import { View, Dimensions } from 'react-native'

export default class InViewPort extends Component {
  constructor(props) {
    super(props)
    this.state = { rectTop: 0, rectBottom: 0, rectWidth: 0, didUpdate: true }
    this.count = 0;
    this.viewScreen = this.props.viewScreen ? this.props.viewScreen : 1;
    this.didUpdate = this.props.didUpdate === undefined ? true : this.props.didUpdate;
  }

  componentDidMount() {
    if (!this.props.disabled) {
      this.startWatching()
    }
  }

  componentWillUnmount() {
    this.stopWatching()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.disabled) {
      this.stopWatching()
    } else {
      this.lastValue = null
      this.startWatching()
    }
  }

  startWatching() {
    if (this.interval) {
      return
    }
    this.interval = setInterval(() => {
      if (!this.myview) {
        return
      }
      this.myview.measure((x, y, width, height, pageX, pageY) => {
        this.setState({
          rectTop: pageY,
          rectBottom: pageY + height,
          rectWidth: pageX + width
        })
      })
      this.isInViewPort()
    }, this.props.delay || 100)
  }

  stopWatching() {
    this.interval = clearInterval(this.interval)
  }

  isInViewPort() { 
    const window = Dimensions.get('window');
    const isVisible =
      this.state.rectBottom !== 0 &&
      this.state.rectBottom >= 0 &&
      this.state.rectTop <= window.height - (window.height*this.viewScreen/100) &&
      this.state.rectWidth > 0 &&
      this.state.rectWidth <= window.width;

    if (this.lastValue !== isVisible && this.state.didUpdate) {
      this.lastValue = isVisible;
      this.props.onChange(isVisible);

      if (this.count === 1) {
      	this.setState({ didUpdate: this.didUpdate })
      }

      this.count++;
    }
  }

  render() {
    return (
      <View
        collapsable={false}
        ref={component => {
          this.myview = component
        }}
        {...this.props}
      >
        {this.props.children}
      </View>
    )
  }
}
